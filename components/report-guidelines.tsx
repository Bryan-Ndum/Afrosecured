import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Users, AlertTriangle } from "lucide-react"

export function ReportGuidelines() {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-400" />
          Reporting Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-white">Be Detailed</h4>
              <p className="text-xs text-slate-400">
                Provide as much information as possible about the scam, including dates, methods, and red flags.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-white">Protect Privacy</h4>
              <p className="text-xs text-slate-400">
                Don't include personal information like phone numbers, addresses, or financial details.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-white">Stay Safe</h4>
              <p className="text-xs text-slate-400">
                If you're currently being targeted, contact local authorities immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-sm font-medium text-white mb-2">What Happens Next?</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p>1. Your report is reviewed by our team</p>
            <p>2. Verified reports are added to our database</p>
            <p>3. Information helps protect others</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
