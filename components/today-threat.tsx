"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function TodayThreat() {
  const [isOpen, setIsOpen] = useState(false)

  const threat = {
    title: "Organized Crime Rings Target International Students",
    severity: "High Risk",
    date: "Today, 2:45 PM",
    source: "University Affairs",
    sourceUrl: "https://universityaffairs.ca/features/organized-criminals-target-international-students/",
    bullets: [
      "What happened: Sophisticated crime rings are creating fake study permits and acceptance letters for international students in Canada",
      "Why it matters: Students lose thousands of dollars and face deportation when their fraudulent documents are discovered",
      "What to do now: Only accept documents from official university portals and verify all communications through official channels",
    ],
  }

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
                  {threat.severity}
                </Badge>
                <span className="text-sm text-muted-foreground">{threat.date}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <a
                  href={threat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  {threat.source}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold mb-4">{threat.title}</h3>

              <ul className="space-y-3 mb-6">
                {threat.bullets.map((bullet, index) => (
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
                      <p className="text-sm">
                        Verify all university communications through official .edu email addresses
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        2
                      </div>
                      <p className="text-sm">Check acceptance letters directly on the university's official portal</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        3
                      </div>
                      <p className="text-sm">Never pay application fees through unofficial payment processors</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                        4
                      </div>
                      <p className="text-sm">
                        Report suspicious communications to your university's international office
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
