"use client"

import { Card } from "@/components/ui/card"
import { Shield, Search, Brain, Bell, Users, Lock } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Submit Suspicious Content",
      description:
        "Paste any suspicious message, URL, email, or phone number into our security tools for instant analysis.",
    },
    {
      icon: Brain,
      title: "Intelligent Analysis",
      description:
        "Our advanced system analyzes the content against known scam patterns, threat databases, and behavioral indicators.",
    },
    {
      icon: Shield,
      title: "Multi-Source Verification",
      description:
        "We cross-reference with VirusTotal, Have I Been Pwned, and our community threat database for comprehensive verification.",
    },
    {
      icon: Bell,
      title: "Instant Threat Report",
      description:
        "Receive a detailed security report with threat level, risk indicators, and actionable recommendations within seconds.",
    },
    {
      icon: Users,
      title: "Community Protection",
      description:
        "Your reports help protect others. Verified threats are added to our database to warn the community in real-time.",
    },
    {
      icon: Lock,
      title: "Continuous Monitoring",
      description:
        "Stay protected with real-time alerts about new threats, trending scams, and security updates in your region.",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How Afrosecured Protects You</h2>
          <p className="text-lg text-muted-foreground">
            Advanced cybersecurity technology meets community intelligence to provide real-time protection against
            online threats.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
