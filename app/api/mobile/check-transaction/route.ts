import { NextResponse } from "next/server"
import { FraudDetectionService } from "@/services/fraud-detection-service"
import { SMSGatewayService } from "@/services/sms-gateway-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sender, recipient, amount, method } = body

    if (!sender || !recipient || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fraudService = new FraudDetectionService()
    const smsService = new SMSGatewayService()

    const transaction = {
      sender,
      recipient,
      amount: Number.parseFloat(amount),
      method: method || "mpesa",
      timestamp: new Date(),
    }

    const analysis = await fraudService.analyzeTransaction(transaction)
    await fraudService.logTransaction(transaction, analysis)

    // Send SMS alert if high risk
    if (analysis.riskScore > 50) {
      await smsService.sendFraudAlert(sender, recipient, amount, analysis.riskScore)
    }

    return NextResponse.json({
      success: true,
      analysis: {
        isFraud: analysis.isFraud,
        riskScore: analysis.riskScore,
        confidence: analysis.confidence,
        reasons: analysis.reasons,
        recommendations: analysis.recommendations,
      },
    })
  } catch (error) {
    console.error("[v0] Transaction check error:", error)
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
