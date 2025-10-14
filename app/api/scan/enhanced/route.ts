import { type NextRequest, NextResponse } from "next/server"
import { VirusTotalClient } from "@/lib/threat-intelligence/virustotal-client"
import { AlienVaultClient } from "@/lib/threat-intelligence/alienvault-client"
import { AbuseIPDBClient } from "@/lib/threat-intelligence/abuseipdb-client"
import { URLhausClient } from "@/lib/threat-intelligence/urlhaus-client"

export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL or IP address is required" }, { status: 400 })
    }

    // Initialize all threat intelligence clients
    const virusTotal = new VirusTotalClient()
    const alienVault = new AlienVaultClient()
    const abuseIPDB = new AbuseIPDBClient()
    const urlhaus = new URLhausClient()

    // Run all scans in parallel
    const [vtResult, avResult, abuseResult, urlhausResult] = await Promise.all([
      type === "url" ? virusTotal.scanUrl(url) : virusTotal.scanIP(url),
      type === "ip" ? alienVault.getIPReputation(url) : null,
      type === "ip" ? abuseIPDB.checkIP(url) : null,
      type === "url" ? urlhaus.checkURL(url) : null,
    ])

    // Calculate overall risk score
    let riskScore = 0
    let maxScore = 0
    const threats: string[] = []

    // VirusTotal scoring
    if (vtResult) {
      maxScore += 100
      const vtRisk = (vtResult.malicious / vtResult.total) * 100
      riskScore += vtRisk
      if (vtResult.malicious > 0) {
        threats.push(`${vtResult.malicious} security vendors flagged this as malicious`)
      }
    }

    // AlienVault scoring
    if (avResult) {
      maxScore += 100
      riskScore += avResult.reputation * 100
      if (avResult.pulseCount > 0) {
        threats.push(`Found in ${avResult.pulseCount} threat intelligence reports`)
      }
    }

    // AbuseIPDB scoring
    if (abuseResult) {
      maxScore += 100
      riskScore += abuseResult.abuseConfidenceScore
      if (abuseResult.totalReports > 0) {
        threats.push(`${abuseResult.totalReports} abuse reports from ${abuseResult.numDistinctUsers} users`)
      }
    }

    // URLhaus scoring
    if (urlhausResult) {
      maxScore += 100
      if (urlhausResult.threat) {
        riskScore += 100
        threats.push(`Known malware distribution: ${urlhausResult.threat}`)
      }
    }

    // Normalize risk score to 0-100
    const normalizedRisk = maxScore > 0 ? (riskScore / maxScore) * 100 : 0

    return NextResponse.json({
      url,
      type,
      riskScore: Math.round(normalizedRisk),
      riskLevel: normalizedRisk > 70 ? "high" : normalizedRisk > 40 ? "medium" : "low",
      threats,
      details: {
        virusTotal: vtResult,
        alienVault: avResult,
        abuseIPDB: abuseResult,
        urlhaus: urlhausResult,
      },
      scannedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Enhanced scan error:", error)
    return NextResponse.json({ error: "Failed to perform enhanced scan" }, { status: 500 })
  }
}
