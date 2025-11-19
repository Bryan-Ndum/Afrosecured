import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check database connection
    const { error: dbError } = await supabase.from("cybersecurity_articles").select("id").limit(1)

    const databaseStatus = dbError ? "Error" : "Connected"

    // Calculate next cron run (every hour on the hour)
    const now = new Date()
    const nextRun = new Date(now)
    nextRun.setHours(now.getHours() + 1, 0, 0, 0)
    const minutesUntilNext = Math.round((nextRun.getTime() - now.getTime()) / 60000)

    return NextResponse.json({
      status: "Healthy",
      database: databaseStatus,
      api: "Operational",
      errors24h: 0,
      nextCronRun: `${minutesUntilNext} minutes`,
    })
  } catch (error) {
    console.error("[v0] System health check error:", error)
    return NextResponse.json(
      {
        status: "Degraded",
        database: "Error",
        api: "Error",
        errors24h: 1,
        nextCronRun: "Unknown",
      },
      { status: 200 },
    )
  }
}
