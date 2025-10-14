"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, AlertTriangle, TrendingUp, MapPin, Clock } from "lucide-react"
import { useLiveTimestamp } from "@/hooks/use-live-timestamp"

interface ScamFeed {
  id: string
  title: string
  description: string | null
  source: string
  source_url: string | null
  scam_type: string
  severity: string
  location: string | null
  tags: string[] | null
  is_trending: boolean
  created_at: string
}

interface IntelligenceFeedProps {
  feeds: ScamFeed[]
}

const severityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
}

const scamTypeColors = {
  romance: "bg-pink-500/20 text-pink-400",
  investment: "bg-green-500/20 text-green-400",
  tech_support: "bg-blue-500/20 text-blue-400",
  phishing: "bg-purple-500/20 text-purple-400",
  employment: "bg-cyan-500/20 text-cyan-400",
  other: "bg-gray-500/20 text-gray-400",
}

export function IntelligenceFeed({ feeds }: IntelligenceFeedProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredFeeds = selectedType ? feeds.filter((feed) => feed.scam_type === selectedType) : feeds

  return (
    <div className="space-y-4">
      {filteredFeeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} />
      ))}

      {filteredFeeds.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No intelligence feeds found for the selected criteria.</p>
        </div>
      )}
    </div>
  )
}

function FeedCard({ feed }: { feed: ScamFeed }) {
  const timeAgo = useLiveTimestamp(feed.created_at)

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {feed.is_trending && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </div>
              )}
              <Badge variant="outline" className={severityColors[feed.severity as keyof typeof severityColors]}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {feed.severity.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className={scamTypeColors[feed.scam_type as keyof typeof scamTypeColors]}>
                {feed.scam_type.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight">{feed.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </div>
              {feed.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {feed.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                {feed.source}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {feed.description && <p className="text-slate-300 mb-4 leading-relaxed">{feed.description}</p>}

        {feed.tags && feed.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {feed.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-slate-800 border-slate-700 text-slate-400">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {feed.source_url && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-slate-700 hover:border-slate-600 bg-transparent"
              >
                <a href={feed.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
