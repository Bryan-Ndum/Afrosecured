"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, ExternalLink, Clock, MapPin } from "lucide-react"

interface ThreatItem {
  id: string
  title: string
  source: string
  url: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  timestamp: string
  location?: string
}

export function IntelligenceDashboard() {
  const [threats, setThreats] = useState<ThreatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // Simulating real-time feed aggregation
    const fetchThreats = async () => {
      setLoading(true)
      // In production, this would fetch from your API that aggregates the external sources
      const mockThreats: ThreatItem[] = [
        {
          id: "1",
          title: "Major Data Breach Affects 50M Users",
          source: "Have I Been Pwned",
          url: "https://haveibeenpwned.com/",
          severity: "critical",
          category: "Data Breach",
          timestamp: new Date().toISOString(),
          location: "Global",
        },
        {
          id: "2",
          title: "New Phishing Campaign Targets African Banks",
          source: "The Hacker News",
          url: "https://thehackernews.com/",
          severity: "high",
          category: "Phishing",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          location: "Africa",
        },
        {
          id: "3",
          title: "Romance Scam Alert: Fake Investment Schemes",
          source: "Reddit r/Scams",
          url: "https://www.reddit.com/r/Scams/",
          severity: "high",
          category: "Romance Scam",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          location: "Nigeria",
        },
        {
          id: "4",
          title: "TikTok Security Vulnerability Discovered",
          source: "Firewall Times",
          url: "https://firewalltimes.com/tiktok-data-breach-timeline/",
          severity: "medium",
          category: "Social Media",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          location: "Global",
        },
      ]
      setThreats(mockThreats)
      setLoading(false)
    }

    fetchThreats()
    // Refresh every 5 minutes
    const interval = setInterval(fetchThreats, 300000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-secondary"
    }
  }

  const filteredThreats = filter === "all" ? threats : threats.filter((t) => t.severity === filter)

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">Live Intelligence Feed</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Real-Time Threat Intelligence</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aggregated security intelligence from trusted sources worldwide, updated automatically every 5 minutes
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All Threats
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
            className={filter === "critical" ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            Critical
          </Button>
          <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => setFilter("high")}>
            High
          </Button>
          <Button variant={filter === "medium" ? "default" : "outline"} size="sm" onClick={() => setFilter("medium")}>
            Medium
          </Button>
        </div>

        {/* Threat Cards */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground mt-4">Loading latest threats...</p>
            </div>
          ) : (
            filteredThreats.map((threat, index) => (
              <Card
                key={threat.id}
                className="p-6 hover:shadow-lg transition-all duration-300 border-l-4"
                style={{
                  borderLeftColor:
                    threat.severity === "critical"
                      ? "hsl(var(--destructive))"
                      : threat.severity === "high"
                        ? "#f97316"
                        : threat.severity === "medium"
                          ? "#eab308"
                          : "#3b82f6",
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{threat.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {threat.category}
                          </Badge>
                          <Badge className={`text-xs ${getSeverityColor(threat.severity)}`}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          {threat.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {threat.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(threat.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Source: <span className="font-medium">{threat.source}</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent" asChild>
                    <a href={threat.url} target="_blank" rel="noopener noreferrer">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Source Attribution */}
        <div className="mt-12 p-6 bg-secondary/20 rounded-lg border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Trusted Intelligence Sources
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Breach Trackers</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <a
                    href="https://haveibeenpwned.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Have I Been Pwned
                  </a>
                </li>
                <li>
                  <a
                    href="https://informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    World's Biggest Data Breaches
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cybersecurity News</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <a
                    href="https://thehackernews.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    The Hacker News
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.databreachtoday.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Data Breach Today
                  </a>
                </li>
                <li>
                  <a
                    href="https://krebsonsecurity.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Krebs on Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Community Reports</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <a
                    href="https://www.reddit.com/r/Scams/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Reddit r/Scams
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.trustpilot.com/search?query=scam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Trustpilot Scam Reports
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.scamadviser.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    ScamAdviser
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
