import nodemailer, { type Transporter } from "nodemailer";

/**
 * Email layer for AstroKalki.
 *
 * Why this exists:
 * The /api/newsletter, /api/micro-reading, /api/bookings routes previously
 * only persisted to the database and never dispatched any email — even though
 * the micro-reading UI explicitly promises "Enter your email to read the truth."
 *
 * Behavior:
 * - If SMTP_HOST + SMTP_USER + SMTP_PASS are configured in .env, real emails
 *   are dispatched via that SMTP server.
 * - If any of those are missing, the email is formatted and logged to the
 *   server console (dev.log) so the brand owner can still see every captured
 *   lead / reading / booking. The promise to the API caller is still kept
 *   (returns success), so the user-facing flow never breaks.
 *
 * Required env (when ready to send real email):
 *   SMTP_HOST       e.g. smtp.gmail.com
 *   SMTP_PORT       e.g. 465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER       e.g. you@astrokalki.com
 *   SMTP_PASS       app-specific password
 *   EMAIL_FROM      e.g. "AstroKalki <you@astrokalki.com>"
 *   ADMIN_EMAIL     e.g. you@astrokalki.com  (receives lead/booking notifications)
 */

let cachedTransporter: Transporter | null = null;

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  return cachedTransporter;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  delivered: "smtp" | "console";
  messageId?: string;
  preview: string;
}

/**
 * Send an email. Falls back to console logging when SMTP is not configured,
 * so the lead/booking/reading is never silently lost.
 */
export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const from =
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    "AstroKalki <no-reply@astrokalki.local>";

  if (!isSmtpConfigured()) {
    // Graceful fallback — log to console so the brand owner can still see
    // every captured lead. The dev server pipes stdout to dev.log.
    const preview = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `[EMAIL — SMTP NOT CONFIGURED, logging only]`,
      `From:    ${from}`,
      `To:      ${input.to}`,
      `Subject: ${input.subject}`,
      input.replyTo ? `ReplyTo: ${input.replyTo}` : null,
      "─────────── PLAIN TEXT ───────────",
      input.text,
      "─────────── END ───────────",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ]
      .filter(Boolean)
      .join("\n");

    console.log(preview);

    return {
      delivered: "console",
      preview,
    };
  }

  // Real SMTP dispatch
  const info = await getTransporter().sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
  });

  return {
    delivered: "smtp",
    messageId: info.messageId,
    preview: `Sent to ${input.to} via SMTP (messageId=${info.messageId})`,
  };
}

/**
 * Convenience wrapper: send an email to the brand owner (admin) notifying
 * them of a new lead / reading / booking. Uses ADMIN_EMAIL from env.
 */
export async function notifyAdmin(params: {
  subject: string;
  text: string;
  html: string;
}): Promise<SendEmailResult | null> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    // Don't fail the request — just note it in console.
    console.warn(
      "[email] ADMIN_EMAIL not set — admin notification skipped. Subject:",
      params.subject
    );
    return null;
  }

  return sendEmail({
    to: adminEmail,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}
