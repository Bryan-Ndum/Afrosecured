import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

interface Report {
  id: string
  scam_type: string
  title: string
  location: string | null
  created_at: string
  status: string
}

interface RecentReportsProps {
  reports: Report[]
}

const scamTypeColors = {
  romance: "bg-pink-500/20 text-pink-400",
  investment: "bg-green-500/20 text-green-400",
  tech_support: "bg-blue-500/20 text-blue-400",
  phishing: "bg-purple-500/20 text-purple-400",
  employment: "bg-cyan-500/20 text-cyan-400",
  other: "bg-gray-500/20 text-gray-400",
}

export function RecentReports({ reports }: RecentReportsProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    return `${diffInDays}d ago`
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-400 text-sm">No recent reports available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary" className={scamTypeColors[report.scam_type as keyof typeof scamTypeColors]}>
              {report.scam_type.replace("_", " ")}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(report.created_at)}
            </div>
          </div>
          <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">{report.title}</h4>
          {report.location && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {report.location}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
