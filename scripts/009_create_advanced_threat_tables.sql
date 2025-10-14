CREATE TABLE IF NOT EXISTS phishing_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  phish_id TEXT,
  verified BOOLEAN DEFAULT false,
  verification_time TIMESTAMPTZ,
  target TEXT,
  submission_time TIMESTAMPTZ,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS threat_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type TEXT NOT NULL, -- ip, domain, url, hash, email
  indicator_value TEXT NOT NULL,
  threat_type TEXT, -- malware, phishing, botnet, etc
  severity TEXT DEFAULT 'medium', -- low, medium, high, critical
  source TEXT NOT NULL, -- alienvault, phishtank, community, etc
  pulse_id TEXT,
  tags TEXT[],
  description TEXT,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  confidence_score INTEGER DEFAULT 50, -- 0-100
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(indicator_type, indicator_value, source)
);

CREATE TABLE IF NOT EXISTS social_scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- twitter, reddit, telegram
  post_id TEXT,
  author TEXT,
  content TEXT NOT NULL,
  url TEXT,
  scam_type TEXT,
  severity TEXT DEFAULT 'medium',
  ai_confidence INTEGER, -- 0-100
  verified BOOLEAN DEFAULT false,
  engagement_count INTEGER DEFAULT 0,
  reported_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- daily_tip, weekly_summary, trend_analysis, alert
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type TEXT NOT NULL, -- scam_report, phishing_url, suspicious_email
  content TEXT NOT NULL,
  submitter_email TEXT,
  submitter_ip TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  ai_analysis JSONB,
  moderator_notes TEXT,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  job_type TEXT NOT NULL, -- cron, webhook, api
  status TEXT NOT NULL, -- success, failure, partial
  items_processed INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_phishing_urls_url ON phishing_urls(url);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_value ON threat_indicators(indicator_value);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_type ON threat_indicators(indicator_type);
CREATE INDEX IF NOT EXISTS idx_social_reports_platform ON social_scam_reports(platform);
CREATE INDEX IF NOT EXISTS idx_ai_content_published ON ai_generated_content(published, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_community_status ON community_submissions(status);
CREATE INDEX IF NOT EXISTS idx_automation_logs_job ON automation_logs(job_name, created_at DESC);
