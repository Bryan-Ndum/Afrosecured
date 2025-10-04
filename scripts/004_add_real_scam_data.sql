-- Add real scam intelligence data with actual sources

-- Insert real scam feeds with verified sources
INSERT INTO public.scam_feeds (title, description, source, source_url, scam_type, severity, location, tags, is_trending) VALUES
('Organized Criminals Target International Students', 'Crime rings using fake study permits and acceptance letters to defraud international students in Canada', 'University Affairs', 'https://universityaffairs.ca/features/organized-criminals-target-international-students/', 'education', 'critical', 'Canada, Global', ARRAY['education', 'study_permits', 'fraud'], true),
('Romance Scams Targeting African Communities', 'Fraudsters using dating apps and social media to target victims with fake romantic relationships', 'Operation Shamrock', 'https://operationshamrock.org/library/tag/Romance+Scam', 'romance', 'high', 'Global', ARRAY['dating', 'social_media', 'romance'], true),
('How to Identify Scam Scholarship Opportunities', 'Comprehensive guide on spotting fake scholarships and avoiding education fraud', 'After School Africa', 'https://www.afterschoolafrica.com/43867/how-to-identify-scam-scholarship-opportunities-and-avoid-them/', 'education', 'high', 'Africa, Global', ARRAY['scholarship', 'education', 'fraud_prevention'], true),
('Tech Support Scam Targeting Elderly Africans', 'Fake Microsoft support calls targeting elderly users in Kenya and Ghana', 'Manual', null, 'tech_support', 'medium', 'Kenya, Ghana', ARRAY['tech_support', 'elderly', 'phone'], false),
('Fake Job Offers from Dubai Companies', 'Fraudulent job postings targeting job seekers from East Africa', 'Manual', null, 'employment', 'medium', 'UAE, Kenya, Uganda', ARRAY['employment', 'dubai', 'migration'], false);

-- Keep the scam hotspots data as it's geographic information, not dummy links
-- Keep the digest subscribers that are not test accounts
