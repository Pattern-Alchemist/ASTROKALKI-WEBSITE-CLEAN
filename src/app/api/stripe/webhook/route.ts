import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

/**
 * POST /api/stripe/webhook
 *
 * Stripe webhook receiver. Verifies the request signature using
 * STRIPE_WEBHOOK_SECRET, then handles three subscription lifecycle events:
 *
 *   checkout.session.completed
 *     → Create or update the Membership row (status=active). This is the
 *       primary creation event — the user has paid and is now a member.
 *
 *   customer.subscription.updated
 *     → Sync currentPeriodEnd, cancelAtPeriodEnd, and status from Stripe.
 *       Fires when a renewal succeeds, when the user requests cancellation
 *       (cancelAtPeriodEnd=true), or when the plan changes.
 *
 *   customer.subscription.deleted
 *     → Mark the Membership as expired. Fires when a subscription ends
 *       (either at period end after a cancellation request, or immediately
 *       via the Stripe dashboard).
 *
 * Security: middleware bypasses bot-UA + Origin + 4KB body-cap for this path
 * (allowed up to 64KB). Verification is via the Stripe signature header, not
 * cookie/origin checks. Raw body must be passed to constructEvent — Next.js
 * route handlers give us access to the raw bytes via request.text().
 *
 * Stripe API v22 note: `current_period_end` and `current_period_start` have
 * moved from Subscription to SubscriptionItem (per-item billing cycles). We
 * read them off `subscription.items.data[0]`. `cancel_at_period_end`,
 * `ended_at`, `status`, and `customer` remain on Subscription.
 */

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(key);
}

/**
 * Type-narrowing helper for Stripe subscription objects.
 * Stripe's SDK types are loose (object | string etc.); we cast carefully.
 */
function asSubscription(obj: unknown): Stripe.Subscription | null {
  if (!obj || typeof obj !== 'object') return null;
  const s = obj as Stripe.Subscription;
  // Sniff for the fields we actually use.
  if (typeof s.id !== 'string') return null;
  return s;
}

/**
 * Compute the canonical AstroKalki status from a Stripe subscription status.
 * Stripe uses: active, past_due, canceled, unpaid, trialing, incomplete, etc.
 * AstroKalki Membership.status uses: active, cancelled, expired.
 *
 *   active / trialing / past_due     → active (the member is still being
 *                                       billed; past_due gets a grace period)
 *   canceled                          → expired (Stripe fires .deleted when
 *                                       the subscription actually terminates)
 *   everything else                   → expired (defensive default)
 */
function mapStatus(stripeStatus: string): 'active' | 'expired' | 'cancelled' {
  if (
    stripeStatus === 'active' ||
    stripeStatus === 'trialing' ||
    stripeStatus === 'past_due'
  ) {
    return 'active';
  }
  if (stripeStatus === 'canceled') return 'expired';
  // 'incomplete', 'incomplete_expired', 'unpaid' → treat as expired for our purposes
  return 'expired';
}

/**
 * Read the current_period_end (in seconds) from a Stripe subscription.
 * In Stripe API v22, this lives on SubscriptionItem, not Subscription.
 * We read the first item's period end — AstroKalki subscriptions always have
 * exactly one line item (one monthly OR one yearly price), so this is safe.
 */
function getCurrentPeriodEnd(subscription: Stripe.Subscription): number | null {
  const item = subscription.items.data[0];
  if (!item) return null;
  // current_period_end is a required `number` on SubscriptionItem, but be
  // defensive in case a future Stripe version makes it optional.
  const v = (item as { current_period_end?: number }).current_period_end;
  return typeof v === 'number' ? v : null;
}

/**
 * Read the recurring interval ('day' | 'week' | 'month' | 'year') from the
 * first subscription item's price. Returns null for one-time prices.
 */
function getInterval(
  subscription: Stripe.Subscription
): 'day' | 'week' | 'month' | 'year' | null {
  const recurring = subscription.items.data[0]?.price?.recurring;
  if (!recurring) return null;
  return recurring.interval;
}

/**
 * Upsert the Membership row keyed by stripeSubscriptionId (preferred) or
 * stripeCustomerId or email (fallbacks). The subscription ID is the most
 * stable identifier across Stripe subscription changes; the email can change
 * if the customer updates it in the billing portal.
 */
async function upsertMembership(params: {
  email: string;
  name?: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  stripeSessionId?: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
  userId?: string | null;
}) {
  const {
    email,
    name,
    plan,
    status,
    stripeSessionId,
    stripeCustomerId,
    stripeSubscriptionId,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    userId,
  } = params;

  // Look up by subscription ID first (the most reliable key), then by customer
  // ID, then by email. Create if no match.
  const existing = await db.membership.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId },
        { stripeCustomerId },
        { email },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  if (existing) {
    return db.membership.update({
      where: { id: existing.id },
      data: {
        email,
        ...(name ? { name } : {}),
        plan,
        status,
        stripeSessionId: stripeSessionId ?? existing.stripeSessionId,
        stripeCustomerId,
        stripeSubscriptionId,
        ...(currentPeriodEnd !== undefined ? { currentPeriodEnd } : {}),
        ...(cancelAtPeriodEnd !== undefined ? { cancelAtPeriodEnd } : {}),
        ...(userId ? { userId } : {}),
      },
    });
  }

  return db.membership.create({
    data: {
      email,
      name: name || email.split('@')[0],
      plan,
      status,
      stripeSessionId: stripeSessionId || null,
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd: currentPeriodEnd || null,
      cancelAtPeriodEnd: cancelAtPeriodEnd ?? false,
      userId: userId || null,
    },
  });
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Stripe requires the raw body — not the JSON-parsed body — to verify the
  // signature. request.text() gives us the raw bytes.
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown signature error';
    console.error(`[stripe/webhook] signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // ─── Dispatch by event type ─────────────────────────────────────────────
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // The subscription is attached as a string ID on the session.
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;
        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id;

        if (!subscriptionId || !customerId) {
          console.warn(
            `[stripe/webhook] checkout.session.completed missing subscription/customer`,
            { id: session.id }
          );
          // Acknowledge so Stripe doesn't retry — we can't recover the
          // missing IDs anyway.
          return NextResponse.json({ received: true });
        }

        // Pull the subscription object to read current_period_end + plan.
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Determine plan from the price's recurring interval.
        const interval = getInterval(subscription);
        const plan: 'monthly' | 'yearly' =
          interval === 'year' ? 'yearly' : 'monthly';

        // Prefer metadata.email (we set it at checkout), then customer_email,
        // then fall back to retrieving the customer's email from Stripe.
        let email: string =
          session.metadata?.email ||
          session.customer_email ||
          session.customer_details?.email ||
          '';

        if (!email && typeof session.customer === 'string') {
          try {
            const customer = (await stripe.customers.retrieve(
              session.customer
            )) as Stripe.Customer;
            email = customer.email || '';
          } catch {
            // leave email as ''
          }
        }

        if (!email) {
          console.warn(
            `[stripe/webhook] checkout.session.completed could not resolve email`,
            { id: session.id, customerId, subscriptionId }
          );
        }

        // Try to attach a userId if the email matches an existing NextAuth user.
        let userId: string | null = null;
        if (email) {
          const user = await db.user.findUnique({ where: { email } });
          if (user) userId = user.id;
        }

        const currentPeriodEndSec = getCurrentPeriodEnd(subscription);

        await upsertMembership({
          email,
          name: session.customer_details?.name || undefined,
          plan,
          status: mapStatus(subscription.status),
          stripeSessionId: session.id,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          currentPeriodEnd: currentPeriodEndSec
            ? new Date(currentPeriodEndSec * 1000)
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          userId,
        });

        console.log(
          `[stripe/webhook] checkout.session.completed → membership activated`,
          { email, plan, customerId, subscriptionId }
        );
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = asSubscription(event.data.object);
        if (!subscription) {
          console.warn('[stripe/webhook] subscription.updated: malformed object');
          break;
        }

        const interval = getInterval(subscription);
        const plan: 'monthly' | 'yearly' =
          interval === 'year' ? 'yearly' : 'monthly';

        // Resolve email + name from the customer record.
        let email = '';
        let name: string | undefined;
        if (typeof subscription.customer === 'string') {
          try {
            const customer = (await stripe.customers.retrieve(
              subscription.customer
            )) as Stripe.Customer;
            email = customer.email || '';
            name = customer.name || undefined;
          } catch {
            // leave email as ''
          }
        }

        // Look up the existing membership (by subscription ID, then customer ID).
        const existing = await db.membership.findFirst({
          where: {
            OR: [
              { stripeSubscriptionId: subscription.id },
              ...(subscription.customer
                ? [{ stripeCustomerId: subscription.customer as string }]
                : []),
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        if (!existing) {
          console.warn(
            `[stripe/webhook] subscription.updated: no existing membership for subscription ${subscription.id}`
          );
          // If we somehow got an update before the checkout.session.completed
          // event (rare race), upsert from this event alone.
          if (email) {
            const currentPeriodEndSec = getCurrentPeriodEnd(subscription);
            await upsertMembership({
              email,
              name,
              plan,
              status: mapStatus(subscription.status),
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              currentPeriodEnd: currentPeriodEndSec
                ? new Date(currentPeriodEndSec * 1000)
                : null,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            });
          }
          break;
        }

        const currentPeriodEndSec = getCurrentPeriodEnd(subscription);

        await db.membership.update({
          where: { id: existing.id },
          data: {
            ...(email ? { email } : {}),
            ...(name ? { name } : {}),
            plan,
            status: mapStatus(subscription.status),
            stripeSubscriptionId: subscription.id,
            ...(subscription.customer
              ? { stripeCustomerId: subscription.customer as string }
              : {}),
            currentPeriodEnd: currentPeriodEndSec
              ? new Date(currentPeriodEndSec * 1000)
              : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = asSubscription(event.data.object);
        if (!subscription) {
          console.warn('[stripe/webhook] subscription.deleted: malformed object');
          break;
        }

        const currentPeriodEndSec = getCurrentPeriodEnd(subscription);
        const endedAtSec = subscription.ended_at;

        // Mark the membership as expired. We do NOT delete the row — the
        // record is useful for historical lookups (e.g. showing the user
        // "your last membership ended on …") and for revenue audit.
        await db.membership.updateMany({
          where: {
            OR: [
              { stripeSubscriptionId: subscription.id },
              ...(subscription.customer
                ? [{ stripeCustomerId: subscription.customer as string }]
                : []),
            ],
          },
          data: {
            status: 'expired',
            cancelAtPeriodEnd: false,
            currentPeriodEnd: endedAtSec
              ? new Date(endedAtSec * 1000)
              : currentPeriodEndSec
              ? new Date(currentPeriodEndSec * 1000)
              : null,
          },
        });
        break;
      }

      default:
        // Silently ack unhandled events. Stripe retries on non-2xx, so we
        // always 200 — even for events we don't care about.
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(`[stripe/webhook] handler failed for event ${event.type}:`, err);
    // Return 500 so Stripe retries — but only for transient errors. If this
    // is a logic bug, Stripe will keep retrying until it gives up.
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
