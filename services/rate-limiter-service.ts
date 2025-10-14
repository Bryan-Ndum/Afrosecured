import { createClient } from "@supabase/supabase-js"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

export class RateLimiterService {
  private supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Rate limit by API key
  async checkRateLimit(apiKey: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = new Date()
    const windowStart = new Date(now.getTime() - config.windowMs)

    // Count requests in current window
    const { data: requests, error } = await this.supabase
      .from("api_requests")
      .select("id")
      .eq("api_key", apiKey)
      .gte("created_at", windowStart.toISOString())

    if (error) {
      console.error("[v0] Rate limit check error:", error)
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(now.getTime() + config.windowMs),
      }
    }

    const requestCount = requests?.length || 0
    const remaining = Math.max(0, config.maxRequests - requestCount)
    const allowed = requestCount < config.maxRequests

    return {
      allowed,
      remaining,
      resetAt: new Date(now.getTime() + config.windowMs),
    }
  }

  // Get partner tier limits
  async getPartnerLimits(apiKey: string): Promise<RateLimitConfig> {
    const { data: partner } = await this.supabase.from("partners").select("tier").eq("api_key", apiKey).single()

    // Default limits by tier
    const limits: Record<string, RateLimitConfig> = {
      free: { maxRequests: 100, windowMs: 60000 }, // 100/min
      starter: { maxRequests: 1000, windowMs: 60000 }, // 1000/min
      growth: { maxRequests: 10000, windowMs: 60000 }, // 10k/min
      enterprise: { maxRequests: 100000, windowMs: 60000 }, // 100k/min
    }

    return limits[partner?.tier || "free"]
  }

  // Log API request
  async logRequest(apiKey: string, endpoint: string, method: string, statusCode: number, responseTime: number) {
    await this.supabase.from("api_requests").insert({
      api_key: apiKey,
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTime,
      created_at: new Date().toISOString(),
    })
  }
}
