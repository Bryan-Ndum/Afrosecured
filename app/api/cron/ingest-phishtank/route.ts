import { NextResponse } from "next/server"
import { PhishTankService } from "@/services/phishtank-service"

export const runtime = "nodejs"
export const maxDuration = 60

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting PhishTank ingestion...")

    const insertedCount = await PhishTankService.ingestPhishingData()

    return NextResponse.json({
      success: true,
      message: `Ingested ${insertedCount} phishing URLs from PhishTank`,
      count: insertedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] PhishTank ingestion error:", error)
    return NextResponse.json(
      {
        error: "Failed to ingest PhishTank data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
