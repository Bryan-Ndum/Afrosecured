import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { calculateRiskScore } from "@/lib/risk-scoring-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, amount, recipient, method, timestamp } = body

    console.log("[PayGuard] Intercepting payment:", { url, amount, recipient })

    // Create Supabase client
    const supabase = await createClient()

    // Calculate risk score
    const riskAnalysis = await calculateRiskScore({
      amount: Number.parseFloat(amount) || 0,
      recipient: recipient || "unknown",
      url: url || "",
      method: method || "unknown",
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    })

    // Store transaction
    const { data: transaction, error } = await supabase
      .from("payguard_transactions")
      .insert({
        amount: Number.parseFloat(amount) || 0,
        recipient: recipient || "unknown",
        url: url || "",
        method: method || "unknown",
        risk_score: riskAnalysis.score,
        risk_factors: riskAnalysis.factors,
        status: riskAnalysis.score > 90 ? "blocked" : riskAnalysis.score > 70 ? "flagged" : "approved",
        timestamp: timestamp || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[PayGuard] Database error:", error)
    }

    // Return risk analysis
    return NextResponse.json({
      success: true,
      riskScore: riskAnalysis.score,
      reason: riskAnalysis.recommendation,
      factors: riskAnalysis.factors,
      shouldBlock: riskAnalysis.score > 90,
      shouldFlag: riskAnalysis.score > 70,
      transactionId: transaction?.id,
    })
  } catch (error) {
    console.error("[PayGuard] Intercept error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze payment",
        riskScore: 0,
      },
      { status: 500 },
    )
  }
}
