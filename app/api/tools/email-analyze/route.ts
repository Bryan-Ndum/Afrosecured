import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

const emailAnalysisSchema = z.object({
  trustScore: z.number().min(0).max(100),
  verdict: z.enum(["Legitimate", "Suspicious", "Likely Phishing"]),
  sender: z.string(),
  warnings: z.array(z.string()),
  analysis: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { headers } = await request.json()

    if (!headers) {
      return NextResponse.json({ error: "Email headers are required" }, { status: 400 })
    }

    console.log("[v0] Analyzing email headers")

    // Use AI to analyze email headers
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: emailAnalysisSchema,
      prompt: `Analyze these email headers for phishing and spoofing indicators:

${headers}

Check for:
- SPF, DKIM, DMARC authentication
- Sender domain legitimacy
- Reply-To mismatches
- Suspicious routing
- Known phishing patterns
- Header inconsistencies

Provide trust score (0-100), verdict, sender email, list of warnings, and detailed analysis.`,
    })

    console.log("[v0] Email analysis complete:", object)

    return NextResponse.json(object)
  } catch (error) {
    console.error("[v0] Email analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze email" }, { status: 500 })
  }
}
