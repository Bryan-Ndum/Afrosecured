import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { AIContentGenerator } from "@/lib/ai-content-generator"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, type, email } = body

    if (!content || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get submitter IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // AI moderation
    const generator = new AIContentGenerator()
    const analysis = await generator.moderateSubmission({ content, type })

    // Store submission
    const { data: submission, error } = await supabase
      .from("community_submissions")
      .insert({
        submission_type: type,
        content,
        submitter_email: email,
        submitter_ip: ip,
        status: analysis.shouldPublish ? "approved" : "pending",
        ai_analysis: analysis,
        approved_at: analysis.shouldPublish ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // If auto-approved, publish to appropriate table
    if (analysis.shouldPublish && analysis.isLegitimate) {
      if (type === "scam_report") {
        await supabase.from("scam_reports").insert({
          scam_type: analysis.scamType,
          description: content,
          severity: analysis.severity,
          source: "community",
          verified: false,
          metadata: {
            submission_id: submission.id,
            ai_confidence: analysis.confidence,
          },
        })
      } else if (type === "phishing_url") {
        const urlMatch = content.match(/https?:\/\/[^\s]+/)
        if (urlMatch) {
          await supabase.from("phishing_urls").insert({
            url: urlMatch[0],
            verified: false,
            details: {
              submission_id: submission.id,
              description: content,
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      status: analysis.shouldPublish ? "published" : "pending_review",
      confidence: analysis.confidence,
    })
  } catch (error) {
    console.error("Community submission error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
