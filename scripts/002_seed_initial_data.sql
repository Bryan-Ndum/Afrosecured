-- Seed initial scam intelligence data for AfroSecure

-- Insert sample scam feeds
INSERT INTO public.scam_feeds (title, description, source, source_url, scam_type, severity, location, tags, is_trending) VALUES
('Romance Scam Targeting Nigerian Diaspora', 'Fraudsters using fake dating profiles to target Nigerian immigrants in the US and UK', 'BBC', 'https://bbc.com/news/fake-url', 'romance', 'high', 'Nigeria, US, UK', ARRAY['dating', 'diaspora', 'social_media'], true),
('Investment Fraud in South African Crypto Markets', 'Ponzi scheme promising 300% returns on Bitcoin investments', 'FTC', 'https://ftc.gov/fake-url', 'investment', 'critical', 'South Africa', ARRAY['cryptocurrency', 'ponzi', 'investment'], true),
('Tech Support Scam Targeting Elderly Africans', 'Fake Microsoft support calls targeting elderly users in Kenya and Ghana', 'Manual', null, 'tech_support', 'medium', 'Kenya, Ghana', ARRAY['tech_support', 'elderly', 'phone'], false),
('WhatsApp Business Verification Scam', 'Scammers impersonating WhatsApp to steal business account credentials', 'Reddit', 'https://reddit.com/r/scams/fake-url', 'phishing', 'high', 'Global', ARRAY['whatsapp', 'business', 'phishing'], true),
('Fake Job Offers from Dubai Companies', 'Fraudulent job postings targeting job seekers from East Africa', 'Manual', null, 'employment', 'medium', 'UAE, Kenya, Uganda', ARRAY['employment', 'dubai', 'migration'], false);

-- Insert scam hotspots for the map
INSERT INTO public.scam_hotspots (country, country_code, latitude, longitude, scam_count, primary_scam_type) VALUES
('Nigeria', 'NG', 9.0820, 8.6753, 1247, 'romance'),
('South Africa', 'ZA', -30.5595, 22.9375, 892, 'investment'),
('Kenya', 'KE', -0.0236, 37.9062, 634, 'tech_support'),
('Ghana', 'GH', 7.9465, -1.0232, 445, 'phishing'),
('Uganda', 'UG', 1.3733, 32.2903, 298, 'employment'),
('Morocco', 'MA', 31.7917, -7.0926, 267, 'romance'),
('Egypt', 'EG', 26.8206, 30.8025, 234, 'investment'),
('Ethiopia', 'ET', 9.1450, 40.4897, 189, 'tech_support'),
('Tanzania', 'TZ', -6.3690, 34.8888, 156, 'phishing'),
('Cameroon', 'CM', 7.3697, 12.3547, 134, 'romance');

-- Insert sample social media mentions
INSERT INTO public.social_mentions (platform, post_id, author, content, url, engagement_count, scam_keywords) VALUES
('twitter', 'tweet_123', '@scamwatch_ng', 'Warning: New romance scam targeting Nigerians on dating apps. They claim to be US soldiers deployed overseas. #ScamAlert #Nigeria', 'https://twitter.com/fake-url', 45, ARRAY['romance', 'dating', 'soldier']),
('reddit', 'post_456', 'u/SafetyFirst_ZA', 'Lost R50,000 to a crypto investment scam. They promised 300% returns in 30 days. Please learn from my mistake.', 'https://reddit.com/r/southafrica/fake-url', 128, ARRAY['crypto', 'investment', 'ponzi']),
('twitter', 'tweet_789', '@CyberSecKE', 'Elderly parents receiving fake Microsoft calls again. Please educate your family about tech support scams. #CyberSecurity #Kenya', 'https://twitter.com/fake-url', 67, ARRAY['tech_support', 'microsoft', 'elderly']);

-- Insert sample digest subscribers (for testing)
INSERT INTO public.digest_subscribers (email, preferences) VALUES
('test@example.com', '{"frequency": "weekly", "categories": ["romance", "investment"]}'),
('demo@afrosecure.com', '{"frequency": "weekly", "categories": ["all"]}');
