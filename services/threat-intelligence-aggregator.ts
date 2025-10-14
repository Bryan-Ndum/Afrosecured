import { createClient } from "@/lib/supabase/server"

interface ThreatIndicator {
  type: "ip" | "domain" | "url" | "hash" | "phone"
  value: string
  source: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  first_seen: string
  last_seen: string
}

export class ThreatIntelligenceAggregator {
  private async fetchAlienVault(): Promise<ThreatIndicator[]> {
    const apiKey = process.env.ALIENVAULT_API_KEY
    if (!apiKey) {
      console.log("[v0] AlienVault API key not found, skipping")
      return []
    }

    try {
      const response = await fetch("https://otx.alienvault.com/api/v1/pulses/subscribed", {
        headers: { "X-OTX-API-KEY": apiKey },
      })

      if (!response.ok) {
        console.log("[v0] AlienVault API error:", response.status)
        return []
      }

      const data = await response.json()

      const indicators: ThreatIndicator[] = []
      for (const pulse of data.results?.slice(0, 10) || []) {
        for (const indicator of pulse.indicators?.slice(0, 5) || []) {
          indicators.push({
            type: indicator.type === "IPv4" ? "ip" : "domain",
            value: indicator.indicator,
            source: "AlienVault OTX",
            severity: "high",
            description: pulse.description || "Threat detected",
            first_seen: pulse.created,
            last_seen: pulse.modified,
          })
        }
      }
      return indicators
    } catch (error) {
      console.log("[v0] AlienVault fetch failed, skipping:", error)
      return []
    }
  }

  private async fetchAbuseIPDB(): Promise<ThreatIndicator[]> {
    const apiKey = process.env.ABUSEIPDB_API_KEY
    if (!apiKey) {
      console.log("[v0] AbuseIPDB API key not found, skipping")
      return []
    }

    try {
      const response = await fetch("https://api.abuseipdb.com/api/v2/blacklist?limit=100", {
        headers: { Key: apiKey, Accept: "application/json" },
      })

      if (!response.ok) {
        console.log("[v0] AbuseIPDB API error:", response.status)
        return []
      }

      const data = await response.json()

      return (data.data || []).map((item: any) => ({
        type: "ip" as const,
        value: item.ipAddress,
        source: "AbuseIPDB",
        severity: item.abuseConfidenceScore > 75 ? "critical" : "high",
        description: `Malicious IP with ${item.abuseConfidenceScore}% confidence`,
        first_seen: item.lastReportedAt,
        last_seen: item.lastReportedAt,
      }))
    } catch (error) {
      console.log("[v0] AbuseIPDB fetch failed, skipping:", error)
      return []
    }
  }

  async aggregateThreats(): Promise<void> {
    console.log("[v0] Starting threat aggregation...")

    const [alienVault, abuseIPDB] = await Promise.all([this.fetchAlienVault(), this.fetchAbuseIPDB()])

    const allThreats = [...alienVault, ...abuseIPDB]
    console.log(`[v0] Aggregated ${allThreats.length} threats`)

    if (allThreats.length === 0) {
      console.log("[v0] No threats to save")
      return
    }

    // Save to database
    const supabase = await createClient()

    for (const threat of allThreats) {
      try {
        await supabase.from("cybersecurity_articles").insert({
          title: `${threat.type.toUpperCase()} Threat: ${threat.value}`,
          content: threat.description,
          source: threat.source,
          source_url: null,
          published_at: threat.first_seen,
          threat_level: threat.severity,
          category: "threat-intelligence",
          tags: [threat.type, threat.severity],
        })
      } catch (error) {
        console.log("[v0] Failed to save threat:", error)
      }
    }

    console.log("[v0] Threat aggregation complete")
  }
}
