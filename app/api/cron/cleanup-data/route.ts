import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { DataGovernanceService } from "@/services/data-governance-service"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const governance = new DataGovernanceService()

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    let deletedCount = 0

    // Get old transactions (90 days retention)
    const { data: oldTransactions } = await supabase
      .from("transactions")
      .select("id, created_at")
      .lt("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

    if (oldTransactions) {
      for (const tx of oldTransactions) {
        if (governance.shouldDeleteData(new Date(tx.created_at), 90)) {
          await supabase.from("transactions").delete().eq("id", tx.id)
          deletedCount++
        }
      }
    }

    // Reset monthly quotas if needed
    await supabase.rpc("reset_monthly_quotas")

    // Generate compliance report
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const { data: stats } = await supabase
      .from("api_requests")
      .select("*")
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString())

    await supabase.from("compliance_reports").insert({
      report_type: "monthly",
      period_start: periodStart.toISOString().split("T")[0],
      period_end: periodEnd.toISOString().split("T")[0],
      total_requests: stats?.length || 0,
      generated_at: now.toISOString(),
    })

    return NextResponse.json({
      success: true,
      deletedRecords: deletedCount,
      message: "Data cleanup completed",
    })
  } catch (error) {
    console.error("[v0] Data cleanup error:", error)
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 })
  }
}
