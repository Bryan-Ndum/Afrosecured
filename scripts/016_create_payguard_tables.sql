-- PayGuard Tables for Real-Time Payment Protection

-- Transactions table
CREATE TABLE IF NOT EXISTS payguard_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  recipient TEXT NOT NULL,
  url TEXT,
  method VARCHAR(50),
  risk_score INTEGER NOT NULL,
  risk_factors JSONB,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'blocked', 'flagged', 'frozen', 'reversed')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  frozen_at TIMESTAMPTZ,
  reversed_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  behavioral_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Freeze requests table
CREATE TABLE IF NOT EXISTS payguard_freeze_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES payguard_transactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  reason TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchant reputation table
CREATE TABLE IF NOT EXISTS payguard_merchant_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_identifier TEXT NOT NULL UNIQUE,
  trust_score INTEGER NOT NULL DEFAULT 50,
  total_transactions INTEGER DEFAULT 0,
  successful_transactions INTEGER DEFAULT 0,
  blocked_transactions INTEGER DEFAULT 0,
  fraud_reports INTEGER DEFAULT 0,
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User protection stats table
CREATE TABLE IF NOT EXISTS payguard_user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  total_protected INTEGER DEFAULT 0,
  scams_blocked INTEGER DEFAULT 0,
  money_saved DECIMAL(12, 2) DEFAULT 0,
  last_protection_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payguard_transactions_user_id ON payguard_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payguard_transactions_status ON payguard_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payguard_transactions_timestamp ON payguard_transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_payguard_transactions_risk_score ON payguard_transactions(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_payguard_freeze_requests_transaction_id ON payguard_freeze_requests(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payguard_merchant_reputation_identifier ON payguard_merchant_reputation(merchant_identifier);

-- Row Level Security
ALTER TABLE payguard_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payguard_freeze_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payguard_user_stats ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON payguard_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON payguard_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for freeze requests
CREATE POLICY "Users can view their own freeze requests"
  ON payguard_freeze_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create freeze requests"
  ON payguard_freeze_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user stats
CREATE POLICY "Users can view their own stats"
  ON payguard_user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update merchant reputation
CREATE OR REPLACE FUNCTION update_merchant_reputation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO payguard_merchant_reputation (merchant_identifier, total_transactions, successful_transactions, blocked_transactions)
  VALUES (
    NEW.recipient,
    1,
    CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'blocked' THEN 1 ELSE 0 END
  )
  ON CONFLICT (merchant_identifier) DO UPDATE SET
    total_transactions = payguard_merchant_reputation.total_transactions + 1,
    successful_transactions = payguard_merchant_reputation.successful_transactions + 
      CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
    blocked_transactions = payguard_merchant_reputation.blocked_transactions + 
      CASE WHEN NEW.status = 'blocked' THEN 1 ELSE 0 END,
    trust_score = GREATEST(0, LEAST(100, 
      50 + (payguard_merchant_reputation.successful_transactions * 2) - (payguard_merchant_reputation.blocked_transactions * 5)
    )),
    last_transaction_at = NEW.timestamp,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update merchant reputation
CREATE TRIGGER update_merchant_reputation_trigger
AFTER INSERT ON payguard_transactions
FOR EACH ROW
EXECUTE FUNCTION update_merchant_reputation();

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO payguard_user_stats (user_id, total_protected, scams_blocked, money_saved)
  VALUES (
    NEW.user_id,
    1,
    CASE WHEN NEW.status = 'blocked' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'blocked' THEN NEW.amount ELSE 0 END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_protected = payguard_user_stats.total_protected + 1,
    scams_blocked = payguard_user_stats.scams_blocked + 
      CASE WHEN NEW.status = 'blocked' THEN 1 ELSE 0 END,
    money_saved = payguard_user_stats.money_saved + 
      CASE WHEN NEW.status = 'blocked' THEN NEW.amount ELSE 0 END,
    last_protection_at = NEW.timestamp,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user stats
CREATE TRIGGER update_user_stats_trigger
AFTER INSERT ON payguard_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();
