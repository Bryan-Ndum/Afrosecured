"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function URLScannerPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const scanURL = async () => {
    if (!url.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/tools/url-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] URL scan error:", error)
      setError(
        error instanceof Error ? error.message : "Failed to scan URL. Please check your connection and try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">URL Threat Scanner</h1>
          <p className="text-lg text-muted-foreground">
            Scan suspicious links for malware, phishing, and other threats
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Enter URL to scan</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
                onKeyDown={(e) => e.key === "Enter" && scanURL()}
              />
            </div>
            <Button onClick={scanURL} disabled={loading || !url.trim()} className="w-full">
              {loading ? "Scanning..." : "Scan URL"}
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="p-6 mb-6 border-red-500/50 bg-red-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-500 mb-1">Scan Failed</h3>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Scan Results</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.threatScore >= 70
                      ? "bg-red-500/20 text-red-500"
                      : result.threatScore >= 40
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-emerald-500/20 text-emerald-500"
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Threat Score</p>
                  <p className="text-2xl font-bold text-foreground">{result.threatScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold text-foreground">{result.category}</p>
                </div>
              </div>
              {result.threats && result.threats.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Detected Threats:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.threats.map((threat: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {threat}
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
          </Card>
        )}
      </div>
    </main>
  )
}
