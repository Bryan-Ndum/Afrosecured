import { createClient } from "@/lib/supabase/server"
import { IntelligenceFeed } from "@/components/intelligence-feed"
import { TrendingAlerts } from "@/components/trending-alerts"
import { ScamTypeFilter } from "@/components/scam-type-filter"
import { Suspense } from "react"

export default async function IntelPage() {
  const supabase = await createClient()

  // Fetch trending scam feeds
  const { data: trendingFeeds } = await supabase
    .from("scam_feeds")
    .select("*")
    .eq("is_trending", true)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent scam feeds
  const { data: recentFeeds } = await supabase
    .from("scam_feeds")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Scam Intelligence</h1>
              <p className="text-slate-400">Real-time threat intelligence from global sources</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Feed Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trending Alerts */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Trending Threats
              </h2>
              <Suspense fallback={<div className="text-slate-400">Loading trending alerts...</div>}>
                <TrendingAlerts feeds={trendingFeeds || []} />
              </Suspense>
            </section>

            {/* Intelligence Feed */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Latest Intelligence</h2>
              <Suspense fallback={<div className="text-slate-400">Loading intelligence feed...</div>}>
                <IntelligenceFeed feeds={recentFeeds || []} />
              </Suspense>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter by Type</h3>
              <ScamTypeFilter />
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Threat Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Threats</span>
                  <span className="text-red-400 font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Countries Affected</span>
                  <span className="text-yellow-400 font-semibold">54</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reports Today</span>
                  <span className="text-green-400 font-semibold">89</span>
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Intelligence Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">BBC News</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">FTC Alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Reddit r/Scams</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">User Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
