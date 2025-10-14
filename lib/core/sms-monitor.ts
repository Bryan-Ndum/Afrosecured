import type { FraudDetectionEngine, Transaction } from "./fraud-detection-engine"
import type { LocalDatabase } from "./local-database"

// SMS monitoring service for mobile app
export class SMSMonitor {
  private engine: FraudDetectionEngine
  private db: LocalDatabase

  constructor(engine: FraudDetectionEngine, db: LocalDatabase) {
    this.engine = engine
    this.db = db
  }

  // Analyze incoming SMS for scam patterns
  async analyzeSMS(sms: SMS): Promise<SMSAnalysis> {
    console.log("[v0] Analyzing SMS from:", sms.sender)

    // Check if sender is blacklisted
    const isBlacklisted = await this.db.isBlacklisted(sms.sender)

    // Extract transaction details if it's a mobile money SMS
    const transaction = this.extractTransaction(sms)

    if (transaction) {
      const analysis = this.engine.analyzeTransaction(transaction)

      // Store analysis
      await this.db.storeAnalysis({
        smsId: sms.id,
        sender: sms.sender,
        analysis,
        timestamp: new Date(),
      })

      return {
        isScam: analysis.shouldBlock,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        warning: analysis.recommendation,
        details: analysis.risks,
      }
    }

    // Check for scam keywords in message
    const keywordAnalysis = this.analyzeKeywords(sms.body)

    return {
      isScam: keywordAnalysis.isScam,
      riskScore: keywordAnalysis.score,
      riskLevel: keywordAnalysis.level,
      warning: keywordAnalysis.warning,
      details: [],
    }
  }

  private extractTransaction(sms: SMS): Transaction | null {
    // Parse M-Pesa format: "You have sent KES 1,000 to 0712345678"
    const mpesaPattern = /sent\s+([A-Z]{3})\s+([\d,]+)\s+to\s+(\d+)/i
    const match = sms.body.match(mpesaPattern)

    if (match) {
      return {
        recipient: match[3],
        amount: Number.parseFloat(match[2].replace(/,/g, "")),
        message: sms.body,
        timestamp: sms.timestamp,
        isFirstTime: false, // Check history
      }
    }

    // Add patterns for MTN, Airtel, etc.

    return null
  }

  private analyzeKeywords(message: string): KeywordAnalysis {
    const scamKeywords = [
      "urgent",
      "verify",
      "suspended",
      "winner",
      "prize",
      "claim",
      "congratulations",
      "emergency",
      "help me",
      "stranded",
      "hospital",
      "invest",
      "double",
      "guaranteed",
      "returns",
      "forex",
      "bitcoin",
    ]

    const lowerMessage = message.toLowerCase()
    const foundKeywords = scamKeywords.filter((keyword) => lowerMessage.includes(keyword))

    const score = foundKeywords.length * 15

    return {
      isScam: score >= 60,
      score: Math.min(score, 100),
      level: score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW",
      warning: score >= 60 ? "Potential scam detected" : "Be cautious",
      keywords: foundKeywords,
    }
  }
}

interface SMS {
  id: string
  sender: string
  body: string
  timestamp: Date
}

interface SMSAnalysis {
  isScam: boolean
  riskScore: number
  riskLevel: string
  warning: string
  details: any[]
}

interface KeywordAnalysis {
  isScam: boolean
  score: number
  level: string
  warning: string
  keywords: string[]
}
