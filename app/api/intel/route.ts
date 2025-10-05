import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const fallbackFeeds = [
  {
    id: "fallback-1",
    title: "Organized Crime Rings Target International Students",
    description:
      "Sophisticated criminal networks are targeting international students in Canada with fake study permits and fraudulent acceptance letters.",
    source: "University Affairs",
    source_url: "https://universityaffairs.ca/features/organized-criminals-target-international-students/",
    scam_type: "news",
    severity: "high",
    location: "Canada",
    is_trending: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "fallback-2",
    title: "How to Identify Scam Scholarship Opportunities",
    description:
      "Learn to spot fake scholarships that request processing fees or use shabby websites to deceive students.",
    source: "After School Africa",
    source_url:
      "https://www.afterschoolafrica.com/43867/how-to-identify-scam-scholarship-opportunities-and-avoid-them/",
    scam_type: "news",
    severity: "medium",
    location: "Africa",
    is_trending: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const trending = searchParams.get("trending")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("[v0] Supabase not configured, using fallback data")
    return NextResponse.json({ data: fallbackFeeds.slice(0, limit) })
  }

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
    console.log("[v0] Database error (tables may not exist yet):", error.message)
    return NextResponse.json({ data: fallbackFeeds.slice(0, limit) })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ data: fallbackFeeds.slice(0, limit) })
  }

  return NextResponse.json({ data })
}
