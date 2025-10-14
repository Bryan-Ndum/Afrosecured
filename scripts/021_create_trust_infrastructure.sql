-- Trust Scores Table (AfroTrust Graph)
CREATE TABLE IF NOT EXISTS trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('sender', 'recipient', 'merchant')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_id, entity_type)
);

CREATE INDEX idx_trust_scores_entity ON trust_scores(entity_id);
CREATE INDEX idx_trust_scores_risk ON trust_scores(risk_level);
CREATE INDEX idx_trust_scores_score ON trust_scores(score DESC);

-- Entity Verifications
CREATE TABLE IF NOT EXISTS entity_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partners Table (B2B Customers)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'growth', 'enterprise')),
  rate_limit INTEGER NOT NULL DEFAULT 1000,
  webhook_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partners_api_key ON partners(api_key);

-- API Requests Log
CREATE TABLE IF NOT EXISTS api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  endpoint TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_requests_partner ON api_requests(partner_id);
CREATE INDEX idx_api_requests_created ON api_requests(created_at DESC);

-- Verification Results
CREATE TABLE IF NOT EXISTS verification_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  channel TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('allow', 'review', 'block')),
  reason TEXT NOT NULL,
  sender_trust_score INTEGER,
  receiver_trust_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_results_partner ON verification_results(partner_id);
CREATE INDEX idx_verification_results_action ON verification_results(action);
CREATE INDEX idx_verification_results_created ON verification_results(created_at DESC);

-- Partner Stats
CREATE TABLE IF NOT EXISTS partner_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) UNIQUE,
  total_requests INTEGER DEFAULT 0,
  blocked_transactions INTEGER DEFAULT 0,
  fraud_prevented_amount DECIMAL(15,2) DEFAULT 0,
  last_request_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to increment partner usage
CREATE OR REPLACE FUNCTION increment_partner_usage(partner_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO partner_stats (partner_id, total_requests, last_request_at)
  VALUES (partner_id, 1, NOW())
  ON CONFLICT (partner_id)
  DO UPDATE SET
    total_requests = partner_stats.total_requests + 1,
    last_request_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trust_scores_updated_at
  BEFORE UPDATE ON trust_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER partner_stats_updated_at
  BEFORE UPDATE ON partner_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
