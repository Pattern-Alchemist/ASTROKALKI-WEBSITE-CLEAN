# AstroKalki Marketing Systems

Complete implementation of 5 marketing strategies + 5 deployment steps for production launch.

## Marketing Strategy 1: Programmatic SEO

**500+ keyword-targeted pages** via dynamic routing.

### Implemented
- Location: `/src/lib/seo/programmatic.ts`
- Categories:
  - Comparison pages (astrology vs therapy, vedic vs western, etc.)
  - Glossary pages (what is natal chart, shadow self, etc.)
  - How-to guides (how to read birth chart, find birth time, etc.)
  - In-depth guides (Saturn return guide, etc.)

### Usage
```typescript
import { getAllSEOPages, getSEOPageBySlug } from '@/lib/seo/programmatic';

// Get all pages
const pages = getAllSEOPages();

// Get specific page by slug
const page = getSEOPageBySlug('astrology-vs-therapy');

// Filter by category
const comparisons = getSEOPagesByCategory('comparison');
```

### Route Implementation
Create dynamic route at `/src/app/learn/[slug]/page.tsx`:
```typescript
import { getSEOPageBySlug } from '@/lib/seo/programmatic';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = getSEOPageBySlug(params.slug);
  return <article>{page.content}</article>;
}
```

---

## Marketing Strategy 2: Lead Magnets

**3 gated resources** capturing emails at different funnel stages.

### Implemented
- Location: `/src/app/api/lead-magnets/route.ts`
- Resources:
  - Pattern Recognition Guide (PDF)
  - Shadow Pattern Quiz (interactive)
  - Karmic Loop Identifier (interactive)
  - Pattern Recognition Checklist

### API Usage
```bash
# List available lead magnets
GET /api/lead-magnets

# Capture email for lead magnet
POST /api/lead-magnets
{
  "email": "user@example.com",
  "name": "John Doe",
  "leadMagnetType": "pattern-guide"
}
```

### Expected Conversion
- Lead magnet view: 100% (everyone sees it)
- Lead magnet download: 5-8% (email capture)
- Free tool interaction: 2-3%
- Email course signup: 10-15% of captured leads

---

## Marketing Strategy 3: Free Interactive Tools

**5 tools** for viral lead generation without signup initially.

### Implemented Tools
Location: `/src/app/api/tools/route.ts`

1. **Birth Chart Calculator**
   - Input: Birth date, time, place
   - Output: Sun, moon, rising signs + chart
   - Conversion: Optional email for results

2. **Astrological Compatibility**
   - Input: Two birth charts
   - Output: Compatibility score + analysis
   - Conversion: Optional email for detailed results

3. **Pattern Analyzer**
   - Input: Emotional pattern + birth data
   - Output: Root cause analysis
   - Conversion: Offer session

4. **Karmic Debt Identifier**
   - Input: Birth date
   - Output: South node interpretation
   - Conversion: Lead to shadow work session

5. **Transit Forecaster**
   - Input: Birth date + date range
   - Output: Upcoming transits
   - Conversion: Guide to understanding transits

### API Usage
```bash
POST /api/tools
{
  "tool": "birth-chart",
  "data": {
    "birthDate": "1995-06-15",
    "birthTime": "14:30",
    "birthPlace": "Mumbai, India",
    "lat": 19.0760,
    "lng": 72.8777
  }
}
```

---

## Marketing Strategy 4: Analytics & Event Tracking

**20+ conversion events** tracked in Google Analytics 4.

### Implemented
- Location: `/src/lib/analytics/events.ts`
- API: `/src/app/api/analytics/events/route.ts`

### Events Tracked
- Lead magnet views/downloads
- Quiz starts/completions
- Free tool usage (birth chart, compatibility, analyzer)
- Content engagement (articles, audio, video)
- Booking page views
- Session bookings
- Session completions (revenue events)
- Account creation
- Journal entries
- Progress dashboard views

### Funnel Analysis
```
Lead Magnet View (100%)
    ↓
Lead Magnet Download (5-8%)
    ↓
Email Course Signup (10-15%)
    ↓
Free Tool Interaction (20-30%)
    ↓
Session Booking (2-5%)
    ↓
Session Completion (100% of bookings)
```

### API Usage
```bash
# Track event
POST /api/analytics/events
{
  "eventName": "lead_magnet_download",
  "eventData": { "type": "pattern-guide" },
  "sessionId": "session_abc123"
}

# Get analytics summary
GET /api/analytics/events?period=30d
```

---

## Marketing Strategy 5: AI SEO Optimization

**LLM-discoverable content** for ChatGPT, Perplexity, Claude.

### Implemented
- Location: `/src/lib/seo/ai-optimization.ts`

### Components

#### 1. LLM-Friendly Files
- `/llms.txt` — Context for LLM crawlers
- `/pricing.md` — For AI product discovery

#### 2. Schema Markup
- LocalBusiness schema
- BreadcrumbList schema
- Article schema with citations

#### 3. Content Structure
- Question-answer format
- Citation-worthy statistics
- Entity mentions (keywords for knowledge graph)

#### 4. Multi-Format Content
- Long-form articles (2000-5000 words)
- Audio narrations (for voice AI)
- Visual charts (for image-understanding AI)
- Structured data (for API access)

### Example Implementation
```typescript
import { createPageSchema, generateLlmsTxt } from '@/lib/seo/ai-optimization';

// Generate schema markup
const schema = createPageSchema('/learn/shadow-self', {
  title: 'What Is the Shadow Self?',
  description: 'Carl Jung\'s shadow...',
  content: 'Long article content...',
});

// Get LLMs.txt content
const llmsContent = generateLlmsTxt();
```

---

## Deployment Step 1: Database Migration

✓ **Completed** — Neon PostgreSQL configured

```bash
# Verify connection
npx prisma studio

# Schema includes all models:
# - ChatConversation, ChatMessage (Ask AstroKalki)
# - ChartAnalysis (VLM readings)
# - AudioNarration (TTS)
# - PatternPortrait (Image generation)
# - EmailCourseEnrollment (Drip campaigns)
# - JournalEntry (Pattern journal)
# - SessionRecap (Pre/post emails)
# - BirthChart, TransitCache (Ephemeris)
# - And 10+ more
```

---

## Deployment Step 2: APIs & Integrations

✓ **Configured** — All APIs ready to connect

See `/src/lib/config/deployment.ts` for full config.

```bash
# Set in .env:
OPENAI_API_KEY=sk_...
STRIPE_SECRET_KEY=sk_live_...
GA4_MEASUREMENT_ID=G_...
```

---

## Deployment Step 3: Email Infrastructure

✓ **Configured** — SMTP + drip campaigns ready

```bash
# Set in .env:
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
EMAIL_FROM=hello@astrokalki.com
```

### Drip Campaign
- Location: `/src/app/api/email/drip/route.ts`
- Sends: 5-day Pattern Recognition email course
- Scheduled: Daily via Vercel crons
- Config: `/vercel.json`

---

## Deployment Step 4: Analytics

✓ **Configured** — GA4 event tracking ready

```bash
# Set in .env:
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G_...
GA4_API_SECRET=...
```

### Dashboard Metrics
- Total visitors & new visitors
- Lead capture rate
- Email course conversion
- Booking conversion
- Revenue (session completions)

---

## Deployment Step 5: Domain & Production

✓ **Security headers configured**
- X-Frame-Options: SAMEORIGIN
- HSTS: 1 year preload
- CSP: Self-origin + YouTube
- CORS: Custom domain

✓ **DNS records needed**
```
A     @    astrokalki.vercel.app
CNAME www  cname.vercel-dns.com
```

---

## Quick Launch Checklist

- [ ] Copy `.env.example` to `.env` and fill in values
- [ ] Verify database connection: `npx prisma studio`
- [ ] Test email: Create newsletter signup and check inbox
- [ ] Test analytics: Visit page and check GA4
- [ ] Set domain DNS records
- [ ] Deploy to Vercel: `git push origin main`
- [ ] Monitor first 24 hours in deployment logs

---

## Expected Metrics (First 90 Days)

| Metric | Goal | Actual |
|--------|------|--------|
| Monthly visitors | 2,000-3,000 | - |
| Email captures | 100-240 | - |
| Email course completions | 20-40 | - |
| Free tool interactions | 200-500 | - |
| Session bookings | 2-7 | - |
| Session completions | 2-7 | - |
| AI search citations | 50+ | - |
| Email capture rate | 5-8% | - |
| Booking conversion | 2-5% | - |

---

## Files & Locations

```
Marketing Systems:
├── src/lib/seo/programmatic.ts         (500+ pages)
├── src/lib/seo/ai-optimization.ts      (LLM optimization)
├── src/lib/email/config.ts             (Email + drip)
├── src/lib/analytics/events.ts         (GA4 tracking)
├── src/lib/config/deployment.ts        (Deployment config)

API Routes:
├── src/app/api/lead-magnets/           (Lead magnet capture)
├── src/app/api/tools/                  (Free tools)
├── src/app/api/analytics/events/       (Event tracking)
├── src/app/api/email/drip/             (Email campaign)

AI SEO Files:
├── public/llms.txt                     (For LLM crawlers)
├── public/pricing.md                   (For AI discovery)

Configuration:
├── .env.example                        (Environment template)
├── vercel.json                         (Cron jobs)
├── DEPLOYMENT.md                       (Deployment guide)
├── MARKETING.md                        (This file)
```

---

## Next: Go Live

1. Set all environment variables in Vercel project
2. Deploy: `git push origin main`
3. Monitor emails, analytics, funnel
4. Optimize lead magnets based on conversion data
5. Scale paid ads once organic funnel is working
