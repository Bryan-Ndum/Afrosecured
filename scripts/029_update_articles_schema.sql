-- Add PhishTank-specific fields to cybersecurity_articles table
ALTER TABLE cybersecurity_articles
ADD COLUMN IF NOT EXISTS phish_id TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS online_status BOOLEAN DEFAULT true;

-- Create index for faster PhishTank lookups
CREATE INDEX IF NOT EXISTS idx_articles_phish_id ON cybersecurity_articles(phish_id);
CREATE INDEX IF NOT EXISTS idx_articles_source ON cybersecurity_articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_indicators ON cybersecurity_articles USING GIN(indicators);

-- Add comment
COMMENT ON COLUMN cybersecurity_articles.phish_id IS 'PhishTank unique identifier for phishing URLs';
COMMENT ON COLUMN cybersecurity_articles.verified IS 'Whether the threat has been verified by the source';
COMMENT ON COLUMN cybersecurity_articles.online_status IS 'Whether the malicious site is currently online';
