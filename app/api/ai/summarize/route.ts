import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { content, title, url } = await request.json()

    if (!content || !title) {
      return NextResponse.json({ error: "Content and title are required" }, { status: 400 })
    }

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `Analyze this cybersecurity article and provide a concise summary for African users to protect themselves from scams and breaches.

Article Title: ${title}
Article Content: ${content.slice(0, 3000)}

Provide:
1. Risk Level (Critical/High/Medium/Low)
2. What Happened (2-3 sentences)
3. Who's Affected (specific regions/demographics if mentioned)
4. How to Stay Safe (3-4 actionable tips)

Format as JSON with keys: riskLevel, whatHappened, whoAffected, howToStaySafe (array)`,
      })

      // Parse AI response
      const summary = JSON.parse(text)

      return NextResponse.json({
        success: true,
        summary: {
          riskLevel: summary.riskLevel || "Medium",
          whatHappened: summary.whatHappened || "Security incident detected.",
          whoAffected: summary.whoAffected || "General public",
          howToStaySafe: summary.howToStaySafe || [
            "Stay vigilant and verify sources",
            "Enable two-factor authentication",
            "Monitor your accounts regularly",
          ],
        },
      })
    } catch (aiError) {
      console.log("[v0] AI API not available, using fallback summarization")

      const fallbackSummary = generateFallbackSummary(content, title)
      return NextResponse.json({
        success: true,
        summary: fallbackSummary,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("[v0] Summarization error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}

function generateFallbackSummary(content: string, title: string) {
  const text = content.toLowerCase()

  // Risk assessment based on keywords
  const criticalKeywords = ["breach", "hacked", "stolen", "ransomware", "zero-day"]
  const highKeywords = ["vulnerability", "exploit", "malware", "phishing", "scam"]

  let riskLevel = "Medium"
  if (criticalKeywords.some((k) => text.includes(k))) riskLevel = "Critical"
  else if (highKeywords.some((k) => text.includes(k))) riskLevel = "High"

  // Extract key sentences
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  const whatHappened = sentences.slice(0, 2).join(". ").trim() + "."

  // Detect affected regions
  const africanCountries = ["nigeria", "kenya", "ghana", "south africa", "egypt", "ethiopia"]
  const affectedRegions = africanCountries.filter((country) => text.includes(country))
  const whoAffected =
    affectedRegions.length > 0
      ? `Users in ${affectedRegions.join(", ")} and across Africa`
      : "African users and general public"

  return {
    riskLevel,
    whatHappened: whatHappened || title,
    whoAffected,
    howToStaySafe: [
      "Verify all communications before taking action",
      "Enable two-factor authentication on all accounts",
      "Keep software and systems updated",
      "Report suspicious activity immediately",
    ],
  }
}
