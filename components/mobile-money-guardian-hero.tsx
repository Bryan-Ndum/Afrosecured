"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Smartphone, MessageSquare, Phone, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function MobileMoneyGuardianHero() {
  const features = [
    {
      icon: MessageSquare,
      title: "SMS Scam Shield",
      description: "Real-time detection of fake M-Pesa, MTN Money, and Airtel Money messages",
    },
    {
      icon: Phone,
      title: "Voice Call Protection",
      description: "AI analyzes calls for manipulation tactics and impersonation attempts",
    },
    {
      icon: Zap,
      title: "Transaction Verification",
      description: "Verify recipients before sending money with community threat intelligence",
    },
    {
      icon: Shield,
      title: "SIM Swap Detection",
      description: "Automatic account lock when suspicious SIM changes are detected",
    },
  ]

  const stats = [
    { value: "$21B+", label: "Fraud prevented annually" },
    { value: "500M+", label: "Mobile money users" },
    { value: "<100ms", label: "Detection speed" },
    { value: "95%+", label: "Accuracy rate" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full text-sm">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Mobile Money Guardian</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Protect your mobile money
              <br />
              <span className="text-primary">before scammers strike</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The first AI-powered protection system built specifically for Africa's $700B mobile money ecosystem.
              Detect scams in SMS, USSD, WhatsApp, and voice calls—before you lose money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-base px-8 h-12 rounded-full" asChild>
                <Link href="/mobile-money-guardian/download">
                  Download for Android
                  <Shield className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-full bg-transparent" asChild>
                <Link href="/mobile-money-guardian/demo">Watch Demo</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Comprehensive Protection for Mobile Money
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border-2 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
            <div className="space-y-4">
              {[
                "Install Mobile Money Guardian on your Android phone",
                "Grant SMS and call permissions for real-time monitoring",
                "Our AI analyzes every message and call for fraud patterns",
                "Get instant alerts when suspicious activity is detected",
                "Verify transactions before sending money with one tap",
                "Report scams to protect the entire community",
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
