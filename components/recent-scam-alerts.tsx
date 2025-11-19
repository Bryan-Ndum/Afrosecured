"use client"

import { AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react'
import { Card } from "@/components/ui/card"

const recentScams = [
  {
    title: "AI-Powered Job Scams Surge Globally",
    description: "Scammers increasingly using AI tools to create sophisticated fake job postings, deepfake video interviews, and fraudulent recruitment schemes. Google reports significant rise in AI-enhanced employment fraud targeting job seekers worldwide.",
    learnMore: "/intel",
    source: "https://blog.google/technology/safety-security/fraud-and-scams-advisory-november-2025/",
    sourceName: "Google Security",
    severity: "critical"
  },
  {
    title: "DoorDash Data Breach Exposes Millions",
    description: "Social engineering attack on DoorDash in November 2025 compromised user contact details across US, Canada, Australia, and New Zealand. Highlights growing threat of social engineering which now accounts for 36% of all cyber intrusions.",
    learnMore: "/intel",
    source: "https://www.techrepublic.com/article/news-doordash-breach-november-2025/",
    sourceName: "TechRepublic",
    severity: "critical"
  },
  {
    title: "Mobile Money & SIM Swap Fraud",
    description: "Sophisticated attacks targeting mobile money accounts through SIM swapping techniques. Attackers gain control of phone numbers to access financial accounts and transfer funds.",
    learnMore: "/intel",
    source: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5257020",
    sourceName: "SSRN Research",
    severity: "critical"
  },
  {
    title: "Crypto & Investment Scams in Africa",
    description: "Massive cybercrime networks dismantled across Africa, involving cryptocurrency fraud and fake investment schemes that defrauded victims of millions.",
    learnMore: "/intel",
    source: "https://www.interpol.int/en/News-and-Events/News/2025/African-authorities-dismantle-massive-cybercrime-and-fraud-networks-recover-millions",
    sourceName: "INTERPOL",
    severity: "critical"
  },
  {
    title: "Fake World Bank & NGO Impersonation",
    description: "Scammers impersonating World Bank officials and NGO representatives to solicit personal information and money from unsuspecting victims.",
    learnMore: "/intel",
    source: "https://www.miragenews.com/world-bank-alerts-public-to-fraud-scams-using-1572449/",
    sourceName: "World Bank Alert",
    severity: "high"
  },
  {
    title: "Remote Work & Job Offer Scams",
    description: "Fake job postings promising remote work opportunities that require upfront payments or personal information, targeting job seekers across Africa.",
    learnMore: "/intel",
    source: "https://www.mcafee.com/blogs/internet-security/scam-alert-the-alarming-reality-behind-2025s-explosion-in-digital-fraud/",
    sourceName: "McAfee Security",
    severity: "high"
  },
  {
    title: "Review Extortion Schemes",
    description: "Businesses and individuals targeted by fraudsters who post fake negative reviews and demand payment to remove them.",
    learnMore: "/intel",
    source: "https://blog.google/technology/safety-security/fraud-and-scams-advisory-november-2025/",
    sourceName: "Google Security",
    severity: "medium"
  },
  {
    title: "Romance Sextortion (BM Boys - Nigeria)",
    description: "Nigerian cybercrime group known as 'BM Boys' targeting victims through romance scams on social media, leading to sextortion and financial theft.",
    learnMore: "/intel",
    source: "https://www.theguardian.com/us-news/2025/may/11/sextortion-nigeria-bm-boys-tiktok",
    sourceName: "The Guardian",
    severity: "critical"
  },
  {
    title: "Romance Scams Targeting Diaspora",
    description: "Organized romance scams specifically targeting African diaspora communities, with losses reaching millions annually.",
    learnMore: "/intel",
    source: "https://apnews.com/article/85af8ffb6c257a902ce3360cabf28974",
    sourceName: "AP News",
    severity: "high"
  },
  {
    title: "Ghana Cybercrime & Fake Recruitment",
    description: "Fake recruitment agencies in Ghana promising overseas jobs, collecting fees and personal documents, then disappearing.",
    learnMore: "/intel",
    source: "https://apnews.com/article/b4d2f1a70c0031fb87b6d575efb55e84",
    sourceName: "AP News",
    severity: "high"
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
              <div className="flex items-center justify-between gap-4">
                <a 
                  href={scam.learnMore}
                  className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                >
                  Learn More
                  <ExternalLink className="w-3 h-3" />
                </a>
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
