import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { visaGlobalClient } from "@/lib/visa-global-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { merchantId, merchantName, merchantCountry, merchantUrl } = body

    if (!merchantId && !merchantName) {
      return NextResponse.json({ error: "Merchant ID or name required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already verified recently (cache for 24 hours)
    const { data: existing } = await supabase
      .from("merchant_verification")
      .select("*")
      .eq("merchant_id", merchantId)
      .gte("last_checked", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single()

    if (existing) {
      return NextResponse.json({
        verified: existing.visa_verified,
        trustScore: existing.trust_score,
        riskLevel: existing.risk_level,
        merchant: existing,
        cached: true,
      })
    }

    // Verify via Visa API
    const visaResponse = await visaGlobalClient.verifyMerchant({
      merchantId,
      merchantName,
      merchantCountry,
    })

    const isVerified = visaResponse.merchantLocatorServiceResponse?.response?.length > 0
    const merchantData = visaResponse.merchantLocatorServiceResponse?.response?.[0]

    // Calculate trust score based on Visa data
    let trustScore = 50 // baseline
    if (isVerified) trustScore += 30
    if (merchantData?.matchScore > 80) trustScore += 20

    const riskLevel = trustScore >= 80 ? "low" : trustScore >= 60 ? "medium" : trustScore >= 40 ? "high" : "critical"

    // Store verification result
    const { data: verification, error } = await supabase
      .from("merchant_verification")
      .upsert({
        merchant_id: merchantId,
        merchant_name: merchantName || merchantData?.visaMerchantName,
        merchant_url: merchantUrl,
        merchant_country: merchantCountry || merchantData?.merchantCountryCode,
        merchant_category: merchantData?.merchantCategoryCode,
        visa_verified: isVerified,
        trust_score: trustScore,
        risk_level: riskLevel,
        verification_date: new Date().toISOString(),
        last_checked: new Date().toISOString(),
        metadata: merchantData,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      verified: isVerified,
      trustScore,
      riskLevel,
      merchant: verification,
      visaData: merchantData,
    })
  } catch (error: any) {
    console.error("[v0] Merchant verification error:", error)
    return NextResponse.json({ error: error.message || "Failed to verify merchant" }, { status: 500 })
  }
}
