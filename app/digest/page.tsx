import { DigestSignup } from "@/components/digest-signup"
import { DigestPreview } from "@/components/digest-preview"
import { DigestStats } from "@/components/digest-stats"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DigestPage() {
  const supabase = await createClient()

  // Get subscriber count
  const { count: subscriberCount } = await supabase
    .from("digest_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  // Get recent trending feeds for preview
  const { data: trendingFeeds } = await supabase
    .from("scam_feeds")
    .select("*")
    .eq("is_trending", true)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get weekly stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count: weeklyReports } = await supabase
    .from("user_reports")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo.toISOString())

  const { count: weeklyFeeds } = await supabase
    .from("scam_feeds")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo.toISOString())

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Weekly Scam Intelligence Digest</h1>
            <p className="text-slate-400 text-lg">
              Stay informed with weekly summaries of the latest scam trends and threats
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {subscriberCount || 0} subscribers
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Sent every Sunday
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Free forever
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Signup Form */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Subscribe to Weekly Digest</h2>
                <p className="text-slate-400 mb-6">
                  Get the most important scam alerts, trends, and protection tips delivered to your inbox every Sunday.
                </p>
                <DigestSignup />
              </div>

              {/* Preview */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">This Week's Preview</h2>
                <DigestPreview
                  feeds={trendingFeeds || []}
                  weeklyStats={{
                    reports: weeklyReports || 0,
                    feeds: weeklyFeeds || 0,
                    subscribers: subscriberCount || 0,
                  }}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <DigestStats
                stats={{
                  subscribers: subscriberCount || 0,
                  weeklyReports: weeklyReports || 0,
                  weeklyFeeds: weeklyFeeds || 0,
                }}
              />

              {/* Features */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">What You'll Get</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Trending Threats</h4>
                      <p className="text-xs text-slate-400">Latest scam trends affecting African communities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Protection Tips</h4>
                      <p className="text-xs text-slate-400">Actionable advice to stay safe online</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Community Reports</h4>
                      <p className="text-xs text-slate-400">Real experiences from community members</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Regional Focus</h4>
                      <p className="text-xs text-slate-400">Threats specific to African countries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">What Subscribers Say</h3>
                <div className="space-y-4">
                  <blockquote className="text-sm text-slate-300 italic">
                    "The weekly digest helped me identify a romance scam before I lost money. Essential reading!"
                  </blockquote>
                  <div className="text-xs text-slate-500">— Sarah K., Lagos</div>

                  <blockquote className="text-sm text-slate-300 italic">
                    "Clear, actionable information that keeps my family safe online."
                  </blockquote>
                  <div className="text-xs text-slate-500">— Michael T., Johannesburg</div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Privacy Promise</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Your email is never shared</p>
                  <p>• Unsubscribe anytime</p>
                  <p>• No spam, just valuable content</p>
                  <p>• Secure data handling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
