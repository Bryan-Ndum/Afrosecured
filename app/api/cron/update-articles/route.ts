import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { extractThreatIntelligence, fetchArticleContent } from "@/lib/ai-content-extractor"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const isManualTrigger = authHeader === `Bearer ${process.env.CRON_SECRET}`
    const isVercelCron = request.headers.get("user-agent")?.includes("vercel-cron")

    if (!isVercelCron && !isManualTrigger && process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting AI-powered article update cron job...")

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const feeds = [
      {
        url: "https://krebsonsecurity.com/feed/",
        source: "Krebs on Security",
        category: "Investigative Journalism",
      },
      {
        url: "https://feeds.feedburner.com/TheHackersNews",
        source: "The Hacker News",
        category: "Breaking News",
      },
      {
        url: "https://www.darkreading.com/rss.xml",
        source: "Dark Reading",
        category: "Enterprise Security",
      },
      {
        url: "https://www.bleepingcomputer.com/feed/",
        source: "BleepingComputer",
        category: "Technical Analysis",
      },
    ]

    let totalProcessed = 0
    let totalErrors = 0
    let totalAiProcessed = 0

    for (const feed of feeds) {
      try {
        console.log(`[v0] Fetching ${feed.source}...`)
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=public&count=5`,
          { next: { revalidate: 0 } },
        )
        const data = await response.json()

        if (data.status === "ok" && data.items) {
          for (const item of data.items) {
            try {
              const cleanDescription = item.description?.replace(/<[^>]*>/g, "").substring(0, 500) || ""

              console.log(`[v0] Fetching full content for: ${item.title}`)
              const fullContent = await fetchArticleContent(item.link)

              let aiIntelligence = null
              if (fullContent) {
                console.log(`[v0] Extracting threat intelligence with AI...`)
                aiIntelligence = await extractThreatIntelligence(item.title, fullContent, feed.source)
                totalAiProcessed++
              }

              const articleData = {
                title: item.title,
                link: item.link,
                pub_date: new Date(item.pubDate).toISOString(),
                description: cleanDescription,
                source: feed.source,
                category: feed.category,
                content: fullContent || item.content || item.description || "",
                ai_summary: aiIntelligence?.summary || null,
                threat_level: aiIntelligence?.threatLevel || null,
                threat_indicators: aiIntelligence?.threatIndicators || [],
                affected_platforms: aiIntelligence?.affectedPlatforms || [],
                cve_ids: aiIntelligence?.cveIds || [],
                iocs: aiIntelligence?.iocs || {},
                recommendations: aiIntelligence?.recommendations || [],
                tags: aiIntelligence?.tags || [],
                ai_processed: !!aiIntelligence,
                ai_processed_at: aiIntelligence ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
              }

              const { error } = await supabase.from("cybersecurity_articles").upsert(articleData, {
                onConflict: "link",
                ignoreDuplicates: false,
              })

              if (error) {
                console.error(`[v0] Error upserting article from ${feed.source}:`, error.message)
                totalErrors++
              } else {
                totalProcessed++
                console.log(`[v0] Successfully processed: ${item.title}`)
              }

              await new Promise((resolve) => setTimeout(resolve, 2000))
            } catch (itemError) {
              console.error(`[v0] Error processing article:`, itemError)
              totalErrors++
            }
          }
          console.log(`[v0] Successfully processed ${feed.source}`)
        } else {
          console.error(`[v0] Failed to fetch ${feed.source}:`, data.message || "Unknown error")
          totalErrors++
        }

        await new Promise((resolve) => setTimeout(resolve, 3000))
      } catch (error) {
        console.error(`[v0] Error fetching ${feed.source}:`, error)
        totalErrors++
      }
    }

    // Clean up old articles (keep last 100 per source)
    console.log("[v0] Cleaning up old articles...")
    for (const feed of feeds) {
      try {
        const { data: articles } = await supabase
          .from("cybersecurity_articles")
          .select("id")
          .eq("source", feed.source)
          .order("pub_date", { ascending: false })
          .range(100, 1000)

        if (articles && articles.length > 0) {
          const idsToDelete = articles.map((a) => a.id)
          await supabase.from("cybersecurity_articles").delete().in("id", idsToDelete)
          console.log(`[v0] Cleaned up ${articles.length} old articles from ${feed.source}`)
        }
      } catch (cleanupError) {
        console.error(`[v0] Error cleaning up ${feed.source}:`, cleanupError)
      }
    }

    const result = {
      success: true,
      message: `Processed ${totalProcessed} articles (${totalAiProcessed} with AI) with ${totalErrors} errors`,
      totalProcessed,
      totalAiProcessed,
      totalErrors,
      timestamp: new Date().toISOString(),
      trigger: isManualTrigger ? "manual" : "cron",
    }

    console.log("[v0] AI-powered cron job completed:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json(
      {
        error: "Failed to update articles",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
