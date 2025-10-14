interface PhishTankResponse {
  meta: {
    timestamp: string
    status: string
  }
  results: {
    url: string
    in_database: boolean
    phish_id?: string
    phish_detail_url?: string
    verified?: boolean
    verified_at?: string
    valid?: boolean
  }
}

interface PhishTankBulkData {
  phish_id: string
  url: string
  phish_detail_url: string
  submission_time: string
  verified: string
  verification_time: string
  online: string
  target: string
}

export class PhishTankClient {
  private readonly apiKey: string
  private readonly baseUrl = "http://checkurl.phishtank.com/checkurl/"
  private readonly dataUrl = "http://data.phishtank.com/data/online-valid.json"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PHISHTANK_API_KEY || ""
  }

  async checkUrl(url: string): Promise<PhishTankResponse> {
    const formData = new URLSearchParams()
    formData.append("url", url)
    formData.append("format", "json")
    if (this.apiKey) {
      formData.append("app_key", this.apiKey)
    }

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`PhishTank API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getBulkData(): Promise<PhishTankBulkData[]> {
    const response = await fetch(this.dataUrl, {
      headers: {
        "User-Agent": "AfroSecured/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`PhishTank bulk data error: ${response.statusText}`)
    }

    return response.json()
  }

  async syncToDatabase(supabase: any): Promise<{ added: number; updated: number }> {
    const data = await this.getBulkData()
    let added = 0
    const updated = 0

    // Process in batches of 100
    for (let i = 0; i < data.length; i += 100) {
      const batch = data.slice(i, i + 100)

      for (const item of batch) {
        const { error } = await supabase.from("phishing_urls").upsert(
          {
            url: item.url,
            phish_id: item.phish_id,
            verified: item.verified === "yes",
            verification_time: item.verification_time,
            target: item.target,
            submission_time: item.submission_time,
            details: item,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "url",
          },
        )

        if (!error) {
          added++
        }
      }
    }

    return { added, updated }
  }
}
