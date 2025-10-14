// Real-Time Risk Scoring Engine
// Analyzes transactions and assigns risk scores

import type { BiometricAnalysis } from "./behavioral-biometrics"

interface TransactionData {
  amount: number
  currency: string
  merchantId: string
  merchantName: string
  userId?: string
  ipAddress: string
  deviceFingerprint: string
}

interface RiskScore {
  overallScore: number // 0-100
  riskLevel: "low" | "medium" | "high" | "critical"
  behavioralRisk: number
  deviceRisk: number
  networkRisk: number
  transactionRisk: number
  velocityRisk: number
  riskFactors: string[]
  mfaRequired: boolean
  decision: "approve" | "review" | "decline" | "mfa_required"
  confidence: number
}

class RiskScoringEngine {
  private readonly RISK_THRESHOLDS = {
    low: 30,
    medium: 50,
    high: 70,
    critical: 85,
  }

  private readonly MFA_THRESHOLD = 60

  async calculateRiskScore(
    transaction: TransactionData,
    biometrics?: BiometricAnalysis,
    networkData?: any,
  ): Promise<RiskScore> {
    const behavioralRisk = biometrics ? this.calculateBehavioralRisk(biometrics) : 50

    const deviceRisk = this.calculateDeviceRisk(transaction.deviceFingerprint, transaction.userId)

    const networkRisk = networkData
      ? this.calculateNetworkRisk(networkData)
      : await this.analyzeNetwork(transaction.ipAddress)

    const transactionRisk = this.calculateTransactionRisk(transaction)

    const velocityRisk = await this.calculateVelocityRisk(
      transaction.userId,
      transaction.ipAddress,
      transaction.deviceFingerprint,
    )

    // Weighted average
    const overallScore =
      behavioralRisk * 0.25 + deviceRisk * 0.2 + networkRisk * 0.2 + transactionRisk * 0.2 + velocityRisk * 0.15

    const riskLevel = this.determineRiskLevel(overallScore)
    const riskFactors = this.identifyRiskFactors({
      behavioralRisk,
      deviceRisk,
      networkRisk,
      transactionRisk,
      velocityRisk,
    })

    const mfaRequired = overallScore >= this.MFA_THRESHOLD
    const decision = this.makeDecision(overallScore, mfaRequired)
    const confidence = this.calculateConfidence(biometrics, networkData)

    return {
      overallScore: Math.round(overallScore),
      riskLevel,
      behavioralRisk,
      deviceRisk,
      networkRisk,
      transactionRisk,
      velocityRisk,
      riskFactors,
      mfaRequired,
      decision,
      confidence,
    }
  }

  private calculateBehavioralRisk(biometrics: BiometricAnalysis): number {
    // High consistency = low risk
    const consistencyScore = biometrics.consistencyScore

    // Unusual patterns increase risk
    const typingRisk = this.evaluateTypingPattern(biometrics.typing)
    const mouseRisk = this.evaluateMousePattern(biometrics.mouse)

    // Average the risks (inverted consistency)
    return (100 - consistencyScore + typingRisk + mouseRisk) / 3
  }

  private evaluateTypingPattern(typing: any): number {
    // Very fast or very slow typing is suspicious
    if (typing.avgSpeed < 50 || typing.avgSpeed > 500) return 70
    if (typing.consistency > 100) return 60
    return 20
  }

  private evaluateMousePattern(mouse: any): number {
    // Robotic or too perfect movements are suspicious
    if (mouse.consistency < 10) return 80 // Too consistent = bot
    if (mouse.avgVelocity === 0) return 90 // No mouse movement
    return 15
  }

  private calculateDeviceRisk(fingerprint: string, userId?: string): number {
    // Check if device is known for this user
    // For now, return moderate risk
    // TODO: Implement device history checking
    return 30
  }

  private async analyzeNetwork(ipAddress: string): Promise<number> {
    // Check for VPN, proxy, Tor
    // TODO: Integrate with IP intelligence APIs
    return 25
  }

  private calculateNetworkRisk(networkData: any): number {
    let risk = 0

    if (networkData.vpnDetected) risk += 30
    if (networkData.proxyDetected) risk += 25
    if (networkData.torDetected) risk += 40

    return Math.min(risk, 100)
  }

  private calculateTransactionRisk(transaction: TransactionData): number {
    let risk = 0

    // Large transactions are riskier
    if (transaction.amount > 1000) risk += 20
    if (transaction.amount > 5000) risk += 30
    if (transaction.amount > 10000) risk += 40

    // Round numbers are suspicious
    if (transaction.amount % 100 === 0) risk += 10

    return Math.min(risk, 100)
  }

  private async calculateVelocityRisk(
    userId?: string,
    ipAddress?: string,
    deviceFingerprint?: string,
  ): Promise<number> {
    // Check transaction velocity
    // TODO: Query transaction_velocity table
    return 20
  }

  private determineRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
    if (score >= this.RISK_THRESHOLDS.critical) return "critical"
    if (score >= this.RISK_THRESHOLDS.high) return "high"
    if (score >= this.RISK_THRESHOLDS.medium) return "medium"
    return "low"
  }

  private identifyRiskFactors(risks: {
    behavioralRisk: number
    deviceRisk: number
    networkRisk: number
    transactionRisk: number
    velocityRisk: number
  }): string[] {
    const factors: string[] = []

    if (risks.behavioralRisk > 60) {
      factors.push("Unusual behavioral patterns detected")
    }
    if (risks.deviceRisk > 60) {
      factors.push("Unknown or suspicious device")
    }
    if (risks.networkRisk > 60) {
      factors.push("VPN/Proxy/Tor detected")
    }
    if (risks.transactionRisk > 60) {
      factors.push("Large or unusual transaction amount")
    }
    if (risks.velocityRisk > 60) {
      factors.push("High transaction velocity")
    }

    return factors
  }

  private makeDecision(score: number, mfaRequired: boolean): "approve" | "review" | "decline" | "mfa_required" {
    if (score >= 85) return "decline"
    if (score >= 70) return "review"
    if (mfaRequired) return "mfa_required"
    return "approve"
  }

  private calculateConfidence(biometrics?: BiometricAnalysis, networkData?: any): number {
    let confidence = 50

    if (biometrics) confidence += 25
    if (networkData) confidence += 25

    return confidence
  }
}

export { RiskScoringEngine, type TransactionData, type RiskScore }

export async function calculateRiskScore(data: {
  amount: number
  recipient: string
  url: string
  method: string
  userAgent: string
  ip: string
}): Promise<{
  score: number
  factors: string[]
  recommendation: string
}> {
  const engine = new RiskScoringEngine()

  // Convert simplified data to TransactionData format
  const transactionData: TransactionData = {
    amount: data.amount,
    currency: "USD",
    merchantId: data.recipient,
    merchantName: data.recipient,
    ipAddress: data.ip,
    deviceFingerprint: data.userAgent,
  }

  const result = await engine.calculateRiskScore(transactionData)

  return {
    score: result.overallScore,
    factors: result.riskFactors,
    recommendation:
      result.decision === "decline"
        ? "Transaction blocked due to high risk"
        : result.decision === "review"
          ? "Transaction flagged for review"
          : result.decision === "mfa_required"
            ? "Multi-factor authentication required"
            : "Transaction approved",
  }
}
