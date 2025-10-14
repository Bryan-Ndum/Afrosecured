import https from "https"

interface VisaConfig {
  userId: string
  password: string
  cert: string
  key: string
  ca: string
  baseUrl: string
}

interface VirtualCardRequest {
  userId: string
  amount?: number
  currency?: string
  merchantRestriction?: string
  expiryHours?: number
  usageLimit?: number
}

interface MerchantVerificationRequest {
  merchantId: string
  merchantName?: string
  merchantCountry?: string
}

interface PaymentRouteRequest {
  fromCountry: string
  toCountry: string
  amount: number
  fromCurrency: string
  toCurrency: string
}

export class VisaGlobalClient {
  private config: VisaConfig
  private agent: https.Agent

  constructor() {
    this.config = {
      userId: process.env.VISA_USER_ID!,
      password: process.env.VISA_PASSWORD!,
      cert: process.env.VISA_CERT_PEM!,
      key: process.env.VISA_PRIVATE_KEY_PEM!,
      ca: process.env.VISA_CA_BUNDLE_PEM!,
      baseUrl: process.env.VISA_BASE_URL || "https://sandbox.api.visa.com",
    }

    this.agent = new https.Agent({
      cert: this.config.cert,
      key: this.config.key,
      ca: this.config.ca,
    })
  }

  private async makeRequest(endpoint: string, method = "GET", body?: any) {
    const url = `${this.config.baseUrl}${endpoint}`
    const auth = Buffer.from(`${this.config.userId}:${this.config.password}`).toString("base64")

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      // @ts-ignore - Node.js fetch supports agent
      agent: this.agent,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Visa API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Generate Virtual Card Token
  async generateVirtualCard(request: VirtualCardRequest) {
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + (request.expiryHours || 24))

    const payload = {
      cardholderName: "AfroSecured User",
      cardType: "virtual",
      expirationDate: {
        month: expiryDate.getMonth() + 1,
        year: expiryDate.getFullYear(),
      },
      amount: request.amount,
      currency: request.currency || "USD",
      merchantRestriction: request.merchantRestriction,
      usageLimit: request.usageLimit || 1,
    }

    return this.makeRequest("/vctc/v1/cards", "POST", payload)
  }

  // Verify Merchant via Visa Merchant Locator
  async verifyMerchant(request: MerchantVerificationRequest) {
    const endpoint = `/merchantlocator/v1/locator`
    const payload = {
      header: {
        messageDateTime: new Date().toISOString(),
        requestMessageId: `ML_${Date.now()}`,
      },
      searchAttrList: {
        merchantName: request.merchantName,
        merchantCountryCode: request.merchantCountry,
      },
      responseAttrList: ["GNSTANDARD"],
      searchOptions: {
        maxRecords: "5",
        matchIndicators: "true",
        matchScore: "true",
      },
    }

    return this.makeRequest(endpoint, "POST", payload)
  }

  // Get Optimal Payment Route using Visa Direct
  async getPaymentRoutes(request: PaymentRouteRequest) {
    // Visa Direct Multi-Currency Cross-Border
    const endpoint = "/visadirect/v1/fundstransfer/routes"
    const payload = {
      amount: request.amount,
      senderCurrency: request.fromCurrency,
      recipientCurrency: request.toCurrency,
      senderCountry: request.fromCountry,
      recipientCountry: request.toCountry,
    }

    return this.makeRequest(endpoint, "POST", payload)
  }

  // Get Real-Time Exchange Rates
  async getExchangeRates(fromCurrency: string, toCurrency: string) {
    const endpoint = `/forexrates/v1/foreignexchangerates`
    const payload = {
      sourceAmount: 1,
      sourceCurrencyCode: fromCurrency,
      destinationCurrencyCode: toCurrency,
      markUpRate: "0",
    }

    return this.makeRequest(endpoint, "POST", payload)
  }

  // Fraud Detection via Visa Risk Manager
  async analyzeFraudRisk(transaction: {
    amount: number
    currency: string
    merchantId: string
    merchantCountry: string
    cardToken: string
    ipAddress?: string
    deviceInfo?: any
  }) {
    const endpoint = "/riskmanager/v1/risk-assessment"
    const payload = {
      transactionAmount: transaction.amount,
      transactionCurrency: transaction.currency,
      merchantId: transaction.merchantId,
      merchantCountry: transaction.merchantCountry,
      cardToken: transaction.cardToken,
      deviceFingerprint: transaction.deviceInfo,
      ipAddress: transaction.ipAddress,
    }

    return this.makeRequest(endpoint, "POST", payload)
  }

  // Process Payment via Visa Direct
  async processPayment(payment: {
    amount: number
    currency: string
    senderCardToken: string
    recipientCardToken: string
    merchantId?: string
  }) {
    const endpoint = "/visadirect/fundstransfer/v1/pushfundstransactions"
    const payload = {
      amount: payment.amount,
      currency: payment.currency,
      senderCardId: payment.senderCardToken,
      recipientPrimaryAccountNumber: payment.recipientCardToken,
      transactionIdentifier: Date.now().toString(),
      merchantCategoryCode: "6012",
      sourceOfFundsCode: "05",
    }

    return this.makeRequest(endpoint, "POST", payload)
  }
}

export const visaGlobalClient = new VisaGlobalClient()
