import { createClient } from "@supabase/supabase-js"

interface TrustFactors {
  transactionHistory: number
  communityReports: number
  behaviorConsistency: number
  networkReputation: number
  verificationStatus: number
}

interface TrustScore {
  entityId: string
  entityType: "sender" | "recipient" | "merchant"
  score: number
  factors: TrustFactors
  riskLevel: "low" | "medium" | "high" | "critical"
  lastUpdated: Date
}

export class TrustScoreService {
  private supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  async calculateTrustScore(entityId: string, entityType: "sender" | "recipient" | "merchant"): Promise<TrustScore> {
    const factors = await this.gatherTrustFactors(entityId, entityType)
    const score = this.computeScore(factors)
    const riskLevel = this.determineRiskLevel(score)

    // Store in trust graph
    await this.supabase.from("trust_scores").upsert({
      entity_id: entityId,
      entity_type: entityType,
      score,
      factors,
      risk_level: riskLevel,
      updated_at: new Date().toISOString(),
    })

    return {
      entityId,
      entityType,
      score,
      factors,
      riskLevel,
      lastUpdated: new Date(),
    }
  }

  private async gatherTrustFactors(entityId: string, entityType: string): Promise<TrustFactors> {
    // Transaction history score (0-100)
    const { data: transactions } = await this.supabase
      .from("mobile_money_transactions")
      .select("*")
      .or(`sender.eq.${entityId},recipient.eq.${entityId}`)
      .order("created_at", { ascending: false })
      .limit(100)

    const transactionHistory = this.scoreTransactionHistory(transactions || [])

    // Community reports score (0-100, inverse of reports)
    const { data: reports } = await this.supabase
      .from("scam_reports")
      .select("*")
      .eq("reported_entity", entityId)
      .eq("status", "verified")

    const communityReports = Math.max(0, 100 - (reports?.length || 0) * 10)

    // Behavior consistency score (0-100)
    const behaviorConsistency = await this.scoreBehaviorConsistency(entityId, transactions || [])

    // Network reputation score (0-100)
    const networkReputation = await this.scoreNetworkReputation(entityId)

    // Verification status score (0-100)
    const { data: verification } = await this.supabase
      .from("entity_verifications")
      .select("*")
      .eq("entity_id", entityId)
      .single()

    const verificationStatus = verification?.verified ? 100 : 0

    return {
      transactionHistory,
      communityReports,
      behaviorConsistency,
      networkReputation,
      verificationStatus,
    }
  }

  private computeScore(factors: TrustFactors): number {
    // Weighted average of trust factors
    const weights = {
      transactionHistory: 0.25,
      communityReports: 0.3,
      behaviorConsistency: 0.2,
      networkReputation: 0.15,
      verificationStatus: 0.1,
    }

    return Math.round(
      factors.transactionHistory * weights.transactionHistory +
        factors.communityReports * weights.communityReports +
        factors.behaviorConsistency * weights.behaviorConsistency +
        factors.networkReputation * weights.networkReputation +
        factors.verificationStatus * weights.verificationStatus,
    )
  }

  private determineRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
    if (score >= 80) return "low"
    if (score >= 60) return "medium"
    if (score >= 40) return "high"
    return "critical"
  }

  private scoreTransactionHistory(transactions: any[]): number {
    if (transactions.length === 0) return 50 // Neutral for new entities

    const successfulTxns = transactions.filter((t) => t.status === "completed")
    const successRate = (successfulTxns.length / transactions.length) * 100

    // Bonus for transaction volume
    const volumeBonus = Math.min(20, transactions.length / 5)

    return Math.min(100, successRate * 0.8 + volumeBonus)
  }

  private async scoreBehaviorConsistency(entityId: string, transactions: any[]): number {
    if (transactions.length < 5) return 50 // Need more data

    // Analyze transaction patterns
    const amounts = transactions.map((t) => t.amount)
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - avgAmount, 2), 0) / amounts.length)

    // Lower standard deviation = more consistent = higher score
    const consistencyScore = Math.max(0, 100 - (stdDev / avgAmount) * 100)

    return Math.min(100, consistencyScore)
  }

  private async scoreNetworkReputation(entityId: string): number {
    // Check connections to known good/bad entities
    const { data: connections } = await this.supabase
      .from("mobile_money_transactions")
      .select("sender, recipient")
      .or(`sender.eq.${entityId},recipient.eq.${entityId}`)
      .limit(50)

    if (!connections || connections.length === 0) return 50

    // Get trust scores of connected entities
    const connectedEntities = connections.flatMap((c) => [c.sender, c.recipient].filter((e) => e !== entityId))

    const { data: connectedScores } = await this.supabase
      .from("trust_scores")
      .select("score")
      .in("entity_id", connectedEntities)

    if (!connectedScores || connectedScores.length === 0) return 50

    // Average trust score of network
    const avgNetworkScore = connectedScores.reduce((sum, s) => sum + s.score, 0) / connectedScores.length

    return Math.round(avgNetworkScore)
  }

  async getTrustGraph(entityId: string, depth = 2): Promise<any> {
    // Build trust graph showing connections and their trust scores
    const graph = {
      root: entityId,
      nodes: [] as any[],
      edges: [] as any[],
    }

    await this.buildGraphRecursive(entityId, depth, graph, new Set())

    return graph
  }

  private async buildGraphRecursive(entityId: string, depth: number, graph: any, visited: Set<string>) {
    if (depth === 0 || visited.has(entityId)) return

    visited.add(entityId)

    // Get entity trust score
    const { data: trustScore } = await this.supabase.from("trust_scores").select("*").eq("entity_id", entityId).single()

    graph.nodes.push({
      id: entityId,
      score: trustScore?.score || 50,
      riskLevel: trustScore?.risk_level || "medium",
    })

    // Get connections
    const { data: connections } = await this.supabase
      .from("mobile_money_transactions")
      .select("sender, recipient, amount, created_at")
      .or(`sender.eq.${entityId},recipient.eq.${entityId}`)
      .limit(20)

    if (!connections) return

    for (const conn of connections) {
      const connectedEntity = conn.sender === entityId ? conn.recipient : conn.sender

      graph.edges.push({
        from: conn.sender,
        to: conn.recipient,
        amount: conn.amount,
        timestamp: conn.created_at,
      })

      await this.buildGraphRecursive(connectedEntity, depth - 1, graph, visited)
    }
  }
}
