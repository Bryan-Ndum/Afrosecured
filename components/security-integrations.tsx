"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Database, Brain, Globe, ExternalLink, CheckCircle } from "lucide-react"
import Link from "next/link"

export function SecurityIntegrations() {
  const integrations = [
    {
      name: "VirusTotal",
      icon: Shield,
      description:
        "Industry-leading malware and URL scanning service that analyzes suspicious files and URLs to detect types of malware using multiple antivirus engines.",
      features: [
        "Scans URLs against 70+ security vendors",
        "Real-time threat intelligence database",
        "Behavioral analysis of suspicious links",
        "Historical scan data and reputation scores",
      ],
      link: "https://www.virustotal.com",
      status: "integrated",
    },
    {
      name: "Have I Been Pwned",
      icon: Database,
      description:
        "Comprehensive breach notification service that checks if your email or phone number has been compromised in known data breaches across the internet.",
      features: [
        "Database of 12+ billion breached accounts",
        "Real-time breach notifications",
        "Password exposure checking",
        "Domain-wide breach monitoring",
      ],
      link: "https://haveibeenpwned.com",
      status: "integrated",
    },
    {
      name: "AI Threat Analysis",
      icon: Brain,
      description:
        "Advanced GPT-4 powered scam detection that analyzes suspicious messages, emails, and content using natural language processing and pattern recognition.",
      features: [
        "Real-time message analysis",
        "Scam pattern recognition",
        "Threat severity scoring",
        "Actionable security recommendations",
      ],
      link: "/tools/ai-analyzer",
      status: "active",
    },
    {
      name: "Global Threat Intelligence",
      icon: Globe,
      description:
        "Crowdsourced threat database powered by community reports and verified security researchers tracking scams across Africa and globally.",
      features: [
        "Real-time scam reporting",
        "Geographic threat mapping",
        "Trend analysis and predictions",
        "Community verification system",
      ],
      link: "/intel",
      status: "active",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered By Industry Leaders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise-Grade Security Integrations</h2>
          <p className="text-lg text-muted-foreground">
            Afrosecured combines the best cybersecurity tools and threat intelligence platforms to provide comprehensive
            protection against online scams and fraud.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <Card
                key={integration.name}
                className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      integration.status === "integrated"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    {integration.status === "integrated" ? "Integrated" : "Active"}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{integration.name}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{integration.description}</p>

                <div className="space-y-3 mb-6">
                  {integration.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button asChild variant="outline" className="w-full group/btn bg-transparent">
                  <Link href={integration.link} target={integration.link.startsWith("http") ? "_blank" : undefined}>
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
