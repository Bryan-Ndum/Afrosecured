import { NextResponse } from "next/server"
import { localDB } from "@/lib/offline/local-threat-db"

// SMS-based number checking (works without app)
export async function POST(req: Request) {
  try {
    const { from, message } = await req.json()

    // Parse command from SMS
    const command = message.trim().toUpperCase()

    if (command.startsWith("CHECK ")) {
      const phoneNumber = command.replace("CHECK ", "").trim()

      // Check against local database
      const suspicious = await localDB.checkPhoneNumber(phoneNumber)

      if (suspicious) {
        return NextResponse.json({
          response: `⚠️ WARNING: ${phoneNumber} has been reported ${suspicious.reportCount} times for ${suspicious.scamType}. Be careful!`,
          risk: "high",
        })
      } else {
        return NextResponse.json({
          response: `✓ ${phoneNumber} has no scam reports. Stay vigilant!`,
          risk: "low",
        })
      }
    }

    if (command.startsWith("REPORT ")) {
      const phoneNumber = command.replace("REPORT ", "").trim()

      await localDB.reportPhoneNumber(phoneNumber, "user_reported")

      return NextResponse.json({
        response: `Thank you! ${phoneNumber} has been reported. We'll investigate and protect others.`,
        risk: "reported",
      })
    }

    if (command === "HELP") {
      return NextResponse.json({
        response: `AfroSecured SMS Commands:
CHECK [number] - Check if number is safe
REPORT [number] - Report scam number
STATUS - Get your protection status
HELP - Show this message`,
        risk: "info",
      })
    }

    return NextResponse.json({
      response: "Unknown command. Text HELP for available commands.",
      risk: "info",
    })
  } catch (error) {
    console.error("[v0] SMS check error:", error)
    return NextResponse.json({ error: "Failed to process SMS command" }, { status: 500 })
  }
}
