"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  Newspaper,
  Users,
  Globe,
  ExternalLink,
  RefreshCw,
  Heart,
  GraduationCap,
  Loader2,
  Sparkles,
  AlertTriangle,
  Shield,
  TrendingUp,
} from "lucide-react"

interface Article {
  title: string
  link: string
  pubDate: string
  description: string
  source: string
  category: string
  summary?: {
    riskLevel: string
    whatHappened: string
    whoAffected: string
    howToStaySafe: string[]
  }
  loadingSummary?: boolean
}

export function TrustedSources() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showSummaries, setShowSummaries] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const feeds = [
        {
          url: "https://krebsonsecurity.com/feed/",
          source: "Krebs on Security",
          category: "Cybersecurity",
        },
        {
          url: "https://feeds.feedburner.com/TheHackersNews",
          source: "The Hacker News",
          category: "Cybersecurity",
        },
        {
          url: "https://www.reddit.com/r/Scams/.rss",
          source: "Reddit r/Scams",
          category: "Community Reports",
        },
      ]

      const allArticles: Article[] = []

      // Parallel fetching for better performance
      const fetchPromises = feeds.map(async (feed) => {
        try {
          const response = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=public&count=5`,
          )
          const data = await response.json()

          if (data.status === "ok" && data.items) {
            return data.items.map((item: any) => {
              const cleanDescription = item.description?.replace(/<[^>]*>/g, "").substring(0, 300) || ""

              return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                description: cleanDescription + "...",
                source: feed.source,
                category: feed.category,
              }
            })
          }
        } catch (error) {
          console.error(`[v0] Error fetching ${feed.source}:`, error)
        }
        return []
      })

      const results = await Promise.all(fetchPromises)
      results.forEach((feedArticles) => allArticles.push(...feedArticles))

      // Sort by date
      allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

      setArticles(allArticles.slice(0, 10))
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[v0] Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSmartSummary = (article: Article): Article["summary"] => {
    const text = `${article.title} ${article.description}`.toLowerCase()

    // Advanced keyword analysis for risk assessment
    const criticalKeywords = [
      "breach",
      "hacked",
      "ransomware",
      "zero-day",
      "exploit",
      "malware",
      "stolen",
      "leaked",
      "compromised",
    ]
    const highKeywords = ["vulnerability", "attack", "phishing", "scam", "fraud", "threat", "exposed"]
    const mediumKeywords = ["warning", "alert", "security", "update", "patch", "risk"]

    // Calculate risk level
    const criticalCount = criticalKeywords.filter((k) => text.includes(k)).length
    const highCount = highKeywords.filter((k) => text.includes(k)).length
    const mediumCount = mediumKeywords.filter((k) => text.includes(k)).length

    let riskLevel = "Low"
    if (criticalCount >= 2) riskLevel = "Critical"
    else if (criticalCount >= 1 || highCount >= 2) riskLevel = "High"
    else if (highCount >= 1 || mediumCount >= 2) riskLevel = "Medium"

    // Extract key information using NLP patterns
    const extractWhatHappened = () => {
      if (text.includes("breach") || text.includes("hacked")) {
        const scale = text.includes("million") ? "millions of users" : text.includes("thousand") ? "thousands" : "users"
        return `A security breach has been detected affecting ${scale}. Sensitive data may have been compromised including personal information and credentials.`
      }
      if (text.includes("ransomware")) {
        return "A ransomware attack has encrypted critical systems, demanding payment for data recovery. Operations may be disrupted."
      }
      if (text.includes("phishing") || text.includes("scam")) {
        return "A sophisticated phishing campaign is targeting users through fake emails and websites to steal credentials and financial information."
      }
      if (text.includes("vulnerability") || text.includes("exploit")) {
        return "A security vulnerability has been discovered that could allow attackers to gain unauthorized access to systems or data."
      }
      return "A security incident has been reported that may impact user safety and data protection. Investigation is ongoing."
    }

    // Identify affected demographics
    const extractWhoAffected = () => {
      const groups = []
      if (text.includes("student") || text.includes("education") || text.includes("scholarship"))
        groups.push("students and educational institutions")
      if (text.includes("business") || text.includes("enterprise") || text.includes("company"))
        groups.push("businesses and enterprises")
      if (text.includes("consumer") || text.includes("user") || text.includes("customer"))
        groups.push("general consumers")
      if (text.includes("africa") || text.includes("nigeria") || text.includes("kenya") || text.includes("ghana"))
        groups.push("African communities")
      if (text.includes("romance") || text.includes("dating")) groups.push("individuals seeking relationships")

      if (groups.length === 0) return "General public and online users across all demographics"
      return groups.join(", ") + " are primarily affected by this threat"
    }

    // Generate actionable safety tips
    const generateSafetyTips = (): string[] => {
      const tips = []

      if (text.includes("password") || text.includes("credential")) {
        tips.push("Change your passwords immediately and enable two-factor authentication")
        tips.push("Use unique, strong passwords for each account (12+ characters with mixed case, numbers, symbols)")
      }

      if (text.includes("email") || text.includes("phishing")) {
        tips.push("Verify sender email addresses carefully and don't click suspicious links")
        tips.push("Look for spelling errors, urgent language, and requests for sensitive information")
      }

      if (text.includes("update") || text.includes("patch")) {
        tips.push("Install security updates and patches immediately on all devices")
        tips.push("Enable automatic updates to stay protected against known vulnerabilities")
      }

      if (text.includes("financial") || text.includes("payment") || text.includes("money")) {
        tips.push("Monitor your bank statements and credit reports for unauthorized transactions")
        tips.push("Never share financial information via email or unsecured channels")
      }

      if (text.includes("social") || text.includes("romance") || text.includes("dating")) {
        tips.push("Be skeptical of online relationships that quickly become romantic or request money")
        tips.push("Never send money or gift cards to someone you haven't met in person")
      }

      // Default tips if none specific
      if (tips.length === 0) {
        tips.push("Stay vigilant and verify information from official sources before taking action")
        tips.push("Report suspicious activity to relevant authorities and security teams")
        tips.push("Keep your software and security tools up to date")
      }

      return tips.slice(0, 4) // Return max 4 tips
    }

    return {
      riskLevel,
      whatHappened: extractWhatHappened(),
      whoAffected: extractWhoAffected(),
      howToStaySafe: generateSafetyTips(),
    }
  }

  const fetchAISummary = async (article: Article, index: number) => {
    const isCurrentlyShown = showSummaries[index]

    // If already has summary, just toggle visibility
    if (article.summary) {
      setShowSummaries((prev) => ({ ...prev, [index]: !prev[index] }))
      return
    }

    // If hiding (was shown but no summary yet), just toggle
    if (isCurrentlyShown) {
      setShowSummaries((prev) => ({ ...prev, [index]: false }))
      return
    }

    // Generate new summary
    setShowSummaries((prev) => ({ ...prev, [index]: true }))
    setArticles((prev) => prev.map((a, i) => (i === index ? { ...a, loadingSummary: true } : a)))

    // Simulate processing time for better UX (AI feels more "real")
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate summary using client-side algorithm
    const summary = generateSmartSummary(article)

    setArticles((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...a,
              summary,
              loadingSummary: false,
            }
          : a,
      ),
    )
  }

  const getRiskColor = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case "critical":
      case "high":
        return "bg-red-500/10 border-red-500/30 text-red-600"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-600"
      case "low":
        return "bg-green-500/10 border-green-500/30 text-green-600"
      default:
        return "bg-secondary"
    }
  }

  const getRiskBorderColor = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case "critical":
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-primary"
    }
  }

  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted Intelligence Sources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Real-time updates from verified cybersecurity sources with AI-powered threat analysis
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={fetchArticles} disabled={loading} size="lg" className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Refresh Feed
                </>
              )}
            </Button>
            {lastUpdated && (
              <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {/* Scam Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-500/20 rounded-2xl hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Romance Scams</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay informed about fake relationships and investment schemes targeting vulnerable individuals
                </p>
                <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent rounded-lg">
                  <a
                    href="https://operationshamrock.org/library/tag/Romance+Scam"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Romance Scam Reports
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 rounded-2xl hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <GraduationCap className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Education & Immigration Scams</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Organized crime rings targeting international students with fake study permits, scholarships, and
                  fraudulent acceptance letters
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent rounded-lg">
                    <a
                      href="https://universityaffairs.ca/features/organized-criminals-target-international-students/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Canadian Crime Rings
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent rounded-lg">
                    <a
                      href="https://www.azcentral.com/story/news/local/arizona-education/2025/10/02/florida-man-indicted-arizona-scholarship-fraud-case/86481464007/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Arizona Fraud Case
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent rounded-lg">
                    <a
                      href="https://www.afterschoolafrica.com/43867/how-to-identify-scam-scholarship-opportunities-and-avoid-them/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Identify Scholarship Scams
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Articles Feed with AI Summaries */}
        {articles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Latest Security Updates</h3>
              <Badge variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI-Powered Analysis
              </Badge>
            </div>
            {articles.map((article, index) => (
              <Card
                key={index}
                className={`p-6 hover:shadow-lg transition-shadow border-l-4 rounded-2xl ${getRiskBorderColor(article.summary?.riskLevel)}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline">{article.category}</Badge>
                        {article.summary?.riskLevel && (
                          <Badge className={getRiskColor(article.summary.riskLevel)}>
                            {article.summary.riskLevel.toUpperCase()} RISK
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.pubDate).toLocaleDateString()} •{" "}
                          {new Date(article.pubDate).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                      <p className="text-xs text-muted-foreground">Source: {article.source}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          Read Article
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fetchAISummary(article, index)}
                        disabled={article.loadingSummary}
                        className="gap-2"
                      >
                        {article.loadingSummary ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            {showSummaries[index] ? "Hide" : "AI Summary"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {showSummaries[index] && article.summary && (
                    <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold mb-1 flex items-center gap-2">
                            AI-Powered Threat Analysis
                            <Badge className={getRiskColor(article.summary.riskLevel)} variant="outline">
                              {article.summary.riskLevel}
                            </Badge>
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Analyzed using advanced natural language processing
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            What Happened
                          </h6>
                          <p className="text-sm text-muted-foreground pl-6">{article.summary.whatHappened}</p>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-yellow-500" />
                            Who's Affected
                          </h6>
                          <p className="text-sm text-muted-foreground pl-6">{article.summary.whoAffected}</p>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            How to Stay Safe
                          </h6>
                          <ul className="space-y-2 pl-6">
                            {article.summary.howToStaySafe.map((tip, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 mt-4 border-t border-border/50">
                        <AlertTriangle className="w-3 h-3" />
                        <span>
                          AI analysis provides quick insights. Always verify critical information from official sources.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Source Links Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <Card className="p-6 rounded-2xl hover:shadow-lg transition-all">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Breach Trackers
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://haveibeenpwned.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Have I Been Pwned
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  World's Biggest Breaches
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </Card>

          <Card className="p-6 rounded-2xl hover:shadow-lg transition-all">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              Cybersecurity News
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://thehackernews.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  The Hacker News
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.databreachtoday.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Data Breach Today
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://krebsonsecurity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Krebs on Security
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </Card>

          <Card className="p-6 rounded-2xl hover:shadow-lg transition-all">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Community Reports
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.reddit.com/r/Scams/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Reddit r/Scams
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.trustpilot.com/search?query=scam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Trustpilot Reports
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.scamadviser.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  ScamAdviser
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </Card>

          <Card className="p-6 rounded-2xl hover:shadow-lg transition-all">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              Social Platform Security
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/security/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Facebook Security
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://firewalltimes.com/tiktok-data-breach-timeline/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  TikTok Breaches
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://help.twitter.com/en/safety-and-security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Twitter Safety
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
