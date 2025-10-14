# AfroSecured - Quick Setup Guide

## Get Started in 5 Minutes

### Step 1: Run Database Scripts (Required)

Execute these scripts in order from the v0 interface:

1. `scripts/012_seed_geographic_threat_data.sql` - Adds threat data for heatmap
2. `scripts/013_create_error_logging.sql` - Sets up error tracking
3. `scripts/014_create_behavioral_biometrics.sql` - Enables fraud detection
4. `scripts/015_create_risk_assessments_table.sql` - Risk scoring system
5. `scripts/016_create_payguard_tables.sql` - PayGuard with FraudFreeze

### Step 2: Add API Keys (Optional but Recommended)

Add these to your Vercel environment variables:

**Free APIs (Highly Recommended):**
\`\`\`
ALIENVAULT_API_KEY=your_key_here
VIRUSTOTAL_API_KEY=your_key_here
ABUSEIPDB_API_KEY=your_key_here
\`\`\`

**Get Your Keys:**
1. AlienVault OTX: https://otx.alienvault.com → Settings → API Key
2. VirusTotal: https://www.virustotal.com/gui/join-us → Profile → API Key
3. AbuseIPDB: https://www.abuseipdb.com/register → Account → API

### Step 3: Test Core Features

**Threat Heatmap:**
- Visit `/intel` to see live global threat map
- Should show 35+ threats across multiple countries

**Visa Verification:**
- Visit `/visa-verify` to test merchant verification
- Try entering a merchant name or transaction details

**PayGuard:**
- Visit `/payguard` to see transaction monitoring
- Install Chrome extension from `/extension`

**Scam Analyzer:**
- Visit `/tools` to analyze suspicious URLs
- Test with known phishing sites

### Step 4: Admin Access

**Login:**
- Email: `bryanndum12@gmail.com`
- Password: `Admin@2024Secure`
- URL: `/admin`

**Admin Features:**
- View all reported scams
- Moderate community submissions
- Monitor system health
- View analytics

## What Works Right Now (Without API Keys)

✅ Threat Intelligence Heatmap (35+ threats loaded)
✅ Merchant Verification (basic checks)
✅ Scam Database (pre-seeded data)
✅ Risk Scoring Engine
✅ Behavioral Biometrics Tracking
✅ Admin Dashboard
✅ Community Reporting
✅ Educational Content

## What Needs API Keys

⚠️ Real-time threat intelligence updates (AlienVault OTX)
⚠️ URL scanning (VirusTotal)
⚠️ IP reputation checks (AbuseIPDB)
⚠️ Visa production features (Visa API - already have sandbox)

## Chrome Extension Installation

1. Visit `/extension`
2. Click "Download Extension"
3. Extract the ZIP file
4. Open Chrome → Extensions → Enable Developer Mode
5. Click "Load Unpacked" → Select extracted folder
6. Extension is now active!

## Troubleshooting

**Heatmap not showing threats?**
- Run `scripts/012_seed_geographic_threat_data.sql`

**Admin login not working?**
- Run `scripts/008_create_default_admin.sql`

**Risk scoring not working?**
- Run `scripts/014_create_behavioral_biometrics.sql`
- Run `scripts/015_create_risk_assessments_table.sql`

**PayGuard not tracking?**
- Run `scripts/016_create_payguard_tables.sql`

## Production Checklist

Before going live:

- [ ] Run all database scripts
- [ ] Add all API keys
- [ ] Test admin dashboard
- [ ] Test Chrome extension
- [ ] Apply for Visa production access
- [ ] Set up error monitoring
- [ ] Configure automated backups
- [ ] Add custom domain
- [ ] Set up SSL certificate
- [ ] Test on mobile devices

## Support

Issues? Check:
1. Database scripts are all executed
2. Environment variables are set
3. Supabase connection is active
4. Check browser console for errors

---

**You're ready to start protecting yourself from scams!**
