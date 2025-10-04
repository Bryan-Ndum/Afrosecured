import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const trending = searchParams.get("trending")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  const supabase = await createClient()

  let query = supabase.from("scam_feeds").select("*").order("created_at", { ascending: false }).limit(limit)

  if (type && type !== "all") {
    query = query.eq("scam_type", type)
  }

  if (trending === "true") {
    query = query.eq("is_trending", true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
