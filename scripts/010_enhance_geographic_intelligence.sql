CREATE TABLE IF NOT EXISTS geographic_threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  city TEXT,
  region TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  threat_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  source TEXT NOT NULL,
  indicator_value TEXT,
  description TEXT,
  first_detected TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  occurrence_count INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for fast geographic queries
CREATE INDEX IF NOT EXISTS idx_geographic_threats_coords ON geographic_threats(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_geographic_threats_country ON geographic_threats(country_code);
CREATE INDEX IF NOT EXISTS idx_geographic_threats_severity ON geographic_threats(severity);
CREATE INDEX IF NOT EXISTS idx_geographic_threats_updated ON geographic_threats(last_updated DESC);

-- Update scam_hotspots with more detailed tracking
ALTER TABLE scam_hotspots ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE scam_hotspots ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE scam_hotspots ADD COLUMN IF NOT EXISTS severity_breakdown JSONB DEFAULT '{"low": 0, "medium": 0, "high": 0, "critical": 0}'::jsonb;
ALTER TABLE scam_hotspots ADD COLUMN IF NOT EXISTS threat_types JSONB DEFAULT '{}'::jsonb;

-- Create materialized view for fast heatmap queries
CREATE MATERIALIZED VIEW IF NOT EXISTS threat_heatmap_data AS
SELECT 
  country,
  country_code,
  city,
  latitude,
  longitude,
  COUNT(*) as total_threats,
  COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count,
  COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_count,
  COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_count,
  COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_count,
  jsonb_object_agg(threat_type, threat_count) as threat_breakdown,
  MAX(last_updated) as last_threat_time
FROM (
  SELECT 
    country,
    country_code,
    city,
    latitude,
    longitude,
    severity,
    threat_type,
    COUNT(*) as threat_count,
    last_updated
  FROM geographic_threats
  WHERE last_updated > NOW() - INTERVAL '30 days'
  GROUP BY country, country_code, city, latitude, longitude, severity, threat_type, last_updated
) subquery
GROUP BY country, country_code, city, latitude, longitude;

CREATE UNIQUE INDEX IF NOT EXISTS idx_threat_heatmap_location ON threat_heatmap_data(country_code, latitude, longitude);

-- Function to refresh heatmap data
CREATE OR REPLACE FUNCTION refresh_threat_heatmap()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY threat_heatmap_data;
END;
$$ LANGUAGE plpgsql;

-- Enable real-time for geographic_threats table
ALTER PUBLICATION supabase_realtime ADD TABLE geographic_threats;
