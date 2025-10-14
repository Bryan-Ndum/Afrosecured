import { createServerClient } from "@/lib/supabase/server"
import { SMSGatewayService } from "./sms-gateway-service"

interface NotificationData {
  recipientType: "user" | "partner" | "admin"
  recipientId: string
  channel: "sms" | "email" | "push" | "webhook"
  template: string
  data: Record<string, any>
}

export class NotificationService {
  static async queueNotification(notification: NotificationData): Promise<void> {
    const supabase = createServerClient()

    await supabase.from("notification_queue").insert({
      recipient_type: notification.recipientType,
      recipient_id: notification.recipientId,
      channel: notification.channel,
      template: notification.template,
      data: notification.data,
      status: "pending",
    })
  }

  static async processQueue(): Promise<void> {
    const supabase = createServerClient()

    // Get pending notifications
    const { data: notifications } = await supabase
      .from("notification_queue")
      .select("*")
      .eq("status", "pending")
      .lt("attempts", 3)
      .order("created_at", { ascending: true })
      .limit(100)

    if (!notifications || notifications.length === 0) return

    for (const notification of notifications) {
      try {
        await this.sendNotification(notification)

        // Mark as sent
        await supabase
          .from("notification_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", notification.id)
      } catch (error) {
        // Increment attempts and log error
        await supabase
          .from("notification_queue")
          .update({
            attempts: notification.attempts + 1,
            status: notification.attempts + 1 >= 3 ? "failed" : "pending",
            error: error instanceof Error ? error.message : "Unknown error",
          })
          .eq("id", notification.id)
      }
    }
  }

  private static async sendNotification(notification: any): Promise<void> {
    switch (notification.channel) {
      case "sms":
        await this.sendSMS(notification)
        break
      case "email":
        await this.sendEmail(notification)
        break
      case "push":
        await this.sendPush(notification)
        break
      case "webhook":
        await this.sendWebhook(notification)
        break
    }
  }

  private static async sendSMS(notification: any): Promise<void> {
    const message = this.renderTemplate(notification.template, notification.data)
    await SMSGatewayService.sendSMS(notification.recipient_id, message)
  }

  private static async sendEmail(notification: any): Promise<void> {
    // TODO: Implement email sending (SendGrid/Resend)
    console.log("[v0] Email notification:", notification)
  }

  private static async sendPush(notification: any): Promise<void> {
    // TODO: Implement push notifications (FCM/APNS)
    console.log("[v0] Push notification:", notification)
  }

  private static async sendWebhook(notification: any): Promise<void> {
    // TODO: Implement webhook delivery
    console.log("[v0] Webhook notification:", notification)
  }

  private static renderTemplate(template: string, data: Record<string, any>): string {
    const templates: Record<string, string> = {
      fraud_alert: `FRAUD ALERT: Suspicious transaction detected. Amount: ${data.amount} ${data.currency} to ${data.recipient}. Risk score: ${data.riskScore}%. Block this transaction? Reply BLOCK to stop it.`,
      transaction_blocked: `TRANSACTION BLOCKED: We prevented a suspicious transaction of ${data.amount} ${data.currency} to ${data.recipient}. Your money is safe.`,
      scam_report_confirmed: `Thank you for reporting a scam. We've verified your report and added ${data.phoneNumber} to our blacklist. You've helped protect the community!`,
      daily_summary: `AfroSecured Daily Summary: ${data.transactionsChecked} transactions checked, ${data.threatsBlocked} threats blocked, ${data.moneySaved} ${data.currency} saved.`,
    }

    return templates[template] || template
  }

  // Convenience methods
  static async sendFraudAlert(userId: string, transactionData: any): Promise<void> {
    await this.queueNotification({
      recipientType: "user",
      recipientId: userId,
      channel: "sms",
      template: "fraud_alert",
      data: transactionData,
    })
  }

  static async sendTransactionBlocked(userId: string, transactionData: any): Promise<void> {
    await this.queueNotification({
      recipientType: "user",
      recipientId: userId,
      channel: "sms",
      template: "transaction_blocked",
      data: transactionData,
    })
  }
}
