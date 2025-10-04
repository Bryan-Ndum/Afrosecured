"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, MapPin } from "lucide-react"

interface ScamFeed {
  id: string
  title: string
  description: string | null
  source: string
  scam_type: string
  severity: string
  location: string | null
  created_at: string
}

interface TrendingAlertsProps {
  feeds: ScamFeed[]
}

const severityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function TrendingAlerts({ feeds }: TrendingAlertsProps) {
  if (feeds.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400">No trending alerts at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {feeds.map((feed) => (
        <Card
          key={feed.id}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30 hover:border-red-500/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={severityColors[feed.severity as keyof typeof severityColors]}>
                    {feed.severity.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-red-400 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2 leading-tight">{feed.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {feed.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {feed.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                    {feed.source}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
