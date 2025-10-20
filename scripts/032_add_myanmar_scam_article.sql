-- Add BBC article about Myanmar scam compound raid
INSERT INTO cybersecurity_articles (
  title,
  url,
  description,
  content,
  source,
  source_url,
  category,
  threat_level,
  published_at,
  author,
  tags,
  region
) VALUES (
  'Cyber scams: Notorious hub linked to Chinese mafia raided in Myanmar',
  'https://www.bbc.com/news/articles/c0jdn4yjze6o',
  'Myanmar military raids KK Park, one of the most notorious scam compounds on the Thai border, where thousands were forced to run elaborate online scams stealing billions globally. The complex, linked to Chinese organized crime, held victims from African countries who faced torture and beatings.',
  'The Myanmar military says it has captured one of the most notorious scam compounds on the border with Thailand. KK Park has been synonymous with online fraud, money laundering and human trafficking for five years. Thousands were lured with promises of well-paid jobs, then forced to run elaborate scams stealing billions from victims worldwide. The compound, linked to Chinese underworld figure Wan Kuok Koi (Broken Tooth), expanded rapidly since 2020. Escapees describe brutal conditions with torture and beatings for those failing to meet targets. Over 2,000 workers were released, and 30 Starlink terminals confiscated. However, sources indicate scam operations may continue in parts of the complex, and KK Park is only one of at least 30 similar compounds on the border.',
  'BBC News',
  'https://www.bbc.com/news/articles/c0jdn4yjze6o',
  'Organized Crime',
  'critical',
  '2025-10-20T09:15:07.000Z',
  'Jonathan Head',
  ARRAY['scam compound', 'human trafficking', 'forced labor', 'Chinese mafia', 'Myanmar', 'KK Park', 'online fraud', 'money laundering', 'Southeast Asia'],
  'Southeast Asia'
) ON CONFLICT (url) DO NOTHING;
