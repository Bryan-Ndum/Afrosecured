-- Enhance cybersecurity_articles table with AI-extracted intelligence
ALTER TABLE cybersecurity_articles
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS threat_indicators JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS threat_level TEXT CHECK (threat_level IN ('critical', 'high', 'medium', 'low', 'info')),
ADD COLUMN IF NOT EXISTS affected_platforms TEXT[],
ADD COLUMN IF NOT EXISTS cve_ids TEXT[],
ADD COLUMN IF NOT EXISTS iocs JSONB DEFAULT '{}'::jsonb, -- Indicators of Compromise
ADD COLUMN IF NOT EXISTS recommendations TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS ai_processed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_articles_threat_level ON cybersecurity_articles(threat_level);
CREATE INDEX IF NOT EXISTS idx_articles_ai_processed ON cybersecurity_articles(ai_processed);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON cybersecurity_articles USING GIN(tags);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_articles_search ON cybersecurity_articles 
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(ai_summary, '')));

COMMENT ON COLUMN cybersecurity_articles.ai_summary IS 'AI-generated concise summary of the article';
COMMENT ON COLUMN cybersecurity_articles.threat_indicators IS 'Extracted threat indicators and patterns';
COMMENT ON COLUMN cybersecurity_articles.threat_level IS 'AI-assessed threat severity level';
COMMENT ON COLUMN cybersecurity_articles.affected_platforms IS 'Platforms/systems affected by the threat';
COMMENT ON COLUMN cybersecurity_articles.cve_ids IS 'CVE identifiers mentioned in the article';
COMMENT ON COLUMN cybersecurity_articles.iocs IS 'Indicators of Compromise (IPs, domains, hashes, etc.)';
COMMENT ON COLUMN cybersecurity_articles.recommendations IS 'AI-extracted security recommendations';
COMMENT ON COLUMN cybersecurity_articles.tags IS 'Auto-generated tags for categorization';
