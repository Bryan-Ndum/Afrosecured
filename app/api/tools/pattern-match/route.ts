import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const patternMatchSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedPatterns: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      confidence: z.number(),
    }),
  ),
  analysis: z.string(),
  recommendation: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    console.log("[v0] Matching scam patterns")

    // Get known scam patterns from database
    const supabase = await createClient()
    const { data: knownScams } = await supabase.from("scam_feeds").select("title, description, scam_type").limit(50)

    const scamPatterns = knownScams?.map((s) => `${s.scam_type}: ${s.title}`).join("\n") || ""

    // Use AI to match patterns
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: patternMatchSchema,
      prompt: `Analyze this text for known scam patterns:

${text}

Known scam patterns in our database:
${scamPatterns}

Look for:
- Urgency tactics
- Too-good-to-be-true offers
- Request for personal information
- Payment pressure
- Impersonation attempts
- Grammar/spelling issues
- Suspicious links or contact methods

Provide match score (0-100), list of matched patterns with confidence levels, detailed analysis, and recommendation.`,
    })

    console.log("[v0] Pattern matching complete:", object)

    return NextResponse.json(object)
  } catch (error) {
    console.error("[v0] Pattern matching error:", error)
    return NextResponse.json({ error: "Failed to match patterns" }, { status: 500 })
  }
}
