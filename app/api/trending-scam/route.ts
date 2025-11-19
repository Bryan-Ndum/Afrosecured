import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const fallbackScam = {
  id: "fallback",
  title: "Organized Crime Rings Target International Students",
  description:
    "Sophisticated criminal networks are targeting international students in Canada with fake study permits, fraudulent acceptance letters, and bogus scholarship offers. These scams involve fake websites impersonating legitimate universities, forged immigration documents, and money laundering schemes that exploit vulnerable students seeking education abroad.",
  source: "University Affairs",
  source_url: "https://universityaffairs.ca/features/organized-criminals-target-international-students/",
  scam_type: "employment",
  severity: "high",
  location: "Canada, International",
  tags: ["education", "immigration", "fake_documents", "organized_crime"],
  created_at: new Date().toISOString(),
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log("[v0] Supabase not configured, using fallback data")
      return NextResponse.json({ data: fallbackScam })
    }

    const { createClient } = await import("@/lib/supabase/server")
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
      return NextResponse.json({ data: fallbackScam })
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
        return NextResponse.json({ data: fallbackScam })
      }

      return NextResponse.json({ data: fallbackData?.[0] || fallbackScam })
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ data: fallbackScam })
  }
}
