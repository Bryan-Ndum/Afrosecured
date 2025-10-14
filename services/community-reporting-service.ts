import { createClient } from "@/lib/supabase/server"

interface ScamReport {
  reporterId: string
  scamType: "phishing" | "romance" | "investment" | "impersonation" | "other"
  phoneNumber?: string
  url?: string
  description: string
  evidence?: string[]
  amount?: number
}

interface ReportVerification {
  reportId: string
  verified: boolean
  confidence: number
  similarReports: number
}

export class CommunityReportingService {
  private supabase = createClient()

  // Submit scam report
  async submitReport(report: ScamReport): Promise<string> {
    try {
      // Insert report
      const { data, error } = await this.supabase
        .from("scam_reports")
        .insert({
          reporter_id: report.reporterId,
          scam_type: report.scamType,
          phone_number: report.phoneNumber,
          url: report.url,
          description: report.description,
          evidence: report.evidence,
          amount_lost: report.amount,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Auto-verify if similar reports exist
      await this.autoVerifyReport(data.id, report)

      // Update community stats
      await this.updateCommunityStats(report)

      return data.id
    } catch (error) {
      console.error("[v0] Submit report error:", error)
      throw error
    }
  }

  // Auto-verify report based on similar reports
  private async autoVerifyReport(reportId: string, report: ScamReport): Promise<void> {
    // Find similar reports
    const { data: similarReports } = await this.supabase
      .from("scam_reports")
      .select("*")
      .or(`phone_number.eq.${report.phoneNumber},url.eq.${report.url}`)
      .eq("status", "verified")

    const similarCount = similarReports?.length || 0

    // Auto-verify if 3+ similar reports
    if (similarCount >= 3) {
      await this.supabase
        .from("scam_reports")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
          confidence_score: Math.min(95, 60 + similarCount * 10),
        })
        .eq("id", reportId)

      // Add to blacklist
      if (report.phoneNumber) {
        await this.addToBlacklist(report.phoneNumber, "phone", report.scamType)
      }
      if (report.url) {
        await this.addToBlacklist(report.url, "url", report.scamType)
      }
    }
  }

  // Add to blacklist
  private async addToBlacklist(value: string, type: "phone" | "url", scamType: string): Promise<void> {
    await this.supabase.from("blacklist").upsert({
      value,
      type,
      scam_type: scamType,
      added_at: new Date().toISOString(),
      source: "community",
    })
  }

  // Update community statistics
  private async updateCommunityStats(report: ScamReport): Promise<void> {
    await this.supabase.rpc("increment_community_stat", {
      stat_name: `reports_${report.scamType}`,
      increment_by: 1,
    })

    if (report.amount) {
      await this.supabase.rpc("increment_community_stat", {
        stat_name: "total_amount_reported",
        increment_by: report.amount,
      })
    }
  }

  // Get community statistics
  async getCommunityStats(): Promise<any> {
    const { data } = await this.supabase.from("community_stats").select("*").single()

    return data
  }

  // Verify report manually
  async verifyReport(reportId: string, verified: boolean, adminId: string): Promise<void> {
    await this.supabase
      .from("scam_reports")
      .update({
        status: verified ? "verified" : "rejected",
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq("id", reportId)
  }

  // Get trending scams
  async getTrendingScams(limit = 10): Promise<any[]> {
    const { data } = await this.supabase
      .from("scam_reports")
      .select("scam_type, phone_number, url, count")
      .eq("status", "verified")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("count", { ascending: false })
      .limit(limit)

    return data || []
  }
}
