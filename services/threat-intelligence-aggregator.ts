import { createClient } from "@/lib/supabase/server"

export class ThreatIntelligenceAggregator {
  private supabase = createClient()

  async aggregateThreats() {
    console.log("[v0] Starting threat intelligence aggregation...")

    await Promise.all([
      this.fetchAlienVaultThreats(),
      this.fetchVirusTotalThreats(),
      this.fetchAbuseIPDBThreats(),
      this.fetchCommunityReports(),
    ])

    console.log("[v0] Threat intelligence aggregation complete")
  }

  private async fetchAlienVaultThreats() {
    const apiKey = process.env.ALIENVAULT_API_KEY
    if (!apiKey) return

    try {
      const response = await fetch("https://otx.alienvault.com/api/v1/pulses/subscribed", {
        headers: { "X-OTX-API-KEY": apiKey },
      })

      const data = await response.json()

      for (const pulse of data.results || []) {
        for (const indicator of pulse.indicators || []) {
          if (indicator.type === "URL" || indicator.type === "domain") {
            await this.supabase.from("threat_patterns").upsert({
              pattern_type: "url",
              pattern_value: indicator.indicator,
              threat_type: pulse.tags?.join(",") || "phishing",
              severity: "high",
              source: "alienvault",
              confidence: 0.8,
            })
          }
        }
      }
    } catch (error) {
      console.error("[v0] AlienVault fetch error:", error)
    }
  }

  private async fetchVirusTotalThreats() {
    const apiKey = process.env.VIRUSTOTAL_API_KEY
    if (!apiKey) return

    // Fetch recent malicious URLs from VirusTotal
    // Implementation depends on VirusTotal API access level
  }

  private async fetchAbuseIPDBThreats() {
    const apiKey = process.env.ABUSEIPDB_API_KEY
    if (!apiKey) return

    try {
      const response = await fetch("https://api.abuseipdb.com/api/v2/blacklist", {
        headers: { Key: apiKey },
      })

      const data = await response.json()

      for (const entry of data.data || []) {
        await this.supabase.from("blacklisted_numbers").upsert({
          phone_number: entry.ipAddress,
          reason: `AbuseIPDB: ${entry.abuseConfidenceScore}% confidence`,
          source: "abuseipdb",
          severity: entry.abuseConfidenceScore > 80 ? "critical" : "high",
        })
      }
    } catch (error) {
      console.error("[v0] AbuseIPDB fetch error:", error)
    }
  }

  private async fetchCommunityReports() {
    // Aggregate user-submitted scam reports
    const { data: reports } = await this.supabase
      .from("scam_reports")
      .select("reported_number, scam_type, count")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const numberCounts = new Map<string, number>()

    reports?.forEach((report) => {
      const current = numberCounts.get(report.reported_number) || 0
      numberCounts.set(report.reported_number, current + 1)
    })

    for (const [number, count] of numberCounts.entries()) {
      if (count >= 3) {
        await this.supabase.from("blacklisted_numbers").upsert({
          phone_number: number,
          reason: `${count} community reports in past 7 days`,
          source: "community",
          severity: count > 10 ? "critical" : "high",
        })
      }
    }
  }
}
