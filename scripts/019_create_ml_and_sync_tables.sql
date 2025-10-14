-- ML Models table
CREATE TABLE IF NOT EXISTS ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_type TEXT NOT NULL,
  weights JSONB NOT NULL,
  version BIGINT NOT NULL,
  trained_at TIMESTAMPTZ NOT NULL,
  accuracy DECIMAL(5,4),
  precision DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ml_models_type_trained ON ml_models(model_type, trained_at DESC);

-- Device syncs table
CREATE TABLE IF NOT EXISTS device_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  sync_version BIGINT NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_device_syncs_device_time ON device_syncs(device_id, synced_at DESC);

-- Partners table for webhook integrations
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  webhook_url TEXT,
  webhook_secret TEXT,
  api_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partners_api_key ON partners(api_key);

-- Webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  event TEXT NOT NULL,
  status_code INTEGER,
  success BOOLEAN,
  sent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_partner_time ON webhook_logs(partner_id, sent_at DESC);

-- Scam keywords table
CREATE TABLE IF NOT EXISTS scam_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  category TEXT NOT NULL,
  weight DECIMAL(3,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scam_keywords_active ON scam_keywords(is_active, weight DESC);
