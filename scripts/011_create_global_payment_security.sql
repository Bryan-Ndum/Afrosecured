CREATE TABLE IF NOT EXISTS virtual_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_token TEXT NOT NULL UNIQUE,
  card_last_four TEXT NOT NULL,
  card_brand TEXT DEFAULT 'visa',
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  card_type TEXT DEFAULT 'virtual', -- 'virtual', 'physical'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'expired'
  usage_limit INTEGER DEFAULT 1, -- how many times can be used
  usage_count INTEGER DEFAULT 0,
  amount_limit DECIMAL(10,2), -- max amount per transaction
  merchant_restriction TEXT, -- specific merchant only
  country_restriction TEXT[], -- allowed countries
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  virtual_card_id UUID REFERENCES virtual_cards(id),
  merchant_name TEXT NOT NULL,
  merchant_id TEXT,
  merchant_country TEXT,
  merchant_category TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  original_amount DECIMAL(10,2),
  original_currency TEXT,
  exchange_rate DECIMAL(10,6),
  fees DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'blocked'
  risk_score INTEGER, -- 0-100
  risk_factors JSONB,
  fraud_detected BOOLEAN DEFAULT false,
  blocked_reason TEXT,
  transaction_id TEXT UNIQUE,
  visa_transaction_id TEXT,
  payment_method TEXT DEFAULT 'visa',
  ip_address TEXT,
  device_info JSONB,
  location JSONB, -- {country, city, lat, lng}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS merchant_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id TEXT UNIQUE NOT NULL,
  merchant_name TEXT NOT NULL,
  merchant_url TEXT,
  merchant_country TEXT,
  merchant_category TEXT,
  visa_verified BOOLEAN DEFAULT false,
  trust_score INTEGER, -- 0-100
  total_transactions INTEGER DEFAULT 0,
  fraud_reports INTEGER DEFAULT 0,
  successful_transactions INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  risk_level TEXT, -- 'low', 'medium', 'high', 'critical'
  verification_date TIMESTAMPTZ,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  visa_rate DECIMAL(10,6),
  market_rate DECIMAL(10,6),
  markup_percentage DECIMAL(5,2),
  source TEXT DEFAULT 'visa',
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, created_at)
);

CREATE TABLE IF NOT EXISTS payment_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_country TEXT NOT NULL,
  to_country TEXT NOT NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  route_type TEXT NOT NULL, -- 'direct', 'correspondent', 'swift', 'visa_direct'
  estimated_time TEXT, -- '30 seconds', '1-2 days'
  base_fee DECIMAL(10,2),
  percentage_fee DECIMAL(5,2),
  total_cost DECIMAL(10,2),
  exchange_rate DECIMAL(10,6),
  recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_virtual_cards_user ON virtual_cards(user_id);
CREATE INDEX idx_virtual_cards_status ON virtual_cards(status);
CREATE INDEX idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_merchant ON payment_transactions(merchant_id);
CREATE INDEX idx_merchant_verification_id ON merchant_verification(merchant_id);
CREATE INDEX idx_merchant_verification_trust ON merchant_verification(trust_score);
CREATE INDEX idx_currency_rates_pair ON currency_rates(from_currency, to_currency);

-- Enable Row Level Security
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_verification ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own virtual cards"
  ON virtual_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own virtual cards"
  ON virtual_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view merchant verification"
  ON merchant_verification FOR SELECT
  TO authenticated
  USING (true);
