"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, Activity, Globe, Lock, Zap } from "lucide-react"
import { BiometricTracker } from "@/lib/behavioral-biometrics"

export default function VisaVerifyPage() {
  const [tracker, setTracker] = useState<BiometricTracker | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Initialize behavioral tracking
    const biometricTracker = new BiometricTracker()
    setTracker(biometricTracker)

    return () => {
      // Cleanup
    }
  }, [])

  const handleVerifyTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setVerifying(true)

    const formData = new FormData(e.currentTarget)

    // Get behavioral biometrics
    const biometrics = tracker ? await tracker.analyzeBehavior() : null

    const transactionData = {
      merchantId: formData.get("merchantId") as string,
      merchantName: formData.get("merchantName") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") as string,
      deviceFingerprint: biometrics?.device.fingerprint || "",
      ipAddress: "", // Will be detected server-side
      biometrics,
    }

    try {
      const response = await fetch("/api/visa/verify-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Transaction verification failed:", error)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Behavioral Biometrics + Visa Network
            </Badge>
            <h1 className="text-6xl font-bold mb-6 text-balance">
              AfroSecured Visa Verify
              <span className="block text-primary mt-2">Real-Time Fraud Detection</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Advanced behavioral biometrics combined with global threat intelligence and Visa's trusted network.
              Protect every transaction with enterprise-grade security.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 border-border/40 bg-card/50">
              <Activity className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Behavioral Biometrics</h3>
              <p className="text-sm text-muted-foreground">
                Track typing patterns, mouse movements, and scroll behavior to detect fraud
              </p>
            </Card>

            <Card className="p-6 border-border/40 bg-card/50">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Global Threat Intel</h3>
              <p className="text-sm text-muted-foreground">
                Cross-reference with AlienVault, VirusTotal, and AbuseIPDB databases
              </p>
            </Card>

            <Card className="p-6 border-border/40 bg-card/50">
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Instant Risk Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Real-time analysis with automatic MFA triggers for high-risk transactions
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Verification Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 border-2 border-border/40">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Verify Transaction</h2>
              </div>

              <p className="text-muted-foreground mb-8">
                Enter transaction details below. Our system is tracking your behavioral patterns in real-time to ensure
                this is really you.
              </p>

              <form onSubmit={handleVerifyTransaction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="merchantId">Merchant ID</Label>
                    <Input id="merchantId" name="merchantId" placeholder="MERCH123456" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="merchantName">Merchant Name</Label>
                    <Input
                      id="merchantName"
                      name="merchantName"
                      placeholder="Example Store"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="amount">Transaction Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" placeholder="USD" defaultValue="USD" className="mt-2" />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Behavioral Tracking Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We're analyzing your typing speed, mouse movements, and interaction patterns to verify your identity
                  </p>
                </div>

                <Button type="submit" disabled={verifying} className="w-full" size="lg">
                  {verifying ? "Analyzing Transaction..." : "Verify Transaction"}
                </Button>
              </form>
            </Card>

            {/* Results */}
            {result && (
              <Card className="mt-8 p-8 border-2 border-border/40">
                <RiskScoreDisplay result={result} />
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Behavioral Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Track typing cadence, mouse pressure, and scroll patterns as you interact
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Merchant Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Check merchant against Visa network and global threat databases
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Risk Scoring</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyze 5 risk dimensions: behavioral, device, network, transaction, velocity
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Instant Decision</h3>
                    <p className="text-sm text-muted-foreground">
                      Approve, decline, or trigger MFA based on real-time risk assessment
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/40 rounded-lg p-6">
                <h3 className="font-bold mb-4">What Makes Us Unique</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Global threat intelligence from 4+ sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Elderly-friendly with SMS alerts and simple warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Works in 190+ countries with multi-currency support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Deep Visa API integration for merchant verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>African scam pattern recognition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function RiskScoreDisplay({ result }: { result: any }) {
  const { riskScore, merchantVerification, threatIntelligence } = result

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "approve":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "mfa_required":
        return <Lock className="w-8 h-8 text-yellow-500" />
      case "review":
        return <AlertTriangle className="w-8 h-8 text-orange-500" />
      case "decline":
        return <AlertTriangle className="w-8 h-8 text-red-500" />
      default:
        return <Shield className="w-8 h-8 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Decision */}
      <div className={`p-6 rounded-lg border-2 ${getRiskColor(riskScore.riskLevel)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getDecisionIcon(riskScore.decision)}
            <div>
              <h3 className="text-2xl font-bold capitalize">{riskScore.decision.replace("_", " ")}</h3>
              <p className="text-sm opacity-80">Risk Level: {riskScore.riskLevel.toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{riskScore.overallScore}</div>
            <div className="text-xs opacity-80">Risk Score</div>
          </div>
        </div>

        {riskScore.mfaRequired && (
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm font-medium">Multi-Factor Authentication Required</p>
            <p className="text-xs opacity-80 mt-1">
              This transaction requires additional verification due to elevated risk factors
            </p>
          </div>
        )}
      </div>

      {/* Risk Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 border-border/40">
          <h4 className="font-bold mb-3">Risk Analysis</h4>
          <div className="space-y-2">
            <RiskBar label="Behavioral" score={riskScore.behavioralRisk} />
            <RiskBar label="Device" score={riskScore.deviceRisk} />
            <RiskBar label="Network" score={riskScore.networkRisk} />
            <RiskBar label="Transaction" score={riskScore.transactionRisk} />
            <RiskBar label="Velocity" score={riskScore.velocityRisk} />
          </div>
        </Card>

        <Card className="p-4 border-border/40">
          <h4 className="font-bold mb-3">Risk Factors</h4>
          {riskScore.riskFactors.length > 0 ? (
            <ul className="space-y-2">
              {riskScore.riskFactors.map((factor: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No significant risk factors detected</p>
          )}
        </Card>
      </div>

      {/* Merchant Verification */}
      {merchantVerification && (
        <Card className="p-4 border-border/40">
          <h4 className="font-bold mb-3">Merchant Verification</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge className="ml-2" variant={merchantVerification.verified ? "default" : "destructive"}>
                {merchantVerification.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Trust Score:</span>
              <span className="ml-2 font-semibold">{merchantVerification.trustScore}/100</span>
            </div>
          </div>
        </Card>
      )}

      {/* Threat Intelligence */}
      {threatIntelligence && (
        <Card className="p-4 border-border/40">
          <h4 className="font-bold mb-3">Threat Intelligence</h4>
          <div className="space-y-2 text-sm">
            {threatIntelligence.alienvault && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">AlienVault OTX:</span>
                <Badge variant={threatIntelligence.alienvault.clean ? "default" : "destructive"}>
                  {threatIntelligence.alienvault.clean ? "Clean" : "Threat Detected"}
                </Badge>
              </div>
            )}
            {threatIntelligence.virustotal && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">VirusTotal:</span>
                <Badge variant={threatIntelligence.virustotal.malicious === 0 ? "default" : "destructive"}>
                  {threatIntelligence.virustotal.malicious} detections
                </Badge>
              </div>
            )}
            {threatIntelligence.abuseipdb && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">AbuseIPDB:</span>
                <Badge variant={threatIntelligence.abuseipdb.abuseScore < 25 ? "default" : "destructive"}>
                  {threatIntelligence.abuseipdb.abuseScore}% abuse score
                </Badge>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

function RiskBar({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score < 30) return "bg-green-500"
    if (score < 50) return "bg-yellow-500"
    if (score < 70) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{Math.round(score)}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${getColor(score)} transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}
