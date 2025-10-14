interface OTXPulse {
  id: string
  name: string
  description: string
  author_name: string
  created: string
  modified: string
  tags: string[]
  references: string[]
  indicators: OTXIndicator[]
}

interface OTXIndicator {
  id: string
  indicator: string
  type: string // IPv4, domain, URL, FileHash-SHA256, etc
  title: string
  description: string
  content: string
  created: string
}

export class AlienVaultClient {
  private readonly apiKey: string
  private readonly baseUrl = "https://otx.alienvault.com/api/v1"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ALIENVAULT_API_KEY || ""
  }

  private async request(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "X-OTX-API-KEY": this.apiKey,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`AlienVault API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getSubscribedPulses(limit = 50): Promise<OTXPulse[]> {
    const data = await this.request(`/pulses/subscribed?limit=${limit}`)
    return data.results || []
  }

  async getPulseIndicators(pulseId: string): Promise<OTXIndicator[]> {
    const data = await this.request(`/pulses/${pulseId}/indicators`)
    return data.results || []
  }

  async searchPulses(query: string): Promise<OTXPulse[]> {
    const data = await this.request(`/search/pulses?q=${encodeURIComponent(query)}`)
    return data.results || []
  }

  async syncToDatabase(supabase: any): Promise<{ added: number; updated: number }> {
    const pulses = await this.getSubscribedPulses(100)
    let added = 0
    const updated = 0

    for (const pulse of pulses) {
      const indicators = await this.getPulseIndicators(pulse.id)

      for (const indicator of indicators) {
        const { error } = await supabase.from("threat_indicators").upsert(
          {
            indicator_type: this.normalizeIndicatorType(indicator.type),
            indicator_value: indicator.indicator,
            threat_type: this.extractThreatType(pulse.tags),
            severity: this.calculateSeverity(pulse.tags),
            source: "alienvault",
            pulse_id: pulse.id,
            tags: pulse.tags,
            description: indicator.description || pulse.description,
            last_seen: new Date().toISOString(),
            metadata: {
              pulse_name: pulse.name,
              author: pulse.author_name,
              references: pulse.references,
            },
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "indicator_type,indicator_value,source",
          },
        )

        if (!error) {
          added++
        }
      }
    }

    return { added, updated }
  }

  private normalizeIndicatorType(type: string): string {
    const typeMap: Record<string, string> = {
      IPv4: "ip",
      IPv6: "ip",
      domain: "domain",
      hostname: "domain",
      URL: "url",
      "FileHash-SHA256": "hash",
      "FileHash-SHA1": "hash",
      "FileHash-MD5": "hash",
      email: "email",
    }
    return typeMap[type] || type.toLowerCase()
  }

  private extractThreatType(tags: string[]): string {
    const threatTypes = ["malware", "phishing", "botnet", "ransomware", "trojan", "apt"]
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase()
      for (const type of threatTypes) {
        if (lowerTag.includes(type)) {
          return type
        }
      }
    }
    return "unknown"
  }

  private calculateSeverity(tags: string[]): string {
    const criticalKeywords = ["critical", "severe", "ransomware", "apt"]
    const highKeywords = ["high", "dangerous", "malware", "trojan"]

    const lowerTags = tags.map((t) => t.toLowerCase())

    if (lowerTags.some((t) => criticalKeywords.some((k) => t.includes(k)))) {
      return "critical"
    }
    if (lowerTags.some((t) => highKeywords.some((k) => t.includes(k)))) {
      return "high"
    }
    return "medium"
  }
}
