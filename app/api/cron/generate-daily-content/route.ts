import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { AIContentGenerator } from "@/lib/ai-content-generator"

export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const generator = new AIContentGenerator()
    let itemsProcessed = 0

    // Generate daily security tip
    const dailyTip = await generator.generateDailySecurityTip()
    await supabase.from("ai_generated_content").insert({
      content_type: "daily_tip",
      title: dailyTip.title,
      content: dailyTip.content,
      category: dailyTip.category,
      tags: dailyTip.tags,
      published: true,
      published_at: new Date().toISOString(),
    })
    itemsProcessed++

    // Generate weekly summary (only on Mondays)
    const today = new Date().getDay()
    if (today === 1) {
      const { data: articles } = await supabase
        .from("cybersecurity_articles")
        .select("*")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(20)

      if (articles && articles.length > 0) {
        const weeklySummary = await generator.generateWeeklySummary(articles)
        await supabase.from("ai_generated_content").insert({
          content_type: "weekly_summary",
          title: weeklySummary.title,
          content: weeklySummary.content,
          tags: ["weekly", "summary", ...weeklySummary.keyThreats],
          published: true,
          published_at: new Date().toISOString(),
          metadata: {
            keyThreats: weeklySummary.keyThreats,
            recommendations: weeklySummary.recommendations,
          },
        })
        itemsProcessed++
      }
    }

    // Analyze trends (every 3 days)
    const dayOfMonth = new Date().getDate()
    if (dayOfMonth % 3 === 0) {
      const { data: reports } = await supabase
        .from("scam_reports")
        .select("*")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(50)

      if (reports && reports.length > 10) {
        const trendAnalysis = await generator.analyzeTrendPatterns(reports)
        await supabase.from("ai_generated_content").insert({
          content_type: "trend_analysis",
          title: trendAnalysis.title,
          content: trendAnalysis.content,
          tags: ["trends", "analysis", trendAnalysis.pattern],
          published: true,
          published_at: new Date().toISOString(),
          metadata: {
            pattern: trendAnalysis.pattern,
            severity: trendAnalysis.severity,
            affectedRegions: trendAnalysis.affectedRegions,
            recommendations: trendAnalysis.recommendations,
          },
        })
        itemsProcessed++
      }
    }

    // Log automation run
    await supabase.from("automation_logs").insert({
      job_name: "generate-daily-content",
      job_type: "cron",
      status: "success",
      items_processed: itemsProcessed,
      items_failed: 0,
      execution_time_ms: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      itemsGenerated: itemsProcessed,
      executionTime: Date.now() - startTime,
    })
  } catch (error) {
    console.error("Daily content generation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
