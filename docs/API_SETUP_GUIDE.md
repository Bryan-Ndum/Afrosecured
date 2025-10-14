# API Setup Guide for AfroSecured

This guide will help you set up all the required API keys for full functionality.

## Priority 1: Essential Threat Intelligence (Free)

### 1. AlienVault OTX API Key
**Purpose**: Real-time threat intelligence feed with IOCs, malware signatures, and phishing URLs

**Setup Steps**:
1. Go to https://otx.alienvault.com
2. Click "Sign Up" (free account)
3. Verify your email
4. Go to Settings → API Integration
5. Copy your API Key

**Add to Vercel**:
\`\`\`bash
ALIENVAULT_API_KEY=your_key_here
\`\`\`

**What you get**: 
- 100,000+ threat indicators
- Real-time malware signatures
- Phishing URL database
- Community-contributed threat intelligence

---

### 2. VirusTotal API Key
**Purpose**: URL and file scanning with 70+ antivirus engines

**Setup Steps**:
1. Go to https://www.virustotal.com/gui/join-us
2. Sign up with email
3. Verify your email
4. Go to your profile → API Key
5. Copy your API Key

**Add to Vercel**:
\`\`\`bash
VIRUSTOTAL_API_KEY=your_key_here
\`\`\`

**Free Tier Limits**: 
- 4 requests per minute
- 500 requests per day
- Perfect for our use case

**What you get**:
- Multi-engine URL scanning
- File hash lookups
- Domain reputation
- IP address analysis

---

### 3. AbuseIPDB API Key
**Purpose**: IP reputation checking and abuse reports

**Setup Steps**:
1. Go to https://www.abuseipdb.com/register
2. Create free account
3. Verify email
4. Go to Account → API
5. Generate API Key

**Add to Vercel**:
\`\`\`bash
ABUSEIPDB_API_KEY=your_key_here
\`\`\`

**Free Tier Limits**:
- 1,000 checks per day
- Access to blacklist
- Confidence scores

**What you get**:
- IP abuse confidence scores
- Country and ISP information
- Recent abuse reports
- Blacklist access

---

## Priority 2: Enhanced Features (Recommended)

### 4. Twilio API (For SMS Alerts)
**Purpose**: Send SMS alerts to elderly users and high-risk notifications

**Setup Steps**:
1. Go to https://www.twilio.com/try-twilio
2. Sign up (free trial includes $15 credit)
3. Get your Account SID and Auth Token
4. Get a phone number

**Add to Vercel**:
\`\`\`bash
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
\`\`\`

**Cost**: ~$0.0075 per SMS (very affordable)

**Why it matters**: Elderly users prefer SMS over app notifications

---

### 5. SendGrid or Resend (For Email Alerts)
**Purpose**: Email notifications and weekly security digests

**Option A: SendGrid**
1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Create API Key
4. Verify sender email

**Option B: Resend** (Recommended)
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Create API Key
4. Add domain (optional)

**Add to Vercel**:
\`\`\`bash
SENDGRID_API_KEY=your_key_here
# OR
RESEND_API_KEY=your_key_here
\`\`\`

---

## Already Configured

### Visa API ✓
- Sandbox credentials already set up
- Production access: Apply at developer.visa.com
- Timeline: 2-4 weeks for approval

### Supabase ✓
- Database fully configured
- Real-time subscriptions active

### Vercel AI Gateway ✓
- GPT-4 access for content generation
- No additional setup needed

---

## Optional: Future Enhancements

### Google Safe Browsing API
**Purpose**: Additional URL verification layer
**Cost**: Free (10,000 queries/day)
**Setup**: Google Cloud Console

### MaxMind GeoIP2
**Purpose**: More accurate IP geolocation
**Cost**: Free tier available
**Setup**: maxmind.com

---

## Quick Start Commands

After adding API keys to Vercel, run these scripts to populate your database:

\`\`\`bash
# 1. Create threat intelligence tables
Run: scripts/009_create_advanced_threat_tables.sql

# 2. Sync threat data
The cron job at /api/cron/sync-threat-intelligence will run automatically every 6 hours

# 3. Test the APIs
Visit: /api/threat-indicators to see synced data
\`\`\`

---

## Testing Your Setup

### Test AlienVault OTX:
\`\`\`bash
curl https://your-domain.com/api/cron/sync-threat-intelligence
\`\`\`

### Test VirusTotal:
\`\`\`bash
curl -X POST https://your-domain.com/api/scan/enhanced \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
\`\`\`

### Test AbuseIPDB:
\`\`\`bash
curl https://your-domain.com/api/threat-indicators?type=ip
\`\`\`

---

## Troubleshooting

**"API key not configured" errors**:
- Check environment variables in Vercel dashboard
- Ensure no extra spaces in API keys
- Redeploy after adding new variables

**Rate limit errors**:
- VirusTotal: 4 requests/minute (add delays)
- AbuseIPDB: 1,000/day (cache results)
- AlienVault: No strict limits

**No data showing**:
- Run the SQL scripts first
- Trigger the cron job manually
- Check automation_logs table for errors

---

## Support

Need help? Check:
- `/admin` dashboard for automation logs
- `automation_logs` table in Supabase
- Error logs in Vercel dashboard
