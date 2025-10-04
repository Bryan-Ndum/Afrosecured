import { createClient } from "@/lib/supabase/server"
import { SocialFeed } from "@/components/social-feed"
import { PlatformFilter } from "@/components/platform-filter"
import { SocialStats } from "@/components/social-stats"
import { Suspense } from "react"

export default async function SocialPage() {
  const supabase = await createClient()

  // Fetch social media mentions
  const { data: socialMentions } = await supabase
    .from("social_mentions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  // Get platform stats
  const { data: platformStats } = await supabase
    .from("social_mentions")
    .select("platform")
    .order("created_at", { ascending: false })

  const stats = platformStats?.reduce(
    (acc, mention) => {
      acc[mention.platform] = (acc[mention.platform] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Social Intelligence</h1>
              <p className="text-slate-400">Community discussions and social media mentions about scams</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Social Monitoring Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Social Feed */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Community Discussions</h2>
                <div className="text-sm text-slate-400">{socialMentions?.length || 0} recent mentions</div>
              </div>
              <Suspense fallback={<div className="text-slate-400">Loading social feed...</div>}>
                <SocialFeed mentions={socialMentions || []} />
              </Suspense>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform Filter */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter by Platform</h3>
              <PlatformFilter />
            </div>

            {/* Social Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Platform Activity</h3>
              <SocialStats stats={stats || {}} />
            </div>

            {/* Trending Keywords */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Keywords</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">#romance_scam</span>
                  <span className="text-red-400 text-xs">+45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">#crypto_fraud</span>
                  <span className="text-orange-400 text-xs">+32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">#tech_support</span>
                  <span className="text-yellow-400 text-xs">+18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">#phishing</span>
                  <span className="text-blue-400 text-xs">+12%</span>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Community Guidelines</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <p>• Share experiences to help others</p>
                <p>• Protect personal information</p>
                <p>• Report suspicious content</p>
                <p>• Be respectful and supportive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
