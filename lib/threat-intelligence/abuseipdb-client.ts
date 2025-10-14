import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface AbuseIPDBResponse {
  data: {
    ipAddress: string
    abuseConfidenceScore: number
    countryCode: string
    usageType: string
    isp: string
    domain: string
    totalReports: number
    numDistinctUsers: number
    lastReportedAt: string
  }
}

/**
 * AbuseIPDB Client - Free IP reputation database
 * Free tier: 1,000 requests/day
 */
export class AbuseIPDBClient {
  private baseUrl = "https://api.abuseipdb.com/api/v2"
  private apiKey: string

  constructor() {
    this.apiKey = process.env.ABUSEIPDB_API_KEY || ""
  }

  /**
   * Check if an IP address is malicious
   */
  async checkIp(ipAddress: string): Promise<AbuseIPDBResponse | null> {
    if (!this.apiKey) {
      console.warn("[v0] AbuseIPDB API key not configured")
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/check?ipAddress=${ipAddress}&maxAgeInDays=90&verbose`, {
        headers: {
          Key: this.apiKey,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        console.error("[v0] AbuseIPDB API error:", response.statusText)
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] AbuseIPDB check failed:", error)
      return null
    }
  }

  /**
   * Get recently reported malicious IPs
   */
  async getRecentIps(limit = 50): Promise<any[]> {
    if (!this.apiKey) {
      console.warn("[v0] AbuseIPDB API key not configured")
      return []
    }

    try {
      const response = await fetch(`${this.baseUrl}/blacklist?confidenceMinimum=75&limit=${limit}`, {
        headers: {
          Key: this.apiKey,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        console.error("[v0] AbuseIPDB blacklist error:", response.statusText)
        return []
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error("[v0] AbuseIPDB blacklist failed:", error)
      return []
    }
  }

  /**
   * Sync malicious IPs to database
   */
  async syncToDatabase(): Promise<{ synced: number; errors: number }> {
    let synced = 0
    let errors = 0

    try {
      const recentIps = await this.getRecentIps(50)

      for (const ipData of recentIps) {
        try {
          const { error } = await supabase.from("threat_indicators").upsert(
            {
              indicator_type: "ip",
              indicator_value: ipData.ipAddress,
              threat_type: "malicious_ip",
              severity: this.mapScoreToSeverity(ipData.abuseConfidenceScore),
              source: "abuseipdb",
              first_seen: ipData.lastReportedAt,
              last_seen: new Date().toISOString(),
              metadata: {
                abuse_confidence_score: ipData.abuseConfidenceScore,
                country_code: ipData.countryCode,
                usage_type: ipData.usageType,
                isp: ipData.isp,
                total_reports: ipData.totalReports,
              },
            },
            {
              onConflict: "indicator_value,source",
            },
          )

          if (error) {
            console.error("[v0] AbuseIPDB sync error:", error)
            errors++
          } else {
            synced++
          }
        } catch (err) {
          console.error("[v0] AbuseIPDB item sync failed:", err)
          errors++
        }
      }

      await supabase.from("automation_logs").insert({
        job_name: "abuseipdb_sync",
        status: errors > 0 ? "partial_success" : "success",
        records_processed: recentIps.length,
        records_created: synced,
        execution_time_ms: 0,
        metadata: { synced, errors },
      })

      return { synced, errors }
    } catch (error) {
      console.error("[v0] AbuseIPDB sync failed:", error)

      await supabase.from("automation_logs").insert({
        job_name: "abuseipdb_sync",
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })

      return { synced, errors: errors + 1 }
    }
  }

  private mapScoreToSeverity(score: number): string {
    if (score >= 90) return "critical"
    if (score >= 75) return "high"
    if (score >= 50) return "medium"
    return "low"
  }
}
