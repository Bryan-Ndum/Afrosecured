import { createClient } from "@/lib/supabase/server"

interface MobileMoneyTransaction {
  provider: "mpesa" | "mtn" | "airtel"
  transactionId: string
  amount: number
  currency: string
  sender: string
  recipient: string
  timestamp: Date
  metadata?: Record<string, any>
}

interface TransactionStatus {
  status: "pending" | "completed" | "failed" | "blocked"
  reason?: string
  fraudScore?: number
}

export class MobileMoneyService {
  private supabase = createClient()

  // M-Pesa Integration
  async verifyMpesaTransaction(transactionId: string): Promise<TransactionStatus> {
    try {
      // Call M-Pesa API to verify transaction
      const response = await fetch(`${process.env.MPESA_API_URL}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await this.getMpesaToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TransactionID: transactionId,
          PartyA: process.env.MPESA_SHORTCODE,
          IdentifierType: "4",
          Remarks: "Fraud verification",
        }),
      })

      const data = await response.json()

      // Log transaction for analysis
      await this.logTransaction({
        provider: "mpesa",
        transactionId,
        amount: data.TransAmount,
        currency: "KES",
        sender: data.MSISDN,
        recipient: data.BusinessShortCode,
        timestamp: new Date(data.TransTime),
        metadata: data,
      })

      return {
        status: data.ResultCode === "0" ? "completed" : "failed",
        reason: data.ResultDesc,
      }
    } catch (error) {
      console.error("[v0] M-Pesa verification error:", error)
      return { status: "failed", reason: "Verification failed" }
    }
  }

  // MTN Mobile Money Integration
  async verifyMtnTransaction(transactionId: string): Promise<TransactionStatus> {
    try {
      const response = await fetch(`${process.env.MTN_API_URL}/collection/v1_0/requesttopay/${transactionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await this.getMtnToken()}`,
          "X-Target-Environment": process.env.MTN_ENVIRONMENT || "sandbox",
          "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
        },
      })

      const data = await response.json()

      await this.logTransaction({
        provider: "mtn",
        transactionId,
        amount: Number.parseFloat(data.amount),
        currency: data.currency,
        sender: data.payer.partyId,
        recipient: data.payee.partyId,
        timestamp: new Date(),
        metadata: data,
      })

      return {
        status: data.status === "SUCCESSFUL" ? "completed" : "pending",
      }
    } catch (error) {
      console.error("[v0] MTN verification error:", error)
      return { status: "failed", reason: "Verification failed" }
    }
  }

  // Airtel Money Integration
  async verifyAirtelTransaction(transactionId: string): Promise<TransactionStatus> {
    try {
      const response = await fetch(`${process.env.AIRTEL_API_URL}/merchant/v1/payments/${transactionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await this.getAirtelToken()}`,
          "X-Country": process.env.AIRTEL_COUNTRY || "KE",
          "X-Currency": process.env.AIRTEL_CURRENCY || "KES",
        },
      })

      const data = await response.json()

      await this.logTransaction({
        provider: "airtel",
        transactionId,
        amount: Number.parseFloat(data.transaction.amount),
        currency: data.transaction.currency,
        sender: data.transaction.msisdn,
        recipient: data.transaction.merchant_id,
        timestamp: new Date(data.transaction.created_at),
        metadata: data,
      })

      return {
        status: data.status.toLowerCase() as any,
      }
    } catch (error) {
      console.error("[v0] Airtel verification error:", error)
      return { status: "failed", reason: "Verification failed" }
    }
  }

  // Block transaction if fraud detected
  async blockTransaction(transactionId: string, provider: string, reason: string): Promise<boolean> {
    try {
      // Log blocked transaction
      await this.supabase.from("blocked_transactions").insert({
        transaction_id: transactionId,
        provider,
        reason,
        blocked_at: new Date().toISOString(),
      })

      // Send alert to user via SMS
      const { data: transaction } = await this.supabase
        .from("transactions")
        .select("sender")
        .eq("transaction_id", transactionId)
        .single()

      if (transaction) {
        // SMS alert will be sent by webhook
        await this.supabase.from("fraud_alerts").insert({
          phone_number: transaction.sender,
          transaction_id: transactionId,
          alert_type: "blocked",
          message: `Transaction ${transactionId} blocked: ${reason}`,
        })
      }

      return true
    } catch (error) {
      console.error("[v0] Block transaction error:", error)
      return false
    }
  }

  // Get authentication tokens
  private async getMpesaToken(): Promise<string> {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString(
      "base64",
    )

    const response = await fetch(`${process.env.MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    })

    const data = await response.json()
    return data.access_token
  }

  private async getMtnToken(): Promise<string> {
    const response = await fetch(`${process.env.MTN_API_URL}/collection/token/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.MTN_USER_ID}:${process.env.MTN_API_KEY}`).toString("base64")}`,
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
      },
    })

    const data = await response.json()
    return data.access_token
  }

  private async getAirtelToken(): Promise<string> {
    const response = await fetch(`${process.env.AIRTEL_API_URL}/auth/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AIRTEL_CLIENT_ID,
        client_secret: process.env.AIRTEL_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    })

    const data = await response.json()
    return data.access_token
  }

  // Log transaction for fraud analysis
  private async logTransaction(transaction: MobileMoneyTransaction): Promise<void> {
    await this.supabase.from("transactions").insert({
      provider: transaction.provider,
      transaction_id: transaction.transactionId,
      amount: transaction.amount,
      currency: transaction.currency,
      sender: transaction.sender,
      recipient: transaction.recipient,
      timestamp: transaction.timestamp.toISOString(),
      metadata: transaction.metadata,
      created_at: new Date().toISOString(),
    })
  }
}
