import { NextResponse } from "next/server"
import { VisaClient } from "@/lib/visa-client"

export async function GET() {
  console.log("[v0] ========================================")
  console.log("[v0] /api/visa/helloworld endpoint called")
  console.log("[v0] ========================================")

  try {
    console.log("[v0] Creating Visa Client instance...")
    const visaClient = new VisaClient()

    console.log("[v0] Calling testConnection()...")
    const result = await visaClient.testConnection()

    console.log("[v0] Test connection completed:", JSON.stringify(result, null, 2))

    return NextResponse.json(result, { status: result.statusCode || 200 })
  } catch (error) {
    console.error("[v0] ❌ FATAL ERROR in /api/visa/helloworld:")
    console.error("[v0] Error type:", error?.constructor?.name)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
