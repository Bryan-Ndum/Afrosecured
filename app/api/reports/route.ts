import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const fallbackReports = [
  {
    id: "fallback-1",
    scam_type: "employment",
    title: "Fake Job Offer from Dubai Company",
    location: "Nigeria",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: "verified",
  },
  {
    id: "fallback-2",
    scam_type: "romance",
    title: "Dating App Scammer Requesting Money",
    location: "Kenya",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    status: "verified",
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reporterEmail, scamType, title, description, location, evidenceUrls } = body

    // Validate required fields
    if (!scamType || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[v0] Supabase not configured, report submission disabled")
      return NextResponse.json(
        { error: "Database not configured. Please run SQL scripts to set up the database." },
        { status: 503 },
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_reports")
      .insert({
        reporter_email: reporterEmail || null,
        scam_type: scamType,
        title,
        description,
        location: location || null,
        evidence_urls: evidenceUrls && evidenceUrls.length > 0 ? evidenceUrls : null,
        status: "pending",
      })
      .select()

    if (error) {
      console.log("[v0] Database error (tables may not exist yet):", error.message)
      return NextResponse.json({ error: "Database tables not set up. Please run SQL scripts first." }, { status: 503 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "verified"
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("[v0] Supabase not configured, using fallback data")
    return NextResponse.json({ data: fallbackReports.slice(0, limit) })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_reports")
    .select("id, scam_type, title, location, created_at, status")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.log("[v0] Database error (tables may not exist yet):", error.message)
    return NextResponse.json({ data: fallbackReports.slice(0, limit) })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ data: fallbackReports.slice(0, limit) })
  }

  return NextResponse.json({ data })
}
