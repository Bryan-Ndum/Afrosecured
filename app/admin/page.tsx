"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, Activity, AlertTriangle, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const [articleStats, setArticleStats] = useState<any>(null)
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, healthRes] = await Promise.all([
        fetch("/api/admin/article-stats"),
        fetch("/api/admin/system-health"),
      ])

      const [articlesData, healthData] = await Promise.all([articlesRes.json(), healthRes.json()])

      setArticleStats(articlesData)
      setSystemHealth(healthData)
    } catch (error) {
      console.error("[v0] Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const triggerManualUpdate = async () => {
    setRefreshing(true)
    try {
      const response = await fetch("/api/cron/update-articles", {
        method: "POST",
      })

      if (response.ok) {
        alert("Articles updated successfully!")
        fetchDashboardData()
      } else {
        alert("Failed to update articles")
      }
    } catch (error) {
      console.error("[v0] Manual update error:", error)
      alert("Error triggering update")
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor system health and article updates</p>
          </div>
          <Button onClick={triggerManualUpdate} disabled={refreshing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Updating..." : "Update Articles Now"}
          </Button>
        </div>

        {/* System Health */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">System Status</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{systemHealth?.status || "Healthy"}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Database</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{systemHealth?.database || "Connected"}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">API Status</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{systemHealth?.api || "Operational"}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Errors (24h)</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{systemHealth?.errors24h || 0}</p>
          </Card>
        </div>

        {/* Article Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Article Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Articles</span>
                <span className="text-2xl font-bold text-foreground">{articleStats?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last 24 Hours</span>
                <span className="text-lg font-semibold text-emerald-500">+{articleStats?.last24h || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Update</span>
                <span className="text-sm text-muted-foreground">
                  {articleStats?.lastUpdate ? new Date(articleStats.lastUpdate).toLocaleString() : "Never"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Articles by Source</h2>
            <div className="space-y-3">
              {articleStats?.bySource?.map((source: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{source.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(source.count / articleStats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-12 text-right">{source.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Articles */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Articles</h2>
          <div className="space-y-3">
            {articleStats?.recent?.map((article: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                  >
                    {article.title}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{article.source}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cron Job Info */}
        <Card className="p-6 mt-6 border-primary/30">
          <h2 className="text-xl font-bold text-foreground mb-2">Automatic Updates</h2>
          <p className="text-muted-foreground mb-4">
            Articles are automatically fetched every hour via Vercel Cron Jobs. The system pulls from 4 trusted
            cybersecurity sources and stores them in the database for fast access.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Next scheduled update: {systemHealth?.nextCronRun || "In progress..."}</span>
          </div>
        </Card>
      </div>
    </main>
  )
}
