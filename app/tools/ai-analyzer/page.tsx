"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AIAnalyzerPage() {
  const [input, setInput] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeContent = async () => {
    if (!input.trim()) return

    setAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/tools/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] AI analysis error:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze content. Please check your connection and try again.",
      )
    } finally {
      setAnalyzing(false)
    }
  }

  const getThreatColor = (score: number) => {
    if (score >= 80) return "text-red-500"
    if (score >= 50) return "text-amber-500"
    return "text-emerald-500"
  }

  const getThreatLabel = (score: number) => {
    if (score >= 80) return "High Risk"
    if (score >= 50) return "Medium Risk"
    return "Low Risk"
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <a href="/tools" className="inline-flex items-center text-primary hover:underline mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </a>
          <h1 className="text-4xl font-bold text-foreground mb-3">AI Scam Analyzer</h1>
          <p className="text-lg text-muted-foreground">
            Paste any suspicious message, email, or text below and our AI will analyze it for scam indicators
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Suspicious Content</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the suspicious message, email, or text here..."
            className="min-h-[200px] mb-4 font-mono text-sm"
          />
          <Button onClick={analyzeContent} disabled={!input.trim() || analyzing} className="w-full md:w-auto">
            {analyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Analyze with AI
              </>
            )}
          </Button>
        </Card>

        {error && (
          <Card className="p-6 mb-6 border-red-500/50 bg-red-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-500 mb-1">Analysis Failed</h3>
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

        {/* Results Section */}
        {result && !error && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Threat Score */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Threat Assessment</h2>
                <div className={`text-3xl font-bold ${getThreatColor(result.threatScore)}`}>
                  {result.threatScore}/100
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <span className={`text-sm font-semibold ${getThreatColor(result.threatScore)}`}>
                    {getThreatLabel(result.threatScore)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.threatScore >= 80
                        ? "bg-red-500"
                        : result.threatScore >= 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${result.threatScore}%` }}
                  />
                </div>
              </div>
              <p className="text-muted-foreground">{result.summary}</p>
            </Card>

            {/* Scam Indicators */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Detected Indicators</h3>
              <div className="space-y-3">
                {result.indicators.map((indicator: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div
                      className={`p-2 rounded-lg ${
                        indicator.severity === "high"
                          ? "bg-red-500/10 text-red-500"
                          : indicator.severity === "medium"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{indicator.type}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            indicator.severity === "high"
                              ? "bg-red-500/20 text-red-500"
                              : indicator.severity === "medium"
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          {indicator.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
