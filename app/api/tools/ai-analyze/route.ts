import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

const scamAnalysisSchema = z.object({
  threatScore: z.number().min(0).max(100),
  summary: z.string(),
  indicators: z.array(
    z.object({
      type: z.string(),
      severity: z.enum(["high", "medium", "low"]),
      description: z.string(),
    }),
  ),
  recommendations: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    console.log("[v0] Analyzing content with AI...")

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: scamAnalysisSchema,
      prompt: `You are a cybersecurity expert analyzing potentially fraudulent content. Analyze the following message and provide a detailed scam assessment.

Content to analyze:
"""
${content}
"""

Look for common scam indicators like:
- Urgency and pressure tactics
- Requests for personal information or money
- Suspicious links or contact methods
- Grammar and spelling errors
- Too-good-to-be-true offers
- Impersonation attempts
- Emotional manipulation
- Unusual payment methods

Provide a threat score from 0-100 where:
- 0-30: Low risk (likely legitimate)
- 31-70: Medium risk (suspicious elements)
- 71-100: High risk (likely scam)

Analyze the content and return:
1. A threatScore (0-100)
2. A brief summary of the threat assessment
3. An array of indicators found (each with type, severity, and description)
4. An array of actionable recommendations`,
    })

    console.log("[v0] AI analysis complete")

    return NextResponse.json(object)
  } catch (error) {
    console.error("[v0] AI analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
