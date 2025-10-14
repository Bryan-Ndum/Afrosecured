import { createClient } from "@/lib/supabase/server"

interface WebhookPayload {
  event: string
  data: any
  timestamp: string
  signature: string
}

export class WebhookService {
  private supabase = createClient()

  async sendWebhook(partnerId: string, event: string, data: any): Promise<void> {
    const { data: partner } = await this.supabase
      .from("partners")
      .select("webhook_url, webhook_secret")
      .eq("id", partnerId)
      .single()

    if (!partner?.webhook_url) return

    const payload: WebhookPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      signature: this.generateSignature(data, partner.webhook_secret),
    }

    try {
      const response = await fetch(partner.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AfroSecured-Signature": payload.signature,
        },
        body: JSON.stringify(payload),
      })

      await this.logWebhook(partnerId, event, response.status, response.ok)
    } catch (error) {
      await this.logWebhook(partnerId, event, 0, false)
    }
  }

  private generateSignature(data: any, secret: string): string {
    const crypto = require("crypto")
    return crypto.createHmac("sha256", secret).update(JSON.stringify(data)).digest("hex")
  }

  private async logWebhook(partnerId: string, event: string, statusCode: number, success: boolean): Promise<void> {
    await this.supabase.from("webhook_logs").insert({
      partner_id: partnerId,
      event,
      status_code: statusCode,
      success,
      sent_at: new Date().toISOString(),
    })
  }

  async notifyFraudDetected(partnerId: string, transaction: any, riskScore: number): Promise<void> {
    await this.sendWebhook(partnerId, "fraud.detected", {
      transactionId: transaction.id,
      amount: transaction.amount,
      sender: transaction.sender,
      recipient: transaction.recipient,
      riskScore,
      riskFactors: transaction.risk_factors,
      recommendedAction: riskScore > 0.8 ? "block" : "review",
    })
  }

  async notifyTransactionBlocked(partnerId: string, transaction: any): Promise<void> {
    await this.sendWebhook(partnerId, "transaction.blocked", {
      transactionId: transaction.id,
      amount: transaction.amount,
      reason: transaction.block_reason,
      blockedAt: new Date().toISOString(),
    })
  }
}
