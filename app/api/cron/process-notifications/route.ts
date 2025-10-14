import { type NextRequest, NextResponse } from "next/server"
import { NotificationService } from "@/services/notification-service"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await NotificationService.processQueue()

    return NextResponse.json({
      success: true,
      message: "Notification queue processed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Process notifications error:", error)
    return NextResponse.json({ error: "Failed to process notifications" }, { status: 500 })
  }
}
