import { type NextRequest, NextResponse } from "next/server"
import { FraudDetectionEngine, loadThreatPatterns } from "@/lib/core/fraud-detection-engine"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { transaction, userId } = await request.json()

    console.log("[v0] Analyzing transaction for user:", userId)

    // Load threat patterns
    const patterns = await loadThreatPatterns()

    // Load blacklist
    const supabase = createClient()
    const { data: blacklistData } = await supabase.from("blacklisted_numbers").select("phone_number")

    const blacklist = blacklistData?.map((item) => item.phone_number) || []

    // Initialize engine
    const engine = new FraudDetectionEngine(patterns, blacklist)

    // Analyze transaction
    const analysis = engine.analyzeTransaction(transaction)

    // Store analysis in database
    await supabase.from("transaction_analyses").insert({
      user_id: userId,
      recipient: transaction.recipient,
      amount: transaction.amount,
      risk_score: analysis.riskScore,
      risk_level: analysis.riskLevel,
      should_block: analysis.shouldBlock,
      risks: analysis.risks,
      recommendation: analysis.recommendation,
      analyzed_at: new Date().toISOString(),
    })

    console.log("[v0] Analysis complete. Risk score:", analysis.riskScore)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error: any) {
    console.error("[v0] Error analyzing transaction:", error)
    return NextResponse.json({ error: "Failed to analyze transaction", details: error.message }, { status: 500 })
  }
}
