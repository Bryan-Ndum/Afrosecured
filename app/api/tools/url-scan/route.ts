import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const urlAnalysisSchema = z.object({
  threatScore: z.number().min(0).max(100),
  status: z.enum(["Safe", "Suspicious", "Dangerous"]),
  category: z.string(),
  threats: z.array(z.string()),
  recommendation: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("[v0] Scanning URL:", url)

    // Check against our database of known scam URLs
    const supabase = await createClient()
    const { data: knownScams } = await supabase
      .from("scam_feeds")
      .select("*")
      .or(`source_url.ilike.%${url}%,description.ilike.%${url}%`)
      .limit(5)

    // Use AI to analyze the URL
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: urlAnalysisSchema,
      prompt: `Analyze this URL for potential security threats: ${url}

Consider:
- Domain reputation and age
- SSL certificate status
- Known phishing patterns
- Suspicious URL structure (typosquatting, homograph attacks)
- Presence in threat databases

${knownScams && knownScams.length > 0 ? `This URL appears in our scam database ${knownScams.length} times.` : ""}

Provide a threat score (0-100), status (Safe/Suspicious/Dangerous), category, list of specific threats found, and a recommendation.`,
    })

    console.log("[v0] URL scan complete:", object)

    return NextResponse.json(object)
  } catch (error) {
    console.error("[v0] URL scan error:", error)
    return NextResponse.json({ error: "Failed to scan URL" }, { status: 500 })
  }
}
