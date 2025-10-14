import { createClient } from "@/lib/supabase/server"

interface SyncPackage {
  version: number
  threatPatterns: any[]
  blacklistedNumbers: any[]
  scamKeywords: any[]
  mlModelWeights: number[]
  lastUpdated: string
}

export class OfflineSyncService {
  private supabase = createClient()

  async generateSyncPackage(): Promise<SyncPackage> {
    const [threatPatterns, blacklistedNumbers, scamKeywords, mlModel] = await Promise.all([
      this.getThreatPatterns(),
      this.getBlacklistedNumbers(),
      this.getScamKeywords(),
      this.getMLModel(),
    ])

    return {
      version: Date.now(),
      threatPatterns,
      blacklistedNumbers,
      scamKeywords,
      mlModelWeights: mlModel,
      lastUpdated: new Date().toISOString(),
    }
  }

  private async getThreatPatterns(): Promise<any[]> {
    const { data } = await this.supabase
      .from("threat_patterns")
      .select("*")
      .eq("is_active", true)
      .order("severity", { ascending: false })
      .limit(1000)

    return data || []
  }

  private async getBlacklistedNumbers(): Promise<any[]> {
    const { data } = await this.supabase
      .from("blacklisted_numbers")
      .select("phone_number, reason, severity, reports_count")
      .gte("reports_count", 3)
      .order("reports_count", { ascending: false })
      .limit(5000)

    return data || []
  }

  private async getScamKeywords(): Promise<any[]> {
    const { data } = await this.supabase
      .from("scam_keywords")
      .select("keyword, category, weight")
      .eq("is_active", true)
      .order("weight", { ascending: false })

    return data || []
  }

  private async getMLModel(): Promise<number[]> {
    const { data } = await this.supabase
      .from("ml_models")
      .select("weights")
      .eq("model_type", "fraud_detection")
      .order("trained_at", { ascending: false })
      .limit(1)
      .single()

    return data?.weights || []
  }

  async compressSyncPackage(syncPackage: SyncPackage): Promise<Buffer> {
    const json = JSON.stringify(syncPackage)
    // In production, use actual compression (gzip/brotli)
    return Buffer.from(json)
  }

  async recordSync(deviceId: string, version: number): Promise<void> {
    await this.supabase.from("device_syncs").insert({
      device_id: deviceId,
      sync_version: version,
      synced_at: new Date().toISOString(),
    })
  }

  async getDeviceLastSync(deviceId: string): Promise<number> {
    const { data } = await this.supabase
      .from("device_syncs")
      .select("sync_version")
      .eq("device_id", deviceId)
      .order("synced_at", { ascending: false })
      .limit(1)
      .single()

    return data?.sync_version || 0
  }
}
