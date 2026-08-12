import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Shown only when the database has no pulled articles yet.
const fallbackFeeds = [
  {
    id: "fallback-1",
    title: "INTERPOL Operation Red Card 2.0: 651 Arrested Across 16 African Countries",
    description:
      "INTERPOL's latest operation dismantled cybercrime networks across Africa, recovering $4.3 million and identifying 1,247 victims.",
    source: "INTERPOL",
    source_url:
      "https://www.interpol.int/News-and-Events/News/2026/Major-operation-in-Africa-targeting-online-scams-nets-651-arrests-recovers-USD-4.3-million",
    scam_type: "news",
    severity: "high",
    location: "Africa",
    is_trending: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "fallback-2",
    title: "AI Deepfake Crypto Scams Surge 500%",
    description:
      "Scammers are using AI-generated celebrity impersonations and fake chatbots to promote fraudulent cryptocurrency platforms.",
    source: "Malwarebytes",
    source_url:
      "https://www.malwarebytes.com/blog/ai/2026/02/scammers-use-fake-gemini-ai-chatbot-to-sell-fake-google-coin",
    scam_type: "news",
    severity: "high",
    location: "Global",
    is_trending: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

function mapSeverity(threatLevel?: string | null): "high" | "medium" | "low" {
  if (threatLevel === "critical" || threatLevel === "high") return "high"
  if (threatLevel === "medium") return "medium"
  return "low"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const trending = searchParams.get("trending")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ data: fallbackFeeds.slice(0, limit) })
  }

  try {
    const supabase = await createClient()

    // Read from the table the cron job populates with freshly-pulled articles.
    let query = supabase
      .from("cybersecurity_articles")
      .select("id, title, ai_summary, description, source, link, category, threat_level, pub_date, tags")
      .order("pub_date", { ascending: false })
      .limit(limit)

    // "Security Alerts" surface only higher-severity, actively trending items.
    if (trending === "true") {
      query = query.in("threat_level", ["critical", "high"])
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: fallbackFeeds.slice(0, limit) })
    }

    const mapped = data.map((article) => ({
      id: article.id,
      source: article.source,
      title: article.title,
      description: article.ai_summary || article.description || "",
      scam_type: type === "news" ? "News" : article.category || "Threat",
      severity: mapSeverity(article.threat_level),
      is_trending: article.threat_level === "critical" || article.threat_level === "high",
      created_at: article.pub_date,
      url: article.link,
      source_url: article.link,
      tags: article.tags || [],
    }))

    return NextResponse.json({ data: mapped })
  } catch {
    return NextResponse.json({ data: fallbackFeeds.slice(0, limit) })
  }
}
