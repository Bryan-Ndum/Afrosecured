"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Globe, Hash } from "lucide-react"

interface ThreatIndicator {
  id: string
  indicator_type: string
  indicator_value: string
  threat_type: string
  severity: string
  source: string
  description: string
  last_seen: string
  confidence_score: number
}

export function ThreatIndicatorsFeed() {
  const [indicators, setIndicators] = useState<ThreatIndicator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIndicators()
    const interval = setInterval(fetchIndicators, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchIndicators = async () => {
    try {
      const response = await fetch("/api/threat-indicators?limit=10")
      const data = await response.json()
      setIndicators(data.indicators || [])
    } catch (error) {
      console.error("Failed to fetch threat indicators:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "ip":
        return <Globe className="w-4 h-4" />
      case "domain":
      case "url":
        return <Globe className="w-4 h-4" />
      case "hash":
        return <Hash className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading threat indicators...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold">Live Threat Indicators</h2>
        <Badge variant="outline" className="ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          Live
        </Badge>
      </div>

      <div className="grid gap-3">
        {indicators.map((indicator) => (
          <Card key={indicator.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                {getIcon(indicator.indicator_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getSeverityColor(indicator.severity)}>{indicator.severity}</Badge>
                  <Badge variant="outline">{indicator.threat_type}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{indicator.source}</span>
                </div>

                <code className="text-sm font-mono bg-muted px-2 py-1 rounded block truncate mb-2">
                  {indicator.indicator_value}
                </code>

                {indicator.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{indicator.description}</p>
                )}

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Confidence: {indicator.confidence_score}%</span>
                  <span>Last seen: {new Date(indicator.last_seen).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
