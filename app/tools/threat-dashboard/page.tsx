"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function ThreatDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/tools/threat-stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("[v0] Failed to fetch threat stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading threat intelligence...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Live Threat Intelligence Dashboard</h1>
          <p className="text-lg text-muted-foreground">Real-time global scam activity and threat analytics</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Threats</p>
            <p className="text-3xl font-bold text-foreground">{stats?.totalThreats || 0}</p>
            <p className="text-xs text-emerald-500 mt-1">+{stats?.newToday || 0} today</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Scams</p>
            <p className="text-3xl font-bold text-foreground">{stats?.activeScams || 0}</p>
            <p className="text-xs text-amber-500 mt-1">Trending now</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Countries Affected</p>
            <p className="text-3xl font-bold text-foreground">{stats?.countriesAffected || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Global reach</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Reports Today</p>
            <p className="text-3xl font-bold text-foreground">{stats?.reportsToday || 0}</p>
            <p className="text-xs text-emerald-500 mt-1">Community driven</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Top Threat Types</h3>
            <div className="space-y-3">
              {stats?.topTypes?.map((type: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{type.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(type.count / stats.totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-12 text-right">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Threats</h3>
            <div className="space-y-3">
              {stats?.recentThreats?.map((threat: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      threat.severity === "Critical"
                        ? "bg-red-500"
                        : threat.severity === "High"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{threat.title}</p>
                    <p className="text-xs text-muted-foreground">{threat.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
