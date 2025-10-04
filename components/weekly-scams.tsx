"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, AlertCircle, ExternalLink, Calendar } from "lucide-react"

interface WeeklyScam {
  id: string
  title: string
  description: string
  category: string
  victims: number
  trend: "rising" | "stable" | "declining"
  source: string
  url: string
}

export function WeeklyScams() {
  const [scams, setScams] = useState<WeeklyScam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeeklyScams = async () => {
      setLoading(true)
      // In production, this would fetch from your API aggregating Reddit, Trustpilot, etc.
      const mockScams: WeeklyScam[] = [
        {
          id: "1",
          title: "Fake Cryptocurrency Investment Platform",
          description:
            "Scammers impersonating legitimate crypto exchanges, promising 300% returns in 30 days. Targets African investors through WhatsApp groups.",
          category: "Investment Fraud",
          victims: 1247,
          trend: "rising",
          source: "Reddit r/Scams",
          url: "https://www.reddit.com/r/Scams/",
        },
        {
          id: "2",
          title: "Romance Scam with Fake Military Personnel",
          description:
            "Fraudsters posing as US military personnel stationed abroad, building relationships before requesting money for 'emergencies'.",
          category: "Romance Scam",
          victims: 892,
          trend: "rising",
          source: "ScamAdviser",
          url: "https://www.scamadviser.com/",
        },
        {
          id: "3",
          title: "Fake Job Recruitment Agencies",
          description:
            "Scammers offering overseas employment opportunities, collecting fees for visa processing that never happens.",
          category: "Employment Fraud",
          victims: 654,
          trend: "stable",
          source: "Trustpilot",
          url: "https://www.trustpilot.com/search?query=scam",
        },
        {
          id: "4",
          title: "WhatsApp Account Hijacking",
          description:
            "Attackers gaining access to WhatsApp accounts through verification code phishing, then requesting money from contacts.",
          category: "Account Takeover",
          victims: 2103,
          trend: "rising",
          source: "Reddit r/Scams",
          url: "https://www.reddit.com/r/Scams/",
        },
      ]
      setScams(mockScams)
      setLoading(false)
    }

    fetchWeeklyScams()
  }, [])

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "rising":
        return "text-destructive"
      case "stable":
        return "text-yellow-500"
      case "declining":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">This Week's Top Threats</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Scams of the Week</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The most reported and dangerous scams targeting Africans this week, updated from community reports
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground mt-4">Loading weekly scams...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {scams.map((scam, index) => (
              <Card
                key={scam.id}
                className="p-6 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {scam.category}
                  </Badge>
                  <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(scam.trend)}`}>
                    <TrendingUp className="w-4 h-4" />
                    {scam.trend}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  {scam.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{scam.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Reported victims: </span>
                    <span className="font-bold text-destructive">{scam.victims.toLocaleString()}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={scam.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      View Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-2">Source: {scam.source}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
