import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { FraudDetectionService } from "@/services/fraud-detection-service"
import { RateLimiterService } from "@/services/rate-limiter-service"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const fraudDetection = new FraudDetectionService()
const rateLimiter = new RateLimiterService()

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Extract API key
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    // Verify partner
    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("api_key", apiKey)
      .eq("status", "active")
      .single()

    if (!partner) {
      return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 })
    }

    // Check rate limit
    const limits = await rateLimiter.getPartnerLimits(apiKey)
    const rateLimit = await rateLimiter.checkRateLimit(apiKey, limits)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 },
      )
    }

    // Parse batch request
    const body = await request.json()
    const { transactions } = body

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: "Transactions array required" }, { status: 400 })
    }

    if (transactions.length > 1000) {
      return NextResponse.json({ error: "Maximum 1000 transactions per batch" }, { status: 400 })
    }

    // Process batch
    const results = await Promise.all(
      transactions.map(async (tx: any) => {
        try {
          const analysis = await fraudDetection.analyzeTransaction({
            sender: tx.sender,
            recipient: tx.recipient,
            amount: tx.amount,
            currency: tx.currency || "KES",
            channel: tx.channel || "mobile_money",
            metadata: tx.metadata || {},
          })

          return {
            transactionId: tx.id,
            riskScore: analysis.riskScore,
            riskLevel: analysis.riskLevel,
            recommendation: analysis.recommendation,
            factors: analysis.factors,
          }
        } catch (error) {
          return {
            transactionId: tx.id,
            error: "Analysis failed",
          }
        }
      }),
    )

    // Log batch request
    const responseTime = Date.now() - startTime
    await rateLimiter.logRequest(apiKey, "/api/v1/batch/verify", "POST", 200, responseTime)

    // Update partner stats
    await supabase.rpc("increment_partner_requests", {
      partner_id: partner.id,
      count: transactions.length,
    })

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error("[v0] Batch verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
