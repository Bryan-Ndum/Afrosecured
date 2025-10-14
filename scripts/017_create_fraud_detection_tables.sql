-- Threat patterns for offline fraud detection
CREATE TABLE IF NOT EXISTS threat_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description TEXT NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  recipient_pattern TEXT,
  amount_min DECIMAL(15, 2),
  amount_max DECIMAL(15, 2),
  message_keywords TEXT[], -- Array of keywords
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blacklisted phone numbers
CREATE TABLE IF NOT EXISTS blacklisted_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  reported_count INTEGER DEFAULT 1,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction analyses
CREATE TABLE IF NOT EXISTS transaction_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  recipient VARCHAR(20) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  should_block BOOLEAN NOT NULL,
  risks JSONB NOT NULL,
  recommendation TEXT NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_action VARCHAR(50), -- 'PROCEEDED', 'CANCELLED', 'REPORTED'
  was_fraud BOOLEAN -- User feedback
);

-- SMS analyses
CREATE TABLE IF NOT EXISTS sms_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  sender VARCHAR(20) NOT NULL,
  message_body TEXT NOT NULL,
  is_scam BOOLEAN NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  warning TEXT,
  keywords TEXT[],
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_reported BOOLEAN DEFAULT false
);

-- User reports (for community intelligence)
CREATE TABLE IF NOT EXISTS user_scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  scammer_number VARCHAR(20) NOT NULL,
  scam_type VARCHAR(100) NOT NULL,
  amount_lost DECIMAL(15, 2),
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  verified BOOLEAN DEFAULT false,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default threat patterns
INSERT INTO threat_patterns (type, severity, description, risk_score, message_keywords, amount_min, amount_max) VALUES
('ROMANCE_SCAM', 'CRITICAL', 'Potential romance scam pattern', 85, ARRAY['love', 'emergency', 'hospital', 'urgent', 'help me', 'stranded'], 5000, 1000000),
('INVESTMENT_SCAM', 'HIGH', 'Investment scam pattern detected', 75, ARRAY['invest', 'double', 'profit', 'guaranteed', 'returns', 'forex', 'bitcoin'], 10000, 10000000),
('IMPERSONATION', 'HIGH', 'Possible impersonation scam', 70, ARRAY['bank', 'verify', 'account', 'suspended', 'confirm', 'urgent action'], NULL, NULL),
('LOTTERY_SCAM', 'MEDIUM', 'Lottery/prize scam pattern', 60, ARRAY['won', 'winner', 'prize', 'lottery', 'claim', 'congratulations'], NULL, NULL),
('ADVANCE_FEE', 'HIGH', 'Advance fee fraud pattern', 75, ARRAY['fee', 'processing', 'clearance', 'customs', 'delivery'], 1000, 500000);

-- Create indexes
CREATE INDEX idx_threat_patterns_active ON threat_patterns(active);
CREATE INDEX idx_blacklisted_numbers_phone ON blacklisted_numbers(phone_number);
CREATE INDEX idx_transaction_analyses_user ON transaction_analyses(user_id);
CREATE INDEX idx_transaction_analyses_recipient ON transaction_analyses(recipient);
CREATE INDEX idx_sms_analyses_user ON sms_analyses(user_id);
CREATE INDEX idx_user_reports_scammer ON user_scam_reports(scammer_number);
