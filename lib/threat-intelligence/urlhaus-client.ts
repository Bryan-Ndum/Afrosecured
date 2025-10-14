import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface URLhausResponse {
  query_status: string
  url?: string
  url_status?: string
  threat?: string
  tags?: string[]
  urlhaus_reference?: string
}

/**
 * URLhaus Client - Free malware URL database by abuse.ch
 * No API key required, completely free
 */
export class URLhausClient {
  private baseUrl = "https://urlhaus-api.abuse.ch/v1"

  /**
   * Check if a URL is malicious
   */
  async checkUrl(url: string): Promise<URLhausResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/url/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `url=${encodeURIComponent(url)}`,
      })

      if (!response.ok) {
        console.error("[v0] URLhaus API error:", response.statusText)
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] URLhaus check failed:", error)
      return null
    }
  }

  /**
   * Get recent malware URLs (last 24 hours)
   */
  async getRecentUrls(limit = 100): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/urls/recent/limit/${limit}/`)

      if (!response.ok) {
        console.error("[v0] URLhaus recent URLs error:", response.statusText)
        return []
      }

      const data = await response.json()
      return data.urls || []
    } catch (error) {
      console.error("[v0] URLhaus recent URLs failed:", error)
      return []
    }
  }

  /**
   * Sync recent malware URLs to database
   */
  async syncToDatabase(): Promise<{ synced: number; errors: number }> {
    let synced = 0
    let errors = 0

    try {
      const recentUrls = await this.getRecentUrls(50)

      for (const urlData of recentUrls) {
        try {
          const { error } = await supabase.from("threat_indicators").upsert(
            {
              indicator_type: "url",
              indicator_value: urlData.url,
              threat_type: urlData.threat || "malware",
              severity: this.mapThreatToSeverity(urlData.threat),
              source: "urlhaus",
              first_seen: urlData.dateadded,
              last_seen: new Date().toISOString(),
              metadata: {
                url_status: urlData.url_status,
                tags: urlData.tags,
                urlhaus_reference: urlData.urlhaus_reference,
                reporter: urlData.reporter,
              },
            },
            {
              onConflict: "indicator_value,source",
            },
          )

          if (error) {
            console.error("[v0] URLhaus sync error:", error)
            errors++
          } else {
            synced++
          }
        } catch (err) {
          console.error("[v0] URLhaus item sync failed:", err)
          errors++
        }
      }

      // Log sync activity
      await supabase.from("automation_logs").insert({
        job_name: "urlhaus_sync",
        status: errors > 0 ? "partial_success" : "success",
        records_processed: recentUrls.length,
        records_created: synced,
        execution_time_ms: 0,
        metadata: { synced, errors },
      })

      return { synced, errors }
    } catch (error) {
      console.error("[v0] URLhaus sync failed:", error)

      await supabase.from("automation_logs").insert({
        job_name: "urlhaus_sync",
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })

      return { synced, errors: errors + 1 }
    }
  }

  private mapThreatToSeverity(threat?: string): string {
    if (!threat) return "medium"

    const lowerThreat = threat.toLowerCase()
    if (lowerThreat.includes("ransomware") || lowerThreat.includes("trojan")) {
      return "critical"
    }
    if (lowerThreat.includes("malware") || lowerThreat.includes("phishing")) {
      return "high"
    }
    return "medium"
  }
}
