"use client"

import { Progress } from "@/components/ui/progress"

interface SocialStatsProps {
  stats: Record<string, number>
}

const platformColors = {
  twitter: "bg-blue-500",
  reddit: "bg-orange-500",
  facebook: "bg-blue-600",
}

export function SocialStats({ stats }: SocialStatsProps) {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0)

  if (total === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-400 text-sm">No activity data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(stats).map(([platform, count]) => {
        const percentage = (count / total) * 100

        return (
          <div key={platform} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${platformColors[platform as keyof typeof platformColors] || "bg-slate-500"}`}
                />
                <span className="text-slate-300 text-sm capitalize">{platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">{count}</span>
                <span className="text-slate-500 text-xs">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      })}

      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Total Mentions</span>
          <span className="text-white font-semibold">{total}</span>
        </div>
      </div>
    </div>
  )
}
