// AfroSecured PayGuard - Popup Script

// Declare chrome variable
const chrome = window.chrome

// Load stats
chrome.storage.local.get(["protectedCount", "blockedCount", "savedAmount"], (result) => {
  document.getElementById("protected-count").textContent = result.protectedCount || 0
  document.getElementById("blocked-count").textContent = result.blockedCount || 0
  document.getElementById("saved-amount").textContent = `$${result.savedAmount || 0}`
})

// Dashboard button
document.getElementById("dashboard-btn").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://afrosecured.vercel.app/payguard" })
})

// Freeze button
document.getElementById("freeze-btn").addEventListener("click", () => {
  if (confirm("Freeze your last payment? This will attempt to reverse the transaction.")) {
    chrome.runtime.sendMessage({
      action: "freezeTransaction",
      transactionId: Date.now().toString(),
    })

    alert("Freeze request sent! Check your dashboard for status.")
  }
})
