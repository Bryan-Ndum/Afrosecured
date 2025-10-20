-- Add evidence_urls column to user_reports table
ALTER TABLE user_reports
ADD COLUMN IF NOT EXISTS evidence_urls TEXT[] DEFAULT '{}';

-- Add comment
COMMENT ON COLUMN user_reports.evidence_urls IS 'Array of image URLs uploaded as evidence for the scam report';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_reports_evidence ON user_reports USING GIN (evidence_urls);
