import { ReportForm } from "@/components/report-form"
import { ReportGuidelines } from "@/components/report-guidelines"
import { RecentReports } from "@/components/recent-reports"
import { createClient } from "@/lib/supabase/server"

export default async function ReportPage() {
  const supabase = await createClient()

  // Fetch recent verified reports (anonymized)
  const { data: recentReports } = await supabase
    .from("user_reports")
    .select("id, scam_type, title, location, created_at, status")
    .eq("status", "verified")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Report a Scam</h1>
            <p className="text-slate-400">
              Help protect the African community by reporting scams and fraudulent activities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Submit Your Report</h2>
                <ReportForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <ReportGuidelines />

              {/* Recent Reports */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Verified Reports</h3>
                <RecentReports reports={recentReports || []} />
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Emergency?</h3>
                <p className="text-slate-300 text-sm mb-4">
                  If you're currently being scammed or in immediate danger, contact local authorities first.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nigeria:</span>
                    <span className="text-white">199</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">South Africa:</span>
                    <span className="text-white">10111</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kenya:</span>
                    <span className="text-white">999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
