"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function PhoneLookupPage() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const lookupPhone = async () => {
    if (!phone.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/tools/phone-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Phone lookup error:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to lookup phone number. Please check your connection and try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Phone Number Lookup</h1>
          <p className="text-lg text-muted-foreground">Check if a phone number is associated with known scams</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Enter phone number</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                onKeyDown={(e) => e.key === "Enter" && lookupPhone()}
              />
            </div>
            <Button onClick={lookupPhone} disabled={loading || !phone.trim()} className="w-full">
              {loading ? "Looking up..." : "Lookup Number"}
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="p-6 mb-6 border-red-500/50 bg-red-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-500 mb-1">Lookup Failed</h3>
                <p className="text-sm text-red-500/90">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="mt-3 border-red-500/30 hover:bg-red-500/10"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}

        {result && !error && (
          <Card className="p-6">
            {result.error ? (
              <div className="text-red-500">{result.error}</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Lookup Results</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.riskLevel === "High"
                        ? "bg-red-500/20 text-red-500"
                        : result.riskLevel === "Medium"
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-emerald-500/20 text-emerald-500"
                    }`}
                  >
                    {result.riskLevel} Risk
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Reports</p>
                    <p className="text-2xl font-bold text-foreground">{result.reportCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-lg font-semibold text-foreground">{result.type}</p>
                  </div>
                </div>
                {result.commonScams && result.commonScams.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Common Scams:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.commonScams.map((scam: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {scam}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Recommendation:</p>
                  <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </main>
  )
}
