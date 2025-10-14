CREATE TABLE IF NOT EXISTS behavioral_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  
  -- Typing Biometrics
  avg_typing_speed DECIMAL,
  typing_rhythm_pattern JSONB,
  key_hold_times JSONB,
  
  -- Mouse Biometrics
  mouse_velocity DECIMAL,
  mouse_acceleration DECIMAL,
  click_pressure_pattern JSONB,
  mouse_movement_pattern JSONB,
  
  -- Scroll Biometrics
  scroll_speed DECIMAL,
  scroll_pattern JSONB,
  
  -- Device Fingerprint
  device_fingerprint TEXT,
  screen_resolution TEXT,
  timezone TEXT,
  language TEXT,
  platform TEXT,
  
  -- Network Analysis
  ip_address INET,
  vpn_detected BOOLEAN DEFAULT false,
  proxy_detected BOOLEAN DEFAULT false,
  tor_detected BOOLEAN DEFAULT false,
  
  -- Behavioral Consistency
  consistency_score DECIMAL,
  anomaly_flags JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  
  -- Risk Scoring
  overall_risk_score DECIMAL NOT NULL, -- 0-100
  risk_level TEXT NOT NULL, -- low, medium, high, critical
  
  -- Risk Factors
  behavioral_risk DECIMAL,
  device_risk DECIMAL,
  network_risk DECIMAL,
  transaction_risk DECIMAL,
  velocity_risk DECIMAL,
  
  -- Risk Indicators
  risk_factors JSONB, -- Array of contributing factors
  anomalies_detected JSONB,
  
  -- Transaction Details
  amount DECIMAL,
  currency TEXT,
  merchant_id TEXT,
  merchant_name TEXT,
  
  -- MFA Status
  mfa_required BOOLEAN DEFAULT false,
  mfa_completed BOOLEAN DEFAULT false,
  mfa_method TEXT,
  
  -- Decision
  decision TEXT, -- approve, review, decline, mfa_required
  confidence_score DECIMAL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_velocity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  device_fingerprint TEXT,
  
  transaction_count INTEGER DEFAULT 1,
  total_amount DECIMAL,
  time_window INTERVAL,
  
  first_transaction_at TIMESTAMPTZ,
  last_transaction_at TIMESTAMPTZ,
  
  velocity_score DECIMAL, -- Transactions per hour
  amount_velocity DECIMAL, -- Amount per hour
  
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_behavioral_profiles_user ON behavioral_profiles(user_id);
CREATE INDEX idx_behavioral_profiles_session ON behavioral_profiles(session_id);
CREATE INDEX idx_transaction_risk_user ON transaction_risk_scores(user_id);
CREATE INDEX idx_transaction_risk_level ON transaction_risk_scores(risk_level);
CREATE INDEX idx_transaction_velocity_user ON transaction_velocity(user_id);
CREATE INDEX idx_transaction_velocity_ip ON transaction_velocity(ip_address);

-- RLS Policies
ALTER TABLE behavioral_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_velocity ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own behavioral profiles"
  ON behavioral_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own risk scores"
  ON transaction_risk_scores FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can see all
CREATE POLICY "Admins can view all behavioral profiles"
  ON behavioral_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all risk scores"
  ON transaction_risk_scores FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
