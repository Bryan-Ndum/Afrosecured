import { NextResponse } from "next/server"
import { RSSMonitorService } from "@/services/rss-monitor-service"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const monitor = new RSSMonitorService()
    await monitor.monitorFeeds()

    return NextResponse.json({
      success: true,
      message: "RSS monitoring completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] RSS monitoring error:", error)
    return NextResponse.json(
      {
        error: "Monitoring failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
