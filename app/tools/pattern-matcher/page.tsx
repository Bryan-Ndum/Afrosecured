"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PatternMatcherPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const matchPattern = async () => {
    if (!text.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/tools/pattern-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Pattern matching error:", error)
      setResult({ error: "Failed to match patterns" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Scam Pattern Matcher</h1>
          <p className="text-lg text-muted-foreground">ML-powered pattern recognition for emerging scam tactics</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Enter text to analyze</label>
              <textarea
                placeholder="Paste suspicious message, email, or text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-foreground"
              />
            </div>
            <Button onClick={matchPattern} disabled={loading || !text.trim()} className="w-full">
              {loading ? "Analyzing Patterns..." : "Match Patterns"}
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
                  <h3 className="text-xl font-semibold">Pattern Analysis</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.matchScore >= 70
                        ? "bg-red-500/20 text-red-500"
                        : result.matchScore >= 40
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-emerald-500/20 text-emerald-500"
                    }`}
                  >
                    {result.matchScore}% Match
                  </span>
                </div>
                {result.matchedPatterns && result.matchedPatterns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Matched Scam Patterns:</p>
                    <div className="space-y-2">
                      {result.matchedPatterns.map((pattern: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium text-foreground">{pattern.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
                          <p className="text-xs text-amber-500 mt-1">Confidence: {pattern.confidence}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Analysis:</p>
                  <p className="text-sm text-muted-foreground">{result.analysis}</p>
                </div>
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
