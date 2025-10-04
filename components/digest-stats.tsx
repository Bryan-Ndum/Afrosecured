import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Shield } from "lucide-react"

interface DigestStatsProps {
  stats: {
    subscribers: number
    weeklyReports: number
    weeklyFeeds: number
  }
}

export function DigestStats({ stats }: DigestStatsProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Digest Impact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-slate-300">Active Subscribers</span>
          </div>
          <span className="text-white font-semibold">{stats.subscribers.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-slate-300">Weekly Reports</span>
          </div>
          <span className="text-white font-semibold">{stats.weeklyReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-teal-400" />
            <span className="text-slate-300">Threats Tracked</span>
          </div>
          <span className="text-white font-semibold">{stats.weeklyFeeds}</span>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400 mb-1">98%</div>
            <div className="text-xs text-slate-400">Subscriber satisfaction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
