"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [selectedRegion, setSelectedRegion] = useState("global")

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 pt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
            <Shield className="relative w-16 h-16 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-balance">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            AfroSecured™
          </span>
        </h1>

        <p className="text-2xl md:text-3xl font-semibold text-muted-foreground/80 mb-6">
          Enterprise-Grade Threat Intelligence Platform
        </p>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          Real-time fraud prevention powered by AlienVault OTX, VirusTotal, and global threat intelligence networks.
          Protecting businesses and consumers across Africa.
        </p>

        <div className="flex justify-center mb-8">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[200px] bg-card border-border">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">🌍 Global</SelectItem>
              <SelectItem value="us">🇺🇸 United States</SelectItem>
              <SelectItem value="gh">🇬🇭 Ghana</SelectItem>
              <SelectItem value="ke">🇰🇪 Kenya</SelectItem>
              <SelectItem value="ng">🇳🇬 Nigeria</SelectItem>
              <SelectItem value="za">🇿🇦 South Africa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Link href="/tools">Try Security Tools</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          >
            Join Waitlist
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-2xl font-bold text-primary">AlienVault</span>
            <span className="text-sm text-muted-foreground">Threat Intelligence</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-2xl font-bold text-primary">Real-Time</span>
            <span className="text-sm text-muted-foreground">Threat Detection</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-2xl font-bold text-primary">B2B API</span>
            <span className="text-sm text-muted-foreground">Enterprise Integration</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Launched 2025 • Open Beta
        </div>
      </div>
    </section>
  )
}
