-- Risk Assessments Table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id TEXT NOT NULL,
  merchant_name TEXT,
  amount DECIMAL(10, 2),
  currency TEXT,
  ip_address TEXT,
  device_fingerprint TEXT,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  decision TEXT NOT NULL CHECK (decision IN ('approve', 'review', 'decline', 'mfa_required')),
  risk_factors TEXT[],
  behavioral_risk DECIMAL(5, 2),
  device_risk DECIMAL(5, 2),
  network_risk DECIMAL(5, 2),
  transaction_risk DECIMAL(5, 2),
  velocity_risk DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_risk_assessments_merchant ON risk_assessments(merchant_id);
CREATE INDEX idx_risk_assessments_created ON risk_assessments(created_at DESC);
CREATE INDEX idx_risk_assessments_risk_level ON risk_assessments(risk_level);

-- Enable RLS
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin can view all risk assessments"
  ON risk_assessments FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
