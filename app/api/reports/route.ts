import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reporterEmail, scamType, title, description, location, evidenceUrls } = body

    // Validate required fields
    if (!scamType || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "verified"
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_reports")
    .select("id, scam_type, title, location, created_at, status")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
