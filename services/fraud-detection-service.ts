import { createClient } from "@/lib/supabase/server"

interface Transaction {
  amount: number
  recipient: string
  sender: string
  timestamp: Date
  method: "mpesa" | "mtn" | "airtel" | "bank"
  metadata?: Record<string, any>
}

interface FraudAnalysis {
  isFraud: boolean
  confidence: number
  riskScore: number
  reasons: string[]
  blockedPatterns: string[]
  recommendations: string[]
}

export class FraudDetectionService {
  private supabase = createClient()

  async analyzeTransaction(transaction: Transaction): Promise<FraudAnalysis> {
    const checks = await Promise.all([
      this.checkBlacklist(transaction.recipient),
      this.checkVelocity(transaction.sender),
      this.checkAmount(transaction.amount),
      this.checkTimePattern(transaction.timestamp),
      this.checkRecipientHistory(transaction.recipient),
      this.checkSenderBehavior(transaction.sender, transaction.amount),
    ])

    const riskScore = this.calculateRiskScore(checks)
    const isFraud = riskScore > 70

    return {
      isFraud,
      confidence: riskScore / 100,
      riskScore,
      reasons: checks.flatMap((c) => c.reasons),
      blockedPatterns: checks.flatMap((c) => c.patterns),
      recommendations: this.generateRecommendations(riskScore, checks),
    }
  }

  private async checkBlacklist(recipient: string) {
    const { data } = await this.supabase.from("blacklisted_numbers").select("*").eq("phone_number", recipient).single()

    if (data) {
      return {
        risk: 100,
        reasons: [`Recipient ${recipient} is blacklisted: ${data.reason}`],
        patterns: ["blacklisted_recipient"],
      }
    }

    return { risk: 0, reasons: [], patterns: [] }
  }

  private async checkVelocity(sender: string) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const { data: recentTransactions } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("sender", sender)
      .gte("created_at", fiveMinutesAgo.toISOString())

    const count = recentTransactions?.length || 0

    if (count > 5) {
      return {
        risk: 80,
        reasons: [`${count} transactions in 5 minutes - unusual velocity`],
        patterns: ["high_velocity"],
      }
    }

    if (count > 3) {
      return {
        risk: 50,
        reasons: [`${count} transactions in 5 minutes - moderate velocity`],
        patterns: ["moderate_velocity"],
      }
    }

    return { risk: 0, reasons: [], patterns: [] }
  }

  private async checkAmount(amount: number) {
    if (amount > 100000) {
      return {
        risk: 60,
        reasons: ["Large transaction amount (>100k)"],
        patterns: ["large_amount"],
      }
    }

    if (amount > 50000) {
      return {
        risk: 30,
        reasons: ["Moderate transaction amount (>50k)"],
        patterns: ["moderate_amount"],
      }
    }

    return { risk: 0, reasons: [], patterns: [] }
  }

  private async checkTimePattern(timestamp: Date) {
    const hour = timestamp.getHours()

    // Transactions between 11pm and 5am are higher risk
    if (hour >= 23 || hour <= 5) {
      return {
        risk: 40,
        reasons: ["Transaction during unusual hours (11pm-5am)"],
        patterns: ["unusual_time"],
      }
    }

    return { risk: 0, reasons: [], patterns: [] }
  }

  private async checkRecipientHistory(recipient: string) {
    const { data: reports } = await this.supabase.from("scam_reports").select("*").eq("reported_number", recipient)

    const reportCount = reports?.length || 0

    if (reportCount > 10) {
      return {
        risk: 90,
        reasons: [`${reportCount} scam reports against this number`],
        patterns: ["multiple_reports"],
      }
    }

    if (reportCount > 3) {
      return {
        risk: 60,
        reasons: [`${reportCount} scam reports against this number`],
        patterns: ["some_reports"],
      }
    }

    return { risk: 0, reasons: [], patterns: [] }
  }

  private async checkSenderBehavior(sender: string, amount: number) {
    const { data: history } = await this.supabase
      .from("transactions")
      .select("amount")
      .eq("sender", sender)
      .order("created_at", { ascending: false })
      .limit(10)

    if (!history || history.length < 3) {
      return { risk: 0, reasons: [], patterns: [] }
    }

    const avgAmount = history.reduce((sum, t) => sum + t.amount, 0) / history.length
    const deviation = Math.abs(amount - avgAmount) / avgAmount

    if (deviation > 5) {
      return {
        risk: 70,
        reasons: [`Transaction amount ${deviation.toFixed(1)}x higher than user's average`],
        patterns: ["unusual_amount_for_user"],
      }
    }

    if (deviation > 2) {
      return {
        risk: 40,
        reasons: [`Transaction amount ${deviation.toFixed(1)}x higher than user's average`],
        patterns: ["elevated_amount_for_user"],
      }
    }

    return { risk: 0, reasons: [], patterns: [] }
  }

  private calculateRiskScore(checks: Array<{ risk: number; reasons: string[]; patterns: string[] }>): number {
    const maxRisk = Math.max(...checks.map((c) => c.risk))
    const avgRisk = checks.reduce((sum, c) => sum + c.risk, 0) / checks.length

    // Weight max risk more heavily than average
    return Math.round(maxRisk * 0.7 + avgRisk * 0.3)
  }

  private generateRecommendations(riskScore: number, checks: any[]): string[] {
    const recommendations: string[] = []

    if (riskScore > 70) {
      recommendations.push("BLOCK this transaction immediately")
      recommendations.push("Report this number to authorities")
    } else if (riskScore > 50) {
      recommendations.push("Verify recipient identity before proceeding")
      recommendations.push("Contact recipient through alternative channel")
    } else if (riskScore > 30) {
      recommendations.push("Proceed with caution")
      recommendations.push("Verify transaction details")
    }

    return recommendations
  }

  async logTransaction(transaction: Transaction, analysis: FraudAnalysis) {
    await this.supabase.from("transactions").insert({
      sender: transaction.sender,
      recipient: transaction.recipient,
      amount: transaction.amount,
      method: transaction.method,
      risk_score: analysis.riskScore,
      is_fraud: analysis.isFraud,
      blocked_patterns: analysis.blockedPatterns,
      metadata: transaction.metadata,
    })
  }
}
