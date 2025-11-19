import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "daily_tip"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

    const { data, error } = await supabase
      .from("ai_generated_content")
      .select("*")
      .eq("content_type", type)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return NextResponse.json({ content: data })
  } catch (error) {
    console.error("AI content fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch AI content" }, { status: 500 })
  }
}
