import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { CacheService } from "@/services/cache-service"

export async function GET(request: NextRequest) {
  try {
    const deviceId = request.nextUrl.searchParams.get("device_id")
    const version = request.nextUrl.searchParams.get("version") || "1.0.0"

    if (!deviceId) {
      return NextResponse.json({ error: "device_id required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check cache first
    const cacheKey = `sdk:config:${deviceId}`
    const cached = await CacheService.getPartnerConfig(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Get threat patterns for offline use
    const { data: threatPatterns } = await supabase
      .from("threat_patterns")
      .select("*")
      .eq("is_active", true)
      .order("severity", { ascending: false })
      .limit(100)

    // Get blacklisted numbers
    const { data: blacklist } = await supabase
      .from("blacklisted_numbers")
      .select("phone_number, reason, severity")
      .eq("is_active", true)
      .limit(1000)

    // Get ML model configuration
    const { data: mlModel } = await supabase
      .from("ml_models")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Get configuration settings
    const { data: settings } = await supabase.from("sdk_settings").select("*").eq("version", version).single()

    const config = {
      version,
      deviceId,
      threatPatterns: threatPatterns || [],
      blacklist: (blacklist || []).map((b) => b.phone_number),
      mlModel: mlModel
        ? {
            version: mlModel.version,
            weights: mlModel.weights,
            threshold: mlModel.threshold,
          }
        : null,
      settings: settings || {
        syncInterval: 3600, // 1 hour
        offlineMode: true,
        smsMonitoring: true,
        ussdMonitoring: false, // Requires telco partnership
        alertThreshold: 0.7,
        autoBlock: false,
      },
      syncUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/sync/package`,
      reportUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/community/report`,
      timestamp: new Date().toISOString(),
    }

    // Cache the configuration
    await CacheService.setPartnerConfig(cacheKey, config)

    // Log SDK request
    await supabase.from("sdk_requests").insert({
      device_id: deviceId,
      version,
      config_version: config.version,
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("[v0] SDK config error:", error)
    return NextResponse.json({ error: "Failed to fetch SDK configuration" }, { status: 500 })
  }
}
