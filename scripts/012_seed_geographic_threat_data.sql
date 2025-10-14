-- Seed geographic threat data for testing the heatmap
-- This adds realistic threat data for major cities across Africa, Europe, and USA

-- Clear existing data
TRUNCATE TABLE geographic_threats;

-- Africa - Nigeria
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Nigeria', 'NG', 'Lagos', 6.5244, 3.3792, 'phishing', 'high', 45, 'Banking phishing campaign targeting Nigerian banks', 'URLhaus', 'West Africa'),
('Nigeria', 'NG', 'Abuja', 9.0765, 7.3986, 'romance_scam', 'critical', 32, 'Romance scam operations detected', 'Community Report', 'West Africa'),
('Nigeria', 'NG', 'Port Harcourt', 4.8156, 7.0498, 'investment_fraud', 'high', 28, 'Cryptocurrency investment scams', 'AlienVault OTX', 'West Africa'),
('Nigeria', 'NG', 'Ibadan', 7.3775, 3.9470, 'phishing', 'medium', 19, 'Email phishing attempts', 'URLhaus', 'West Africa');

-- Africa - Kenya
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Kenya', 'KE', 'Nairobi', -1.2864, 36.8172, 'mobile_money_fraud', 'critical', 67, 'M-Pesa fraud and SIM swap attacks', 'Community Report', 'East Africa'),
('Kenya', 'KE', 'Mombasa', -4.0435, 39.6682, 'phishing', 'high', 41, 'Banking credential theft', 'URLhaus', 'East Africa'),
('Kenya', 'KE', 'Kisumu', -0.0917, 34.7680, 'job_scam', 'medium', 23, 'Fake job offers targeting graduates', 'Community Report', 'East Africa');

-- Africa - South Africa
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('South Africa', 'ZA', 'Johannesburg', -26.2041, 28.0473, 'identity_theft', 'critical', 89, 'Large-scale identity theft operations', 'AlienVault OTX', 'Southern Africa'),
('South Africa', 'ZA', 'Cape Town', -33.9249, 18.4241, 'phishing', 'high', 56, 'Corporate email compromise', 'URLhaus', 'Southern Africa'),
('South Africa', 'ZA', 'Durban', -29.8587, 31.0218, 'investment_fraud', 'high', 34, 'Ponzi schemes and investment fraud', 'Community Report', 'Southern Africa');

-- Africa - Ghana
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Ghana', 'GH', 'Accra', 5.6037, -0.1870, 'romance_scam', 'high', 52, 'Romance scam operations', 'Community Report', 'West Africa'),
('Ghana', 'GH', 'Kumasi', 6.6885, -1.6244, 'phishing', 'medium', 27, 'Banking phishing attempts', 'URLhaus', 'West Africa');

-- Africa - Egypt
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Egypt', 'EG', 'Cairo', 30.0444, 31.2357, 'malware', 'critical', 78, 'Banking trojan distribution', 'AlienVault OTX', 'North Africa'),
('Egypt', 'EG', 'Alexandria', 31.2001, 29.9187, 'phishing', 'high', 43, 'Credential harvesting campaigns', 'URLhaus', 'North Africa');

-- USA
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('United States', 'US', 'New York', 40.7128, -74.0060, 'ransomware', 'critical', 124, 'Ransomware attacks on businesses', 'AlienVault OTX', 'North America'),
('United States', 'US', 'Los Angeles', 34.0522, -118.2437, 'phishing', 'high', 98, 'Corporate phishing campaigns', 'URLhaus', 'North America'),
('United States', 'US', 'Chicago', 41.8781, -87.6298, 'identity_theft', 'high', 76, 'Identity theft operations', 'Community Report', 'North America'),
('United States', 'US', 'Houston', 29.7604, -95.3698, 'investment_fraud', 'medium', 54, 'Cryptocurrency scams', 'Community Report', 'North America'),
('United States', 'US', 'Miami', 25.7617, -80.1918, 'romance_scam', 'high', 67, 'Romance and dating scams', 'Community Report', 'North America');

-- Europe - United Kingdom
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('United Kingdom', 'GB', 'London', 51.5074, -0.1278, 'phishing', 'critical', 156, 'Banking and financial phishing', 'URLhaus', 'Western Europe'),
('United Kingdom', 'GB', 'Manchester', 53.4808, -2.2426, 'malware', 'high', 87, 'Malware distribution campaigns', 'AlienVault OTX', 'Western Europe'),
('United Kingdom', 'GB', 'Birmingham', 52.4862, -1.8904, 'job_scam', 'medium', 45, 'Fake job postings', 'Community Report', 'Western Europe');

-- Europe - Germany
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Germany', 'DE', 'Berlin', 52.5200, 13.4050, 'ransomware', 'critical', 112, 'Ransomware targeting businesses', 'AlienVault OTX', 'Central Europe'),
('Germany', 'DE', 'Munich', 48.1351, 11.5820, 'phishing', 'high', 79, 'Corporate credential theft', 'URLhaus', 'Central Europe'),
('Germany', 'DE', 'Frankfurt', 50.1109, 8.6821, 'malware', 'high', 68, 'Banking trojan distribution', 'AlienVault OTX', 'Central Europe');

-- Europe - France
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('France', 'FR', 'Paris', 48.8566, 2.3522, 'phishing', 'critical', 134, 'Large-scale phishing operations', 'URLhaus', 'Western Europe'),
('France', 'FR', 'Marseille', 43.2965, 5.3698, 'identity_theft', 'high', 72, 'Identity theft and fraud', 'Community Report', 'Western Europe'),
('France', 'FR', 'Lyon', 45.7640, 4.8357, 'investment_fraud', 'medium', 51, 'Investment scams', 'Community Report', 'Western Europe');

-- Europe - Spain
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Spain', 'ES', 'Madrid', 40.4168, -3.7038, 'phishing', 'high', 91, 'Banking phishing campaigns', 'URLhaus', 'Southern Europe'),
('Spain', 'ES', 'Barcelona', 41.3851, 2.1734, 'romance_scam', 'medium', 58, 'Romance scams targeting tourists', 'Community Report', 'Southern Europe');

-- Europe - Italy
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('Italy', 'IT', 'Rome', 41.9028, 12.4964, 'phishing', 'high', 83, 'Email phishing campaigns', 'URLhaus', 'Southern Europe'),
('Italy', 'IT', 'Milan', 45.4642, 9.1900, 'malware', 'high', 69, 'Malware distribution', 'AlienVault OTX', 'Southern Europe');

-- Asia - India (for global coverage)
INSERT INTO geographic_threats (country, country_code, city, latitude, longitude, threat_type, severity, occurrence_count, description, source, region) VALUES
('India', 'IN', 'Mumbai', 19.0760, 72.8777, 'phishing', 'critical', 187, 'Massive phishing operations', 'URLhaus', 'South Asia'),
('India', 'IN', 'Delhi', 28.7041, 77.1025, 'tech_support_scam', 'high', 143, 'Tech support scam call centers', 'Community Report', 'South Asia'),
('India', 'IN', 'Bangalore', 12.9716, 77.5946, 'job_scam', 'medium', 76, 'Fake job offers', 'Community Report', 'South Asia');

-- Update timestamps
UPDATE geographic_threats SET 
  created_at = NOW() - (random() * interval '24 hours'),
  last_updated = NOW() - (random() * interval '6 hours'),
  first_detected = NOW() - (random() * interval '7 days');

-- Add some metadata
UPDATE geographic_threats SET metadata = jsonb_build_object(
  'detection_method', 'automated',
  'confidence', (random() * 40 + 60)::int,
  'related_campaigns', (random() * 5)::int
);
