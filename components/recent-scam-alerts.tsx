"use client"

import { AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react'
import { Card } from "@/components/ui/card"

const recentScams = [
  {
    title: "INTERPOL Operation Red Card 2.0: 651 Arrested Across Africa",
    description: "INTERPOL's Operation Red Card 2.0 (Dec 2025 - Jan 2026) dismantled criminal networks across 16 African nations, arresting 651 suspects and recovering $4.3 million. The operation uncovered scams linked to over $45 million in losses and identified 1,247 victims, seizing 2,341 devices.",
    learnMore: "/intel",
    source: "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
    sourceName: "INTERPOL",
    severity: "critical",
    date: "Feb 18, 2026"
  },
  {
    title: "Massive Data Leak: 3 Billion Records Including SSNs Exposed",
    description: "A misconfigured cloud database containing approximately 2.7 billion SSN records and 3 billion email/password combinations was discovered exposed online without authentication. Researchers estimate the dataset could contain over 1 billion unique SSNs.",
    learnMore: "/intel",
    source: "https://cyberinsider.com/exposed-database-leaks-2-7-billion-ssns-and-3-billion-passwords",
    sourceName: "CyberInsider",
    severity: "critical",
    date: "Feb 19, 2026"
  },
  {
    title: "AI Deepfake Crypto Scams Surge 500%",
    description: "A 500% surge in AI-powered deepfake cryptocurrency scams has been reported, including a fake 'Gemini' AI chatbot promoting a bogus 'Google Coin'. Scammers use celebrity impersonations and AI-generated content to lure victims into fraudulent investment platforms.",
    learnMore: "/intel",
    source: "https://www.malwarebytes.com/blog/ai/2026/02/scammers-use-fake-gemini-ai-chatbot-to-sell-fake-google-coin",
    sourceName: "Malwarebytes",
    severity: "critical",
    date: "Feb 18, 2026"
  },
  {
    title: "Ghana Arrests Nigerians Running Cyber-Crime Networks in Accra",
    description: "Ghana's security forces arrested 9 Nigerians coordinating cyber-crime from makeshift offices in Accra. 44 others, believed to be victims lured under false pretenses, were detained. Raids uncovered 62 laptops, 52 phones, and 2 firearms. Victims were forced into romance scams and BEC fraud.",
    learnMore: "/intel",
    source: "https://bbc.com/news/articles/cr4k35q6yr0o",
    sourceName: "BBC News",
    severity: "critical",
    date: "Feb 20, 2026"
  },
  {
    title: "FTC Valentine's Day Romance Scam Warning",
    description: "The FTC issued a consumer alert warning that romance scams are increasingly powered by AI, making them harder to spot. Scammers build trust over weeks, then request money via wire transfers, gift cards, or cryptocurrency. Reverse image searches can help expose fake profiles.",
    learnMore: "/intel",
    source: "https://consumer.ftc.gov/consumer-alerts/2026/02/why-cant-new-love-interest-meet-person",
    sourceName: "FTC",
    severity: "high",
    date: "Feb 12, 2026"
  },
  {
    title: "Tax Season Phishing: Fake IRS & USPS Messages Surge",
    description: "Scammers are impersonating the IRS and USPS via email and text, demanding immediate payment or personal data. Messages use fake logos, spoofed .gov addresses, and urgent language. The IRS never initiates contact by email, text, or social media.",
    learnMore: "/intel",
    source: "https://consumer.ftc.gov/consumer-alerts/2026/01/text-or-email-about-your-tax-refund-scam",
    sourceName: "FTC",
    severity: "high",
    date: "Feb 2026"
  },
  {
    title: "Mobile Loan Fraud Crackdown in Ivory Coast",
    description: "In Ivory Coast, law enforcement made 58 arrests and seized 240 phones, 25 laptops, and 300+ SIM cards targeting mobile loan fraud. These scams targeted vulnerable populations through deceptive mobile apps, imposing hidden fees and harvesting sensitive personal data.",
    learnMore: "/intel",
    source: "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
    sourceName: "INTERPOL",
    severity: "high",
    date: "Feb 18, 2026"
  },
  {
    title: "Kenya Investment Scam Ring Busted",
    description: "Kenyan authorities arrested 27 people linked to investment fraud schemes using messaging apps and social media. Scammers solicited investments as low as $50 in fake ventures with fabricated dashboards showing fake returns, while blocking all withdrawal requests.",
    learnMore: "/intel",
    source: "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
    sourceName: "INTERPOL",
    severity: "high",
    date: "Feb 18, 2026"
  },
  {
    title: "Nigeria Telecom Infiltration Syndicate Dismantled",
    description: "Nigerian authorities dismantled a cybercrime syndicate that infiltrated the internal platform of a major telecom provider through compromised staff credentials, siphoning significant volumes of airtime and data for illegal resale.",
    learnMore: "/intel",
    source: "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
    sourceName: "INTERPOL",
    severity: "critical",
    date: "Feb 18, 2026"
  },
  {
    title: "SMS Phishing Targets Travelers in Southeast Asia",
    description: "Singapore police warned that scammers are sending SMS phishing messages impersonating toll authorities, targeting travelers. The tactic is spreading globally as scammers exploit location-based services to craft convincing, targeted phishing attacks.",
    learnMore: "/intel",
    source: "https://www.police.gov.sg/Media-Hub/News/2026/02/20260210_police_advisory_on_phishing_scams_targeting_singaporean_travellers_to_malaysia",
    sourceName: "Singapore Police",
    severity: "medium",
    date: "Feb 10, 2026"
  }
]

export function RecentScamAlerts() {
  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Active Threats</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Scam Alerts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest scam trends targeting African communities and the diaspora.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recentScams.map((scam, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up border-l-4"
              style={{ 
                borderLeftColor: scam.severity === 'critical' ? 'rgb(239 68 68)' : 
                                scam.severity === 'high' ? 'rgb(251 146 60)' : 
                                'rgb(234 179 8)',
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  scam.severity === 'critical' ? 'text-red-500' : 
                  scam.severity === 'high' ? 'text-orange-500' : 
                  'text-yellow-500'
                }`} />
                <h3 className="font-semibold text-lg">{scam.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {scam.description}
              </p>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <a 
                    href={scam.learnMore}
                    className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                  >
                    Learn More
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {scam.date && (
                    <span className="text-xs text-muted-foreground">{scam.date}</span>
                  )}
                </div>
                <a 
                  href={scam.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Source: {scam.sourceName}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
