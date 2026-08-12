import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const fallbackScam = {
  id: "fallback-2026-02",
  title: "INTERPOL Operation Red Card 2.0: Massive Africa-Wide Cybercrime Crackdown",
  description:
    "INTERPOL's Operation Red Card 2.0 has arrested 651 suspects across 16 African countries and recovered over $4.3 million. The eight-week operation (Dec 2025 - Jan 2026) targeted high-yield investment scams, mobile money fraud, and fraudulent mobile loan apps, uncovering schemes linked to over $45 million in losses and 1,247 identified victims. Authorities seized 2,341 devices and took down 1,442 malicious IPs and domains.",
  source: "INTERPOL",
  source_url: "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
  scam_type: "organized_crime",
  severity: "critical",
  location: "16 African Countries",
  tags: ["interpol", "mobile_money", "investment_fraud", "organized_crime", "operation_red_card"],
  created_at: new Date().toISOString(),
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      
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
    console.error("Trending scam API error:", error)
    return NextResponse.json({ data: fallbackScam })
  }
}
