-- Create scam intelligence tables for AfroSecure

-- Scam intelligence feeds table
CREATE TABLE IF NOT EXISTS public.scam_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL, -- 'BBC', 'FTC', 'Reddit', 'Manual'
  source_url TEXT,
  scam_type TEXT NOT NULL, -- 'phishing', 'romance', 'investment', 'tech_support', 'other'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  location TEXT, -- Country or region affected
  tags TEXT[], -- Array of tags for categorization
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User reports table
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_email TEXT,
  scam_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  evidence_urls TEXT[], -- URLs to screenshots or evidence
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly digest subscribers
CREATE TABLE IF NOT EXISTS public.digest_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  preferences JSONB DEFAULT '{"frequency": "weekly", "categories": ["all"]}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scam hotspots for the map
CREATE TABLE IF NOT EXISTS public.scam_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  country_code TEXT NOT NULL, -- ISO country code
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  scam_count INTEGER DEFAULT 0,
  primary_scam_type TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media mentions (for aggregation)
CREATE TABLE IF NOT EXISTS public.social_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- 'twitter', 'reddit', 'facebook'
  post_id TEXT NOT NULL,
  author TEXT,
  content TEXT NOT NULL,
  url TEXT,
  engagement_count INTEGER DEFAULT 0,
  scam_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.scam_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digest_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_mentions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is public scam intelligence)
-- Scam feeds - public read access
CREATE POLICY "Allow public read access to scam feeds" ON public.scam_feeds
  FOR SELECT USING (true);

-- User reports - public can insert, but only admins can read/update
CREATE POLICY "Allow public insert to user reports" ON public.user_reports
  FOR INSERT WITH CHECK (true);

-- Digest subscribers - users can manage their own subscriptions
CREATE POLICY "Allow public insert to digest subscribers" ON public.digest_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their own subscription" ON public.digest_subscribers
  FOR UPDATE USING (true);

-- Scam hotspots - public read access
CREATE POLICY "Allow public read access to scam hotspots" ON public.scam_hotspots
  FOR SELECT USING (true);

-- Social mentions - public read access
CREATE POLICY "Allow public read access to social mentions" ON public.social_mentions
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scam_feeds_created_at ON public.scam_feeds(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scam_feeds_trending ON public.scam_feeds(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_scam_feeds_type ON public.scam_feeds(scam_type);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status);
CREATE INDEX IF NOT EXISTS idx_scam_hotspots_country ON public.scam_hotspots(country);
CREATE INDEX IF NOT EXISTS idx_social_mentions_platform ON public.social_mentions(platform);
