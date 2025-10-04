"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Users, Zap } from "lucide-react"

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <section id="waitlist" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Join the <span className="text-primary">AfroSecure</span> Community
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Be among the first to access our comprehensive cybersecurity platform
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Early Access Waitlist</CardTitle>
            <div className="flex justify-center gap-4 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                12,847 joined
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Launching Q2 2025
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Joining...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Join Waitlist
                      </div>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    By joining, you'll get early access to our beta, exclusive security tips, and updates on the latest
                    scam threats.
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Welcome to AfroSecure!</h3>
                <p className="text-muted-foreground">
                  Thank you for joining our waitlist. We'll keep you updated on our progress and notify you as soon as
                  early access is available.
                </p>
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm">
                    <strong>What's next?</strong> Check your email for a confirmation link and follow us on social media
                    for the latest security tips and updates.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-card/30 backdrop-blur border-border/50 text-center">
            <CardContent className="p-6">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Early Access</h4>
              <p className="text-sm text-muted-foreground">
                Be first to try our beta platform and shape the future of African cybersecurity
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur border-border/50 text-center">
            <CardContent className="p-6">
              <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Exclusive Updates</h4>
              <p className="text-sm text-muted-foreground">
                Weekly security tips and alerts tailored to African and diaspora communities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur border-border/50 text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Community Access</h4>
              <p className="text-sm text-muted-foreground">
                Join our private community of security-conscious Africans worldwide
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
