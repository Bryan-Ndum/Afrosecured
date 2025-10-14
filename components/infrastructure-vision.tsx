"use client"

import { Card } from "@/components/ui/card"
import { Shield, Network, Zap, Database, Users, TrendingUp } from "lucide-react"

export function InfrastructureVision() {
  const layers = [
    {
      icon: Users,
      title: "Consumer Layer",
      description: "Mobile Money Guardian app for SMS, USSD, and WhatsApp fraud detection",
      status: "Live MVP",
      color: "text-green-500",
    },
    {
      icon: Network,
      title: "API Layer",
      description: "Real-time fraud detection API for fintechs, telcos, and e-commerce platforms",
      status: "In Development",
      color: "text-blue-500",
    },
    {
      icon: Database,
      title: "Intelligence Layer",
      description: "Proprietary African fraud database with behavioral biometrics and threat graphs",
      status: "Building",
      color: "text-purple-500",
    },
    {
      icon: Shield,
      title: "Infrastructure Layer",
      description: "Trust verification protocol embedded in every digital transaction across Africa",
      status: "Vision",
      color: "text-orange-500",
    },
  ]

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">The Infrastructure Play</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">From App to Infrastructure</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Like Cloudflare for security and Stripe for payments, AfroSecured is becoming the trust layer that powers
            Africa's digital economy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {layers.map((layer, index) => (
            <Card key={index} className="p-6 border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-card border ${layer.color}`}>
                  <layer.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{layer.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${layer.color} bg-card border`}>
                      {layer.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{layer.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold mb-3">The Network Effect</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every user contributes anonymized fraud data. Every transaction makes our detection smarter. Every
                integration strengthens the network. Once we reach critical mass, we become impossible to replicate— the
                definitive source of truth for digital transactions in Africa.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
