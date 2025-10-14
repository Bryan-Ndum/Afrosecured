# Automatic Article Update System

## Overview

AfroSecured automatically fetches and updates cybersecurity articles from trusted sources every hour using Vercel Cron Jobs and Supabase.

## Architecture

### Components

1. **Database Table**: `cybersecurity_articles`
   - Stores articles from RSS feeds
   - Indexed by publication date and source
   - Row Level Security enabled for public read access

2. **Cron Job**: `/api/cron/update-articles`
   - Runs every hour (configured in `vercel.json`)
   - Fetches from 4 trusted sources:
     - Krebs on Security
     - The Hacker News
     - Dark Reading
     - BleepingComputer
   - Upserts articles (prevents duplicates)
   - Cleans up old articles (keeps last 100 per source)

3. **API Route**: `/api/articles`
   - Fetches articles from database
   - Returns latest 20 articles
   - Cached for 60 seconds with stale-while-revalidate

4. **Frontend Component**: `components/trusted-sources.tsx`
   - Uses SWR for automatic revalidation
   - Refreshes every 60 seconds
   - Shows real-time updates badge
   - AI-powered threat analysis on demand

## Setup Instructions

### 1. Run Database Migration

Execute the SQL script to create the articles table:

\`\`\`bash
# The script is located at: scripts/005_create_cybersecurity_articles_table.sql
# Run it from the v0 interface or Supabase dashboard
\`\`\`

### 2. Initial Population

Manually trigger the cron job to populate the database:

\`\`\`bash
# Option 1: Deploy to Vercel and visit the cron endpoint
curl https://your-domain.vercel.app/api/cron/update-articles

# Option 2: Set CRON_SECRET and use authorization
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/update-articles
\`\`\`

### 3. Verify Cron Job Configuration

The `vercel.json` file configures the cron schedule:

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

**Schedule**: `0 * * * *` = Every hour at minute 0

### 4. Optional: Set CRON_SECRET

For additional security when manually triggering:

\`\`\`bash
# In Vercel Dashboard > Project Settings > Environment Variables
CRON_SECRET=your-random-secret-here
\`\`\`

## How It Works

### Automatic Updates

1. **Every Hour**: Vercel triggers the cron job
2. **Fetch RSS Feeds**: Parallel requests to all 4 sources
3. **Parse & Clean**: Extract title, description, link, date
4. **Upsert to Database**: Insert new or update existing articles
5. **Cleanup**: Remove articles older than the last 100 per source
6. **Frontend Auto-Refresh**: SWR detects changes and updates UI

### Real-Time User Experience

- Articles refresh automatically every 60 seconds
- Users see "Auto-updates every hour" badge
- Manual refresh button available
- No page reload required
- Smooth loading states

## Monitoring

### Check Cron Job Logs

In Vercel Dashboard:
1. Go to your project
2. Click "Deployments"
3. Select latest deployment
4. Click "Functions" tab
5. Find `/api/cron/update-articles`
6. View execution logs

### Check Database

\`\`\`sql
-- Count articles per source
SELECT source, COUNT(*) as count
FROM cybersecurity_articles
GROUP BY source
ORDER BY count DESC;

-- Latest articles
SELECT title, source, pub_date
FROM cybersecurity_articles
ORDER BY pub_date DESC
LIMIT 10;

-- Check last update time
SELECT MAX(updated_at) as last_update
FROM cybersecurity_articles;
\`\`\`

## Troubleshooting

### No Articles Showing

1. Check if database table exists
2. Run cron job manually to populate
3. Check Supabase RLS policies
4. Verify environment variables

### Cron Job Not Running

1. Verify `vercel.json` is in project root
2. Check Vercel Dashboard > Cron Jobs
3. Ensure project is deployed (cron only works in production)
4. Check function logs for errors

### Stale Articles

1. Manually trigger cron job
2. Check RSS feed availability
3. Verify rss2json API is working
4. Check rate limits

## Performance

- **Database**: Indexed queries, ~10ms response time
- **API Route**: Cached for 60s, stale-while-revalidate
- **Frontend**: SWR caching, optimistic updates
- **Cron Job**: ~5-10 seconds execution time

## Future Enhancements

- [ ] Add more RSS sources
- [ ] Implement full-text search
- [ ] Add article categorization with AI
- [ ] Email digest for subscribers
- [ ] Webhook notifications for critical threats
- [ ] Multi-language support
