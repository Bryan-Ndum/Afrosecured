"use client"

import { Shield, Smartphone, Wifi, WifiOff, Zap, Database, MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function OfflineFirstPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <WifiOff className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Works Without Internet</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Offline-First Protection
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Built for Africa's reality: expensive data, unreliable internet, and USSD transactions. Mobile Money
            Guardian works <span className="text-emerald-400 font-semibold">without internet by default</span>.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <WifiOff className="w-8 h-8 text-emerald-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-2">0%</div>
              <div className="text-sm text-slate-400">Internet Required</div>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <Database className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-2">&lt;10MB</div>
              <div className="text-sm text-slate-400">Storage Footprint</div>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <Zap className="w-8 h-8 text-yellow-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-2">&lt;100ms</div>
              <div className="text-sm text-slate-400">Threat Detection</div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Three Layers of Offline Protection</h2>

          <div className="space-y-8">
            {/* Layer 1 */}
            <Card className="p-8 bg-slate-900/50 border-slate-800">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Layer 1: On-Device Protection</h3>
                  <p className="text-slate-400 mb-4">
                    Local threat database and ML model stored on your phone. Analyzes transactions instantly without
                    internet.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                      <div className="text-sm font-medium text-slate-300 mb-1">Local Threat Database</div>
                      <div className="text-xs text-slate-500">2.3MB compressed patterns</div>
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                      <div className="text-sm font-medium text-slate-300 mb-1">ML Model</div>
                      <div className="text-xs text-slate-500">3MB TensorFlow Lite</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Layer 2 */}
            <Card className="p-8 bg-slate-900/50 border-slate-800">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Layer 2: SMS-Based Protection</h3>
                  <p className="text-slate-400 mb-4">
                    Works on ANY phone, even feature phones. Check numbers and report scams via SMS.
                  </p>
                  <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 font-mono text-sm">
                    <div className="text-emerald-400 mb-2">Text to *123#:</div>
                    <div className="text-slate-400">CHECK 0712345678</div>
                    <div className="text-slate-600 my-2">↓</div>
                    <div className="text-red-400">⚠️ WARNING: Number reported 47 times for scams</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Layer 3 */}
            <Card className="p-8 bg-slate-900/50 border-slate-800">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Layer 3: USSD Integration</h3>
                  <p className="text-slate-400 mb-4">
                    Partner with telcos to intercept USSD transactions and warn users before money leaves their account.
                  </p>
                  <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                    <div className="text-sm text-slate-400 mb-2">User dials: *150*01*1234567*1000#</div>
                    <div className="text-sm text-slate-600 mb-2">↓ AfroSecured intercepts ↓</div>
                    <div className="text-sm text-yellow-400">
                      ⚠️ This number has 12 scam reports. Continue? 1=Yes 2=No
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sync Strategy */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Smart Sync Strategy</h2>

          <Card className="p-8 bg-slate-900/50 border-slate-800">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Wifi className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">WiFi-Only Updates</h3>
                  <p className="text-slate-400">
                    Threat database updates only download on WiFi to save your data costs. Typical update: &lt;100KB per
                    week.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Database className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Delta Sync</h3>
                  <p className="text-slate-400">
                    Only download changes since last sync, not the entire database. Saves 95% of bandwidth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Battery Efficient</h3>
                  <p className="text-slate-400">
                    Background sync only when charging or battery &gt;50%. Uses &lt;5% battery per day.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">$0.15/month</div>
              <div className="text-slate-400">Total cost per user (SMS + data)</div>
              <div className="text-sm text-slate-500 mt-2">vs $2-5/month for cloud-based competitors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Why This Is Your Moat</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-slate-900/50 border-slate-800">
              <h3 className="text-xl font-bold text-white mb-3">✅ AfroSecured (Offline-First)</h3>
              <ul className="space-y-2 text-slate-400">
                <li>• Works with 0% internet</li>
                <li>• &lt;10MB storage</li>
                <li>• &lt;100ms detection</li>
                <li>• SMS-based (any phone)</li>
                <li>• USSD integration</li>
                <li>• $0.15/user/month</li>
              </ul>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-slate-800 opacity-60">
              <h3 className="text-xl font-bold text-white mb-3">❌ Competitors (Cloud-Based)</h3>
              <ul className="space-y-2 text-slate-400">
                <li>• Requires constant internet</li>
                <li>• 50-100MB+ data usage</li>
                <li>• 500ms+ latency</li>
                <li>• App-only (smartphones)</li>
                <li>• No USSD support</li>
                <li>• $2-5/user/month</li>
              </ul>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl text-slate-300 mb-4">
              <span className="text-emerald-400 font-bold">60% of Africans</span> have intermittent internet access.
            </p>
            <p className="text-lg text-slate-400">You're building the ONLY solution that works for them.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
