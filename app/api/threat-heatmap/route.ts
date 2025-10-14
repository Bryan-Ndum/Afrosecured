import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("range") || "24h"

    const supabase = await createClient()

    const timeRanges: Record<string, number> = {
      "1h": 1 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    }

    const timeMs = timeRanges[timeRange] || timeRanges["24h"]
    const cutoffTime = new Date(Date.now() - timeMs).toISOString()

    console.log("[v0] Fetching threats from:", cutoffTime)

    const { data: threats, error } = await supabase
      .from("geographic_threats")
      .select("*")
      .order("last_updated", { ascending: false })
      .limit(1000)

    if (error) {
      console.error("[v0] Heatmap query error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[v0] Fetched threats count:", threats?.length || 0)

    const filteredThreats =
      threats?.filter((threat) => {
        const threatTime = new Date(threat.last_updated || threat.created_at).getTime()
        return threatTime >= Date.now() - timeMs
      }) || []

    console.log("[v0] Filtered threats count:", filteredThreats.length)

    // Aggregate threats by location
    const locationMap = new Map()

    filteredThreats.forEach((threat) => {
      const key = `${threat.country}-${threat.city || "unknown"}-${threat.latitude}-${threat.longitude}`

      if (!locationMap.has(key)) {
        locationMap.set(key, {
          country: threat.country,
          country_code: threat.country_code,
          city: threat.city,
          latitude: Number.parseFloat(threat.latitude),
          longitude: Number.parseFloat(threat.longitude),
          total_threats: 0,
          critical_count: 0,
          high_count: 0,
          medium_count: 0,
          low_count: 0,
          threat_types: {},
          last_threat_time: threat.last_updated || threat.created_at,
        })
      }

      const location = locationMap.get(key)
      location.total_threats += threat.occurrence_count || 1

      // Count by severity
      const severity = (threat.severity || "low").toLowerCase()
      if (severity === "critical") location.critical_count += threat.occurrence_count || 1
      else if (severity === "high") location.high_count += threat.occurrence_count || 1
      else if (severity === "medium") location.medium_count += threat.occurrence_count || 1
      else location.low_count += threat.occurrence_count || 1

      // Aggregate threat types
      if (threat.threat_type) {
        const type = threat.threat_type.replace(/_/g, " ")
        location.threat_types[type] = (location.threat_types[type] || 0) + (threat.occurrence_count || 1)
      }

      // Update last threat time
      const threatTime = threat.last_updated || threat.created_at
      if (new Date(threatTime) > new Date(location.last_threat_time)) {
        location.last_threat_time = threatTime
      }
    })

    const heatmapData = Array.from(locationMap.values()).sort((a, b) => b.total_threats - a.total_threats)

    console.log("[v0] Returning heatmap locations:", heatmapData.length)

    return NextResponse.json({
      success: true,
      data: heatmapData,
      timestamp: new Date().toISOString(),
      stats: {
        total_locations: heatmapData.length,
        total_threats: heatmapData.reduce((sum, loc) => sum + loc.total_threats, 0),
        time_range: timeRange,
      },
    })
  } catch (error) {
    console.error("[v0] Heatmap API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch heatmap data",
      },
      { status: 500 },
    )
  }
}
