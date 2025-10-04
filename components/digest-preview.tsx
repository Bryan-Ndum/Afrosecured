import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, FileText, AlertTriangle } from "lucide-react"

interface ScamFeed {
  id: string
  title: string
  scam_type: string
  severity: string
  location: string | null
  created_at: string
}

interface DigestPreviewProps {
  feeds: ScamFeed[]
  weeklyStats: {
    reports: number
    feeds: number
    subscribers: number
  }
}

const severityColors = {
  low: "bg-blue-500/20 text-blue-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
}

export function DigestPreview({ feeds, weeklyStats }: DigestPreviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-slate-800">
        <h3 className="text-xl font-semibold text-white mb-2">AfroSecure Weekly Digest</h3>
        <p className="text-slate-400">
          Week of {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{weeklyStats.feeds}</div>
            <div className="text-xs text-slate-400">New Threats</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{weeklyStats.reports}</div>
            <div className="text-xs text-slate-400">Community Reports</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{feeds.length}</div>
            <div className="text-xs text-slate-400">Trending Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Threats */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          This Week's Top Threats
        </h4>
        <div className="space-y-3">
          {feeds.slice(0, 3).map((feed, index) => (
            <Card key={feed.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-500 text-sm">#{index + 1}</span>
                      <Badge variant="outline" className={severityColors[feed.severity as keyof typeof severityColors]}>
                        {feed.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {feed.scam_type.replace("_", " ")}
                      </Badge>
                    </div>
                    <h5 className="text-white font-medium mb-1">{feed.title}</h5>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      {feed.location && <span>{feed.location}</span>}
                      <span>{formatDate(feed.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Protection Tip */}
      <Card className="bg-teal-500/10 border-teal-500/30">
        <CardHeader>
          <CardTitle className="text-teal-400 text-lg">This Week's Protection Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm leading-relaxed">
            <strong>Verify Before You Trust:</strong> Always independently verify any investment opportunity, especially
            those promising high returns. Contact the company directly through official channels, not through links or
            numbers provided by the person contacting you.
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-slate-800">
        <p className="text-slate-400 text-sm">Stay safe, stay informed. Forward this digest to friends and family.</p>
      </div>
    </div>
  )
}
