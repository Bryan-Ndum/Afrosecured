import { type NextRequest, NextResponse } from "next/server"
import { CommunityReportingService } from "@/services/community-reporting-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const reportingService = new CommunityReportingService()

    const reportId = await reportingService.submitReport({
      reporterId: user.id,
      scamType: body.scamType,
      phoneNumber: body.phoneNumber,
      url: body.url,
      description: body.description,
      evidence: body.evidence,
      amount: body.amount,
    })

    return NextResponse.json({
      success: true,
      reportId,
      message: "Report submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Community report error:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const reportingService = new CommunityReportingService()
    const stats = await reportingService.getCommunityStats()
    const trending = await reportingService.getTrendingScams()

    return NextResponse.json({
      stats,
      trending,
    })
  } catch (error) {
    console.error("[v0] Get community data error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
