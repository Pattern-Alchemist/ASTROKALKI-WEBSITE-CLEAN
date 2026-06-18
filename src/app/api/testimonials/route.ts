import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyAdmin } from '@/lib/email';
import {
  checkRateLimit,
  RATE_LIMITS,
  getClientIp,
  validateInput,
  testimonialInputSchema,
  isHoneypotTriggered,
  honeypotSuccessResponse,
} from '@/lib/security';

/**
 * Testimonials API.
 *
 * GET  — public, returns only status='approved' AND featured=true, ordered
 *        for the editorial testimonials grid on /testimonials.
 *
 * POST — public submission. Creates a Testimonial row with status='pending'
 *        and fires an admin notification so the brand owner can moderate it
 *        in /admin/testimonials. Rate-limited, Zod-validated, honeypot-guarded,
 *        body-capped (4 KB enforced by middleware + handler).
 */

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { status: 'approved', featured: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Testimonials fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // ─── Rate limit — 3 submissions per IP per hour ──────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit(`tm:${ip}`, RATE_LIMITS.testimonials);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many submissions. Please try again in ${rl.retryAfterSeconds}s.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfterSeconds) },
      }
    );
  }

  // ─── Parse body with 4 KB cap ────────────────────────────────────────
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 4 * 1024) {
      return NextResponse.json(
        { error: 'Submission too large' },
        { status: 413 }
      );
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ─── Honeypot — silently succeed for bots ────────────────────────────
  if (isHoneypotTriggered(raw)) {
    return NextResponse.json(honeypotSuccessResponse('testimonials'), {
      status: 201,
    });
  }

  // ─── Validate ────────────────────────────────────────────────────────
  const parsed = validateInput(testimonialInputSchema, raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { quote, context, initials, email, pattern } = parsed.data;

  try {
    const testimonial = await db.testimonial.create({
      data: {
        quote,
        context,
        initials,
        email,
        pattern: pattern || null,
        // Public submissions always start as pending — moderator decides.
        status: 'pending',
        // Not featured by default — moderator can feature after approval.
        featured: false,
        order: 0,
      },
    });

    // ─── Admin notification ───────────────────────────────────────────
    // Non-blocking — failures are logged but never break the submission.
    const preview =
      quote.length > 240 ? `${quote.slice(0, 240)}…` : quote;

    await notifyAdmin({
      subject: `[AstroKalki] New testimonial awaiting moderation — ${initials}`,
      text: [
        `A new testimonial was submitted and is awaiting review.`,
        ``,
        `From:    ${initials}`,
        `Email:   ${email || '(not provided)'}`,
        `Context: ${context}`,
        pattern ? `Pattern: ${pattern}` : null,
        `Submitted: ${testimonial.createdAt.toISOString()}`,
        `ID:       ${testimonial.id}`,
        ``,
        `─────────── QUOTE ───────────`,
        quote,
        `─────────── END ───────────`,
        ``,
        `Moderate at https://astrokalki.com/admin/testimonials`,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div style="background:#070707;color:#f0eee9;font-family:Georgia,serif;padding:48px 24px;max-width:560px;margin:0 auto;">
          <p style="font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#a58a54;margin:0 0 24px;">AstroKalki · Moderation</p>
          <h1 style="font-size:24px;font-weight:300;letter-spacing:-0.02em;line-height:1.3;margin:0 0 20px;">A new testimonial is awaiting review.</h1>
          <p style="font-size:14px;line-height:1.8;color:#9a9a9a;font-weight:300;">
            From <strong style="color:#cfcabf;">${initials}</strong>${email ? ` &lt;${email}&gt;` : ''} · ${context}${pattern ? ` · ${pattern}` : ''}
          </p>
          <blockquote style="font-style:italic;color:#cfcabf;font-size:15px;line-height:1.8;border-left:2px solid #c9a96e;padding-left:20px;margin:32px 0;">
            ${preview.replace(/</g, '&lt;')}
          </blockquote>
          <p style="font-size:13px;color:#7a7a7a;margin-top:32px;font-weight:300;">
            Moderate at <a href="https://astrokalki.com/admin/testimonials" style="color:#c9a96e;">astrokalki.com/admin/testimonials</a>
          </p>
          <p style="font-size:11px;color:#5a5a5a;margin-top:24px;font-weight:300;">ID: ${testimonial.id}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Thank you. Your testimonial is awaiting review.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Testimonial submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
