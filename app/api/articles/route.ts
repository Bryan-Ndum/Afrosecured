import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: articles, error } = await supabase
      .from("cybersecurity_articles")
      .select("*")
      .order("pub_date", { ascending: false })
      .limit(20)

    if (error) {
      console.error("[v0] Error fetching articles:", error)
      return NextResponse.json({ error: "Failed to fetch articles", articles: [] }, { status: 500 })
    }

    // If no articles found, suggest running the cron job
    if (!articles || articles.length === 0) {
      return NextResponse.json({
        articles: [],
        lastUpdated: new Date().toISOString(),
        message: "No articles found. Run the cron job to populate the database.",
      })
    }

    return NextResponse.json(
      {
        articles: articles || [],
        lastUpdated: new Date().toISOString(),
        count: articles?.length || 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    )
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        articles: [],
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
