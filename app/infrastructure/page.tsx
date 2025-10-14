;```tsx
'use client'

import { Shield, Code, Zap, Lock, Globe, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Infrastructure Documentation
            </div>
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-balance">
              Building Security Infrastructure
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              How AfroSecured becomes the trust layer for Africa's digital economy
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="border-b border-border py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold">
            Infrastructure Architecture
          </h2>
          
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Layer 1: Core Security Engine */}
            <Card className="border-2 border-primary/20 bg-primary/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Layer 1: Core Security Engine</h3>
                  <p className="text-sm text-muted-foreground">Proprietary fraud detection algorithms</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Behavioral Biometrics</h4>
                  <p className="text-sm text-muted-foreground">
                    Typing patterns, device fingerprinting, transaction velocity
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Threat Intelligence</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time scam database, community reports, ML models
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Risk Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-factor analysis, contextual scoring, adaptive thresholds
                  </p>
                </div>
              </div>
            </Card>

            {/* Layer 2: API Platform */}
            <Card className="border-2 border-blue-500/20 bg-blue-500/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Layer 2: API Platform</h3>
                  <p className="text-sm text-muted-foreground">Developer-friendly integration layer</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">REST API</h4>
                  <p className="text-sm text-muted-foreground">
                    Simple HTTP endpoints for fraud detection, verification
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">WebSocket Streams</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time threat alerts, transaction monitoring
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Webhooks</h4>
                  <p className="text-sm text-muted-foreground">
                    Event-driven notifications to partner systems
                  </p>
                </div>
              </div>
            </Card>

            {/* Layer 3: SDKs & Libraries */}
            <Card className="border-2 border-green-500/20 bg-green-500/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Layer 3: SDKs & Libraries</h3>
                  <p className="text-sm text-muted-foreground">Drop-in protection for any platform</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Mobile SDKs</h4>
                  <p className="text-sm text-muted-foreground">
                    iOS, Android - native integration for mobile money apps
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Web Libraries</h4>
                  <p className="text-sm text-muted-foreground">
                    JavaScript, React - browser-based fraud detection
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Server Libraries</h4>
                  <p className="text-sm text-muted-foreground">
                    Node.js, Python, Go - backend integration
                  </p>
                </div>
              </div>
            </Card>

            {/* Layer 4: Partner Dashboard */}
            <Card className="border-2 border-purple-500/20 bg-purple-500/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Layer 4: Partner Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Analytics and control center</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Real-Time Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Fraud prevented, transactions monitored, threat trends
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Rule Configuration</h4>
                  <p className="text-sm text-muted-foreground">
                    Custom risk thresholds, block lists, allow lists
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold">Audit Logs</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete transaction history, compliance reports
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Security-First Principles */}
      <section className="border-b border-border bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold">
            Security-First Design Principles
          </h2>
          
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <Card className="p-6">
              <Lock className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Zero-Trust Architecture</h3>
              <p className="text-muted-foreground">
                Every API request is authenticated and authorized. No implicit trust. 
                JWT tokens, API keys with scopes, rate limiting per partner.
              </p>
            </Card>

            <Card className="p-6">
              <Shield className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Data Isolation</h3>
              <p className="text-muted-foreground">
                Multi-tenant architecture with complete data separation. Each partner's 
                data is encrypted and isolated. No cross-contamination.
              </p>
            </Card>

            <Card className="p-6">
              <Globe className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Edge Computing</h3>
              <p className="text-muted-foreground">
                Deploy fraud detection at the edge for sub-100ms latency. 
                Process transactions close to users across Africa.
              </p>
            </Card>

            <Card className="p-6">
              <Activity className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Observability</h3>
              <p className="text-muted-foreground">
                Complete visibility into system health. Real-time metrics, 
                distributed tracing, anomaly detection, automated alerts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Example */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold">
            How Partners Integrate
          </h2>
          
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Step 1 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Get API Key</h3>
              </div>
              <Card className="bg-muted/50 p-6">
                <pre className="overflow-x-auto text-sm">
                  <code>{` // Partner signs up, gets API key
const AFROSECURED_API_KEY = "as_live_abc123..."`}</code>
                </pre>
              </Card>
            </div>

            {/* Step 2 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Install SDK</h3>
              </div>
              <Card className="bg-muted/50 p-6">
                <pre className="overflow-x-auto text-sm">
                  <code>{` // Mobile Money App (React Native)\
npm
install
@afrosecured
;/-bdeiklmos

import AfroSecured from "@afrosecured/mobile-sdk"

AfroSecured.init({
  apiKey: AFROSECURED_API_KEY,
  environment: "production",
})`}</code>
                </pre>
              </Card>
            </div>

            {/* Step 3 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Protect Transactions</h3>
              </div>
              <Card className="bg-muted/50 p-6">
                <pre className="overflow-x-auto text-sm">
                  <code>{` // Before processing payment
const riskScore = await AfroSecured.analyzeTransaction({
  amount: 50000,
  currency: "KES",
  recipient: "+254712345678",
  userId: "user_123",
})

if (riskScore.score > 80) {
  // High risk - require additional verification
  await requestMFA()
} else if (riskScore.score > 50) {
  // Medium risk - show warning
  await showWarning(riskScore.factors)
} else {
  // Low risk - proceed
  await processPayment()
}
;`}</code>
                </pre>
              </Card>
            </div>

            {/* Step 4 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold">Receive Webhooks</h3>
              </div>
              <Card className="bg-muted/50 p-6">
                <pre className="overflow-x-auto text-sm">
                  <code>{` // AfroSecured sends real-time alerts\
POST
//partner.com/webhooks/afrosecured

{
  "event\": \"fraud_detected",
  "transaction_id\": \"txn_456",\
  "risk_score\": 95,
  "threat_type": "account_takeover",
  "recommended_action": "block"
}
`}</code>
                </pre>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="border-t border-border bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold">
            Infrastructure Business Model
          </h2>
          
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">Phase 1: Consumer App</h3>
              <p className="mb-4 text-muted-foreground">
                Free mobile money protection app. Collect data, build ML models, 
                prove fraud prevention works.
              </p>
              <div className="text-sm font-semibold text-primary">
                Revenue: $0 (data collection)
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">Phase 2: B2B API</h3>
              <p className="mb-4 text-muted-foreground">
                Sell API access to fintechs, telcos. Charge per transaction 
                or monthly subscription.
              </p>
              <div className="text-sm font-semibold text-primary">
                Revenue: $0.01-0.05 per transaction
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">Phase 3: Infrastructure</h3>
              <p className="mb-4 text-muted-foreground">
                Embedded in every digital transaction. Partners can't operate 
                without AfroSecured.
              </p>
              <div className="text-sm font-semibold text-primary">
                Revenue: $100M+ ARR
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
