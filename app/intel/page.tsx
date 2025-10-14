import { createClient } from "@/lib/supabase/server"
import { IntelligenceFeed } from "@/components/intelligence-feed"
import { TrendingAlerts } from "@/components/trending-alerts"
import { ScamTypeFilter } from "@/components/scam-type-filter"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, Shield } from "lucide-react"
import Link from "next/link"

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

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentArticles } = await supabase
    .from("cybersecurity_articles")
    .select("*")
    .gte("pub_date", sevenDaysAgo.toISOString())
    .order("pub_date", { ascending: false })

  const { data: archiveArticles } = await supabase
    .from("cybersecurity_articles")
    .select("*")
    .lt("pub_date", sevenDaysAgo.toISOString())
    .order("pub_date", { ascending: false })
    .limit(50)

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

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Scam Reports & Articles</h2>
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-900 border border-slate-800">
                  <TabsTrigger value="recent" className="data-[state=active]:bg-slate-800">
                    Recent (Last 7 Days)
                  </TabsTrigger>
                  <TabsTrigger value="archive" className="data-[state=active]:bg-slate-800">
                    Archive
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="mt-6 space-y-4">
                  {recentArticles && recentArticles.length > 0 ? (
                    recentArticles.map((article) => <ArticleCard key={article.id} article={article} />)
                  ) : (
                    <div className="text-slate-400 text-center py-8">
                      No recent articles found. Check back soon for updates.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="archive" className="mt-6 space-y-4">
                  {archiveArticles && archiveArticles.length > 0 ? (
                    archiveArticles.map((article) => <ArticleCard key={article.id} article={article} />)
                  ) : (
                    <div className="text-slate-400 text-center py-8">No archived articles available.</div>
                  )}
                </TabsContent>
              </Tabs>
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

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Verified Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-slate-300 text-sm">Gulf News</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-slate-300 text-sm">The Cable Nigeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-slate-300 text-sm">MSN News</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-slate-300 text-sm">BBC News</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-slate-300 text-sm">FTC Alerts</span>
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

function ArticleCard({ article }: { article: any }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-white leading-tight flex-1">{article.title}</h3>
        {article.threat_level && (
          <Badge className={`${getThreatColor(article.threat_level)} border`}>{article.threat_level}</Badge>
        )}
      </div>

      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{article.description}</p>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>{article.source}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(article.pub_date)}</span>
          </div>
          {article.category && (
            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
          )}
        </div>

        <Link
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Read full article
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
          {article.tags.slice(0, 4).map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-1 bg-slate-800/50 text-slate-400 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
