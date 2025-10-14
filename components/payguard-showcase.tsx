"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Zap, AlertTriangle, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PayGuardShowcase() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Revolutionary Payment Protection</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            PayGuard with FraudFreeze
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stop scams before money leaves your account. AI-powered payment interception with 60-second fraud reversal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
              asChild
            >
              <Link href="/extension">
                <Download className="w-5 h-5 mr-2" />
                Download Extension
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="rounded-xl bg-transparent" asChild>
              <Link href="/payguard">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800 p-8 hover:border-blue-500/50 transition-colors">
            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Real-Time Interception</h3>
            <p className="text-slate-400 leading-relaxed">
              AI analyzes every payment before it processes. Behavioral biometrics detect fraud patterns instantly.
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-8 hover:border-red-500/50 transition-colors">
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">60-Second FraudFreeze</h3>
            <p className="text-slate-400 leading-relaxed">
              Made a mistake? Hit FREEZE to reverse any transaction within 60 seconds. Your money stays safe.
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-8 hover:border-green-500/50 transition-colors">
            <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Global Protection</h3>
            <p className="text-slate-400 leading-relaxed">
              Works with Visa, Mastercard, PayPal, bank transfers, and mobile money across 190+ countries.
            </p>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">99.8%</div>
            <div className="text-sm text-slate-400">Fraud Detection Rate</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">60s</div>
            <div className="text-sm text-slate-400">Reversal Window</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-teal-400 mb-2">190+</div>
            <div className="text-sm text-slate-400">Countries Supported</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">$0</div>
            <div className="text-sm text-slate-400">Cost to Users</div>
          </div>
        </div>
      </div>
    </section>
  )
}
