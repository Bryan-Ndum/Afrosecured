"use client"

import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-32">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-24 h-24 border border-accent/30 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent rounded-full animate-ping" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Shield className="w-20 h-20 text-primary animate-pulse-glow" />
            <Globe className="absolute -top-2 -right-2 w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up text-balance">
          <span className="text-foreground">AfroSecure:</span> <span className="text-primary">Digital Security</span>{" "}
          <span className="text-accent">That Saves Lives</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto animate-fade-in-up text-pretty">
          Comprehensive digital security protection for Africans and the diaspora - from scam prevention to emergency
          protocols that can save lives.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow"
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          >
            Join the Waitlist
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            Learn More
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span>Real-time alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Privacy-first</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            <span>Global coverage</span>
          </div>
        </div>
      </div>
    </section>
  )
}
