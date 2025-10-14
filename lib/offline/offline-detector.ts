import { localDB, type LocalTransaction } from "./local-threat-db"

export interface RiskAnalysis {
  score: number
  level: "low" | "medium" | "high" | "critical"
  factors: string[]
  recommendation: "approve" | "review" | "block"
}

export class OfflineScamDetector {
  // Analyze a transaction without internet connection
  async analyzeTransaction(transaction: {
    from: string
    to: string
    amount: number
    message?: string
  }): Promise<RiskAnalysis> {
    const factors: string[] = []
    let riskScore = 0

    // 1. Check sender against local blacklist
    const suspiciousSender = await localDB.checkPhoneNumber(transaction.from)
    if (suspiciousSender) {
      riskScore += Math.min(suspiciousSender.reportCount * 10, 40)
      factors.push(`Sender reported ${suspiciousSender.reportCount} times for ${suspiciousSender.scamType}`)
    }

    // 2. Check recipient against local blacklist
    const suspiciousRecipient = await localDB.checkPhoneNumber(transaction.to)
    if (suspiciousRecipient) {
      riskScore += Math.min(suspiciousRecipient.reportCount * 15, 50)
      factors.push(`Recipient reported ${suspiciousRecipient.reportCount} times`)
    }

    // 3. Analyze message content if present
    if (transaction.message) {
      const messageAnalysis = await localDB.analyzeMessage(transaction.message)
      riskScore += messageAnalysis.risk
      if (messageAnalysis.matches.length > 0) {
        factors.push(`Message matches ${messageAnalysis.matches.length} scam patterns`)
      }
    }

    // 4. Check transaction amount (unusually high amounts are risky)
    if (transaction.amount > 50000) {
      riskScore += 20
      factors.push("Unusually high transaction amount")
    }

    // 5. Check recent transaction velocity
    const recentTransactions = await this.getRecentTransactions(transaction.from, 60) // Last 60 minutes
    if (recentTransactions.length > 5) {
      riskScore += 25
      factors.push(`${recentTransactions.length} transactions in last hour (velocity attack)`)
    }

    // Determine risk level and recommendation
    const level = riskScore >= 70 ? "critical" : riskScore >= 50 ? "high" : riskScore >= 30 ? "medium" : "low"

    const recommendation = riskScore >= 70 ? "block" : riskScore >= 50 ? "review" : "approve"

    return {
      score: Math.min(riskScore, 100),
      level,
      factors,
      recommendation,
    }
  }

  // Get recent transactions for velocity checking
  private async getRecentTransactions(phoneNumber: string, minutesAgo: number): Promise<LocalTransaction[]> {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000)

    return await localDB.transactions
      .where("from")
      .equals(phoneNumber)
      .and((tx) => tx.timestamp >= cutoffTime)
      .toArray()
  }

  // Store transaction for future analysis
  async recordTransaction(transaction: {
    from: string
    to: string
    amount: number
    message?: string
    riskScore: number
    status: "pending" | "approved" | "blocked"
  }) {
    await localDB.transactions.add({
      ...transaction,
      timestamp: new Date(),
    })
  }
}

export const offlineDetector = new OfflineScamDetector()
