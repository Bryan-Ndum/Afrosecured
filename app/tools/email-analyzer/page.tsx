"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function EmailAnalyzerPage() {
  const [headers, setHeaders] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const analyzeEmail = async () => {
    if (!headers.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/tools/email-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Email analysis error:", error)
      setResult({ error: "Failed to analyze email" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Email Header Analyzer</h1>
          <p className="text-lg text-muted-foreground">Detect spoofing and phishing attempts in email headers</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Paste email headers</label>
              <textarea
                placeholder="From: sender@example.com&#10;To: recipient@example.com&#10;Subject: Important Message&#10;..."
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-foreground"
              />
            </div>
            <Button onClick={analyzeEmail} disabled={loading || !headers.trim()} className="w-full">
              {loading ? "Analyzing..." : "Analyze Headers"}
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
                  <h3 className="text-xl font-semibold">Analysis Results</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.trustScore < 40
                        ? "bg-red-500/20 text-red-500"
                        : result.trustScore < 70
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-emerald-500/20 text-emerald-500"
                    }`}
                  >
                    {result.verdict}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Trust Score</p>
                    <p className="text-2xl font-bold text-foreground">{result.trustScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sender</p>
                    <p className="text-sm font-semibold text-foreground break-all">{result.sender}</p>
                  </div>
                </div>
                {result.warnings && result.warnings.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Warnings:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.warnings.map((warning: string, i: number) => (
                        <li key={i} className="text-sm text-amber-500">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Analysis:</p>
                  <p className="text-sm text-muted-foreground">{result.analysis}</p>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </main>
  )
}
