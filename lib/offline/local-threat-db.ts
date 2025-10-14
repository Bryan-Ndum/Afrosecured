import Dexie, { type Table } from "dexie"

// Local threat database for offline operation
export interface ScamPattern {
  id?: number
  pattern: string
  type: "regex" | "keyword" | "phone"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  lastUpdated: Date
}

export interface SuspiciousNumber {
  id?: number
  phoneNumber: string
  reportCount: number
  scamType: string
  lastReported: Date
}

export interface LocalTransaction {
  id?: number
  timestamp: Date
  from: string
  to: string
  amount: number
  message?: string
  riskScore: number
  status: "pending" | "approved" | "blocked"
}

export class LocalThreatDB extends Dexie {
  scamPatterns!: Table<ScamPattern, number>
  suspiciousNumbers!: Table<SuspiciousNumber, number>
  transactions!: Table<LocalTransaction, number>

  constructor() {
    super("AfroSecuredOfflineDB")

    this.version(1).stores({
      scamPatterns: "++id, pattern, type, severity, lastUpdated",
      suspiciousNumbers: "++id, phoneNumber, reportCount, lastReported",
      transactions: "++id, timestamp, from, to, riskScore, status",
    })
  }

  // Initialize with default threat patterns
  async seedDefaultPatterns() {
    const count = await this.scamPatterns.count()
    if (count > 0) return // Already seeded

    const defaultPatterns: ScamPattern[] = [
      {
        pattern: "urgent.*transfer.*immediately",
        type: "regex",
        severity: "high",
        description: "Urgency scam pattern",
        lastUpdated: new Date(),
      },
      {
        pattern: "congratulations.*won.*prize",
        type: "regex",
        severity: "high",
        description: "Prize scam pattern",
        lastUpdated: new Date(),
      },
      {
        pattern: "verify.*account.*suspended",
        type: "regex",
        severity: "critical",
        description: "Account verification scam",
        lastUpdated: new Date(),
      },
      {
        pattern: "click.*link.*claim",
        type: "regex",
        severity: "high",
        description: "Phishing link pattern",
        lastUpdated: new Date(),
      },
    ]

    await this.scamPatterns.bulkAdd(defaultPatterns)
  }

  // Check if a phone number is suspicious
  async checkPhoneNumber(phoneNumber: string): Promise<SuspiciousNumber | undefined> {
    return await this.suspiciousNumbers.where("phoneNumber").equals(phoneNumber).first()
  }

  // Add or update suspicious number
  async reportPhoneNumber(phoneNumber: string, scamType: string) {
    const existing = await this.checkPhoneNumber(phoneNumber)

    if (existing) {
      await this.suspiciousNumbers.update(existing.id!, {
        reportCount: existing.reportCount + 1,
        lastReported: new Date(),
      })
    } else {
      await this.suspiciousNumbers.add({
        phoneNumber,
        reportCount: 1,
        scamType,
        lastReported: new Date(),
      })
    }
  }

  // Analyze message content against patterns
  async analyzeMessage(message: string): Promise<{ risk: number; matches: ScamPattern[] }> {
    const patterns = await this.scamPatterns.toArray()
    const matches: ScamPattern[] = []
    let totalRisk = 0

    for (const pattern of patterns) {
      if (pattern.type === "regex") {
        const regex = new RegExp(pattern.pattern, "i")
        if (regex.test(message)) {
          matches.push(pattern)
          totalRisk +=
            pattern.severity === "critical"
              ? 40
              : pattern.severity === "high"
                ? 30
                : pattern.severity === "medium"
                  ? 20
                  : 10
        }
      } else if (pattern.type === "keyword") {
        if (message.toLowerCase().includes(pattern.pattern.toLowerCase())) {
          matches.push(pattern)
          totalRisk += 15
        }
      }
    }

    return { risk: Math.min(totalRisk, 100), matches }
  }
}

// Singleton instance
export const localDB = new LocalThreatDB()
