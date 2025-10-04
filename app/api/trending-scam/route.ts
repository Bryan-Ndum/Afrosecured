import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the most recent high-severity trending scam
    const { data, error } = await supabase
      .from("scam_feeds")
      .select("*")
      .eq("is_trending", true)
      .in("severity", ["high", "critical"])
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If no trending scam found, get the most recent high-severity scam
    if (!data || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("scam_feeds")
        .select("*")
        .in("severity", ["high", "critical"])
        .order("created_at", { ascending: false })
        .limit(1)

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 })
      }

      return NextResponse.json({ data: fallbackData?.[0] || null })
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
