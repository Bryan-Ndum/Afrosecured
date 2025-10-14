// AfroSecured PayGuard - Content Script
console.log("[PayGuard] Content script loaded")

// Inject behavioral biometrics tracker
const script = document.createElement("script")
script.src = window.chrome.runtime.getURL("injected.js")
;(document.head || document.documentElement).appendChild(script)

// Listen for payment form submissions
document.addEventListener("submit", (e) => {
  const form = e.target

  // Check if it's a payment form
  const isPaymentForm =
    form.action.toLowerCase().includes("payment") ||
    form.action.toLowerCase().includes("checkout") ||
    form.querySelector('[name*="card"]') ||
    form.querySelector('[name*="amount"]')

  if (isPaymentForm) {
    console.log("[PayGuard] Payment form detected")

    // Extract form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    // Send to background script
    window.chrome.runtime.sendMessage({
      action: "paymentFormSubmit",
      data: data,
      url: window.location.href,
    })
  }
})

// Add FraudFreeze button to payment pages
function addFreezeButton() {
  const freezeBtn = document.createElement("div")
  freezeBtn.id = "afrosecured-freeze-btn"
  freezeBtn.innerHTML = `
    <button style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
      display: none;
      animation: pulse 2s infinite;
    ">
      🛡️ FREEZE PAYMENT
    </button>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    </style>
  `

  document.body.appendChild(freezeBtn)

  const btn = freezeBtn.querySelector("button")

  // Show button on payment pages
  if (window.location.href.match(/checkout|payment|pay/i)) {
    btn.style.display = "block"
  }

  // Handle freeze click
  btn.addEventListener("click", () => {
    if (confirm("Are you sure you want to freeze this transaction? This will attempt to reverse the payment.")) {
      window.chrome.runtime.sendMessage({
        action: "freezeTransaction",
        transactionId: Date.now().toString(),
      })

      btn.textContent = "✅ FREEZE REQUESTED"
      btn.style.background = "#10b981"
    }
  })
}

// Add freeze button when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addFreezeButton)
} else {
  addFreezeButton()
}
