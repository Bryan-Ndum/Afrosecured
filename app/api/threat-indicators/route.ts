import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type")
    const severity = searchParams.get("severity")

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

    let query = supabase.from("threat_indicators").select("*").order("last_seen", { ascending: false }).limit(limit)

    if (type) {
      query = query.eq("indicator_type", type)
    }

    if (severity) {
      query = query.eq("severity", severity)
    }

    const { data, error } = await supabase
      .from("threat_indicators")
      .select("*")
      .order("last_seen", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return NextResponse.json({ indicators: data })
  } catch (error) {
    console.error("Threat indicators fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch threat indicators" }, { status: 500 })
  }
}
