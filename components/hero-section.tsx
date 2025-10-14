"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-card border border-border rounded-full text-sm">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Africa's Digital Trust Infrastructure</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
          AfroSecured™
          <br />
          <span className="text-primary">Africa's digital economy</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Protecting $700B+ in mobile money transactions with real-time fraud detection, behavioral intelligence, and
          community-powered security.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            asChild
            size="lg"
            className="text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group"
          >
            <Link href="/mobile-money-guardian">
              Try Mobile Money Guardian
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base px-8 h-12 border-border hover:bg-card rounded-full bg-transparent"
            asChild
          >
            <Link href="/vision">Our Vision</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="text-4xl font-bold text-primary mb-2">$700B+</div>
            <div className="text-sm text-muted-foreground">Mobile money protected</div>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="text-4xl font-bold text-primary mb-2">500M+</div>
            <div className="text-sm text-muted-foreground">Users across Africa</div>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
            <div className="text-sm text-muted-foreground">Fraud prevention</div>
          </div>
        </div>
      </div>
    </section>
  )
}
