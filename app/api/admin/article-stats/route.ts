import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total articles
    const { count: total } = await supabase.from("cybersecurity_articles").select("*", { count: "exact", head: true })

    // Get articles from last 24 hours
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    const { count: last24h } = await supabase
      .from("cybersecurity_articles")
      .select("*", { count: "exact", head: true })
      .gte("published_at", yesterday.toISOString())

    // Get last update time
    const { data: lastArticle } = await supabase
      .from("cybersecurity_articles")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Get articles by source
    const { data: allArticles } = await supabase.from("cybersecurity_articles").select("source").limit(1000)

    const sourceCounts = allArticles?.reduce(
      (acc, article) => {
        acc[article.source] = (acc[article.source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const bySource = Object.entries(sourceCounts || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Get recent articles
    const { data: recent } = await supabase
      .from("cybersecurity_articles")
      .select("title, url, source, published_at")
      .order("published_at", { ascending: false })
      .limit(10)

    return NextResponse.json({
      total: total || 0,
      last24h: last24h || 0,
      lastUpdate: lastArticle?.created_at || null,
      bySource,
      recent,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch article stats:", error)
    return NextResponse.json(
      {
        total: 0,
        last24h: 0,
        lastUpdate: null,
        bySource: [],
        recent: [],
      },
      { status: 200 },
    )
  }
}
