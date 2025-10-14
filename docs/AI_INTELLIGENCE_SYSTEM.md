# AI-Powered Threat Intelligence System

## Overview

AfroSecured uses **GPT-4** to automatically extract threat intelligence from cybersecurity articles, providing users with structured, actionable security insights without requiring manual analysis.

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Cron Job (Hourly)                 │
│                  /api/cron/update-articles                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              1. Fetch RSS Feeds (4 sources)                  │
│   • Krebs on Security  • The Hacker News                    │
│   • Dark Reading       • BleepingComputer                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         2. Fetch Full Article Content (Web Scraping)         │
│   • Respects robots.txt and rate limits                     │
│   • 10-second timeout per article                           │
│   • User-Agent: AfroSecured-Bot/1.0                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      3. AI Extraction (GPT-4 via Vercel AI SDK)             │
│   • Threat level assessment (critical/high/medium/low)      │
│   • Threat indicators & attack vectors                      │
│   • Affected platforms (Windows, Linux, Chrome, etc.)       │
│   • CVE identifiers                                         │
│   • IOCs (IPs, domains, hashes, URLs)                       │
│   • Security recommendations                                │
│   • Auto-generated tags                                     │
│   • Relevance to African users (0-10 score)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           4. Store in Supabase (PostgreSQL)                  │
│   • Upsert articles (update if exists)                      │
│   • Full-text search indexing                               │
│   • Keep last 100 articles per source                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         5. Frontend Display (SWR Auto-Refresh)               │
│   • Real-time updates every 60 seconds                      │
│   • Expandable intelligence cards                           │
│   • Threat level color coding                               │
│   • CVE links to NIST database                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Features

### 1. Intelligent Content Extraction

Instead of just displaying RSS feed summaries, AfroSecured:
- Fetches the **full article content** from source websites
- Uses **GPT-4** to analyze and extract structured threat intelligence
- Generates **concise summaries** (2-3 sentences) for quick scanning
- Assesses **threat severity** automatically

### 2. Structured Threat Data

Each article is enriched with:

| Field | Description | Example |
|-------|-------------|---------|
| `threat_level` | Severity assessment | `critical`, `high`, `medium`, `low`, `info` |
| `threat_indicators` | Attack vectors & vulnerabilities | `["SQL injection", "Remote code execution"]` |
| `affected_platforms` | Systems at risk | `["Windows 10", "Chrome", "WordPress"]` |
| `cve_ids` | CVE identifiers | `["CVE-2024-1234", "CVE-2024-5678"]` |
| `iocs` | Indicators of Compromise | `{ ips: ["192.0.2.1"], domains: ["evil.com"] }` |
| `recommendations` | Security actions | `["Update to version 2.0", "Enable 2FA"]` |
| `tags` | Auto-categorization | `["ransomware", "phishing", "data-breach"]` |

### 3. Ethical Web Scraping

AfroSecured follows best practices:
- ✅ Respects `robots.txt` files
- ✅ Rate limiting (1-3 second delays between requests)
- ✅ Proper User-Agent identification
- ✅ 10-second timeout to avoid hanging
- ✅ Only scrapes publicly available content
- ✅ Caches results to minimize requests

### 4. Real-Time Updates

- **Cron Job**: Runs every hour via Vercel Cron
- **Frontend**: Auto-refreshes every 60 seconds using SWR
- **Manual Trigger**: Admin dashboard button for on-demand updates
- **Smart Caching**: 60-second cache with 120-second stale-while-revalidate

## Database Schema

\`\`\`sql
CREATE TABLE cybersecurity_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  pub_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT,
  
  -- AI-extracted fields
  ai_summary TEXT,
  threat_level TEXT CHECK (threat_level IN ('critical', 'high', 'medium', 'low', 'info')),
  threat_indicators JSONB DEFAULT '[]'::jsonb,
  affected_platforms TEXT[],
  cve_ids TEXT[],
  iocs JSONB DEFAULT '{}'::jsonb,
  recommendations TEXT[],
  tags TEXT[],
  ai_processed BOOLEAN DEFAULT false,
  ai_processed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_pub_date ON cybersecurity_articles(pub_date DESC);
CREATE INDEX idx_articles_threat_level ON cybersecurity_articles(threat_level);
CREATE INDEX idx_articles_tags ON cybersecurity_articles USING GIN(tags);
CREATE INDEX idx_articles_search ON cybersecurity_articles 
  USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(ai_summary, '')));
\`\`\`

## AI Extraction Process

### Input to GPT-4

\`\`\`typescript
const prompt = `You are a cybersecurity analyst extracting threat intelligence from news articles.

Article Source: ${source}
Article Title: ${title}
Article Content: ${content.substring(0, 4000)}

Extract the following information:
1. A concise summary (2-3 sentences)
2. Threat severity level
3. Key threat indicators and attack vectors
4. Affected platforms/systems
5. Any CVE identifiers mentioned
6. Indicators of Compromise (IPs, domains, hashes, URLs)
7. Security recommendations
8. Relevant tags for categorization
9. Relevance to African users/businesses`
\`\`\`

### Output Schema (Zod)

\`\`\`typescript
const ThreatIntelligenceSchema = z.object({
  summary: z.string(),
  threatLevel: z.enum(["critical", "high", "medium", "low", "info"]),
  threatIndicators: z.array(z.string()),
  affectedPlatforms: z.array(z.string()),
  cveIds: z.array(z.string()),
  iocs: z.object({
    ips: z.array(z.string()).optional(),
    domains: z.array(z.string()).optional(),
    hashes: z.array(z.string()).optional(),
    urls: z.array(z.string()).optional(),
  }),
  recommendations: z.array(z.string()),
  tags: z.array(z.string()),
  relevanceToAfrica: z.number().min(0).max(10),
})
\`\`\`

## Setup Instructions

### 1. Run Database Migrations

\`\`\`bash
# Create the enhanced articles table
Run script: scripts/006_enhance_articles_table_for_ai.sql
\`\`\`

### 2. Deploy to Vercel

The cron job is configured in `vercel.json`:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/update-articles",
      "schedule": "0 * * * *"
    }
  ]
}
\`\`\`

This runs every hour at minute 0 (e.g., 1:00, 2:00, 3:00).

### 3. Manual Trigger (Optional)

Visit the admin dashboard at `/admin` and click "Trigger Update Now" to manually fetch and process articles.

Or use curl:

\`\`\`bash
curl -X GET https://your-domain.com/api/cron/update-articles \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
\`\`\`

## Performance Metrics

### Processing Time
- **RSS Fetch**: ~1-2 seconds per source
- **Full Content Fetch**: ~2-3 seconds per article
- **AI Extraction**: ~3-5 seconds per article
- **Total per article**: ~5-10 seconds
- **Total per run** (20 articles): ~2-3 minutes

### Cost Estimation (GPT-4o-mini)
- **Input tokens**: ~1,500 per article (title + content)
- **Output tokens**: ~300 per article (structured data)
- **Cost per article**: ~$0.001 (GPT-4o-mini pricing)
- **Cost per hour**: ~$0.02 (20 articles)
- **Monthly cost**: ~$14.40 (24 runs/day × 30 days)

### Database Storage
- **Average article size**: ~5 KB (with AI data)
- **20 articles/hour**: ~100 KB/hour
- **Monthly storage**: ~72 MB
- **With 100 articles/source retention**: ~2 MB total

## Monitoring & Debugging

### Check Cron Job Logs

In Vercel Dashboard:
1. Go to your project
2. Click "Deployments" → Select latest deployment
3. Click "Functions" → Find `/api/cron/update-articles`
4. View logs for execution history

### Check Database

\`\`\`sql
-- Count AI-processed articles
SELECT COUNT(*) FROM cybersecurity_articles WHERE ai_processed = true;

-- View recent articles with threat levels
SELECT title, threat_level, ai_processed_at 
FROM cybersecurity_articles 
WHERE ai_processed = true 
ORDER BY ai_processed_at DESC 
LIMIT 10;

-- Check articles by threat level
SELECT threat_level, COUNT(*) 
FROM cybersecurity_articles 
WHERE ai_processed = true 
GROUP BY threat_level;
\`\`\`

### Admin Dashboard

Visit `/admin` to see:
- Total articles in database
- Articles added in last 24 hours
- Articles by source breakdown
- System health status
- Manual trigger button

## Troubleshooting

### No Articles Appearing

1. **Check if cron job ran**: Look at Vercel function logs
2. **Run manual trigger**: Visit `/admin` and click "Trigger Update Now"
3. **Check database**: Verify table exists and has data
4. **Check API route**: Visit `/api/articles` directly

### AI Extraction Failing

1. **Check API key**: Ensure OpenAI API key is configured (via Vercel AI Gateway)
2. **Check rate limits**: GPT-4o-mini has generous limits, but verify
3. **Check content length**: Articles over 8,000 chars are truncated
4. **Check error logs**: Look for `[v0] AI extraction error` in logs

### Slow Performance

1. **Reduce article count**: Change `count=5` to `count=3` in cron job
2. **Increase delays**: Add longer `setTimeout` between requests
3. **Use GPT-3.5-turbo**: Faster but less accurate (change model in `lib/ai-content-extractor.ts`)

## Future Enhancements

- [ ] Add sentiment analysis for threat urgency
- [ ] Implement article deduplication across sources
- [ ] Add email notifications for critical threats
- [ ] Create weekly threat digest reports
- [ ] Add multi-language support for African languages
- [ ] Implement user feedback loop for AI accuracy
- [ ] Add trending threat visualization dashboard
- [ ] Integrate with threat intelligence APIs (MISP, OpenCTI)

## Security Considerations

- ✅ Row Level Security (RLS) enabled on database
- ✅ Service role key used only in server-side code
- ✅ Rate limiting on web scraping
- ✅ Input validation on all AI-extracted data
- ✅ HTTPS-only communication
- ✅ No PII collection from articles
- ✅ Proper error handling to prevent data leaks

## Legal & Ethical Compliance

AfroSecured's web scraping is legal and ethical because:
1. **Publicly Available Content**: Only scrapes publicly accessible articles
2. **Fair Use**: Educational/research purpose for cybersecurity awareness
3. **Attribution**: Always links back to original sources
4. **Robots.txt Compliance**: Respects website crawling rules
5. **Rate Limiting**: Doesn't overload source servers
6. **No Circumvention**: Doesn't bypass paywalls or authentication
7. **Transformative Use**: Adds value through AI analysis and summarization

---

**Built with**: Next.js, Vercel AI SDK, GPT-4, Supabase, TypeScript, Zod
