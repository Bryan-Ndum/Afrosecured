# AfroSecured 🛡️

**AI-Powered Cybersecurity Platform for Africa**

AfroSecured is a comprehensive security platform that protects African users from scams, fraud, and cyber threats through intelligent threat detection, real-time intelligence feeds, and educational resources.

## 🚀 Features

### 🤖 AI-Powered Security Tools

1. **AI Scam Analyzer**
   - Analyzes messages, emails, and social media posts for scam patterns
   - GPT-4 powered risk assessment with confidence scoring
   - Identifies specific red flags and provides actionable recommendations
   - Detects urgency tactics, payment requests, and impersonation attempts

2. **URL Scanner**
   - Real-time website safety checking
   - Phishing detection and malicious link identification
   - Domain age and reputation analysis
   - SSL certificate verification

3. **Phone Number Lookup**
   - Identifies suspicious phone numbers
   - Detects common scam caller patterns
   - Provides safety recommendations

4. **Email Analyzer**
   - Examines email headers and content for phishing indicators
   - Sender verification and domain reputation checking
   - Attachment safety analysis

5. **Pattern Matcher**
   - Compares user-submitted content against known scam templates
   - Identifies structural similarities to documented scams
   - Cultural and regional scam variation detection

### 📰 AI-Powered Threat Intelligence

- **Automatic Updates**: Hourly cron job fetches and analyzes cybersecurity news
- **GPT-4 Extraction**: Intelligent threat intelligence extraction from articles
- **Structured Data**: Threat levels, CVE IDs, IOCs, affected platforms, recommendations
- **Real-Time Feed**: Auto-refreshing dashboard with latest security updates
- **Smart Categorization**: Auto-generated tags and threat severity assessment

### 🎓 Educational Resources

- **Scam Database**: Comprehensive collection of known scam types
- **Safety Guides**: Best practices for online security
- **Community Reports**: Real-world scam examples and warnings
- **Trusted Sources**: Curated links to elite cybersecurity news outlets

### 📊 Admin Dashboard

- System health monitoring
- Article statistics and analytics
- Manual update triggers
- Database status overview

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: Vercel AI SDK + GPT-4
- **Deployment**: Vercel
- **Cron Jobs**: Vercel Cron
- **Data Fetching**: SWR



## 📚 Documentation

- [AI Intelligence System](docs/AI_INTELLIGENCE_SYSTEM.md) - Detailed architecture and setup
- [Auto-Update System](docs/AUTO_UPDATE_SYSTEM.md) - Cron job configuration
- [API Documentation](docs/API.md) - API endpoints and usage (coming soon)

## 🔒 Security Features

- ✅ Row Level Security (RLS) on all database tables
- ✅ Server-side API key management
- ✅ Rate limiting on web scraping
- ✅ Input validation and sanitization
- ✅ HTTPS-only communication
- ✅ No PII collection without consent

## 🌍 Why Africa?

Africa faces unique cybersecurity challenges:
- **Romance Scams**: Targeting vulnerable individuals seeking relationships
- **Education Fraud**: Fake scholarships and study permits targeting international students
- **Mobile Money Scams**: Exploiting mobile payment systems
- **Social Engineering**: Cultural and linguistic manipulation tactics
- **Limited Awareness**: Lack of accessible cybersecurity education

AfroSecured addresses these challenges with:
- **Localized Content**: Scam types specific to African contexts
- **Accessible Language**: Clear, jargon-free explanations
- **Free Tools**: No paywalls or subscriptions
- **Community Focus**: Crowdsourced scam reports and warnings
- **Educational Mission**: Empowering users with knowledge

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution

- [ ] Add more scam detection patterns
- [ ] Improve AI extraction accuracy
- [ ] Add multi-language support
- [ ] Create mobile app version
- [ ] Expand educational content
- [ ] Add user authentication and saved scans
- [ ] Implement email notifications for critical threats

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- **Cybersecurity Sources**: Krebs on Security, The Hacker News, Dark Reading, BleepingComputer
- **AI Technology**: OpenAI GPT-4, Vercel AI SDK
- **UI Components**: shadcn/ui
- **Community**: All contributors and users helping make the internet safer

## 📞 Contact

- **Website**: [afrosecured.com](https://afrosecured.com)
- **Email**: security@afrosecured.com
- **Twitter**: [@AfroSecured](https://twitter.com/AfroSecured)
- **GitHub**: [github.com/afrosecured](https://github.com/afrosecured)

---

**Built with ❤️ for Africa's digital safety**
