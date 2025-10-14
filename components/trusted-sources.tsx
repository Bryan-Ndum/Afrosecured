"use client"

import { useState } from "react"
import useSWR from "swr"
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
  Brain,
  Zap,
  CheckCircle2,
} from "lucide-react"

interface Article {
  id: string
  title: string
  link: string
  pub_date: string
  description: string
  source: string
  category: string
  content: string
  ai_summary?: string
  threat_level?: "critical" | "high" | "medium" | "low" | "info"
  threat_indicators?: string[]
  affected_platforms?: string[]
  cve_ids?: string[]
  iocs?: {
    ips?: string[]
    domains?: string[]
    hashes?: string[]
    urls?: string[]
  }
  recommendations?: string[]
  tags?: string[]
  ai_processed: boolean
  ai_processed_at?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TrustedSources() {
  const { data, error, isLoading, mutate } = useSWR("/api/articles", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  const [expandedArticles, setExpandedArticles] = useState<{ [key: string]: boolean }>({})

  const handleRefresh = async () => {
    await mutate()
  }

  const toggleArticle = (articleId: string) => {
    setExpandedArticles((prev) => ({ ...prev, [articleId]: !prev[articleId] }))
  }

  const getThreatLevelColor = (level?: string) => {
    switch (level) {
      case "critical":
        return "bg-red-600/10 border-red-600/30 text-red-600"
      case "high":
        return "bg-orange-500/10 border-orange-500/30 text-orange-600"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-600"
      case "low":
        return "bg-blue-500/10 border-blue-500/30 text-blue-600"
      case "info":
        return "bg-gray-500/10 border-gray-500/30 text-gray-600"
      default:
        return "bg-secondary"
    }
  }

  const getThreatBorderColor = (level?: string) => {
    switch (level) {
      case "critical":
        return "border-l-red-600"
      case "high":
        return "border-l-orange-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-blue-500"
      case "info":
        return "border-l-gray-500"
      default:
        return "border-l-primary"
    }
  }

  const articles: Article[] = data?.articles || []
  const aiProcessedCount = articles.filter((a) => a.ai_processed).length

  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">AI-Powered Threat Intelligence</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Real-time cybersecurity updates with machine learning-powered threat analysis, risk assessment, and
            actionable recommendations
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button onClick={handleRefresh} disabled={isLoading} size="lg" className="gap-2">
              {isLoading ? (
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
            {data?.lastUpdated && (
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <Badge variant="outline" className="gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Auto-updates every hour
            </Badge>
            {aiProcessedCount > 0 && (
              <Badge variant="outline" className="gap-2 bg-primary/5">
                <Brain className="w-4 h-4 text-primary" />
                {aiProcessedCount} AI-analyzed
              </Badge>
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

        {articles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Latest Security Updates</h3>
              <Badge variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                GPT-4 Powered Analysis
              </Badge>
            </div>
            {articles.map((article) => (
              <Card
                key={article.id}
                className={`p-6 hover:shadow-lg transition-shadow border-l-4 rounded-2xl ${getThreatBorderColor(article.threat_level)}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline">{article.category}</Badge>
                        {article.threat_level && (
                          <Badge className={getThreatLevelColor(article.threat_level)}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {article.threat_level.toUpperCase()}
                          </Badge>
                        )}
                        {article.ai_processed && (
                          <Badge variant="outline" className="gap-1 bg-primary/5">
                            <Brain className="w-3 h-3" />
                            AI Analyzed
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.pub_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(article.pub_date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{article.ai_summary || article.description}</p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {article.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Source: {article.source}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          Read Article
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      {article.ai_processed && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleArticle(article.id)}
                          className="gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          {expandedArticles[article.id] ? "Hide" : "View"} Intelligence
                        </Button>
                      )}
                    </div>
                  </div>

                  {expandedArticles[article.id] && article.ai_processed && (
                    <div className="mt-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold mb-1 flex items-center gap-2">
                            AI Threat Intelligence Report
                            {article.threat_level && (
                              <Badge className={getThreatLevelColor(article.threat_level)} variant="outline">
                                {article.threat_level.toUpperCase()} THREAT
                              </Badge>
                            )}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Analyzed by GPT-4 •{" "}
                            {article.ai_processed_at
                              ? new Date(article.ai_processed_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }) +
                                " at " +
                                new Date(article.ai_processed_at).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "Recently"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Threat Indicators */}
                        {article.threat_indicators && article.threat_indicators.length > 0 && (
                          <div>
                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              Threat Indicators
                            </h6>
                            <ul className="space-y-2 pl-6">
                              {article.threat_indicators.map((indicator, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5">⚠</span>
                                  <span>{indicator}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Affected Platforms */}
                        {article.affected_platforms && article.affected_platforms.length > 0 && (
                          <div>
                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-orange-500" />
                              Affected Platforms
                            </h6>
                            <div className="flex flex-wrap gap-2 pl-6">
                              {article.affected_platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="bg-orange-500/5">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CVE IDs */}
                        {article.cve_ids && article.cve_ids.length > 0 && (
                          <div>
                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                              <Database className="w-4 h-4 text-purple-500" />
                              CVE Identifiers
                            </h6>
                            <div className="flex flex-wrap gap-2 pl-6">
                              {article.cve_ids.map((cve) => (
                                <Badge key={cve} variant="outline" className="bg-purple-500/5 font-mono text-xs">
                                  <a
                                    href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {cve}
                                  </a>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Indicators of Compromise */}
                        {article.iocs &&
                          (article.iocs.ips?.length ||
                            article.iocs.domains?.length ||
                            article.iocs.hashes?.length ||
                            article.iocs.urls?.length) && (
                            <div>
                              <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                Indicators of Compromise (IOCs)
                              </h6>
                              <div className="space-y-3 pl-6">
                                {article.iocs.ips && article.iocs.ips.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Malicious IPs:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {article.iocs.ips.map((ip) => (
                                        <code
                                          key={ip}
                                          className="text-xs bg-red-500/10 px-2 py-1 rounded border border-red-500/20"
                                        >
                                          {ip}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {article.iocs.domains && article.iocs.domains.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Malicious Domains:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {article.iocs.domains.map((domain) => (
                                        <code
                                          key={domain}
                                          className="text-xs bg-red-500/10 px-2 py-1 rounded border border-red-500/20"
                                        >
                                          {domain}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {article.iocs.hashes && article.iocs.hashes.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">File Hashes:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {article.iocs.hashes.map((hash) => (
                                        <code
                                          key={hash}
                                          className="text-xs bg-red-500/10 px-2 py-1 rounded border border-red-500/20 font-mono"
                                        >
                                          {hash.substring(0, 16)}...
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                        {/* Security Recommendations */}
                        {article.recommendations && article.recommendations.length > 0 && (
                          <div>
                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-500" />
                              Security Recommendations
                            </h6>
                            <ul className="space-y-2 pl-6">
                              {article.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 mt-4 border-t border-border/50">
                        <AlertTriangle className="w-3 h-3" />
                        <span>
                          AI-extracted intelligence from article content. Always verify critical information from
                          official sources.
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
          <Card className="p-6 rounded-2xl hover:shadow-lg transition-all bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-500" />
              Elite Cybersecurity News
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.darkreading.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="font-medium">Dark Reading</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground mt-1">Enterprise security & threat intelligence</p>
              </li>
              <li>
                <a
                  href="https://krebsonsecurity.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="font-medium">Krebs on Security</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground mt-1">Investigative cybercrime journalism</p>
              </li>
              <li>
                <a
                  href="https://www.bleepingcomputer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="font-medium">BleepingComputer</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground mt-1">Breaking news & technical fixes</p>
              </li>
              <li>
                <a
                  href="https://thehackernews.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="font-medium">The Hacker News</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground mt-1">Real-time cyber incidents & exploits</p>
              </li>
            </ul>
          </Card>

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
