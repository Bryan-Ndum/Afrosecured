import { type NextRequest, NextResponse } from "next/server"
import { RiskScoringEngine } from "@/lib/risk-scoring-engine"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, merchantId, merchantName, biometrics, networkData } = body

    // Get IP address
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Get device fingerprint from headers or body
    const deviceFingerprint = body.deviceFingerprint || "unknown"

    const transactionData = {
      amount,
      currency,
      merchantId,
      merchantName,
      ipAddress,
      deviceFingerprint,
    }

    // Calculate risk score
    const engine = new RiskScoringEngine()
    const riskScore = await engine.calculateRiskScore(transactionData, biometrics, networkData)

    // Store in database
    const supabase = createClient()
    const { data: scoreData, error } = await supabase
      .from("transaction_risk_scores")
      .insert({
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        overall_risk_score: riskScore.overallScore,
        risk_level: riskScore.riskLevel,
        behavioral_risk: riskScore.behavioralRisk,
        device_risk: riskScore.deviceRisk,
        network_risk: riskScore.networkRisk,
        transaction_risk: riskScore.transactionRisk,
        velocity_risk: riskScore.velocityRisk,
        risk_factors: riskScore.riskFactors,
        mfa_required: riskScore.mfaRequired,
        decision: riskScore.decision,
        confidence_score: riskScore.confidence,
        amount,
        currency,
        merchant_id: merchantId,
        merchant_name: merchantName,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error storing risk score:", error)
    }

    return NextResponse.json({
      success: true,
      riskScore,
      transactionId: scoreData?.transaction_id,
    })
  } catch (error) {
    console.error("[v0] Risk scoring error:", error)
    return NextResponse.json({ error: "Failed to calculate risk score" }, { status: 500 })
  }
}

// GET endpoint for merchants to check risk scores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("transaction_risk_scores")
      .select("*")
      .eq("transaction_id", transactionId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      riskScore: {
        overallScore: data.overall_risk_score,
        riskLevel: data.risk_level,
        riskFactors: data.risk_factors,
        mfaRequired: data.mfa_required,
        decision: data.decision,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching risk score:", error)
    return NextResponse.json({ error: "Failed to fetch risk score" }, { status: 500 })
  }
}
