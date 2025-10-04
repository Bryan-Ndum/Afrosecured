import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get("platform")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  const supabase = await createClient()

  let query = supabase.from("social_mentions").select("*").order("created_at", { ascending: false }).limit(limit)

  if (platform && platform !== "all") {
    query = query.eq("platform", platform)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
