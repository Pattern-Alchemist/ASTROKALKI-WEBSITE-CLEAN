# AstroKalki — Complete Deployment Guide

Production deployment with all marketing strategies, integrations, and automation systems.

---

## 5 Deployment Steps

### ✓ STEP 1: Database Migration to Production

**Current:** SQLite (development)  
**Target:** Neon PostgreSQL (production recommended)

```bash
# 1. Create Neon project at https://neon.tech
# 2. Copy DATABASE_URL from Neon console
# 3. Update .env

DATABASE_URL=postgresql://user:password@neon.tech/dbname
DATABASE_PROVIDER=neon

# 4. Run migrations
npx prisma migrate deploy
npx prisma db push

# 5. Verify
npx prisma studio
```

### ✓ STEP 2: Configure APIs & Integrations

#### AI/LLM (Ask AstroKalki, Pattern Analysis)
```bash
# Option A: OpenAI
OPENAI_API_KEY=sk_...
LLM_PROVIDER=openai
LLM_MODEL=gpt-4-turbo

# Option B: Vercel AI Gateway (recommended - free)
AI_GATEWAY_API_KEY=vck_...
LLM_PROVIDER=vercel-ai-gateway
```

#### Image Generation (Pattern Portraits)
```bash
IMAGE_API_KEY=sk_...
IMAGE_MODEL=dall-e-3
```

#### Text-to-Speech (Audio Narrations)
```bash
TTS_API_KEY=sk_...
TTS_VOICE=nova
```

#### Payment Processing (Stripe)
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### ✓ STEP 3: Email Infrastructure

#### SMTP Configuration (Required for lead capture)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_SECURE=false
EMAIL_FROM=hello@astrokalki.com
```

**Gmail Setup:**
1. Enable 2FA
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use as SMTP_PASSWORD

#### Enable Drip Campaigns
- Configured in `vercel.json`
- Set `CRON_SECRET` for security
- Automatically sends daily emails

### ✓ STEP 4: Analytics & Tracking

#### Google Analytics 4
```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G_...
GA4_PROPERTY_ID=...
GA4_API_SECRET=...
```

#### Event Tracking (Auto-tracked)
- `lead_magnet_download` — Lead captured
- `email_course_signup` — Course enrolled
- `birth_chart_generated` — Free tool used
- `session_booked` — Booking made
- `session_completed` — Session completed

### ✓ STEP 5: Domain & Production Launch

#### DNS Records
```
Type    Name              Value
A       @                 astrokalki.vercel.app
CNAME   www               cname.vercel-dns.com
TXT     @                 v=spf1 include:sendgrid.net ~all
```

#### SSL/TLS
- Vercel provides free SSL automatically
- Auto-renews every 60 days

---

## 1. Environment Variables

All secrets live in `.env`. Copy `.env.example` to `.env` on a new machine and fill in real values.

### Email (REQUIRED for lead capture to function)
Without SMTP configured, every captured email (newsletter, micro-reading, booking) is silently logged to `dev.log` instead of sent.

```
SMTP_HOST=smtp.gmail.com        # or smtp.resend.com, smtp-relay.brevo.com, smtp.mailgun.org
SMTP_PORT=465                    # 465 for SSL, 587 for STARTTLS
SMTP_USER=you@astrokalki.com
SMTP_PASS=<16-char app password>  # Gmail: https://myaccount.google.com/apppasswords
EMAIL_FROM=AstroKalki <no-reply@astrokalki.com>
ADMIN_EMAIL=hello@astrokalki.com  # where lead notifications are sent
```

### Security (REQUIRED)
```
ADMIN_PASSWORD=<openssl rand -base64 32>     # admin login
ADMIN_SESSION_SECRET=<openssl rand -base64 32>  # optional, defaults to ADMIN_PASSWORD
CRON_SECRET=<openssl rand -hex 32>           # authenticates cron API calls
```

### Stripe (for membership)
```
STRIPE_SECRET_KEY=sk_test_...     # or sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from Stripe webhook endpoint
STRIPE_PRICE_MONTHLY=price_...    # recurring monthly price ID
STRIPE_PRICE_YEARLY=price_...     # recurring yearly price ID
```

### NextAuth (member portal)
```
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://astrokalki.com
```

---

## 2. Cron Job Scheduling

Three automation endpoints exist and MUST be triggered externally (Next.js does not self-schedule):

| Schedule | Endpoint | Purpose |
|---|---|---|
| Every hour | `GET /api/cron/drip?secret=<CRON_SECRET>` | Send Day+2 and Day+5 nurture emails |
| Every hour | `GET /api/cron/abandoned?secret=<CRON_SECRET>` | Recover abandoned micro-reading flows |
| Daily 03:30 IST | `GET /api/cron/birthday?secret=<CRON_SECRET>` | Send annual solar-return emails |

### Options

**Vercel Cron (recommended if on Vercel):**
Add to `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/drip?secret=...", "schedule": "0 * * * *" },
    { "path": "/api/cron/abandoned?secret=...", "schedule": "0 * * * *" },
    { "path": "/api/cron/birthday?secret=...", "schedule": "30 3 * * *" }
  ]
}
```

**systemd timer (self-hosted):**
```ini
# /etc/systemd/system/astrokalki-cron.service
[Unit]
Description=AstroKalki cron jobs

[Service]
Type=oneshot
ExecStart=/usr/bin/curl -sf "https://astrokalki.com/api/cron/drip?secret=SECRET" >> /var/log/astrokalki-cron.log 2>&1
ExecStart=/usr/bin/curl -sf "https://astrokalki.com/api/cron/abandoned?secret=SECRET" >> /var/log/astrokalki-cron.log 2>&1
```
```ini
# /etc/systemd/system/astrokalki-cron.timer
[Unit]
Description=Run AstroKalki cron hourly

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```
Create a separate timer for the birthday cron at `03:30`.

**GitHub Actions:**
```yaml
on:
  schedule:
    - cron: "0 * * * *"
jobs:
  drip:
    runs-on: ubuntu-latest
    steps:
      - run: curl -sf "https://astrokalki.com/api/cron/drip?secret=${{ secrets.CRON_SECRET }}"
```

---

## 3. Stripe Webhook

Set up a webhook endpoint in Stripe for `checkout.session.completed` and `customer.subscription.updated` / `deleted` events, pointed at:

```
POST https://astrokalki.com/api/stripe/webhook
```

The webhook syncs subscription status to the `Membership` table.

---

## 4. Database

- Dev: SQLite at `db/custom.db`
- Production: swap `DATABASE_URL` to a Postgres URL and run `prisma migrate deploy`
  ```prisma
  datasource db {
    provider = "postgresql"   // change from sqlite
    url      = env("DATABASE_URL")
  }
  ```

---

## 5. Build & Start

```bash
bun install
bun run db:generate
bun run db:push
bun run build
bun run start
```

---

## 6. Pre-Launch Checklist

- [ ] SMTP credentials set and verified (send a test newsletter signup)
- [ ] `ADMIN_PASSWORD` rotated from the dev value
- [ ] `CRON_SECRET` rotated from the dev value
- [ ] Cron jobs scheduled externally (all 3 endpoints)
- [ ] Stripe keys set to `live_` mode (if launching paid memberships)
- [ ] Stripe webhook endpoint configured and `STRIPE_WEBHOOK_SECRET` set
- [ ] `NEXTAUTH_URL` matches the production domain
- [ ] `NEXT_PUBLIC_SITE_URL` matches the production domain
- [ ] Availability mini-service started (port 3003) if using real-time indicator
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] HTTPS enforced (Caddyfile or reverse proxy)
- [ ] `bun run lint` passes clean
