-- Create table for storing cybersecurity articles from RSS feeds
CREATE TABLE IF NOT EXISTS cybersecurity_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  pub_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_pub_date ON cybersecurity_articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON cybersecurity_articles(source);

-- Enable Row Level Security
ALTER TABLE cybersecurity_articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON cybersecurity_articles
  FOR SELECT USING (true);

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role full access" ON cybersecurity_articles
  FOR ALL USING (auth.role() = 'service_role');
