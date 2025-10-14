import { HeroSection } from "@/components/hero-section"
import { InfrastructureVision } from "@/components/infrastructure-vision"
import { ThreatHeatmap } from "@/components/threat-heatmap"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Smartphone, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full text-sm">
                <Smartphone className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Flagship Product</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Mobile Money Guardian</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Protect Africa's $700B mobile money ecosystem with real-time SMS, USSD, and voice call fraud detection.
                Built specifically for M-Pesa, MTN Money, Airtel Money, and Orange Money users.
              </p>
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/mobile-money-guardian">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">$21B+</div>
                <div className="text-sm text-muted-foreground">Annual fraud losses</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">500M+</div>
                <div className="text-sm text-muted-foreground">Users to protect</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">95%+</div>
                <div className="text-sm text-muted-foreground">Detection accuracy</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
                <div className="text-sm text-muted-foreground">Protection</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <InfrastructureVision />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Global Threat Intelligence</h2>
            <p className="text-xl text-muted-foreground">Real-time threat activity across Africa, Europe, and USA</p>
          </div>
          <ThreatHeatmap />
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Africa's Digital Trust Revolution</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're a user protecting your mobile money or a fintech building the future, AfroSecured is your
            trust infrastructure partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/mobile-money-guardian">For Users</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent" asChild>
              <Link href="/vision">For Businesses</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
