// AfroSecured PayGuard - Background Service Worker
const API_BASE = "https://afrosecured.vercel.app/api/payguard"

// Payment patterns to intercept
const PAYMENT_PATTERNS = [
  /checkout/i,
  /payment/i,
  /pay/i,
  /transaction/i,
  /transfer/i,
  /send-money/i,
  /visa/i,
  /stripe/i,
  /paypal/i,
]

// Declare chrome variable
const chrome = window.chrome

// Listen for web requests
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    console.log("[PayGuard] Intercepted request:", details.url)

    // Extract payment data
    const paymentData = extractPaymentData(details)

    if (paymentData) {
      console.log("[PayGuard] Payment detected:", paymentData)

      // Send to AfroSecured API for risk analysis
      try {
        const response = await fetch(`${API_BASE}/intercept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: details.url,
            amount: paymentData.amount,
            recipient: paymentData.recipient,
            method: details.method,
            timestamp: new Date().toISOString(),
          }),
        })

        const result = await response.json()

        // If high risk, block and notify user
        if (result.riskScore > 70) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "⚠️ High Risk Payment Detected",
            message: `Risk Score: ${result.riskScore}%. ${result.reason}. Click to review.`,
            priority: 2,
          })

          // Store transaction for potential freeze
          chrome.storage.local.set({
            [`transaction_${details.requestId}`]: {
              ...paymentData,
              riskScore: result.riskScore,
              timestamp: Date.now(),
            },
          })

          // Block if critical risk
          if (result.riskScore > 90) {
            return { cancel: true }
          }
        }
      } catch (error) {
        console.error("[PayGuard] API error:", error)
      }
    }

    return { cancel: false }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"],
)

// Extract payment data from request
function extractPaymentData(details) {
  const url = details.url.toLowerCase()

  // Check if URL matches payment patterns
  const isPayment = PAYMENT_PATTERNS.some((pattern) => pattern.test(url))

  if (!isPayment) return null

  let amount = null
  let recipient = null

  // Try to extract from URL params
  const urlParams = new URLSearchParams(new URL(details.url).search)
  amount = urlParams.get("amount") || urlParams.get("total") || urlParams.get("price")
  recipient = urlParams.get("recipient") || urlParams.get("merchant") || urlParams.get("to")

  // Try to extract from request body
  if (details.requestBody) {
    const body = details.requestBody.formData || details.requestBody.raw
    if (body) {
      // Parse form data or raw data
      try {
        const bodyStr = JSON.stringify(body)
        const amountMatch = bodyStr.match(/"amount":\s*"?(\d+\.?\d*)"?/i)
        const recipientMatch = bodyStr.match(/"recipient":\s*"([^"]+)"/i)

        if (amountMatch) amount = amountMatch[1]
        if (recipientMatch) recipient = recipientMatch[1]
      } catch (e) {
        console.error("[PayGuard] Body parse error:", e)
      }
    }
  }

  if (amount || recipient) {
    return { amount, recipient, url: details.url }
  }

  return null
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "freezeTransaction") {
    handleFreeze(request.transactionId)
  }
})

// Handle transaction freeze
async function handleFreeze(transactionId) {
  try {
    const response = await fetch(`${API_BASE}/freeze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    })

    const result = await response.json()

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: result.success ? "✅ Transaction Frozen" : "❌ Freeze Failed",
      message: result.message,
      priority: 2,
    })
  } catch (error) {
    console.error("[PayGuard] Freeze error:", error)
  }
}
