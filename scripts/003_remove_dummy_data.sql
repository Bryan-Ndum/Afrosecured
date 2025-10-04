-- Remove all seed data with fake URLs from AfroSecure database

-- Remove scam feeds with fake URLs
DELETE FROM public.scam_feeds 
WHERE source_url LIKE '%fake-url%' 
   OR source_url LIKE '%example.com%';

-- Remove social mentions with fake URLs
DELETE FROM public.social_mentions 
WHERE url LIKE '%fake-url%' 
   OR url LIKE '%example.com%';

-- Remove test subscribers
DELETE FROM public.digest_subscribers 
WHERE email LIKE '%example.com%' 
   OR email = 'test@example.com';
