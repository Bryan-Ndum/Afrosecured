"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, TrendingUp, Clock, DollarSign, Globe } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  recipient: string
  riskScore: number
  status: "pending" | "approved" | "blocked" | "frozen"
  timestamp: string
  country: string
}

export default function PayGuardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalProtected: 0,
    scamsBlocked: 0,
    moneySaved: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // Fetch recent transactions
    fetchTransactions()
    fetchStats()
  }, [])

  const fetchTransactions = async () => {
    // Mock data for now
    setTransactions([
      {
        id: "1",
        amount: 250,
        recipient: "merchant@example.com",
        riskScore: 85,
        status: "blocked",
        timestamp: new Date().toISOString(),
        country: "Nigeria",
      },
      {
        id: "2",
        amount: 50,
        recipient: "shop@verified.com",
        riskScore: 15,
        status: "approved",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        country: "USA",
      },
    ])
  }

  const fetchStats = async () => {
    setStats({
      totalProtected: 1247,
      scamsBlocked: 89,
      moneySaved: 45230,
      activeUsers: 3421,
    })
  }

  const handleFreeze = async (transactionId: string) => {
    try {
      const response = await fetch("/api/payguard/freeze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      })

      const result = await response.json()
      alert(result.message)
      fetchTransactions()
    } catch (error) {
      alert("Failed to freeze transaction")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">PayGuard Dashboard</h1>
              <p className="text-slate-400">Real-time payment protection with FraudFreeze</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalProtected.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Payments Protected</div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.scamsBlocked}</div>
            <div className="text-sm text-slate-400">Scams Blocked</div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">${stats.moneySaved.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Money Saved</div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      transaction.status === "blocked"
                        ? "bg-red-500/10"
                        : transaction.status === "approved"
                          ? "bg-green-500/10"
                          : "bg-yellow-500/10"
                    }`}
                  >
                    {transaction.status === "blocked" ? (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    ) : transaction.status === "approved" ? (
                      <Shield className="w-6 h-6 text-green-400" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-white">${transaction.amount}</div>
                    <div className="text-sm text-slate-400">{transaction.recipient}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Globe className="w-3 h-3" />
                      {transaction.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${
                        transaction.riskScore > 70
                          ? "text-red-400"
                          : transaction.riskScore > 40
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      Risk: {transaction.riskScore}%
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{transaction.status}</div>
                  </div>

                  {transaction.status === "pending" && (
                    <Button
                      onClick={() => handleFreeze(transaction.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Freeze
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* How It Works */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-400">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Analysis</h3>
            <p className="text-slate-400">
              AI analyzes every payment using behavioral biometrics, threat intelligence, and risk scoring before it
              goes through.
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20 p-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-red-400">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Alerts</h3>
            <p className="text-slate-400">
              High-risk transactions trigger immediate notifications with detailed risk factors and recommended actions.
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-green-400">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">60-Second Freeze</h3>
            <p className="text-slate-400">
              Realized it's a scam? Hit FREEZE to reverse the transaction within 60 seconds and get your money back.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
