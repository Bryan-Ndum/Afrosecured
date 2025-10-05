import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const phoneLookupSchema = z.object({
  riskLevel: z.enum(["Low", "Medium", "High"]),
  reportCount: z.number(),
  type: z.string(),
  commonScams: z.array(z.string()),
  recommendation: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    console.log("[v0] Looking up phone:", phone)

    // Check against our database
    const supabase = await createClient()
    const { data: reports } = await supabase
      .from("user_reports")
      .select("*")
      .ilike("description", `%${phone}%`)
      .limit(10)

    const reportCount = reports?.length || 0

    // Use AI to analyze the phone number
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: phoneLookupSchema,
      prompt: `Analyze this phone number for potential scam activity: ${phone}

Database reports found: ${reportCount}

Consider:
- Number format and country code
- Common scam patterns (IRS scams, tech support, lottery, etc.)
- Spoofing indicators
- Report frequency

Provide risk level, report count, type of number, common scams associated, and recommendation.`,
    })

    console.log("[v0] Phone lookup complete:", object)

    return NextResponse.json({
      ...object,
      reportCount: Math.max(reportCount, object.reportCount),
    })
  } catch (error) {
    console.error("[v0] Phone lookup error:", error)
    return NextResponse.json({ error: "Failed to lookup phone number" }, { status: 500 })
  }
}
