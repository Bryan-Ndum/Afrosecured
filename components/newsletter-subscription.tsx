"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle2, Newspaper } from "lucide-react"

export function NewsletterSubscription() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // In production, this would call your newsletter API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubscribed(true)
      setEmail("")
    } catch (err) {
      setError("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center border-2 border-primary/20">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Successfully Subscribed!</h3>
            <p className="text-muted-foreground">
              You'll receive our biweekly security digest with the latest scam alerts, threat intelligence, and safety
              tips.
            </p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Newspaper className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-3">Stay Protected with Our Biweekly Digest</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest scam alerts, security breaches, and expert safety tips delivered to your inbox every two
                weeks. Join thousands of Africans staying one step ahead of cybercriminals.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading} className="bg-primary hover:bg-primary/90">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </form>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
              <p className="text-xs text-muted-foreground mt-3">
                We respect your privacy. Unsubscribe anytime. No spam, ever.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50">
            <h4 className="font-semibold mb-4 text-center">What You'll Get:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h5 className="font-medium mb-1">Top Scams of the Week</h5>
                <p className="text-muted-foreground text-xs">Latest fraud tactics targeting Africans</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h5 className="font-medium mb-1">Security Breach Alerts</h5>
                <p className="text-muted-foreground text-xs">Critical vulnerabilities and data leaks</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h5 className="font-medium mb-1">Expert Safety Tips</h5>
                <p className="text-muted-foreground text-xs">Actionable advice to protect yourself</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
