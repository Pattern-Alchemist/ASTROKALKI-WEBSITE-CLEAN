# AstroKalki — Production Setup Checklist

Complete guide for deploying AstroKalki to production with all systems operational.

## Phase 1: Database Setup (Neon PostgreSQL)

Neon is already connected via the Vercel integration. Your database connection variables are set.

### Step 1: Verify Database Connection

```bash
# In production, Vercel automatically provides DATABASE_URL
# Verify it's set:
echo $DATABASE_URL

# Should output:
# postgresql://username:password@host/database
```

### Step 2: Run Migrations

```bash
# Run Prisma migrations to create all tables
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Verify schema
npx prisma studio
```

### Step 3: Seed Initial Data (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add sample data if needed
  console.log('Database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

---

## Phase 2: Email Configuration

Email infrastructure is ready. Configure SMTP.

### Step 1: Gmail SMTP Setup

1. Go to https://myaccount.google.com/apppasswords
2. Select App: "Mail"
3. Select Device: "Windows Computer" (or your OS)
4. Generate app password
5. Copy the 16-character password

### Step 2: Set Environment Variables

Add to Vercel project settings (Settings → Environment Variables):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_SECURE=false
EMAIL_FROM=hello@astrokalki.com
CRON_SECRET=generate-random-secret-here
```

Generate `CRON_SECRET`:
```bash
openssl rand -base64 32
```

### Step 3: Test Email Sending

```bash
# Create test file
cat > test-email.js << 'EOF'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<h1>Test Successful</h1>',
});

console.log('Email sent');
EOF

# Run test
node test-email.js
```

---

## Phase 3: Analytics Setup (Google Analytics 4)

### Step 1: Create GA4 Property

1. Go to https://analytics.google.com
2. Create new property "AstroKalki"
3. Get Measurement ID (format: G_XXXXXXXXXX)

### Step 2: Set Environment Variables

Add to Vercel:

```
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G_XXXXXXXXXX
```

### Step 3: Verify Tracking

1. Deploy the app
2. Visit https://yourdomain.com
3. Open https://analytics.google.com
4. Check Real Time → Events
5. Should see page_view events

### Step 4: Create Conversion Goals

In GA4 > Admin > Events > Create event:

- `lead_magnet_download` — Lead captured
- `email_course_signup` — Course enrolled
- `free_tool_accessed` — Tool used
- `session_booked` — Session booked
- `session_completed` — Session completed

---

## Phase 4: API Services Integration

### Option A: Vercel AI Gateway (Recommended)

Free tier includes:
- OpenAI GPT-4 access
- Image generation (DALL-E 3)
- No additional API keys needed

Set in Vercel:
```
AI_GATEWAY_API_KEY=your-vercel-gateway-key
```

### Option B: OpenAI Direct

1. Create account at https://platform.openai.com
2. Generate API key
3. Add to Vercel:
   ```
   OPENAI_API_KEY=sk-...
   LLM_PROVIDER=openai
   ```

### Stripe (Optional - for payments)

1. Create Stripe account https://stripe.com
2. Get API keys from Dashboard
3. Add to Vercel:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## Phase 5: Cron Jobs

Cron jobs are configured in `vercel.json`. They run automatically.

### Email Scheduler Cron

```json
{
  "crons": [{
    "path": "/api/cron/email-scheduler",
    "schedule": "0 * * * *"
  }]
}
```

Runs hourly to:
- Process pending emails
- Send drip campaign emails
- Retry failed emails

### Verify Cron is Running

1. Deploy to Vercel
2. Wait 1 hour
3. Check Vercel Logs for `/api/cron/email-scheduler` calls
4. Check that emails were processed

---

## Phase 6: Domain & SSL

### Step 1: Connect Domain

1. In Vercel dashboard → Project Settings → Domains
2. Add your domain (e.g., astrokalki.com)
3. Follow DNS setup instructions

### DNS Records

```
Type    Name    Value
A       @       76.76.19.21
CNAME   www     cname.vercel-dns.com
TXT     @       v=spf1 include:sendgrid.net ~all
```

### Step 2: SSL Certificate

Vercel automatically:
- Issues free SSL certificates
- Auto-renews every 60 days
- Handles HTTPS redirects

---

## Phase 7: Deployment

### Option 1: GitHub Push (Recommended)

```bash
# Push to main branch
git push origin fix-npm-scripts:main

# Vercel auto-deploys
# Check https://vercel.com/[project]
```

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Check status
vercel logs
```

### Option 3: v0 Publish Button

1. Click "Publish" in v0 top right
2. Connect to Vercel if not already
3. Vercel deploys automatically

---

## Phase 8: Post-Deployment Verification

After deployment, verify:

### 1. Site Loads
```bash
curl -I https://astrokalki.com
# Should return 200
```

### 2. Database Connected
Visit `/account/progress` (requires login)
Should load without errors

### 3. Email Works
Subscribe to email course at `/email-course`
Should receive Day 1 email within 1 hour

### 4. Analytics Tracking
Visit site, check https://analytics.google.com
Should see events in Real Time

### 5. Cron Jobs Running
Check Vercel Logs > Functions
Should see `/api/cron/email-scheduler` running hourly

### 6. API Routes Functional
```bash
curl https://astrokalki.com/api/lead-magnets
# Should return 200 with JSON
```

---

## Environment Variables Checklist

```
# Database
DATABASE_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
EMAIL_FROM=hello@astrokalki.com
CRON_SECRET=...

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G_...

# AI Services
AI_GATEWAY_API_KEY=vck_... (or OPENAI_API_KEY=sk_...)

# Optional: Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Image Generation
IMAGE_API_KEY=sk_...
IMAGE_MODEL=dall-e-3

# Optional: Text-to-Speech
TTS_API_KEY=sk_...
TTS_VOICE=nova
```

---

## Monitoring & Maintenance

### Daily
- Check Vercel deployments for errors
- Monitor email queue (should process every hour)
- Check analytics for unusual activity

### Weekly
- Review GA4 events
- Check email delivery rates
- Monitor error logs

### Monthly
- Review analytics trends
- Check database performance
- Update dependencies: `npm update`

---

## Troubleshooting

### Emails Not Sending
```
1. Check SMTP credentials in Vercel
2. Check email queue in database
3. Check /api/cron/email-scheduler logs
4. Verify EMAIL_FROM is valid
```

### Database Connection Error
```
1. Verify DATABASE_URL is set in Vercel
2. Check Neon console for connection limits
3. Run: npx prisma db push
4. Check database logs
```

### Cron Jobs Not Running
```
1. Check vercel.json for cron config
2. Verify CRON_SECRET is set
3. Check Vercel Logs for errors
4. Redeploy project
```

### Analytics Not Tracking
```
1. Verify NEXT_PUBLIC_GA4_MEASUREMENT_ID is set
2. Check browser console for errors
3. Check GA4 Real Time dashboard
4. Verify GA4 script is loaded (check page source)
```

---

## Success Checklist

- [ ] Database migrated to Neon PostgreSQL
- [ ] SMTP configured (emails sending)
- [ ] Analytics property created (tracking events)
- [ ] Domain connected with SSL
- [ ] Cron jobs running (check logs)
- [ ] Email course working (received test email)
- [ ] Lead magnets functional (can download)
- [ ] Free tools accessible
- [ ] API endpoints responding
- [ ] Vercel deployment stable

**🚀 You're live!**
