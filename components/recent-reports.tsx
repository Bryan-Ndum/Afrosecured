import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import { useLiveTimestamp } from "@/hooks/use-live-timestamp"

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
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}

function ReportCard({ report }: { report: Report }) {
  const timeAgo = useLiveTimestamp(report.created_at)

  return (
    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="secondary" className={scamTypeColors[report.scam_type as keyof typeof scamTypeColors]}>
          {report.scam_type.replace("_", " ")}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          {timeAgo}
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
  )
}
