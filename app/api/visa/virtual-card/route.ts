import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { visaGlobalClient } from "@/lib/visa-global-client"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency, merchantRestriction, expiryHours, usageLimit } = body

    // Generate virtual card via Visa API
    const visaResponse = await visaGlobalClient.generateVirtualCard({
      userId: user.id,
      amount,
      currency: currency || "USD",
      merchantRestriction,
      expiryHours: expiryHours || 24,
      usageLimit: usageLimit || 1,
    })

    // Store in database
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + (expiryHours || 24))

    const { data: virtualCard, error } = await supabase
      .from("virtual_cards")
      .insert({
        user_id: user.id,
        card_token: visaResponse.cardToken || `vcard_${Date.now()}`,
        card_last_four: visaResponse.lastFourDigits || "0000",
        expiry_month: visaResponse.expiryMonth || new Date().getMonth() + 1,
        expiry_year: visaResponse.expiryYear || new Date().getFullYear() + 1,
        usage_limit: usageLimit || 1,
        amount_limit: amount,
        merchant_restriction: merchantRestriction,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      virtualCard,
      message: "Virtual card generated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Virtual card generation error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate virtual card" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: cards, error } = await supabase
      .from("virtual_cards")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ cards })
  } catch (error: any) {
    console.error("[v0] Fetch virtual cards error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch virtual cards" }, { status: 500 })
  }
}
