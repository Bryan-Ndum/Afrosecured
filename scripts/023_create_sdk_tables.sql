-- SDK configuration and tracking tables

-- SDK settings for different versions
CREATE TABLE IF NOT EXISTS sdk_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  sync_interval INTEGER DEFAULT 3600,
  offline_mode BOOLEAN DEFAULT true,
  sms_monitoring BOOLEAN DEFAULT true,
  ussd_monitoring BOOLEAN DEFAULT false,
  alert_threshold DECIMAL(3,2) DEFAULT 0.7,
  auto_block BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SDK request tracking
CREATE TABLE IF NOT EXISTS sdk_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  version TEXT NOT NULL,
  config_version TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device registrations
CREATE TABLE IF NOT EXISTS registered_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  device_type TEXT, -- android, ios
  os_version TEXT,
  app_version TEXT,
  last_sync TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Background job queue
CREATE TABLE IF NOT EXISTS job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL, -- train_model, aggregate_threats, cleanup_data, send_alerts
  payload JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  priority INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error TEXT,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification queue
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type TEXT NOT NULL, -- user, partner, admin
  recipient_id TEXT NOT NULL,
  channel TEXT NOT NULL, -- sms, email, push, webhook
  template TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  attempts INTEGER DEFAULT 0,
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System health metrics
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL, -- api_latency, db_connections, cache_hit_rate, error_rate
  value DECIMAL(10,2) NOT NULL,
  unit TEXT, -- ms, count, percentage
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sdk_requests_device ON sdk_requests(device_id);
CREATE INDEX IF NOT EXISTS idx_sdk_requests_created ON sdk_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registered_devices_user ON registered_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON job_queue(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_job_queue_scheduled ON job_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON health_metrics(metric_type, created_at DESC);

-- Insert default SDK settings
INSERT INTO sdk_settings (version, sync_interval, offline_mode, sms_monitoring, alert_threshold)
VALUES ('1.0.0', 3600, true, true, 0.7)
ON CONFLICT (version) DO NOTHING;
