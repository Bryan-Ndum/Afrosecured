"use client"

import { Shield, Search, CreditCard, Scan, Users } from 'lucide-react'
import { Card } from "@/components/ui/card"

const trustFactors = [
  {
    icon: Search,
    title: "Website Legitimacy",
    description: "We verify domain age, SSL certificates, and online reputation to identify suspicious sites."
  },
  {
    icon: Users,
    title: "Merchant Identity",
    description: "Background checks on business registration, physical addresses, and contact authenticity."
  },
  {
    icon: CreditCard,
    title: "Payment Safety",
    description: "Analysis of payment methods, transaction security, and chargeback protections."
  },
  {
    icon: Scan,
    title: "Fraud Pattern Detection",
    description: "AI-powered detection of known scam patterns, phishing techniques, and social engineering tactics."
  },
  {
    icon: Shield,
    title: "Social Media Authenticity",
    description: "Verification of social profiles, account age, engagement patterns, and follower authenticity."
  }
]

export function TrustFramework() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">Our Methodology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How AfroSecured Evaluates Risk</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive 5-point framework ensures thorough evaluation of potential threats and scams.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {trustFactors.map((factor, index) => {
            const Icon = factor.icon
            return (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-lg transition-all duration-300 animate-fade-in-up hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{factor.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {factor.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
