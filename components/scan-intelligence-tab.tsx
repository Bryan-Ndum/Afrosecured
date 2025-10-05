"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, Shield, Mail, Briefcase, Flame } from "lucide-react"

type ScamType = "Romance" | "Investment" | "TechSupport" | "Phishing" | "Employment"

interface ScamItem {
  title: string
  severity: "High" | "Medium" | "Low"
  date: string
  source: string
  desc: string
  link: string
}

const scamData: Record<ScamType, ScamItem[]> = {
  Romance: [
    {
      title: "Romance Scam on WhatsApp",
      severity: "High",
      date: "10/04/2025",
      source: "FTC",
      desc: "Fake lovers luring victims into crypto scams.",
      link: "/threats/romance-whatsapp",
    },
    {
      title: "Online Dating Gift Card Fraud",
      severity: "Medium",
      date: "09/28/2025",
      source: "Scamwatch",
      desc: "Scammers request gift cards as proof of love.",
      link: "/threats/dating-gift-card",
    },
    {
      title: "Fake Military Personnel Romance",
      severity: "High",
      date: "09/25/2025",
      source: "BBC",
      desc: "Scammers impersonate military members seeking relationships.",
      link: "/threats/military-romance",
    },
  ],
  Investment: [
    {
      title: "Fake Forex Trading App",
      severity: "High",
      date: "10/01/2025",
      source: "Google Safe Browsing",
      desc: "Bogus investment apps steal user credentials.",
      link: "/threats/forex-app",
    },
    {
      title: "Cryptocurrency Ponzi Scheme",
      severity: "High",
      date: "09/29/2025",
      source: "FTC",
      desc: "Fake crypto platforms promising guaranteed returns.",
      link: "/threats/crypto-ponzi",
    },
    {
      title: "Real Estate Investment Fraud",
      severity: "Medium",
      date: "09/26/2025",
      source: "Scamwatch",
      desc: "Non-existent properties advertised for investment.",
      link: "/threats/real-estate-fraud",
    },
  ],
  TechSupport: [
    {
      title: "Microsoft Pop-up Scam",
      severity: "High",
      date: "10/02/2025",
      source: "FTC",
      desc: "Fake alerts trick users into calling scammers.",
      link: "/threats/microsoft-popup",
    },
    {
      title: "Apple iCloud Security Alert",
      severity: "High",
      date: "09/30/2025",
      source: "Google Safe Browsing",
      desc: "Fake security warnings requesting remote access.",
      link: "/threats/apple-security",
    },
    {
      title: "Antivirus Renewal Scam",
      severity: "Medium",
      date: "09/27/2025",
      source: "BBC",
      desc: "Fake renewal notices for antivirus software.",
      link: "/threats/antivirus-renewal",
    },
  ],
  Phishing: [
    {
      title: "Bank Account Verification Email",
      severity: "Medium",
      date: "10/03/2025",
      source: "BBC",
      desc: "Emails posing as banks to steal credentials.",
      link: "/threats/bank-phishing",
    },
    {
      title: "PayPal Account Suspension",
      severity: "High",
      date: "10/01/2025",
      source: "Google Safe Browsing",
      desc: "Fake PayPal emails requesting immediate action.",
      link: "/threats/paypal-suspension",
    },
    {
      title: "Tax Refund Phishing",
      severity: "Medium",
      date: "09/28/2025",
      source: "FTC",
      desc: "Fake tax authority emails promising refunds.",
      link: "/threats/tax-refund",
    },
  ],
  Employment: [
    {
      title: "Fake Job Offers on LinkedIn",
      severity: "High",
      date: "10/04/2025",
      source: "Scamwatch",
      desc: "Scammers posing as recruiters ask for fees.",
      link: "/threats/linkedin-jobs",
    },
    {
      title: "Work From Home Package Scam",
      severity: "Medium",
      date: "09/29/2025",
      source: "FTC",
      desc: "Fake employers request payment for starter kits.",
      link: "/threats/work-from-home",
    },
    {
      title: "Mystery Shopper Fraud",
      severity: "High",
      date: "09/26/2025",
      source: "BBC",
      desc: "Fake mystery shopper jobs involving check cashing.",
      link: "/threats/mystery-shopper",
    },
  ],
}

const tabConfig: Record<ScamType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  Romance: { label: "Romance", icon: AlertTriangle },
  Investment: { label: "Investment", icon: TrendingUp },
  TechSupport: { label: "Tech Support", icon: Shield },
  Phishing: { label: "Phishing", icon: Mail },
  Employment: { label: "Employment", icon: Briefcase },
}

const trendingThreats: Record<ScamType, { title: string; count: string; trend: string }[]> = {
  Romance: [
    { title: "WhatsApp Romance Scams", count: "2,341", trend: "+23%" },
    { title: "Military Impersonation", count: "1,892", trend: "+18%" },
    { title: "Gift Card Requests", count: "1,654", trend: "+15%" },
  ],
  Investment: [
    { title: "Fake Crypto Platforms", count: "3,127", trend: "+31%" },
    { title: "Forex Trading Apps", count: "2,456", trend: "+27%" },
    { title: "Real Estate Fraud", count: "1,789", trend: "+12%" },
  ],
  TechSupport: [
    { title: "Microsoft Pop-ups", count: "4,231", trend: "+35%" },
    { title: "Apple Security Alerts", count: "3,567", trend: "+29%" },
    { title: "Antivirus Scams", count: "2,134", trend: "+19%" },
  ],
  Phishing: [
    { title: "Bank Verification Emails", count: "5,678", trend: "+42%" },
    { title: "PayPal Suspension", count: "4,123", trend: "+38%" },
    { title: "Tax Refund Phishing", count: "3,456", trend: "+25%" },
  ],
  Employment: [
    { title: "LinkedIn Fake Jobs", count: "2,987", trend: "+33%" },
    { title: "Work From Home Kits", count: "2,345", trend: "+21%" },
    { title: "Mystery Shopper Fraud", count: "1,876", trend: "+16%" },
  ],
}

export function ScanIntelligenceTab() {
  const [activeTab, setActiveTab] = useState<ScamType>("Romance")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "Low":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Scam Intelligence</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time threat intelligence across multiple scam categories. Stay informed and protected.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(Object.keys(tabConfig) as ScamType[]).map((tab) => {
            const Icon = tabConfig[tab].icon
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500"
                      : "bg-card border-2 border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tabConfig[tab].label}</span>
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Trending Threats Sidebar */}
          <div className="space-y-4">
            <Card className="p-6 border-emerald-500/30 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Trending Threats</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Most reported {tabConfig[activeTab].label.toLowerCase()} scams this week
              </p>
              <div className="space-y-3">
                {trendingThreats[activeTab].map((threat, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-background/50 border border-border hover:border-emerald-500/50 transition-all duration-300 animate-in fade-in slide-in-from-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium leading-tight">{threat.title}</h4>
                      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                        {threat.trend}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{threat.count} reports</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Scam Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {scamData[activeTab].map((scam, index) => (
              <Card
                key={index}
                className="p-6 hover:border-emerald-500/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className={`${getSeverityColor(scam.severity)} border`}>{scam.severity}</Badge>
                  <span className="text-xs text-muted-foreground">{scam.date}</span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{scam.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{scam.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Source: {scam.source}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={scam.link}>Learn More</a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
