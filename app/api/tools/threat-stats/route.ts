import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total threats
    const { count: totalThreats } = await supabase.from("scam_feeds").select("*", { count: "exact", head: true })

    // Get threats from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: newToday } = await supabase
      .from("scam_feeds")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())

    // Get active/trending scams
    const { count: activeScams } = await supabase
      .from("scam_feeds")
      .select("*", { count: "exact", head: true })
      .eq("is_trending", true)

    // Get unique countries
    const { data: hotspots } = await supabase.from("scam_hotspots").select("country").limit(1000)
    const countriesAffected = new Set(hotspots?.map((h) => h.country)).size

    // Get reports today
    const { count: reportsToday } = await supabase
      .from("user_reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())

    // Get top threat types
    const { data: allScams } = await supabase.from("scam_feeds").select("scam_type").limit(1000)
    const typeCounts = allScams?.reduce(
      (acc, scam) => {
        acc[scam.scam_type] = (acc[scam.scam_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const topTypes = Object.entries(typeCounts || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Get recent threats
    const { data: recentThreats } = await supabase
      .from("scam_feeds")
      .select("title, location, severity")
      .order("created_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      totalThreats: totalThreats || 0,
      newToday: newToday || 0,
      activeScams: activeScams || 0,
      countriesAffected,
      reportsToday: reportsToday || 0,
      topTypes,
      recentThreats,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch threat stats:", error)
    return NextResponse.json(
      {
        totalThreats: 0,
        newToday: 0,
        activeScams: 0,
        countriesAffected: 0,
        reportsToday: 0,
        topTypes: [],
        recentThreats: [],
      },
      { status: 200 },
    )
  }
}
