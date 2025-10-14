"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, Shield, RefreshCw, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

interface TrendingScam {
  id: string
  title: string
  description: string
  source: string
  source_url?: string
  scam_type: string
  severity: "low" | "medium" | "high" | "critical"
  location?: string
  tags?: string[]
  created_at: string
}

// Static fallback data
const fallbackScam: TrendingScam = {
  id: "fallback",
  title: "Organized Crime Rings Target International Students",
  description:
    "Sophisticated criminal networks are targeting international students in Canada with fake study permits, fraudulent acceptance letters, and bogus scholarship offers. These scams involve fake websites impersonating legitimate universities, forged immigration documents, and money laundering schemes that exploit vulnerable students seeking education abroad.",
  source: "University Affairs",
  source_url: "https://universityaffairs.ca/features/organized-criminals-target-international-students/",
  scam_type: "employment",
  severity: "high",
  location: "Canada, International",
  tags: ["education", "immigration", "fake_documents", "organized_crime"],
  created_at: new Date().toISOString(),
}

export function ScamOfTheDay() {
  const [trendingScam, setTrendingScam] = useState<TrendingScam>(fallbackScam)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchTrendingScam = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/trending-scam")
      if (response.ok) {
        const { data } = await response.json()
        if (data) {
          setTrendingScam(data)
          setLastUpdated(new Date())
        }
      }
    } catch (error) {
      console.error("Failed to fetch trending scam:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingScam()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getProtectionTips = (scamType: string) => {
    const tips = {
      phishing: {
        spot: [
          "Unsolicited messages with urgent deadlines",
          "Suspicious links or phone numbers",
          "Requests for personal information",
          "Poor grammar or spelling errors",
        ],
        avoid: [
          "Never click suspicious links",
          "Verify through official channels",
          "Don't share personal information",
          "Report and block the sender",
        ],
      },
      romance: {
        spot: [
          "Profiles with limited or stolen photos",
          "Quick declarations of love",
          "Requests for money or gifts",
          "Avoidance of video calls",
        ],
        avoid: [
          "Never send money to online contacts",
          "Always video call before trusting",
          "Research their photos online",
          "Trust your instincts",
        ],
      },
      investment: {
        spot: [
          "Guaranteed high returns",
          "Pressure to invest quickly",
          "Unregistered investment platforms",
          "Celebrity endorsements",
        ],
        avoid: [
          "Research investment platforms thoroughly",
          "Check with financial regulators",
          "Be wary of guaranteed returns",
          "Start with small amounts",
        ],
      },
      tech_support: {
        spot: [
          "Unsolicited calls about computer problems",
          "Requests for remote access",
          "Pressure to pay immediately",
          "Claims of virus infections",
        ],
        avoid: [
          "Never give remote access to strangers",
          "Hang up on unsolicited calls",
          "Contact tech support directly",
          "Use reputable antivirus software",
        ],
      },
      employment: {
        spot: [
          "Requests for upfront fees for applications or permits",
          "Websites that look similar to official university sites",
          "Offers that seem too good to be true",
          "Pressure to pay quickly without proper verification",
        ],
        avoid: [
          "Verify acceptance letters directly with universities",
          "Check official government immigration websites",
          "Never pay application fees to third parties",
          "Research the legitimacy of education consultants",
        ],
      },
    }

    return tips[scamType as keyof typeof tips] || tips.phishing
  }

  const protectionTips = getProtectionTips(trendingScam.scam_type)

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            <span className="text-destructive">Scam Alert:</span> Current Threats
          </h2>
          <p className="text-xl text-muted-foreground">Stay informed about the latest scams targeting our community</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTrendingScam}
              disabled={isLoading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur border-destructive/20 hover:border-destructive/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                {trendingScam.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getSeverityColor(trendingScam.severity)} className="text-sm">
                  {trendingScam.severity.charAt(0).toUpperCase() + trendingScam.severity.slice(1)} Risk
                </Badge>
                {trendingScam.source_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={trendingScam.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Source: {trendingScam.source}</span>
              {trendingScam.location && <span>• Affected regions: {trendingScam.location}</span>}
              <span>• {new Date(trendingScam.created_at).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/20 border border-border rounded-lg p-6 relative">
              <div className="text-sm text-muted-foreground mb-4">Threat Description:</div>
              <div className="bg-secondary/30 rounded-lg p-4 border-l-4 border-destructive">
                <p className="text-sm leading-relaxed">{trendingScam.description}</p>
              </div>

              <div className="absolute -right-2 top-8">
                <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
                  🚩{" "}
                  {trendingScam.scam_type === "phishing"
                    ? "Urgent pressure"
                    : trendingScam.scam_type === "romance"
                      ? "Emotional manipulation"
                      : trendingScam.scam_type === "investment"
                        ? "Guaranteed returns"
                        : trendingScam.scam_type === "employment"
                          ? "Requests for upfront fees"
                          : "Suspicious request"}
                </div>
              </div>
              <div className="absolute -right-2 bottom-8">
                <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
                  🚩{" "}
                  {trendingScam.scam_type === "phishing"
                    ? "Suspicious link"
                    : trendingScam.scam_type === "romance"
                      ? "Money request"
                      : trendingScam.scam_type === "investment"
                        ? "Unverified platform"
                        : trendingScam.scam_type === "employment"
                          ? "Fake websites"
                          : "Red flag"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-semibold text-lg">
                  <Eye className="w-5 h-5 text-accent" />
                  How to Spot It
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  {protectionTips.spot.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-semibold text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  How to Avoid It
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  {protectionTips.avoid.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            {trendingScam.tags && trendingScam.tags.length > 0 && (
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Related tags:</span>
                  {trendingScam.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
