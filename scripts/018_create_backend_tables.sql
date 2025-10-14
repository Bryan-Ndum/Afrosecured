-- Transactions table for logging all analyzed transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('mpesa', 'mtn', 'airtel', 'bank')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  is_fraud BOOLEAN NOT NULL DEFAULT false,
  blocked_patterns TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blacklisted numbers table
CREATE TABLE IF NOT EXISTS blacklisted_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  reason TEXT NOT NULL,
  source TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scam reports table for community intelligence
CREATE TABLE IF NOT EXISTS scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_number TEXT NOT NULL,
  reported_number TEXT NOT NULL,
  scam_type TEXT NOT NULL,
  description TEXT,
  amount_lost DECIMAL(15, 2),
  evidence_urls TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Threat patterns table for offline detection
CREATE TABLE IF NOT EXISTS threat_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('url', 'phone', 'keyword', 'amount')),
  pattern_value TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source TEXT NOT NULL,
  confidence DECIMAL(3, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pattern_type, pattern_value)
);

-- SMS alerts log
CREATE TABLE IF NOT EXISTS sms_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered BOOLEAN DEFAULT false,
  response TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender);
CREATE INDEX IF NOT EXISTS idx_transactions_recipient ON transactions(recipient);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blacklisted_numbers_phone ON blacklisted_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_scam_reports_reported_number ON scam_reports(reported_number);
CREATE INDEX IF NOT EXISTS idx_threat_patterns_type_value ON threat_patterns(pattern_type, pattern_value);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklisted_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for public read access to threat data
CREATE POLICY "Public read access to blacklisted numbers" ON blacklisted_numbers FOR SELECT USING (true);
CREATE POLICY "Public read access to threat patterns" ON threat_patterns FOR SELECT USING (true);

-- Policies for authenticated users to report scams
CREATE POLICY "Users can submit scam reports" ON scam_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view scam reports" ON scam_reports FOR SELECT USING (true);
