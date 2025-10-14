import { createClient } from "@supabase/supabase-js"

interface AnalyticsData {
  totalTransactions: number
  blockedTransactions: number
  fraudPrevented: number
  topRiskyNumbers: Array<{ number: string; riskScore: number; count: number }>
  fraudTrends: Array<{ date: string; count: number; amount: number }>
  channelBreakdown: Array<{ channel: string; count: number; fraudRate: number }>
}

export class AnalyticsService {
  private supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  async getPartnerAnalytics(partnerId: string, startDate: Date, endDate: Date): Promise<AnalyticsData> {
    // Total transactions
    const { count: totalTransactions } = await this.supabase
      .from("verification_results")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", partnerId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    // Blocked transactions
    const { count: blockedTransactions } = await this.supabase
      .from("verification_results")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", partnerId)
      .eq("action", "block")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    // Fraud prevented amount
    const { data: blockedData } = await this.supabase
      .from("verification_results")
      .select("amount")
      .eq("partner_id", partnerId)
      .eq("action", "block")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    const fraudPrevented = blockedData?.reduce((sum, r) => sum + Number.parseFloat(r.amount), 0) || 0

    // Top risky numbers
    const { data: riskyNumbers } = await this.supabase
      .from("verification_results")
      .select("sender, risk_score")
      .eq("partner_id", partnerId)
      .gte("risk_score", 60)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("risk_score", { ascending: false })
      .limit(100)

    const numberCounts = new Map<string, { score: number; count: number }>()
    riskyNumbers?.forEach((r) => {
      const existing = numberCounts.get(r.sender) || { score: 0, count: 0 }
      numberCounts.set(r.sender, {
        score: Math.max(existing.score, r.risk_score),
        count: existing.count + 1,
      })
    })

    const topRiskyNumbers = Array.from(numberCounts.entries())
      .map(([number, data]) => ({
        number,
        riskScore: data.score,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Fraud trends (daily)
    const { data: trendsData } = await this.supabase
      .from("verification_results")
      .select("created_at, amount, action")
      .eq("partner_id", partnerId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true })

    const dailyTrends = new Map<string, { count: number; amount: number }>()
    trendsData?.forEach((r) => {
      if (r.action === "block") {
        const date = new Date(r.created_at).toISOString().split("T")[0]
        const existing = dailyTrends.get(date) || { count: 0, amount: 0 }
        dailyTrends.set(date, {
          count: existing.count + 1,
          amount: existing.amount + Number.parseFloat(r.amount),
        })
      }
    })

    const fraudTrends = Array.from(dailyTrends.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Channel breakdown
    const { data: channelData } = await this.supabase
      .from("verification_results")
      .select("channel, action")
      .eq("partner_id", partnerId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    const channelStats = new Map<string, { total: number; fraud: number }>()
    channelData?.forEach((r) => {
      const existing = channelStats.get(r.channel) || { total: 0, fraud: 0 }
      channelStats.set(r.channel, {
        total: existing.total + 1,
        fraud: existing.fraud + (r.action === "block" ? 1 : 0),
      })
    })

    const channelBreakdown = Array.from(channelStats.entries())
      .map(([channel, data]) => ({
        channel,
        count: data.total,
        fraudRate: (data.fraud / data.total) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      totalTransactions: totalTransactions || 0,
      blockedTransactions: blockedTransactions || 0,
      fraudPrevented,
      topRiskyNumbers,
      fraudTrends,
      channelBreakdown,
    }
  }
}
