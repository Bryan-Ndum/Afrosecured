import { type NextRequest, NextResponse } from "next/server"
import { MobileMoneyService } from "@/services/mobile-money-service"
import { RealtimeMonitorService } from "@/services/realtime-monitor-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, transactionId, amount, sender, recipient } = body

    if (!provider || !transactionId) {
      return NextResponse.json({ error: "Provider and transaction ID required" }, { status: 400 })
    }

    const mobileMoneyService = new MobileMoneyService()
    const monitorService = new RealtimeMonitorService()

    // Verify transaction with provider
    let verificationResult
    switch (provider) {
      case "mpesa":
        verificationResult = await mobileMoneyService.verifyMpesaTransaction(transactionId)
        break
      case "mtn":
        verificationResult = await mobileMoneyService.verifyMtnTransaction(transactionId)
        break
      case "airtel":
        verificationResult = await mobileMoneyService.verifyAirtelTransaction(transactionId)
        break
      default:
        return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
    }

    // Monitor transaction for fraud
    const monitoringResult = await monitorService.monitorTransaction({
      transactionId,
      provider,
      amount,
      sender,
      recipient,
      timestamp: new Date().toISOString(),
    })

    // Block if fraud detected
    if (!monitoringResult.allowed) {
      await mobileMoneyService.blockTransaction(transactionId, provider, monitoringResult.reason || "Fraud detected")
    }

    return NextResponse.json({
      verified: verificationResult.status === "completed",
      allowed: monitoringResult.allowed,
      fraudScore: monitoringResult.fraudScore,
      reason: monitoringResult.reason,
      triggeredRules: monitoringResult.triggeredRules,
    })
  } catch (error) {
    console.error("[v0] Mobile money verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
