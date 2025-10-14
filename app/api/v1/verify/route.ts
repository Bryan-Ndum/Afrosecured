import { type NextRequest, NextResponse } from "next/server"
import { FraudDetectionService } from "@/services/fraud-detection-service"
import { TrustScoreService } from "@/services/trust-score-service"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Partner Gateway - Unified B2B API
export async function POST(request: NextRequest) {
  try {
    // Authenticate partner
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 })
    }

    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("api_key", apiKey)
      .eq("status", "active")
      .single()

    if (!partner) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Parse request
    const body = await request.json()
    const { amount, sender, receiver, channel, metadata } = body

    if (!amount || !sender || !receiver || !channel) {
      return NextResponse.json({ error: "Missing required fields: amount, sender, receiver, channel" }, { status: 400 })
    }

    // Log API request
    await supabase.from("api_requests").insert({
      partner_id: partner.id,
      endpoint: "/api/v1/verify",
      request_data: body,
      created_at: new Date().toISOString(),
    })

    // Run fraud detection
    const fraudService = new FraudDetectionService()
    const fraudAnalysis = await fraudService.analyzeTransaction({
      amount: Number.parseFloat(amount),
      sender,
      recipient: receiver,
      timestamp: new Date(),
      channel,
      metadata,
    })

    // Get trust scores
    const trustService = new TrustScoreService()
    const [senderTrust, receiverTrust] = await Promise.all([
      trustService.calculateTrustScore(sender, "sender"),
      trustService.calculateTrustScore(receiver, "recipient"),
    ])

    // Determine action
    let action: "allow" | "review" | "block" = "allow"
    let reason = "Transaction appears safe"

    if (fraudAnalysis.riskScore >= 80 || senderTrust.riskLevel === "critical") {
      action = "block"
      reason = "High fraud risk detected"
    } else if (fraudAnalysis.riskScore >= 60 || senderTrust.riskLevel === "high") {
      action = "review"
      reason = "Moderate fraud risk - manual review recommended"
    }

    // Store verification result
    await supabase.from("verification_results").insert({
      partner_id: partner.id,
      sender,
      receiver,
      amount,
      channel,
      risk_score: fraudAnalysis.riskScore,
      action,
      reason,
      sender_trust_score: senderTrust.score,
      receiver_trust_score: receiverTrust.score,
      created_at: new Date().toISOString(),
    })

    // Update partner usage
    await supabase.rpc("increment_partner_usage", {
      partner_id: partner.id,
    })

    // Return response
    return NextResponse.json({
      risk_score: fraudAnalysis.riskScore,
      action,
      reason,
      details: {
        fraud_factors: fraudAnalysis.factors,
        sender_trust: {
          score: senderTrust.score,
          risk_level: senderTrust.riskLevel,
        },
        receiver_trust: {
          score: receiverTrust.score,
          risk_level: receiverTrust.riskLevel,
        },
      },
      request_id: crypto.randomUUID(),
    })
  } catch (error: any) {
    console.error("[v0] Partner API error:", error)
    return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500 })
  }
}

// GET endpoint for checking API status
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 })
  }

  const { data: partner } = await supabase
    .from("partners")
    .select("id, name, status, created_at")
    .eq("api_key", apiKey)
    .single()

  if (!partner) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  // Get usage stats
  const { data: stats } = await supabase.from("partner_stats").select("*").eq("partner_id", partner.id).single()

  return NextResponse.json({
    partner: partner.name,
    status: partner.status,
    usage: {
      total_requests: stats?.total_requests || 0,
      blocked_transactions: stats?.blocked_transactions || 0,
      fraud_prevented_amount: stats?.fraud_prevented_amount || 0,
    },
  })
}
