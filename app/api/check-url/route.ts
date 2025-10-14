import { NextResponse } from "next/server"
import { PhishTankService } from "@/services/phishtank-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Check PhishTank
    const isPhishing = await PhishTankService.checkURL(url)

    if (isPhishing) {
      return NextResponse.json({
        safe: false,
        threat_level: "critical",
        source: "PhishTank (Cisco Talos)",
        message: "This URL has been verified as a phishing site by Cisco Talos PhishTank",
        details: "Do not enter any personal information or credentials on this site.",
      })
    }

    // Check other threat sources
    const supabase = await createClient()
    const { data: threats } = await supabase
      .from("cybersecurity_articles")
      .select("*")
      .contains("indicators", [url])
      .limit(1)

    if (threats && threats.length > 0) {
      const threat = threats[0]
      return NextResponse.json({
        safe: false,
        threat_level: threat.threat_level,
        source: threat.source,
        message: `This URL has been flagged as ${threat.category}`,
        details: threat.content,
      })
    }

    return NextResponse.json({
      safe: true,
      message: "No threats detected for this URL",
      note: "Always exercise caution when visiting unfamiliar websites",
    })
  } catch (error) {
    console.error("[v0] Error checking URL:", error)
    return NextResponse.json({ error: "Failed to check URL" }, { status: 500 })
  }
}
