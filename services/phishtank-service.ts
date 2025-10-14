import { createClient } from "@/lib/supabase/server"

interface PhishTankEntry {
  phish_id: string
  url: string
  phish_detail_url: string
  submission_time: string
  verified: string
  verification_time: string
  online: string
  target: string
}

export class PhishTankService {
  private static readonly PHISHTANK_API = "http://data.phishtank.com/data/online-valid.json"

  /**
   * Fetch verified phishing URLs from PhishTank (Cisco Talos)
   */
  static async fetchPhishingURLs(): Promise<PhishTankEntry[]> {
    try {
      console.log("[v0] Fetching phishing URLs from PhishTank...")

      const response = await fetch(this.PHISHTANK_API, {
        headers: {
          "User-Agent": "AfroSecured/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`PhishTank API error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`[v0] Fetched ${data.length} phishing URLs from PhishTank`)

      return data
    } catch (error) {
      console.error("[v0] Error fetching from PhishTank:", error)
      return []
    }
  }

  /**
   * Ingest PhishTank data into database
   */
  static async ingestPhishingData(): Promise<number> {
    try {
      const phishingURLs = await this.fetchPhishingURLs()

      if (phishingURLs.length === 0) {
        return 0
      }

      const supabase = await createClient()
      let insertedCount = 0

      // Take only the most recent 100 entries to avoid overwhelming the database
      const recentPhishing = phishingURLs.slice(0, 100)

      for (const entry of recentPhishing) {
        // Insert into cybersecurity_articles table
        const { error } = await supabase.from("cybersecurity_articles").upsert(
          {
            title: `Phishing Site Detected: ${entry.target || "Unknown Target"}`,
            content: `Verified phishing URL targeting ${entry.target || "users"}. This site has been confirmed as malicious by Cisco Talos PhishTank community. Do not visit or enter credentials.`,
            url: entry.phish_detail_url,
            source: "PhishTank (Cisco Talos)",
            category: "phishing",
            threat_level: "critical",
            published_at: entry.verification_time || entry.submission_time,
            indicators: [entry.url],
            affected_regions: ["Global"],
            metadata: {
              phish_id: entry.phish_id,
              verified: entry.verified === "yes",
              online: entry.online === "yes",
              target: entry.target,
            },
          },
          {
            onConflict: "url",
          },
        )

        if (!error) {
          insertedCount++
        }
      }

      console.log(`[v0] Ingested ${insertedCount} phishing URLs from PhishTank`)
      return insertedCount
    } catch (error) {
      console.error("[v0] Error ingesting PhishTank data:", error)
      return 0
    }
  }

  /**
   * Check if a URL is in PhishTank database
   */
  static async checkURL(url: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("cybersecurity_articles")
        .select("id")
        .eq("source", "PhishTank (Cisco Talos)")
        .contains("indicators", [url])
        .limit(1)

      if (error) {
        console.error("[v0] Error checking URL in PhishTank:", error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error("[v0] Error checking URL:", error)
      return false
    }
  }
}
