interface VirusTotalResponse {
  data: {
    attributes: {
      last_analysis_stats: {
        malicious: number
        suspicious: number
        harmless: number
        undetected: number
      }
      last_analysis_results: Record<
        string,
        {
          category: string
          result: string
        }
      >
      reputation: number
    }
  }
}

export class VirusTotalClient {
  private apiKey: string
  private baseUrl = "https://www.virustotal.com/api/v3"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.VIRUSTOTAL_API_KEY || ""
  }

  async scanUrl(url: string): Promise<{
    malicious: number
    suspicious: number
    harmless: number
    total: number
    reputation: number
    detections: Array<{ vendor: string; result: string }>
  } | null> {
    if (!this.apiKey) {
      console.log("[v0] VirusTotal API key not configured, skipping scan")
      return null
    }

    try {
      // URL encode the URL for VirusTotal
      const urlId = Buffer.from(url).toString("base64").replace(/=/g, "")

      const response = await fetch(`${this.baseUrl}/urls/${urlId}`, {
        headers: {
          "x-apikey": this.apiKey,
        },
      })

      if (!response.ok) {
        // If URL not found, submit it for scanning
        if (response.status === 404) {
          await this.submitUrl(url)
          return null
        }
        throw new Error(`VirusTotal API error: ${response.status}`)
      }

      const data: VirusTotalResponse = await response.json()
      const stats = data.data.attributes.last_analysis_stats
      const results = data.data.attributes.last_analysis_results

      const detections = Object.entries(results)
        .filter(([_, result]) => result.category === "malicious")
        .map(([vendor, result]) => ({
          vendor,
          result: result.result,
        }))
        .slice(0, 10) // Top 10 detections

      return {
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        harmless: stats.harmless,
        total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected,
        reputation: data.data.attributes.reputation,
        detections,
      }
    } catch (error) {
      console.error("[v0] VirusTotal scan error:", error)
      return null
    }
  }

  async submitUrl(url: string): Promise<void> {
    if (!this.apiKey) return

    try {
      const formData = new FormData()
      formData.append("url", url)

      await fetch(`${this.baseUrl}/urls`, {
        method: "POST",
        headers: {
          "x-apikey": this.apiKey,
        },
        body: formData,
      })
    } catch (error) {
      console.error("[v0] VirusTotal submit error:", error)
    }
  }

  async scanIP(ip: string): Promise<{
    malicious: number
    suspicious: number
    harmless: number
    country: string
    asn: string
  } | null> {
    if (!this.apiKey) return null

    try {
      const response = await fetch(`${this.baseUrl}/ip_addresses/${ip}`, {
        headers: {
          "x-apikey": this.apiKey,
        },
      })

      if (!response.ok) return null

      const data = await response.json()
      const stats = data.data.attributes.last_analysis_stats

      return {
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        harmless: stats.harmless,
        country: data.data.attributes.country || "Unknown",
        asn: data.data.attributes.asn?.toString() || "Unknown",
      }
    } catch (error) {
      console.error("[v0] VirusTotal IP scan error:", error)
      return null
    }
  }
}
