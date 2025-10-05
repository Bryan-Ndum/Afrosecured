"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function URLScannerPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const scanURL = async () => {
    if (!url.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/tools/url-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] URL scan error:", error)
      setResult({ error: "Failed to scan URL" })
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
              />
            </div>
            <Button onClick={scanURL} disabled={loading || !url.trim()} className="w-full">
              {loading ? "Scanning..." : "Scan URL"}
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            {result.error ? (
              <div className="text-red-500">{result.error}</div>
            ) : (
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
            )}
          </Card>
        )}
      </div>
    </main>
  )
}
