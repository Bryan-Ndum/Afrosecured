-- Audit logs for compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  action VARCHAR(100) NOT NULL,
  user_id VARCHAR(255),
  data_hash VARCHAR(64),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_partner ON audit_logs(partner_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Data retention tracking
CREATE TABLE IF NOT EXISTS data_retention (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL,
  retention_days INTEGER DEFAULT 90,
  scheduled_deletion TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_data_retention_scheduled ON data_retention(scheduled_deletion);

-- Encrypted sensitive data
CREATE TABLE IF NOT EXISTS encrypted_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type VARCHAR(50) NOT NULL,
  encrypted_value TEXT NOT NULL,
  iv VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  accessed_at TIMESTAMP
);

-- Partner API quotas
CREATE TABLE IF NOT EXISTS partner_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) UNIQUE,
  monthly_quota INTEGER NOT NULL,
  used_this_month INTEGER DEFAULT 0,
  reset_date DATE NOT NULL,
  overage_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Function to increment partner requests
CREATE OR REPLACE FUNCTION increment_partner_requests(
  partner_id UUID,
  count INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE partner_quotas
  SET used_this_month = used_this_month + count,
      updated_at = NOW()
  WHERE partner_quotas.partner_id = increment_partner_requests.partner_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly quotas
CREATE OR REPLACE FUNCTION reset_monthly_quotas()
RETURNS void AS $$
BEGIN
  UPDATE partner_quotas
  SET used_this_month = 0,
      reset_date = DATE_TRUNC('month', NOW() + INTERVAL '1 month'),
      updated_at = NOW()
  WHERE reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Compliance reports
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_requests INTEGER,
  total_blocks INTEGER,
  total_alerts INTEGER,
  data_processed_gb DECIMAL(10,2),
  generated_at TIMESTAMP DEFAULT NOW(),
  report_data JSONB
);

CREATE INDEX idx_compliance_reports_period ON compliance_reports(period_start, period_end);
