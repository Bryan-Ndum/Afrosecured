import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class CacheService {
  private static TTL = {
    TRUST_SCORE: 300, // 5 minutes
    THREAT_PATTERN: 3600, // 1 hour
    BLACKLIST: 1800, // 30 minutes
    PARTNER_CONFIG: 600, // 10 minutes
    ANALYTICS: 180, // 3 minutes
  }

  // Trust score caching
  static async getTrustScore(entityId: string): Promise<number | null> {
    const cached = await redis.get(`trust:${entityId}`)
    return cached ? Number(cached) : null
  }

  static async setTrustScore(entityId: string, score: number): Promise<void> {
    await redis.setex(`trust:${entityId}`, this.TTL.TRUST_SCORE, score)
  }

  // Blacklist caching
  static async isBlacklisted(phoneNumber: string): Promise<boolean | null> {
    const cached = await redis.get(`blacklist:${phoneNumber}`)
    return cached !== null ? cached === "true" : null
  }

  static async setBlacklisted(phoneNumber: string, isBlacklisted: boolean): Promise<void> {
    await redis.setex(`blacklist:${phoneNumber}`, this.TTL.BLACKLIST, isBlacklisted.toString())
  }

  // Threat pattern caching
  static async getThreatPatterns(): Promise<any[] | null> {
    const cached = await redis.get("threat:patterns")
    return cached ? JSON.parse(cached as string) : null
  }

  static async setThreatPatterns(patterns: any[]): Promise<void> {
    await redis.setex("threat:patterns", this.TTL.THREAT_PATTERN, JSON.stringify(patterns))
  }

  // Partner configuration caching
  static async getPartnerConfig(partnerId: string): Promise<any | null> {
    const cached = await redis.get(`partner:config:${partnerId}`)
    return cached ? JSON.parse(cached as string) : null
  }

  static async setPartnerConfig(partnerId: string, config: any): Promise<void> {
    await redis.setex(`partner:config:${partnerId}`, this.TTL.PARTNER_CONFIG, JSON.stringify(config))
  }

  // Analytics caching
  static async getAnalytics(partnerId: string, key: string): Promise<any | null> {
    const cached = await redis.get(`analytics:${partnerId}:${key}`)
    return cached ? JSON.parse(cached as string) : null
  }

  static async setAnalytics(partnerId: string, key: string, data: any): Promise<void> {
    await redis.setex(`analytics:${partnerId}:${key}`, this.TTL.ANALYTICS, JSON.stringify(data))
  }

  // Rate limit tracking
  static async incrementRateLimit(partnerId: string, window: string): Promise<number> {
    const key = `ratelimit:${partnerId}:${window}`
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, 60) // 1 minute window
    }
    return count
  }

  // Invalidation
  static async invalidateTrustScore(entityId: string): Promise<void> {
    await redis.del(`trust:${entityId}`)
  }

  static async invalidateBlacklist(phoneNumber: string): Promise<void> {
    await redis.del(`blacklist:${phoneNumber}`)
  }

  static async invalidatePartnerConfig(partnerId: string): Promise<void> {
    await redis.del(`partner:config:${partnerId}`)
  }

  // Bulk operations
  static async invalidateAll(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
}
