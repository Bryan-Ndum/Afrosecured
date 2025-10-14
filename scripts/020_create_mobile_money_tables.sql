-- Mobile Money Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('mpesa', 'mtn', 'airtel')),
  transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  fraud_score INTEGER,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_sender ON transactions(sender);
CREATE INDEX idx_transactions_recipient ON transactions(recipient);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX idx_transactions_provider ON transactions(provider);

-- Blocked Transactions
CREATE TABLE IF NOT EXISTS blocked_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  reason TEXT NOT NULL,
  blocked_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

-- Fraud Alerts
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  transaction_id TEXT,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('blocked', 'suspicious', 'warning')),
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_fraud_alerts_phone ON fraud_alerts(phone_number);

-- Monitoring Events
CREATE TABLE IF NOT EXISTS monitoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  fraud_score INTEGER NOT NULL,
  triggered_rules TEXT[],
  action TEXT NOT NULL CHECK (action IN ('allowed', 'blocked', 'reviewed')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_monitoring_events_transaction ON monitoring_events(transaction_id);
CREATE INDEX idx_monitoring_events_timestamp ON monitoring_events(timestamp);

-- Community Stats
CREATE TABLE IF NOT EXISTS community_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_name TEXT NOT NULL UNIQUE,
  stat_value BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize community stats
INSERT INTO community_stats (stat_name, stat_value) VALUES
  ('reports_phishing', 0),
  ('reports_romance', 0),
  ('reports_investment', 0),
  ('reports_impersonation', 0),
  ('reports_other', 0),
  ('total_amount_reported', 0),
  ('total_reports', 0),
  ('verified_reports', 0)
ON CONFLICT (stat_name) DO NOTHING;

-- Function to increment stats
CREATE OR REPLACE FUNCTION increment_community_stat(
  stat_name TEXT,
  increment_by BIGINT DEFAULT 1
) RETURNS VOID AS $$
BEGIN
  UPDATE community_stats
  SET stat_value = stat_value + increment_by,
      updated_at = NOW()
  WHERE community_stats.stat_name = increment_community_stat.stat_name;
END;
$$ LANGUAGE plpgsql;

-- Monitoring Rules
CREATE TABLE IF NOT EXISTS monitoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  condition JSONB NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('alert', 'block', 'review')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default monitoring rules
INSERT INTO monitoring_rules (name, description, condition, action, priority) VALUES
  ('Large Amount', 'Transactions over 100,000', '{"amount": {"gt": 100000}}', 'review', 'high'),
  ('Rapid Transactions', 'More than 5 transactions in 10 minutes', '{"velocity": {"gt": 5}}', 'block', 'critical'),
  ('Blacklisted Recipient', 'Recipient is on blacklist', '{"recipientBlacklisted": true}', 'block', 'critical'),
  ('Unusual Time', 'Transactions between midnight and 5 AM', '{"hour": {"between": [0, 5]}}', 'alert', 'medium'),
  ('New Recipient High Amount', 'First time recipient with amount over 10,000', '{"isNewRecipient": true, "amount": {"gt": 10000}}', 'review', 'medium')
ON CONFLICT DO NOTHING;
