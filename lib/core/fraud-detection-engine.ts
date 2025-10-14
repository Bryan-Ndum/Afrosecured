import { createClient } from "@/lib/supabase/server"

// Core fraud detection engine that runs offline
export class FraudDetectionEngine {
  private patterns: ThreatPattern[]
  private blacklist: Set<string>

  constructor(patterns: ThreatPattern[], blacklist: string[]) {
    this.patterns = patterns
    this.blacklist = new Set(blacklist)
  }

  // Analyze transaction without internet
  analyzeTransaction(transaction: Transaction): FraudAnalysis {
    const risks: RiskFactor[] = []
    let score = 0

    // Check blacklisted numbers
    if (this.blacklist.has(transaction.recipient)) {
      risks.push({
        type: "BLACKLISTED_NUMBER",
        severity: "CRITICAL",
        description: "Recipient is on known scammer list",
        score: 95,
      })
      score += 95
    }

    // Pattern matching
    for (const pattern of this.patterns) {
      if (this.matchesPattern(transaction, pattern)) {
        risks.push({
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.description,
          score: pattern.riskScore,
        })
        score += pattern.riskScore
      }
    }

    // Behavioral analysis
    const behaviorRisk = this.analyzeBehavior(transaction)
    if (behaviorRisk) {
      risks.push(behaviorRisk)
      score += behaviorRisk.score
    }

    // Amount analysis
    const amountRisk = this.analyzeAmount(transaction)
    if (amountRisk) {
      risks.push(amountRisk)
      score += amountRisk.score
    }

    return {
      riskScore: Math.min(score, 100),
      riskLevel: this.getRiskLevel(score),
      risks,
      recommendation: this.getRecommendation(score),
      shouldBlock: score >= 80,
    }
  }

  private matchesPattern(transaction: Transaction, pattern: ThreatPattern): boolean {
    // Check if transaction matches scam pattern
    if (pattern.recipientPattern && !new RegExp(pattern.recipientPattern).test(transaction.recipient)) {
      return false
    }

    if (pattern.amountRange) {
      const amount = transaction.amount
      if (amount < pattern.amountRange.min || amount > pattern.amountRange.max) {
        return false
      }
    }

    if (pattern.messageKeywords && transaction.message) {
      const hasKeyword = pattern.messageKeywords.some((keyword) =>
        transaction.message!.toLowerCase().includes(keyword.toLowerCase()),
      )
      if (!hasKeyword) return false
    }

    return true
  }

  private analyzeBehavior(transaction: Transaction): RiskFactor | null {
    // Unusual time (late night transactions are risky)
    const hour = new Date().getHours()
    if (hour >= 23 || hour <= 5) {
      return {
        type: "UNUSUAL_TIME",
        severity: "MEDIUM",
        description: "Transaction at unusual hour",
        score: 20,
      }
    }

    // First time recipient
    if (transaction.isFirstTime) {
      return {
        type: "NEW_RECIPIENT",
        severity: "LOW",
        description: "First transaction to this number",
        score: 10,
      }
    }

    return null
  }

  private analyzeAmount(transaction: Transaction): RiskFactor | null {
    // Large amounts are riskier
    if (transaction.amount > 50000) {
      return {
        type: "LARGE_AMOUNT",
        severity: "HIGH",
        description: "Unusually large transaction amount",
        score: 30,
      }
    }

    return null
  }

  private getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    if (score >= 80) return "CRITICAL"
    if (score >= 60) return "HIGH"
    if (score >= 40) return "MEDIUM"
    return "LOW"
  }

  private getRecommendation(score: number): string {
    if (score >= 80) return "BLOCK: High risk of fraud. Do not proceed."
    if (score >= 60) return "VERIFY: Contact recipient through another channel before sending."
    if (score >= 40) return "CAUTION: Review transaction details carefully."
    return "PROCEED: Transaction appears safe."
  }
}

// Types
interface Transaction {
  recipient: string
  amount: number
  message?: string
  timestamp: Date
  isFirstTime: boolean
  userHistory?: TransactionHistory
}

interface ThreatPattern {
  id: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  description: string
  riskScore: number
  recipientPattern?: string
  amountRange?: { min: number; max: number }
  messageKeywords?: string[]
}

interface RiskFactor {
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  description: string
  score: number
}

interface FraudAnalysis {
  riskScore: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  risks: RiskFactor[]
  recommendation: string
  shouldBlock: boolean
}

interface TransactionHistory {
  totalTransactions: number
  averageAmount: number
  frequentRecipients: string[]
}

// Load patterns from database or local storage
export async function loadThreatPatterns(): Promise<ThreatPattern[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("threat_patterns").select("*").eq("active", true)

  if (error) {
    console.error("[v0] Error loading threat patterns:", error)
    return getDefaultPatterns()
  }

  return data as ThreatPattern[]
}

// Default patterns for offline use
function getDefaultPatterns(): ThreatPattern[] {
  return [
    {
      id: "romance-scam",
      type: "ROMANCE_SCAM",
      severity: "CRITICAL",
      description: "Potential romance scam pattern",
      riskScore: 85,
      messageKeywords: ["love", "emergency", "hospital", "urgent", "help me", "stranded"],
      amountRange: { min: 5000, max: 1000000 },
    },
    {
      id: "investment-scam",
      type: "INVESTMENT_SCAM",
      severity: "HIGH",
      description: "Investment scam pattern detected",
      riskScore: 75,
      messageKeywords: ["invest", "double", "profit", "guaranteed", "returns", "forex", "bitcoin"],
      amountRange: { min: 10000, max: 10000000 },
    },
    {
      id: "impersonation",
      type: "IMPERSONATION",
      severity: "HIGH",
      description: "Possible impersonation scam",
      riskScore: 70,
      messageKeywords: ["bank", "verify", "account", "suspended", "confirm", "urgent action"],
    },
    {
      id: "lottery-scam",
      type: "LOTTERY_SCAM",
      severity: "MEDIUM",
      description: "Lottery/prize scam pattern",
      riskScore: 60,
      messageKeywords: ["won", "winner", "prize", "lottery", "claim", "congratulations"],
    },
  ]
}
