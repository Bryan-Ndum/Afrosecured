-- Add general threat verification fields to cybersecurity_articles table
-- Removed PhishTank-specific references, keeping general verification fields
ALTER TABLE cybersecurity_articles
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS online_status BOOLEAN DEFAULT true;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_articles_source ON cybersecurity_articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_indicators ON cybersecurity_articles USING GIN(indicators);
CREATE INDEX IF NOT EXISTS idx_articles_verified ON cybersecurity_articles(verified);

-- Add comments
COMMENT ON COLUMN cybersecurity_articles.verified IS 'Whether the threat has been verified by the source';
COMMENT ON COLUMN cybersecurity_articles.online_status IS 'Whether the malicious site is currently online';
