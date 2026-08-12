import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Parser from "rss-parser"
import { extractThreatIntelligence } from "@/lib/ai-content-extractor"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Stop AI enrichment once we've used this much of our time budget (ms),
// leaving headroom for the final DB writes and logging before maxDuration.
const AI_TIME_BUDGET_MS = 45_000

const FEEDS = [
  { url: "https://krebsonsecurity.com/feed/", source: "Krebs on Security", category: "Investigative Journalism" },
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", category: "Breaking News" },
  { url: "https://www.darkreading.com/rss.xml", source: "Dark Reading", category: "Enterprise Security" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer", category: "Technical Analysis" },
  { url: "https://www.welivesecurity.com/en/rss/feed/", source: "WeLiveSecurity", category: "Threat Research" },
]

const ITEMS_PER_FEED = 6

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "AfroSecured-Bot/1.0 (Security Research; +https://afrosecured.com)" },
})

function cleanText(html?: string) {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export async function GET(request: Request) {
  const startedAt = Date.now()

  try {
    const authHeader = request.headers.get("authorization")
    const isManualTrigger = authHeader === `Bearer ${process.env.CRON_SECRET}`
    const isVercelCron = request.headers.get("user-agent")?.includes("vercel-cron")

    if (!isVercelCron && !isManualTrigger && process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Fetch every feed in parallel (fast, network-bound).
    const feedResults = await Promise.allSettled(
      FEEDS.map(async (feed) => {
        const parsed = await parser.parseURL(feed.url)
        return { feed, items: (parsed.items || []).slice(0, ITEMS_PER_FEED) }
      }),
    )

    // 2. Flatten into a single list of article rows.
    type PendingArticle = {
      title: string
      link: string
      pub_date: string
      description: string
      source: string
      category: string
      content: string
    }

    const articles: PendingArticle[] = []
    let feedErrors = 0

    for (const result of feedResults) {
      if (result.status !== "fulfilled") {
        feedErrors++
        continue
      }
      const { feed, items } = result.value
      for (const item of items) {
        if (!item.link || !item.title) continue
        const description = cleanText(item.contentSnippet || item.content || item.summary).substring(0, 500)
        articles.push({
          title: item.title,
          link: item.link,
          pub_date: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()),
          description,
          source: feed.source,
          category: feed.category,
          content: cleanText(item.content || item.contentSnippet).substring(0, 8000),
        })
      }
    }

    // 3. Upsert every article immediately WITHOUT AI so fresh content always
    //    lands even if AI enrichment runs out of time.
    let upserted = 0
    if (articles.length > 0) {
      const { error } = await supabase.from("cybersecurity_articles").upsert(
        articles.map((a) => ({ ...a, updated_at: new Date().toISOString() })),
        { onConflict: "link", ignoreDuplicates: false },
      )
      if (error) {
        console.error("Bulk upsert error:", error.message)
      } else {
        upserted = articles.length
      }
    }

    // 4. Enrich with AI within the remaining time budget. Prioritise articles
    //    that have not been AI-processed yet.
    const { data: toEnrich } = await supabase
      .from("cybersecurity_articles")
      .select("id, title, content, description, source")
      .eq("ai_processed", false)
      .order("pub_date", { ascending: false })
      .limit(20)

    let aiProcessed = 0
    let aiErrors = 0

    for (const article of toEnrich || []) {
      if (Date.now() - startedAt > AI_TIME_BUDGET_MS) break
      try {
        const intel = await extractThreatIntelligence(
          article.title,
          article.content || article.description || article.title,
          article.source,
        )
        const { error } = await supabase
          .from("cybersecurity_articles")
          .update({
            ai_summary: intel.summary,
            threat_level: intel.threatLevel,
            threat_indicators: intel.threatIndicators,
            affected_platforms: intel.affectedPlatforms,
            cve_ids: intel.cveIds,
            iocs: intel.iocs,
            recommendations: intel.recommendations,
            tags: intel.tags,
            ai_processed: true,
            ai_processed_at: new Date().toISOString(),
          })
          .eq("id", article.id)
        if (error) {
          aiErrors++
        } else {
          aiProcessed++
        }
      } catch {
        aiErrors++
      }
    }

    // 5. Trim old articles so the table stays lean (keep newest 150).
    try {
      const { data: stale } = await supabase
        .from("cybersecurity_articles")
        .select("id")
        .order("pub_date", { ascending: false })
        .range(150, 1000)
      if (stale && stale.length > 0) {
        await supabase
          .from("cybersecurity_articles")
          .delete()
          .in(
            "id",
            stale.map((a) => a.id),
          )
      }
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError)
    }

    const executionMs = Date.now() - startedAt
    const result = {
      success: true,
      message: `Pulled ${upserted} articles, AI-enriched ${aiProcessed} (${aiErrors} AI errors, ${feedErrors} feed errors)`,
      articlesPulled: upserted,
      aiProcessed,
      aiErrors,
      feedErrors,
      executionMs,
      trigger: isManualTrigger ? "manual" : "cron",
      timestamp: new Date().toISOString(),
    }

    // Best-effort automation log (non-fatal if the table is unavailable).
    try {
      await supabase.from("automation_logs").insert({
        job_name: "update-articles",
        job_type: "cron",
        status: feedErrors > 0 || aiErrors > 0 ? "partial" : "success",
        items_processed: upserted,
        items_failed: feedErrors + aiErrors,
        execution_time_ms: executionMs,
        metadata: result,
      })
    } catch {
      // ignore logging failures
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Article update cron error:", error)
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
