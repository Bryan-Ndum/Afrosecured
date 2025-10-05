interface VisaRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  body?: any
  headers?: Record<string, string>
}

interface VisaResponse {
  success: boolean
  data?: any
  error?: string
  statusCode?: number
  details?: string
}

export class VisaClient {
  private cert: string
  private key: string
  private ca: string
  private baseUrl: string
  private userId: string
  private password: string
  private apiKey: string
  private isConfigured: boolean

  constructor() {
    console.log("[v0] ===== Initializing Visa Client =====")

    try {
      // Load credentials from environment variables
      this.cert = process.env.VISA_CERT_PEM || ""
      this.key = process.env.VISA_PRIVATE_KEY_PEM || ""
      this.ca = process.env.VISA_CA_BUNDLE_PEM || ""
      this.baseUrl = process.env.VISA_BASE_URL || "sandbox.api.visa.com"
      this.userId = process.env.VISA_USER_ID || ""
      this.password = process.env.VISA_PASSWORD || ""
      this.apiKey = process.env.VISA_API_KEY || ""

      this.isConfigured = !!(this.cert && this.key && this.ca && this.userId && this.password && this.apiKey)

      console.log("[v0] Visa Configuration Check:", {
        hasCert: !!this.cert,
        certLength: this.cert.length,
        hasKey: !!this.key,
        keyLength: this.key.length,
        hasCa: !!this.ca,
        caLength: this.ca.length,
        baseUrl: this.baseUrl,
        hasUserId: !!this.userId,
        userIdLength: this.userId.length,
        hasPassword: !!this.password,
        passwordLength: this.password.length,
        hasApiKey: !!this.apiKey,
        apiKeyLength: this.apiKey.length,
        isFullyConfigured: this.isConfigured,
      })

      if (!this.isConfigured) {
        console.warn("[v0] ⚠️  Visa credentials incomplete. Will use mock data.")
        console.warn("[v0] Missing:", {
          cert: !this.cert,
          key: !this.key,
          ca: !this.ca,
          userId: !this.userId,
          password: !this.password,
          apiKey: !this.apiKey,
        })
      } else {
        console.log("[v0] ✅ Visa credentials fully configured")
      }
    } catch (error) {
      console.error("[v0] ❌ Error initializing Visa Client:", error)
      this.isConfigured = false
      throw error
    }
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.userId}:${this.password}`).toString("base64")
    return `Basic ${credentials}`
  }

  async request(options: VisaRequestOptions): Promise<VisaResponse> {
    console.log("[v0] ===== Visa API Request =====")
    console.log("[v0] Method:", options.method)
    console.log("[v0] Path:", options.path)
    console.log("[v0] Has Body:", !!options.body)
    console.log("[v0] Is Configured:", this.isConfigured)

    // If not configured, return mock data immediately
    if (!this.isConfigured) {
      console.log("[v0] 🎭 Returning mock response (not configured)")
      return this.getMockResponse(options.path)
    }

    try {
      // For now, use mock data even when configured
      // TODO: Implement actual mTLS connection when certificates are properly formatted
      console.log("[v0] 🎭 Using mock response (mTLS implementation pending)")
      return this.getMockResponse(options.path)

      /* 
      // Real implementation would go here:
      const https = await import('https')
      const url = `https://${this.baseUrl}${options.path}`
      
      const agent = new https.Agent({
        cert: this.cert,
        key: this.key,
        ca: this.ca,
      })

      const response = await fetch(url, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json',
          'x-api-key': this.apiKey,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        // @ts-ignore - agent is not in standard fetch types
        agent,
      })

      const data = await response.json()
      return {
        success: response.ok,
        data,
        statusCode: response.status,
      }
      */
    } catch (error) {
      console.error("[v0] ❌ Visa API Request Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      }
    }
  }

  private getMockResponse(path: string): VisaResponse {
    console.log("[v0] Generating mock response for path:", path)

    // Mock responses for testing
    if (path.includes("helloworld")) {
      return {
        success: true,
        data: {
          message: "Hello World from Visa Developer Platform",
          timestamp: new Date().toISOString(),
          status: "connected",
          environment: "sandbox",
          note: "This is mock data. Configure Visa credentials to use live API.",
        },
        statusCode: 200,
      }
    }

    if (path.includes("aliasdirectory") || path.includes("resolve")) {
      return {
        success: true,
        data: {
          aliasResolution: {
            status: "verified",
            merchantName: "Verified Merchant",
            merchantId: "VISA_MERCHANT_123456",
            trustScore: 98,
            verificationDate: new Date().toISOString(),
            location: "United States",
            category: "E-commerce",
            note: "This is mock data. Configure Visa credentials to verify real merchants.",
          },
        },
        statusCode: 200,
      }
    }

    return {
      success: false,
      error: "Unknown endpoint",
      statusCode: 404,
    }
  }

  async testConnection(): Promise<VisaResponse> {
    console.log("[v0] ===== Testing Visa Connection =====")
    try {
      const result = await this.request({
        method: "GET",
        path: "/vdp/helloworld",
      })
      console.log("[v0] Test connection result:", result)
      return result
    } catch (error) {
      console.error("[v0] Test connection error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection test failed",
        details: error instanceof Error ? error.stack : undefined,
      }
    }
  }

  async resolveAlias(aliasId: string): Promise<VisaResponse> {
    console.log("[v0] ===== Resolving Alias =====")
    console.log("[v0] Alias ID:", aliasId)
    try {
      const result = await this.request({
        method: "POST",
        path: "/aliasdirectory/v1/resolve",
        body: {
          aliasId,
        },
      })
      console.log("[v0] Resolve alias result:", result)
      return result
    } catch (error) {
      console.error("[v0] Resolve alias error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Alias resolution failed",
        details: error instanceof Error ? error.stack : undefined,
      }
    }
  }
}
