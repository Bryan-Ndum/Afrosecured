import { NextResponse } from "next/server"
import { ThreatIntelligenceAggregator } from "@/services/threat-intelligence-aggregator"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const aggregator = new ThreatIntelligenceAggregator()
    await aggregator.aggregateThreats()

    return NextResponse.json({
      success: true,
      message: "Threat aggregation completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Threat aggregation error:", error)
    return NextResponse.json(
      {
        error: "Aggregation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
