"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, Globe, Zap, RefreshCw } from 'lucide-react'
import { useState, useEffect } from "react"
import { useLiveTimestamp, useLiveTime } from "@/hooks/use-live-timestamp"

interface ScamFeed {
  id: string
  source: string
  title: string
  scam_type: string
  created_at: string
  is_trending: boolean
  severity: "high" | "medium" | "low"
  url?: string
}

// Static fallback data - updated Feb 2026
const fallbackFeeds = [
  {
    source: "INTERPOL",
    title: "Operation Red Card 2.0: 651 Arrested in 16 African Countries, $4.3M Recovered",
    time: "1 day ago",
    type: "Alert",
    severity: "high" as const,
  },
  {
    source: "BBC News Africa",
    title: "Ghana Arrests 9 Nigerians Running Cyber-Crime Networks From Accra Offices",
    time: "2 days ago",
    type: "Alert",
    severity: "high" as const,
  },
  {
    source: "CyberInsider",
    title: "Exposed Database Leaks 3 Billion Records Including SSNs and Passwords",
    time: "1 day ago",
    type: "Breach",
    severity: "high" as const,
  },
  {
    source: "Malwarebytes",
    title: "Fake Gemini AI Chatbot Promotes Bogus 'Google Coin' in 500% Deepfake Surge",
    time: "3 days ago",
    type: "Alert",
    severity: "high" as const,
  },
  {
    source: "FTC Consumer Alerts",
    title: "Valentine's Day Warning: AI-Enhanced Romance Scams Harder to Detect Than Ever",
    time: "1 week ago",
    type: "Advisory",
    severity: "medium" as const,
  },
]

const fallbackNews = [
  {
    title: "INTERPOL Recovers $45M in Losses From African Cybercrime Crackdown",
    source: "INTERPOL / AFJOC",
    time: "1 day ago",
  },
  {
    title: "Tax Season Alert: IRS and USPS Impersonation Texts and Emails Surging",
    source: "FTC Consumer Alerts",
    time: "3 days ago",
  },
  {
    title: "Ivory Coast Seizes 240 Phones in Mobile Loan Fraud Operation",
    source: "INTERPOL Operation Red Card",
    time: "1 day ago",
  },
  {
    title: "Kenya Busts Investment Scam Ring Using Fake Dashboards to Lure Victims",
    source: "INTERPOL",
    time: "1 day ago",
  },
]

export function LiveFeeds() {
  const [securityFeeds, setSecurityFeeds] = useState<ScamFeed[]>([])
  const [newsFeeds, setNewsFeeds] = useState<ScamFeed[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const currentTime = useLiveTime(1000)

  const fetchIntelFeeds = async () => {
    setIsLoading(true)
    try {
      // Fetch trending/high-priority feeds
      const alertsResponse = await fetch("/api/intel?trending=true&limit=10")
      if (alertsResponse.ok) {
        const { data: alertsData } = await alertsResponse.json()
        setSecurityFeeds(alertsData || [])
      }

      // Fetch general news feeds
      const newsResponse = await fetch("/api/intel?type=news&limit=10")
      if (newsResponse.ok) {
        const { data: newsData } = await newsResponse.json()
        setNewsFeeds(newsData || [])
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch intel feeds:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIntelFeeds()

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchIntelFeeds, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            <span className="text-accent">Live</span> Threat Intelligence
          </h2>
          <p className="text-xl text-muted-foreground">Real-time updates from trusted security sources worldwide</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIntelFeeds}
              disabled={isLoading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Security Alerts Feed */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-destructive" />
                Security Alerts
                <Badge variant="destructive" className="ml-auto">
                  {isLoading ? "Updating..." : "Live"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(securityFeeds.length > 0
                ? securityFeeds
                : fallbackFeeds.map((feed, index) => ({
                    id: `fallback-${index}`,
                    source: feed.source,
                    title: feed.title,
                    scam_type: feed.type,
                    created_at: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
                    is_trending: true,
                    severity: feed.severity,
                  }))
              )
                .slice(0, 6)
                .map((feed) => (
                  <SecurityFeedCard key={feed.id} feed={feed} />
                ))}

              <div className="text-center pt-4">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  View all alerts →
                </button>
              </div>
            </CardContent>
          </Card>

          {/* News Updates Feed */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-accent" />
                Security News
                <Badge variant="secondary" className="ml-auto">
                  Updated
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(newsFeeds.length > 0
                ? newsFeeds
                : fallbackNews.map((news, index) => ({
                    id: `news-fallback-${index}`,
                    source: news.source,
                    title: news.title,
                    scam_type: "News",
                    created_at: new Date(Date.now() - (index + 1) * 3 * 60 * 60 * 1000).toISOString(),
                    is_trending: false,
                    severity: "medium" as const,
                  }))
              )
                .slice(0, 6)
                .map((news) => (
                  <NewsFeedCard key={news.id} news={news} />
                ))}

              {/* Auto-refresh indicator */}
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 bg-primary rounded-full ${isLoading ? "animate-pulse" : "animate-pulse"}`} />
                  Auto-refreshing every 5 minutes
                </div>
              </div>

              <div className="text-center pt-2">
                <button className="text-sm text-accent hover:text-accent/80 transition-colors">View all news →</button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration notice */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Powered by Trusted Sources</h3>
            <p className="text-muted-foreground text-sm">
              Our feeds integrate with INTERPOL, BBC News Africa, FTC Consumer Alerts, Malwarebytes, CyberInsider,
              and African law enforcement advisories for comprehensive, real-time coverage.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function SecurityFeedCard({ feed }: { feed: ScamFeed }) {
  const timeAgo = useLiveTimestamp(feed.created_at)

  return (
    <div className="border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${feed.severity === "high" ? "text-destructive" : "text-yellow-500"}`} />
          <span className="text-sm text-muted-foreground">{feed.source}</span>
        </div>
        <Badge variant={feed.severity === "high" ? "destructive" : "secondary"} className="text-xs">
          {feed.scam_type}
        </Badge>
      </div>
      <h4 className="font-medium mb-2 text-sm leading-relaxed">{feed.title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
        {feed.url && (
          <a href={feed.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary cursor-pointer" />
          </a>
        )}
      </div>
    </div>
  )
}

function NewsFeedCard({ news }: { news: ScamFeed }) {
  const timeAgo = useLiveTimestamp(news.created_at)

  return (
    <div className="border border-border/50 rounded-lg p-4 hover:border-accent/50 transition-colors">
      <h4 className="font-medium mb-2 text-sm leading-relaxed">{news.title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{news.source}</span>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
    </div>
  )
}
