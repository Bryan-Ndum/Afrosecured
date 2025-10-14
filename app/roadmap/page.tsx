import { Code, Zap, Globe, CheckCircle2, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Execution Roadmap</Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            How We Build Infrastructure
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            From consumer app to Africa's digital trust infrastructure in 18 months
          </p>
        </div>

        {/* Phase 1: MVP (Months 1-3) */}
        <Card className="bg-slate-900/50 border-emerald-500/20 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">Phase 1: MVP Foundation</h2>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Months 1-3</Badge>
              </div>
              <p className="text-slate-400">Build consumer app, collect data, prove fraud detection works</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-2 border-emerald-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Week 1-2: Core Infrastructure
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Set up Supabase with proper RLS policies and multi-tenancy support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Build API authentication system (JWT + API keys for partners)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Create rate limiting and request validation middleware</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Set up error logging and monitoring (Sentry/LogRocket)</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-emerald-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Week 3-4: Mobile Money Guardian MVP
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>SMS forwarding system (users forward suspicious SMS to your number)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Basic NLP scam detection (keyword matching + pattern recognition)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>User dashboard showing scam alerts and protection status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Community reporting system (users report scams)</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-emerald-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Week 5-8: Behavioral Biometrics
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Implement typing pattern tracking (speed, rhythm, errors)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Mouse movement and click pattern analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Device fingerprinting (browser, OS, screen size, timezone)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Build baseline profiles for normal user behavior</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-emerald-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Week 9-12: Chrome Extension
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Build extension that monitors payment pages (M-Pesa, bank sites)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Real-time risk scoring before payment submission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Warning overlays for high-risk transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>Publish to Chrome Web Store</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-white mb-2">Success Metrics (End of Month 3):</h4>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• 1,000+ active users</li>
                <li>• 10,000+ scam reports analyzed</li>
                <li>• 85%+ accuracy in scam detection</li>
                <li>• $50,000+ in fraud prevented (tracked)</li>
                <li>• Chrome extension: 500+ installs</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Phase 2: API Platform (Months 4-9) */}
        <Card className="bg-slate-900/50 border-cyan-500/20 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-cyan-500/10 p-3 rounded-lg">
              <Code className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">Phase 2: API Platform</h2>
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Months 4-9</Badge>
              </div>
              <p className="text-slate-400">Transform consumer app into developer platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-2 border-cyan-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Public API Launch</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>REST API: /api/v1/fraud-check (real-time transaction scoring)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>Webhook system for async notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>API documentation with interactive examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>Developer dashboard with API keys and usage analytics</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-cyan-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">SDKs & Libraries</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>JavaScript/TypeScript SDK (npm package)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>Python SDK (PyPI package)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>React Native SDK for mobile apps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>WordPress/WooCommerce plugin</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-cyan-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">First B2B Pilots</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>Partner with 3-5 African fintechs for pilot integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>White-label dashboard for partners</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>Custom fraud rules engine for each partner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>Prove ROI: track fraud prevented vs. cost</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-white mb-2">Success Metrics (End of Month 9):</h4>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• 10,000+ API calls per day</li>
                <li>• 5+ paying B2B customers</li>
                <li>• $10K+ MRR (Monthly Recurring Revenue)</li>
                <li>• 95%+ API uptime</li>
                <li>• Sub-100ms average response time</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Phase 3: Infrastructure (Months 10-18) */}
        <Card className="bg-slate-900/50 border-purple-500/20 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">Phase 3: Infrastructure</h2>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Months 10-18</Badge>
              </div>
              <p className="text-slate-400">Become embedded infrastructure layer</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-2 border-purple-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Telco Partnerships</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Deep integration with MTN, Airtel, Safaricom mobile money</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>USSD-based fraud alerts (works on feature phones)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>SMS interception at network level (with user consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Revenue share model: $0.01 per transaction protected</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-purple-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Machine Learning Pipeline</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Train custom ML models on African scam patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Real-time model updates as new scams emerge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Federated learning (train on user data without seeing it)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Predictive fraud detection (catch scams before they happen)</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-purple-500/30 pl-6">
              <h3 className="text-xl font-semibold text-white mb-3">Global Expansion</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Edge computing: deploy to 20+ regions for low latency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Multi-language support (English, French, Swahili, Hausa, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Compliance: GDPR, NDPR (Nigeria), POPIA (South Africa)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">→</span>
                  <span>Expand to Southeast Asia, Latin America</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-white mb-2">Success Metrics (End of Month 18):</h4>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• 1M+ transactions protected daily</li>
                <li>• 50+ enterprise customers</li>
                <li>• $500K+ MRR</li>
                <li>• 2-3 telco partnerships signed</li>
                <li>• $100M+ in fraud prevented (cumulative)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Technical Stack */}
        <Card className="bg-slate-900/50 border-slate-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Technical Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3">Core Infrastructure</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Next.js 15 (App Router) - Frontend & API</li>
                <li>• Supabase - Database, Auth, Real-time</li>
                <li>• Vercel - Hosting, Edge Functions</li>
                <li>• Redis (Upstash) - Caching, Rate Limiting</li>
                <li>• PostgreSQL - Primary database</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">ML & Analytics</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• TensorFlow.js - Client-side ML</li>
                <li>• Python (FastAPI) - ML model serving</li>
                <li>• Hugging Face - NLP models</li>
                <li>• PostHog - Product analytics</li>
                <li>• Sentry - Error tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Security & Compliance</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• JWT + API Keys - Authentication</li>
                <li>• Row Level Security (RLS) - Data isolation</li>
                <li>• Encryption at rest & in transit</li>
                <li>• GDPR compliance tools</li>
                <li>• Audit logging (immutable)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Developer Tools</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• OpenAPI/Swagger - API docs</li>
                <li>• Postman collections - Testing</li>
                <li>• GitHub Actions - CI/CD</li>
                <li>• Terraform - Infrastructure as Code</li>
                <li>• Datadog - Monitoring</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Start Here */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Start Here (This Week)
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Day 1-2: Database Setup</h3>
              <p className="text-slate-300 text-sm mb-2">
                Run all SQL scripts to set up tables, RLS policies, and seed data
              </p>
              <code className="text-xs text-emerald-400 bg-slate-950 px-2 py-1 rounded">
                Run scripts 001-016 in order
              </code>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Day 3-4: API Keys</h3>
              <p className="text-slate-300 text-sm mb-2">Set up free threat intelligence APIs</p>
              <code className="text-xs text-cyan-400 bg-slate-950 px-2 py-1 rounded">
                AlienVault OTX, VirusTotal, AbuseIPDB
              </code>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Day 5-7: SMS Forwarding MVP</h3>
              <p className="text-slate-300 text-sm mb-2">
                Build basic SMS scam detection (users forward suspicious SMS)
              </p>
              <code className="text-xs text-purple-400 bg-slate-950 px-2 py-1 rounded">
                Use Twilio for SMS receiving
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
