import { NextResponse } from "next/server"
import { RiskScoringEngine } from "@/lib/risk-scoring-engine"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchantId, merchantName, amount, currency, biometrics, deviceFingerprint } = body

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "unknown"

    // Initialize risk scoring engine
    const riskEngine = new RiskScoringEngine()

    // Calculate risk score
    const riskScore = await riskEngine.calculateRiskScore(
      {
        amount,
        currency,
        merchantId,
        merchantName,
        ipAddress,
        deviceFingerprint,
      },
      biometrics,
    )

    // Verify merchant with Visa
    const merchantVerification = await verifyMerchantWithVisa(merchantId, merchantName)

    // Check threat intelligence
    const threatIntelligence = await checkThreatIntelligence(merchantId, ipAddress)

    // Store risk assessment in database
    const supabase = await createClient()
    await supabase.from("risk_assessments").insert({
      merchant_id: merchantId,
      merchant_name: merchantName,
      amount,
      currency,
      ip_address: ipAddress,
      device_fingerprint: deviceFingerprint,
      risk_score: riskScore.overallScore,
      risk_level: riskScore.riskLevel,
      decision: riskScore.decision,
      risk_factors: riskScore.riskFactors,
      behavioral_risk: riskScore.behavioralRisk,
      device_risk: riskScore.deviceRisk,
      network_risk: riskScore.networkRisk,
      transaction_risk: riskScore.transactionRisk,
      velocity_risk: riskScore.velocityRisk,
    })

    return NextResponse.json({
      success: true,
      riskScore,
      merchantVerification,
      threatIntelligence,
    })
  } catch (error) {
    console.error("[v0] Transaction verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}

async function verifyMerchantWithVisa(merchantId: string, merchantName: string) {
  // TODO: Integrate with actual Visa API
  // For now, return mock data
  return {
    verified: true,
    trustScore: 85,
    merchantName,
    merchantId,
    status: "active",
  }
}

async function checkThreatIntelligence(merchantId: string, ipAddress: string) {
  // TODO: Integrate with AlienVault, VirusTotal, AbuseIPDB
  // For now, return mock data
  return {
    alienvault: {
      clean: true,
      pulses: 0,
    },
    virustotal: {
      malicious: 0,
      suspicious: 0,
    },
    abuseipdb: {
      abuseScore: 0,
      reports: 0,
    },
  }
}
