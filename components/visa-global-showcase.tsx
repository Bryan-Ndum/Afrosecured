"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, TrendingDown, Globe } from "lucide-react"
import Link from "next/link"

export function VisaGlobalShowcase() {
  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full text-sm">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Global Payment Security</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Secure payments
            <br />
            <span className="text-primary">anywhere in the world</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Virtual cards, merchant verification, and smart payment routing powered by Visa's global network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-background border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Virtual Cards</h3>
            <p className="text-muted-foreground mb-4">
              Generate one-time virtual card numbers for secure online shopping. Your real card details stay protected.
            </p>
            <div className="text-sm text-primary font-medium">Instant generation • Global acceptance</div>
          </Card>

          <Card className="p-6 bg-background border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Merchant Verification</h3>
            <p className="text-muted-foreground mb-4">
              Verify merchant legitimacy before payment. Real-time trust scores and fraud detection across 190+
              countries.
            </p>
            <div className="text-sm text-primary font-medium">Real-time checks • Global coverage</div>
          </Card>

          <Card className="p-6 bg-background border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Payment Routing</h3>
            <p className="text-muted-foreground mb-4">
              Save up to 80% on international transfers. Automatically find the cheapest route for cross-border
              payments.
            </p>
            <div className="text-sm text-primary font-medium">Best rates • Multi-currency</div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
          >
            <Link href="/visa-global">Explore Visa Security Platform</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
