"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Shield, Globe, TrendingDown, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VisaGlobalPage() {
  const [activeTab, setActiveTab] = useState<"virtual-card" | "verify" | "routes">("virtual-card")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">Global Payment Security</Badge>
            <h1 className="text-6xl font-bold mb-6 text-balance">
              Secure Payments
              <span className="block text-primary mt-2">Anywhere in the World</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Virtual cards, merchant verification, and smart payment routing powered by Visa's global network. Protect
              yourself from fraud in 190+ countries.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-border/40 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Virtual Cards</h3>
              <p className="text-muted-foreground mb-4">
                Generate one-time virtual card numbers for secure online shopping. Each card expires after use.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Single-use protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Merchant restrictions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Amount limits
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-border/40 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Merchant Verification</h3>
              <p className="text-muted-foreground mb-4">
                Verify merchant legitimacy before payment. Check trust scores and fraud history instantly.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Real-time verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Trust score 0-100
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Fraud alerts
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-border/40 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Payment Routing</h3>
              <p className="text-muted-foreground mb-4">
                Find the cheapest route for international payments. Save up to 80% on transfer fees.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Best exchange rates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Lowest fees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Instant transfers
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8 border-b border-border/40">
              <button
                onClick={() => setActiveTab("virtual-card")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "virtual-card"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Generate Virtual Card
              </button>
              <button
                onClick={() => setActiveTab("verify")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "verify"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Verify Merchant
              </button>
              <button
                onClick={() => setActiveTab("routes")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "routes"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Compare Routes
              </button>
            </div>

            {activeTab === "virtual-card" && <VirtualCardGenerator />}
            {activeTab === "verify" && <MerchantVerifier />}
            {activeTab === "routes" && <PaymentRouteComparison />}
          </div>
        </div>
      </section>

      {/* Global Coverage */}
      <section className="py-20 border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Global Coverage</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Works in 190+ countries with support for 150+ currencies
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">190+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">150+</div>
                <div className="text-sm text-muted-foreground">Currencies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">30s</div>
                <div className="text-sm text-muted-foreground">Transfer Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">80%</div>
                <div className="text-sm text-muted-foreground">Fee Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function VirtualCardGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      amount: Number.parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") as string,
      merchantRestriction: formData.get("merchant") as string,
      expiryHours: Number.parseInt(formData.get("expiry") as string),
      usageLimit: 1,
    }

    try {
      const response = await fetch("/api/visa/virtual-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setResult(result)
    } catch (error) {
      console.error("[v0] Virtual card generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 border-border/40">
      <h3 className="text-2xl font-bold mb-6">Generate Virtual Card</h3>
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="amount">Amount Limit</Label>
            <Input id="amount" name="amount" type="number" placeholder="100.00" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" name="currency" placeholder="USD" defaultValue="USD" className="mt-2" />
          </div>
        </div>

        <div>
          <Label htmlFor="merchant">Merchant Restriction (Optional)</Label>
          <Input id="merchant" name="merchant" placeholder="amazon.com" className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">Card will only work for this specific merchant</p>
        </div>

        <div>
          <Label htmlFor="expiry">Expiry Time (Hours)</Label>
          <Input id="expiry" name="expiry" type="number" defaultValue="24" min="1" max="168" className="mt-2" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Generating..." : "Generate Virtual Card"}
        </Button>
      </form>

      {result?.virtualCard && (
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="font-semibold">Virtual Card Generated</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Card Number:</span>
              <span className="font-mono">**** **** **** {result.virtualCard.card_last_four}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires:</span>
              <span>
                {result.virtualCard.expiry_month}/{result.virtualCard.expiry_year}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usage Limit:</span>
              <span>{result.virtualCard.usage_limit} time(s)</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function MerchantVerifier() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      merchantId: formData.get("merchantId") as string,
      merchantName: formData.get("merchantName") as string,
      merchantCountry: formData.get("merchantCountry") as string,
    }

    try {
      const response = await fetch("/api/visa/merchant-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setResult(result)
    } catch (error) {
      console.error("[v0] Merchant verification failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 border-border/40">
      <h3 className="text-2xl font-bold mb-6">Verify Merchant</h3>
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <Label htmlFor="merchantId">Merchant ID</Label>
          <Input id="merchantId" name="merchantId" placeholder="MERCH123456" required className="mt-2" />
        </div>

        <div>
          <Label htmlFor="merchantName">Merchant Name</Label>
          <Input id="merchantName" name="merchantName" placeholder="Example Store" className="mt-2" />
        </div>

        <div>
          <Label htmlFor="merchantCountry">Country Code</Label>
          <Input id="merchantCountry" name="merchantCountry" placeholder="US" maxLength={2} className="mt-2" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify Merchant"}
        </Button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-card border border-border/40 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {result.verified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="font-semibold">{result.verified ? "Verified Merchant" : "Unverified Merchant"}</span>
            </div>
            <Badge
              variant={
                result.riskLevel === "low" ? "default" : result.riskLevel === "medium" ? "secondary" : "destructive"
              }
            >
              {result.riskLevel} risk
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trust Score:</span>
              <span className="font-semibold">{result.trustScore}/100</span>
            </div>
            {result.merchant && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant Name:</span>
                  <span>{result.merchant.merchant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country:</span>
                  <span>{result.merchant.merchant_country}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

function PaymentRouteComparison() {
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<any>(null)

  const handleCompare = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      fromCountry: formData.get("fromCountry") as string,
      toCountry: formData.get("toCountry") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      fromCurrency: formData.get("fromCurrency") as string,
      toCurrency: formData.get("toCurrency") as string,
    }

    try {
      const response = await fetch("/api/visa/payment-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setRoutes(result)
    } catch (error) {
      console.error("[v0] Payment route comparison failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 border-border/40">
      <h3 className="text-2xl font-bold mb-6">Compare Payment Routes</h3>
      <form onSubmit={handleCompare} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fromCountry">From Country</Label>
            <Input id="fromCountry" name="fromCountry" placeholder="US" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="toCountry">To Country</Label>
            <Input id="toCountry" name="toCountry" placeholder="NG" required className="mt-2" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" placeholder="1000" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="fromCurrency">From Currency</Label>
            <Input id="fromCurrency" name="fromCurrency" placeholder="USD" defaultValue="USD" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="toCurrency">To Currency</Label>
            <Input id="toCurrency" name="toCurrency" placeholder="NGN" defaultValue="NGN" className="mt-2" />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Comparing..." : "Compare Routes"}
        </Button>
      </form>

      {routes?.routes && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Available Routes</span>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Save ${routes.savings.toFixed(2)}
            </Badge>
          </div>
          {routes.routes.map((route: any) => (
            <Card
              key={route.id}
              className={`p-6 ${route.recommended ? "border-primary bg-primary/5" : "border-border/40"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{route.name}</h4>
                    {route.recommended && <Badge className="bg-primary text-primary-foreground">Recommended</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{route.estimatedTime}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${route.totalCost.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {route.features.map((feature: string) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}
