import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { AnalyticsService } from "@/services/analytics-service"
import { CacheService } from "@/services/cache-service"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKey = authHeader.substring(7)
    const supabase = createServerClient()

    // Get partner from API key
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("*")
      .eq("api_key", apiKey)
      .eq("status", "active")
      .single()

    if (partnerError || !partner) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const partnerId = partner.id
    const timeRange = request.nextUrl.searchParams.get("range") || "7d"

    // Check cache first
    const cacheKey = `dashboard:${timeRange}`
    const cached = await CacheService.getAnalytics(partnerId, cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Get analytics data
    const analytics = await AnalyticsService.getPartnerAnalytics(partnerId, timeRange)

    // Get recent alerts
    const { data: recentAlerts } = await supabase
      .from("fraud_alerts")
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Get API usage
    const { data: apiUsage } = await supabase
      .from("api_requests")
      .select("endpoint, count(*)")
      .eq("partner_id", partnerId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("count", { ascending: false })

    // Get quota usage
    const { data: quotaData } = await supabase.from("partner_quotas").select("*").eq("partner_id", partnerId).single()

    const dashboardData = {
      partner: {
        id: partner.id,
        name: partner.name,
        tier: partner.tier,
        status: partner.status,
      },
      analytics,
      recentAlerts: recentAlerts || [],
      apiUsage: apiUsage || [],
      quota: quotaData || {
        requests_used: 0,
        requests_limit: 1000,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      timestamp: new Date().toISOString(),
    }

    // Cache the result
    await CacheService.setAnalytics(partnerId, cacheKey, dashboardData)

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("[v0] Partner dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
