"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Threat {
  id: string
  title: string
  description: string
  source: string
  source_url?: string
  severity: string
  created_at: string
}

export function TodayThreat() {
  const [isOpen, setIsOpen] = useState(false)
  const [threat, setThreat] = useState<Threat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatestThreat = async () => {
      try {
        const response = await fetch("/api/trending-scam")
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setThreat(data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch threat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestThreat()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Today's Threat</h2>
          <Card className="p-6 md:p-8 bg-card border-border shadow-lg">
            <div className="text-center text-muted-foreground">Loading latest threat...</div>
          </Card>
        </div>
      </section>
    )
  }

  if (!threat) {
    return null
  }

  const bullets = [
    `What happened: ${threat.description.split(".")[0]}`,
    "Why it matters: This scam targets vulnerable individuals and can result in significant financial losses",
    "What to do now: Verify all communications through official channels and report suspicious activity",
  ]

  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Today's Threat</h2>

        <Card className="p-6 md:p-8 bg-card border-border shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="destructive" className="text-sm">
                  {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)} Risk
                </Badge>
                <span className="text-sm text-muted-foreground">{formatDate(threat.created_at)}</span>
                <span className="text-sm text-muted-foreground">•</span>
                {threat.source_url ? (
                  <a
                    href={threat.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {threat.source}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">{threat.source}</span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-semibold mb-4">{threat.title}</h3>

              <ul className="space-y-3 mb-6">
                {bullets.map((bullet, index) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">Protect Me</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>30-Second Protection Checklist</DialogTitle>
                    <DialogDescription>Follow these steps to stay safe from this threat</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        1
                      </div>
                      <p className="text-sm">Verify all communications through official channels and trusted sources</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        2
                      </div>
                      <p className="text-sm">
                        Never share personal information or payment details with unverified contacts
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        3
                      </div>
                      <p className="text-sm">Research and verify any offers or requests before taking action</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        4
                      </div>
                      <p className="text-sm">
                        Report suspicious activity to authorities and warn others in your community
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
