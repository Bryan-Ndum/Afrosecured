"use client"

import { useState, useEffect } from "react"
import { X, Cookie, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("afrosecured-cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("afrosecured-cookie-consent", "accepted")
    localStorage.setItem("afrosecured-consent-date", new Date().toISOString())
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("afrosecured-cookie-consent", "declined")
    localStorage.setItem("afrosecured-consent-date", new Date().toISOString())
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-lg border-2 border-primary/20 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Your Privacy Matters
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AfroSecured™ uses cookies and similar technologies to provide essential security features, analyze
                  threats, and improve your experience. We do not sell your personal data. By clicking "Accept", you
                  agree to our use of cookies as described in our{" "}
                  <a href="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAccept} className="flex-1 sm:flex-none">
                  Accept All Cookies
                </Button>
                <Button onClick={handleDecline} variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  Decline Non-Essential
                </Button>
                <Button
                  onClick={() => setShowBanner(false)}
                  variant="ghost"
                  size="sm"
                  className="sm:ml-auto"
                  aria-label="Close banner"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Essential cookies are required for security and cannot be disabled. Non-essential cookies help us
                improve our threat detection and user experience.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
