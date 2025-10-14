import { type NextRequest, NextResponse } from "next/server"
import { visaGlobalClient } from "@/lib/visa-global-client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromCountry, toCountry, amount, fromCurrency, toCurrency } = body

    if (!fromCountry || !toCountry || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get exchange rates
    const ratesResponse = await visaGlobalClient.getExchangeRates(fromCurrency || "USD", toCurrency || "USD")

    const exchangeRate = ratesResponse.foreignExchangeRateInfo?.destinationAmount || 1

    // Calculate different route options
    const routes = [
      {
        id: "visa-direct",
        name: "Visa Direct (Recommended)",
        type: "visa_direct",
        estimatedTime: "30 seconds",
        baseFee: 2.5,
        percentageFee: 1.5,
        exchangeRate,
        totalCost: amount * 0.015 + 2.5,
        recommended: true,
        features: ["Instant transfer", "Real-time tracking", "Lowest fees"],
      },
      {
        id: "correspondent",
        name: "Correspondent Bank",
        type: "correspondent",
        estimatedTime: "1-2 business days",
        baseFee: 15,
        percentageFee: 2.5,
        exchangeRate: exchangeRate * 0.98,
        totalCost: amount * 0.025 + 15,
        recommended: false,
        features: ["Traditional method", "Higher fees", "Slower"],
      },
      {
        id: "swift",
        name: "SWIFT Transfer",
        type: "swift",
        estimatedTime: "3-5 business days",
        baseFee: 25,
        percentageFee: 3.0,
        exchangeRate: exchangeRate * 0.97,
        totalCost: amount * 0.03 + 25,
        recommended: false,
        features: ["Slowest option", "Highest fees", "Multiple intermediaries"],
      },
    ]

    const supabase = await createClient()
    await supabase.from("payment_routes").insert(
      routes.map((route) => ({
        from_country: fromCountry,
        to_country: toCountry,
        from_currency: fromCurrency || "USD",
        to_currency: toCurrency || "USD",
        route_type: route.type,
        estimated_time: route.estimatedTime,
        base_fee: route.baseFee,
        percentage_fee: route.percentageFee,
        total_cost: route.totalCost,
        exchange_rate: route.exchangeRate,
        recommended: route.recommended,
      })),
    )

    return NextResponse.json({
      routes,
      exchangeRate,
      savings: routes[2].totalCost - routes[0].totalCost,
      recommendedRoute: routes[0],
    })
  } catch (error: any) {
    console.error("[v0] Payment routes error:", error)
    return NextResponse.json({ error: error.message || "Failed to calculate payment routes" }, { status: 500 })
  }
}
