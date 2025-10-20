-- Add missing columns to cybersecurity_articles table for better categorization

-- Add threat_level column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='cybersecurity_articles' AND column_name='threat_level') THEN
    ALTER TABLE cybersecurity_articles ADD COLUMN threat_level TEXT DEFAULT 'medium';
  END IF;
END $$;

-- Add tags column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='cybersecurity_articles' AND column_name='tags') THEN
    ALTER TABLE cybersecurity_articles ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- Add ai_processed column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='cybersecurity_articles' AND column_name='ai_processed') THEN
    ALTER TABLE cybersecurity_articles ADD COLUMN ai_processed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_articles_threat_level ON cybersecurity_articles(threat_level);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON cybersecurity_articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_title_search ON cybersecurity_articles USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_articles_description_search ON cybersecurity_articles USING gin(to_tsvector('english', description));

-- Update RLS policy to allow public insert for admin interface
CREATE POLICY "Allow authenticated insert" ON cybersecurity_articles
  FOR INSERT WITH CHECK (true);
