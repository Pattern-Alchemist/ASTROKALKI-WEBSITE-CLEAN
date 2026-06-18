/**
 * POST /api/session-emails/recap
 *
 * Manually dispatch (or re-dispatch) the post-session recap email with
 * AI-generated integration prompts. Admin-gated.
 *
 * Auth — one of:
 *   - Bearer token (Authorization: Bearer <CRON_SECRET|ADMIN_SECRET>)
 *   - Admin cookie session (same gate as /api/admin/*)
 *
 * Called automatically by /api/admin/bookings/[id] when admin PATCHes a
 * booking status to "completed". This endpoint also exists for manual
 * re-sends.
 *
 * Idempotent: if recapSentAt is already set, returns { skipped: true }
 * unless `force: true` is in the body.
 *
 * Body: { bookingId: string, force?: boolean }
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dispatchRecapEmail } from "@/lib/session-emails";
import { isSessionValid, ADMIN_COOKIE_NAME } from "@/lib/security";

export async function POST(request: NextRequest) {
  // ─── Auth ─────────────────────────────────────────────────────
  const auth = request.headers.get("authorization") || "";
  const hasBearer = auth.startsWith("Bearer ");
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  let authorized = false;
  if (hasBearer) {
    const token = auth.slice(7).trim();
    const cronSecret = process.env.CRON_SECRET;
    const adminSecret = process.env.ADMIN_SECRET;
    if ((cronSecret && token === cronSecret) || (adminSecret && token === adminSecret)) {
      authorized = true;
    }
  }
  if (!authorized && cookie) {
    authorized = await isSessionValid(cookie);
  }
  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized — admin session or service token required" },
      { status: 401 }
    );
  }

  // ─── Parse body ───────────────────────────────────────────────
  let body: { bookingId?: string; force?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bookingId = (body.bookingId || "").trim();
  if (!bookingId) {
    return NextResponse.json(
      { error: "bookingId is required" },
      { status: 400 }
    );
  }

  // ─── Verify booking exists + is in a recap-eligible state ─────
  // Recap is only meaningful for sessions that actually happened.
  // We allow re-sending via force=true for any non-cancelled booking,
  // but the default flow requires status='completed'.
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json(
      { error: "Cannot send recap for a cancelled booking" },
      { status: 400 }
    );
  }

  if (booking.status !== "completed" && !body.force) {
    return NextResponse.json(
      {
        error:
          "Booking is not marked completed. Pass force=true to override (e.g. for test sends).",
      },
      { status: 400 }
    );
  }

  // ─── Dispatch ─────────────────────────────────────────────────
  const result = await dispatchRecapEmail(bookingId, {
    force: Boolean(body.force),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason || "Dispatch failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    skipped: result.skipped || false,
    reason: result.reason,
    delivered: result.delivered,
    messageId: result.messageId,
    recapId: result.recapId,
  });
}
