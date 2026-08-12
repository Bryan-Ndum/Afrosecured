import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Shown only until the cron job has pulled a fresh high-severity article.
const fallbackScam = {
  id: "fallback-2026-02",
  title: "INTERPOL Operation Red Card 2.0: Massive Africa-Wide Cybercrime Crackdown",
  description:
    "INTERPOL's Operation Red Card 2.0 has arrested 651 suspects across 16 African countries and recovered over $4.3 million. The eight-week operation (Dec 2025 - Jan 2026) targeted high-yield investment scams, mobile money fraud, and fraudulent mobile loan apps, uncovering schemes linked to over $45 million in losses and 1,247 identified victims. Authorities seized 2,341 devices and took down 1,442 malicious IPs and domains.",
  source: "INTERPOL",
  source_url:
    "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
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

    // Read the most recent high-severity article the cron job pulled from the web.
    const { data, error } = await supabase
      .from("cybersecurity_articles")
      .select("id, title, ai_summary, description, source, link, category, threat_level, pub_date, tags")
      .in("threat_level", ["critical", "high"])
      .order("pub_date", { ascending: false })
      .limit(1)

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: fallbackScam })
    }

    const article = data[0]
    return NextResponse.json({
      data: {
        id: article.id,
        title: article.title,
        description: article.ai_summary || article.description || "",
        source: article.source,
        source_url: article.link,
        scam_type: article.category || "Threat",
        severity: article.threat_level === "critical" ? "critical" : "high",
        location: "Global",
        tags: article.tags || [],
        created_at: article.pub_date,
      },
    })
  } catch (error) {
    console.error("Trending scam API error:", error)
    return NextResponse.json({ data: fallbackScam })
  }
}
