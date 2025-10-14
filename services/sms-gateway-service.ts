// Integration with Africa's Talking SMS Gateway
export class SMSGatewayService {
  private apiKey: string
  private username: string
  private baseUrl = "https://api.africastalking.com/version1"

  constructor() {
    this.apiKey = process.env.AFRICASTALKING_API_KEY || ""
    this.username = process.env.AFRICASTALKING_USERNAME || ""
  }

  async sendAlert(phoneNumber: string, message: string) {
    const response = await fetch(`${this.baseUrl}/messaging`, {
      method: "POST",
      headers: {
        apiKey: this.apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        username: this.username,
        to: phoneNumber,
        message: message,
        from: "AfroSecured",
      }),
    })

    return response.json()
  }

  async sendFraudAlert(phoneNumber: string, recipientNumber: string, amount: number, riskScore: number) {
    const message = `⚠️ FRAUD ALERT: Transaction to ${recipientNumber} for ${amount} has ${riskScore}% fraud risk. Reply BLOCK to cancel or PROCEED to continue.`
    return this.sendAlert(phoneNumber, message)
  }

  async sendScamWarning(phoneNumber: string, scammerNumber: string, scamType: string) {
    const message = `🚨 SCAM WARNING: ${scammerNumber} is reported for ${scamType}. ${this.getScamReports(scammerNumber)} people have reported this number. DO NOT send money.`
    return this.sendAlert(phoneNumber, message)
  }

  private async getScamReports(number: string): Promise<number> {
    // Query database for report count
    return 0 // Placeholder
  }

  parseMobileMoneyMessage(smsBody: string): {
    type: "mpesa" | "mtn" | "airtel" | "unknown"
    amount?: number
    recipient?: string
    sender?: string
    transactionId?: string
  } {
    // M-Pesa pattern
    const mpesaPattern = /([A-Z0-9]+) Confirmed.*?Ksh([\d,]+).*?to ([+\d]+)/i
    const mpesaMatch = smsBody.match(mpesaPattern)

    if (mpesaMatch) {
      return {
        type: "mpesa",
        transactionId: mpesaMatch[1],
        amount: Number.parseFloat(mpesaMatch[2].replace(/,/g, "")),
        recipient: mpesaMatch[3],
      }
    }

    // MTN Mobile Money pattern
    const mtnPattern = /You have sent ([\d,]+).*?to ([+\d]+)/i
    const mtnMatch = smsBody.match(mtnPattern)

    if (mtnMatch) {
      return {
        type: "mtn",
        amount: Number.parseFloat(mtnMatch[1].replace(/,/g, "")),
        recipient: mtnMatch[2],
      }
    }

    // Airtel Money pattern
    const airtelPattern = /Transaction successful.*?([\d,]+).*?to ([+\d]+)/i
    const airtelMatch = smsBody.match(airtelPattern)

    if (airtelMatch) {
      return {
        type: "airtel",
        amount: Number.parseFloat(airtelMatch[1].replace(/,/g, "")),
        recipient: airtelMatch[2],
      }
    }

    return { type: "unknown" }
  }
}
