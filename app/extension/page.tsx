"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Shield, Zap, Globe, AlertTriangle } from "lucide-react"

export default function ExtensionPage() {
  const handleDownload = () => {
    // Trigger extension download
    const link = document.createElement("a")
    link.href = "/afrosecured-payguard-extension.zip"
    link.download = "afrosecured-payguard-extension.zip"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">New: PayGuard with FraudFreeze</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Stop Scams Before Money Leaves Your Account
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            AI-powered payment protection that intercepts transactions in real-time. Freeze and reverse payments within
            60 seconds if you detect fraud.
          </p>

          <Button
            onClick={handleDownload}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Chrome Extension
          </Button>

          <p className="text-sm text-slate-500 mt-4">Free • Works globally • 60-second fraud freeze</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Interception</h3>
            <p className="text-slate-400">
              AI analyzes every payment before it goes through. Blocks suspicious transactions automatically.
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">60-Second FraudFreeze</h3>
            <p className="text-slate-400">
              Realized you've been scammed? Hit FREEZE to reverse the transaction within 60 seconds.
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Global Protection</h3>
            <p className="text-slate-400">
              Works with Visa, Mastercard, PayPal, bank transfers, and mobile money worldwide.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How PayGuard Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Install Extension</h3>
              <p className="text-sm text-slate-400">One-click installation. Works on all websites.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">AI Monitors Payments</h3>
              <p className="text-sm text-slate-400">Every transaction is analyzed in real-time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Get Instant Alerts</h3>
              <p className="text-sm text-slate-400">High-risk payments trigger warnings.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">4</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Freeze if Needed</h3>
              <p className="text-sm text-slate-400">Reverse transactions within 60 seconds.</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Installation Instructions</h2>

          <ol className="space-y-4 text-slate-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">1.</span>
              <span>Click "Download Chrome Extension" button above</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">2.</span>
              <span>Extract the ZIP file to a folder on your computer</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">3.</span>
              <span>
                Open Chrome and go to <code className="bg-slate-800 px-2 py-1 rounded">chrome://extensions</code>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">4.</span>
              <span>Enable "Developer mode" in the top right</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">5.</span>
              <span>Click "Load unpacked" and select the extracted folder</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">6.</span>
              <span>PayGuard is now active! Look for the shield icon in your toolbar</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
