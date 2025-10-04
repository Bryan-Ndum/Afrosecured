"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, MapPin, Shield, BookOpen, TrendingUp, Users } from "lucide-react"
import { useState, useEffect } from "react"

const features = [
  {
    icon: Bell,
    title: "Real-Time Scam Alerts",
    description: "Get instant notifications about new scams targeting your region and community.",
    color: "text-destructive",
  },
  {
    icon: MapPin,
    title: "Localized Fraud Detection",
    description: "AI-powered detection tailored to African and diaspora-specific scam patterns.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Privacy Tips for Freelancers & Students",
    description: "Specialized guidance for digital nomads, remote workers, and international students.",
    color: "text-accent",
  },
  {
    icon: BookOpen,
    title: "Global Scam Education Hub",
    description: "Comprehensive resources and training materials in multiple African languages.",
    color: "text-primary",
  },
]

export function FeaturesSection() {
  const [stats, setStats] = useState({
    totalReports: 0,
    activeThreats: 0,
    communitiesProtected: 0,
  })

  const fetchStats = async () => {
    try {
      // Fetch total verified reports
      const reportsResponse = await fetch("/api/reports?status=verified&limit=1000")
      if (reportsResponse.ok) {
        const { data: reports } = await reportsResponse.json()
        setStats((prev) => ({ ...prev, totalReports: reports?.length || 0 }))
      }

      // Fetch active threats (trending scams)
      const intelResponse = await fetch("/api/intel?trending=true&limit=100")
      if (intelResponse.ok) {
        const { data: intel } = await intelResponse.json()
        setStats((prev) => ({ ...prev, activeThreats: intel?.length || 0 }))
      }

      // Set communities protected (this would be calculated from user data in a real app)
      setStats((prev) => ({ ...prev, communitiesProtected: 15 }))
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Comprehensive <span className="text-primary">Protection</span> Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Advanced cybersecurity tools designed specifically for the African diaspora community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-primary/5 border-primary/20 text-center rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">{stats.totalReports.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Scams Reported & Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20 text-center rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <Bell className="w-8 h-8 text-destructive mx-auto mb-2" />
              <div className="text-3xl font-bold text-destructive">{stats.activeThreats}</div>
              <div className="text-sm text-muted-foreground">Active Threats Monitored</div>
            </CardContent>
          </Card>
          <Card className="bg-accent/5 border-accent/20 text-center rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-accent">{stats.communitiesProtected}+</div>
              <div className="text-sm text-muted-foreground">Countries Protected</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 rounded-2xl"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-secondary/50">
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-balance">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-pretty">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional feature highlight */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 rounded-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-primary">24/7</span> Community Protection
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Our AI monitors thousands of sources across social media, messaging apps, and financial platforms to
              identify emerging threats before they reach your community.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
