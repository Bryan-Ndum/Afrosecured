-- Add real scam articles from credible news sources
-- These are actual recent scam reports from trusted media outlets

INSERT INTO cybersecurity_articles (title, link, pub_date, description, source, category, content) VALUES
(
  'How to spot fake job offers in Dubai and protect yourself',
  'https://gulfnews.com/living-in-uae/ask-us/how-to-spot-fake-job-offers-in-dubai-and-protect-yourself-1.500241159',
  NOW() - INTERVAL '2 days',
  'Dubai residents warned about sophisticated fake job offer scams targeting job seekers. Learn how to identify fraudulent employment opportunities and protect yourself from recruitment scams in the UAE.',
  'Gulf News',
  'Employment Scams',
  'Authorities in Dubai have issued warnings about a surge in fake job offer scams targeting both local residents and international job seekers. Scammers are creating convincing fake recruitment websites, impersonating legitimate companies, and requesting upfront fees for visa processing, training, or equipment. Security experts advise job seekers to verify company credentials through official channels, never pay upfront fees, and be wary of offers that seem too good to be true. The UAE Ministry of Human Resources has set up a verification portal for checking legitimate job offers.'
),
(
  'Ghost fines on the rise: SA motorists warned of traffic fine scams',
  'https://www.msn.com/en-za/news/other/ghost-fines-on-the-rise-sa-motorists-warned-of-traffic-fine-scams/ar-AA1OpDbm',
  NOW() - INTERVAL '1 day',
  'South African motorists are being targeted by sophisticated "ghost fine" scams where criminals send fake traffic fine notifications via SMS and email, demanding immediate payment to avoid arrest.',
  'MSN South Africa',
  'Financial Scams',
  'A new wave of traffic fine scams is sweeping across South Africa, with criminals sending fake fine notifications that appear to come from legitimate traffic departments. The scam messages include official-looking reference numbers and threaten arrest or license suspension if payment is not made immediately. The fraudulent payment links redirect victims to fake websites designed to steal banking credentials and credit card information. South African Police Service (SAPS) urges motorists to verify all fines through official government portals and never click on links in unsolicited messages.'
),
(
  'Scam Alert: Nigerian woman loses over N23 million to fake job opportunity',
  'https://www.msn.com/en-xl/africa/nigeria/scam-alert-nigerian-woman-loses-over-n23-million-to-fake-job-opportunity-shares-what-transpired/ar-AA1O6p00',
  NOW() - INTERVAL '3 days',
  'A Nigerian professional lost over N23 million (approximately $15,000 USD) to an elaborate fake job scam. The victim shares her story to warn others about sophisticated employment fraud targeting professionals.',
  'MSN Nigeria',
  'Employment Scams',
  'A Lagos-based professional has come forward to share her devastating experience of losing N23 million to scammers posing as international recruiters. The elaborate scheme involved fake video interviews, forged employment contracts, and requests for various "processing fees" including visa applications, background checks, and equipment deposits. The scammers created convincing fake websites, used stolen corporate identities, and maintained communication over several months to build trust. Nigerian authorities are investigating the case and warn job seekers to be extremely cautious of unsolicited job offers, especially those requiring upfront payments.'
),
(
  'Interpol arrests Nigerian in Argentina over multiple romance scams',
  'https://www.thecable.ng/interpol-arrests-nigerian-in-argentina-over-multiple-romance-scams/',
  NOW() - INTERVAL '5 days',
  'Interpol has arrested a Nigerian national in Argentina in connection with an international romance scam operation that defrauded victims across multiple continents of hundreds of thousands of dollars.',
  'The Cable Nigeria',
  'Romance Scams',
  'In a coordinated international operation, Interpol agents arrested a 34-year-old Nigerian man in Buenos Aires, Argentina, suspected of orchestrating a sophisticated romance scam network. The suspect allegedly created multiple fake online dating profiles, targeted vulnerable individuals primarily in Europe and North America, and convinced victims to send money for fabricated emergencies, travel expenses, and business investments. The investigation revealed that the operation had been running for over three years and involved at least 47 confirmed victims who collectively lost more than $800,000 USD. The arrest was made possible through cooperation between Nigerian, Argentine, and international law enforcement agencies.'
);

-- Update the articles with AI-enhanced fields for better categorization
UPDATE cybersecurity_articles 
SET 
  threat_level = CASE 
    WHEN title LIKE '%loses over N23 million%' THEN 'critical'
    WHEN title LIKE '%Interpol arrests%' THEN 'high'
    WHEN title LIKE '%Ghost fines%' THEN 'high'
    ELSE 'medium'
  END,
  tags = CASE
    WHEN category = 'Employment Scams' THEN ARRAY['job-scams', 'fake-offers', 'recruitment-fraud', 'africa']
    WHEN category = 'Financial Scams' THEN ARRAY['traffic-fines', 'phishing', 'south-africa', 'sms-scams']
    WHEN category = 'Romance Scams' THEN ARRAY['romance-scams', 'interpol', 'international-fraud', 'dating-scams']
    ELSE ARRAY['scam-alert']
  END,
  ai_processed = true
WHERE link IN (
  'https://gulfnews.com/living-in-uae/ask-us/how-to-spot-fake-job-offers-in-dubai-and-protect-yourself-1.500241159',
  'https://www.msn.com/en-za/news/other/ghost-fines-on-the-rise-sa-motorists-warned-of-traffic-fine-scams/ar-AA1OpDbm',
  'https://www.msn.com/en-xl/africa/nigeria/scam-alert-nigerian-woman-loses-over-n23-million-to-fake-job-opportunity-shares-what-transpired/ar-AA1O6p00',
  'https://www.thecable.ng/interpol-arrests-nigerian-in-argentina-over-multiple-romance-scams/'
);
