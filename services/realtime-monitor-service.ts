import { createClient } from "@/lib/supabase/server"
import { FraudDetectionService } from "./fraud-detection-service"
import { WebhookService } from "./webhook-service"
import { SMSGatewayService } from "./sms-gateway-service"

interface MonitoringRule {
  id: string
  name: string
  condition: (transaction: any) => boolean
  action: "alert" | "block" | "review"
  priority: "low" | "medium" | "high" | "critical"
}

export class RealtimeMonitorService {
  private supabase = createClient()
  private fraudDetector = new FraudDetectionService()
  private webhookService = new WebhookService()
  private smsService = new SMSGatewayService()
  private rules: MonitoringRule[] = []

  constructor() {
    this.initializeRules()
  }

  // Initialize monitoring rules
  private initializeRules() {
    this.rules = [
      {
        id: "large_amount",
        name: "Large Amount Transaction",
        condition: (tx) => tx.amount > 100000,
        action: "review",
        priority: "high",
      },
      {
        id: "rapid_transactions",
        name: "Rapid Transaction Pattern",
        condition: (tx) => tx.velocity > 5,
        action: "block",
        priority: "critical",
      },
      {
        id: "blacklisted_recipient",
        name: "Blacklisted Recipient",
        condition: (tx) => tx.recipientBlacklisted,
        action: "block",
        priority: "critical",
      },
      {
        id: "unusual_time",
        name: "Unusual Transaction Time",
        condition: (tx) => {
          const hour = new Date(tx.timestamp).getHours()
          return hour >= 0 && hour <= 5
        },
        action: "alert",
        priority: "medium",
      },
      {
        id: "new_recipient",
        name: "First Time Recipient",
        condition: (tx) => tx.isNewRecipient && tx.amount > 10000,
        action: "review",
        priority: "medium",
      },
    ]
  }

  // Monitor transaction in real-time
  async monitorTransaction(transactionData: any): Promise<{
    allowed: boolean
    reason?: string
    fraudScore: number
    triggeredRules: string[]
  }> {
    try {
      // Analyze transaction for fraud
      const fraudAnalysis = await this.fraudDetector.analyzeTransaction(transactionData)

      // Check against monitoring rules
      const triggeredRules = this.rules.filter((rule) => rule.condition(transactionData))

      // Determine if transaction should be blocked
      const shouldBlock = triggeredRules.some(
        (rule) => rule.action === "block" || (rule.action === "review" && fraudAnalysis.riskScore > 80),
      )

      // Log monitoring event
      await this.logMonitoringEvent({
        transaction_id: transactionData.transactionId,
        fraud_score: fraudAnalysis.riskScore,
        triggered_rules: triggeredRules.map((r) => r.id),
        action: shouldBlock ? "blocked" : "allowed",
        timestamp: new Date().toISOString(),
      })

      // Send alerts if needed
      if (shouldBlock || fraudAnalysis.riskScore > 70) {
        await this.sendAlerts(transactionData, fraudAnalysis, triggeredRules)
      }

      // Trigger webhooks for partners
      if (shouldBlock) {
        await this.webhookService.triggerWebhook("transaction.blocked", {
          transactionId: transactionData.transactionId,
          reason: fraudAnalysis.factors.join(", "),
          fraudScore: fraudAnalysis.riskScore,
        })
      }

      return {
        allowed: !shouldBlock,
        reason: shouldBlock ? fraudAnalysis.factors.join(", ") : undefined,
        fraudScore: fraudAnalysis.riskScore,
        triggeredRules: triggeredRules.map((r) => r.name),
      }
    } catch (error) {
      console.error("[v0] Real-time monitoring error:", error)
      // Fail open - allow transaction but log error
      return {
        allowed: true,
        fraudScore: 0,
        triggeredRules: [],
      }
    }
  }

  // Send alerts to user and partners
  private async sendAlerts(transaction: any, fraudAnalysis: any, triggeredRules: MonitoringRule[]): Promise<void> {
    const criticalRules = triggeredRules.filter((r) => r.priority === "critical")

    if (criticalRules.length > 0) {
      // Send SMS alert to user
      await this.smsService.sendAlert(
        transaction.sender,
        `FRAUD ALERT: Transaction to ${transaction.recipient} for ${transaction.currency} ${transaction.amount} blocked. Risk: ${fraudAnalysis.riskScore}%. Reply ALLOW to proceed.`,
      )

      // Send email alert if available
      const { data: user } = await this.supabase
        .from("users")
        .select("email")
        .eq("phone_number", transaction.sender)
        .single()

      if (user?.email) {
        // Email alert would be sent here
      }
    }
  }

  // Log monitoring event
  private async logMonitoringEvent(event: any): Promise<void> {
    await this.supabase.from("monitoring_events").insert(event)
  }

  // Start real-time monitoring subscription
  async startMonitoring(): Promise<void> {
    const supabase = createClient()

    // Subscribe to new transactions
    supabase
      .channel("transactions")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
        },
        async (payload) => {
          console.log("[v0] New transaction detected:", payload.new)
          await this.monitorTransaction(payload.new)
        },
      )
      .subscribe()

    console.log("[v0] Real-time monitoring started")
  }
}
