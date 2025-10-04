"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, ExternalLink, TrendingUp, Users } from "lucide-react"

interface MonthlyThreat {
  id: string
  title: string
  description: string
  type: "breach" | "vulnerability" | "scam"
  severity: "critical" | "high" | "medium"
  affected: string
  impact: string
  source: string
  url: string
}

export function MonthlyThreats() {
  const [threats, setThreats] = useState<MonthlyThreat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonthlyThreats = async () => {
      setLoading(true)
      // In production, this would fetch from your API
      const mockThreats: MonthlyThreat[] = [
        {
          id: "1",
          title: "Major African Bank Data Breach",
          description:
            "Customer data including account numbers and personal information exposed due to unpatched server vulnerability. Immediate password reset recommended.",
          type: "breach",
          severity: "critical",
          affected: "2.3M users",
          impact: "Account takeover risk, identity theft",
          source: "Data Breach Today",
          url: "https://www.databreachtoday.com/",
        },
        {
          id: "2",
          title: "WhatsApp Zero-Day Exploit",
          description:
            "Critical vulnerability allowing remote code execution through malicious video files. Update to latest version immediately.",
          type: "vulnerability",
          severity: "critical",
          affected: "All WhatsApp users",
          impact: "Device compromise, data theft",
          source: "The Hacker News",
          url: "https://thehackernews.com/",
        },
        {
          id: "3",
          title: "Coordinated Investment Scam Network",
          description:
            "Large-scale cryptocurrency investment scam operating across 15 African countries, using fake celebrity endorsements.",
          type: "scam",
          severity: "high",
          affected: "50,000+ victims",
          impact: "$45M in losses",
          source: "Reddit r/Scams",
          url: "https://www.reddit.com/r/Scams/",
        },
      ]
      setThreats(mockThreats)
      setLoading(false)
    }

    fetchMonthlyThreats()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      default:
        return "bg-secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "breach":
        return <Shield className="w-5 h-5" />
      case "vulnerability":
        return <AlertTriangle className="w-5 h-5" />
      case "scam":
        return <Users className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Critical Monthly Overview</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Top Security Threats This Month</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The most significant security breaches, vulnerabilities, and scams affecting Africans this month
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground mt-4">Loading monthly threats...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {threats.map((threat, index) => (
              <Card
                key={threat.id}
                className="p-6 hover:shadow-lg transition-all duration-300 border-l-4"
                style={{
                  borderLeftColor:
                    threat.severity === "critical"
                      ? "hsl(var(--destructive))"
                      : threat.severity === "high"
                        ? "#f97316"
                        : "#eab308",
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        threat.type === "breach"
                          ? "bg-destructive/10 text-destructive"
                          : threat.type === "vulnerability"
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {getTypeIcon(threat.type)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={`text-xs ${getSeverityColor(threat.severity)}`}>
                        {threat.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {threat.type}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-xl mb-3">{threat.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{threat.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-secondary/20 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Affected</p>
                        <p className="font-semibold">{threat.affected}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Impact</p>
                        <p className="font-semibold">{threat.impact}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Source: <span className="font-medium">{threat.source}</span>
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={threat.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Read Full Report
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Critical Alert Banner */}
        <Card className="mt-8 p-6 bg-destructive/5 border-destructive/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg mb-2">Stay Protected</h4>
              <p className="text-muted-foreground text-sm mb-4">
                These threats are actively targeting African users. Subscribe to our biweekly digest to receive detailed
                protection guides and real-time alerts directly to your inbox.
              </p>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Subscribe to Alerts
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
