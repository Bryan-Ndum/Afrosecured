import { InfrastructureVision } from "@/components/infrastructure-vision"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Rocket, Globe } from "lucide-react"
import Link from "next/link"

export default function VisionPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Vision: Africa's Digital Trust Infrastructure</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're building the trust layer that makes every digital transaction in Africa safe, transparent, and
            fraud-free— from SMS to blockchain.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-20">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">The Problem</h3>
                <p className="text-muted-foreground">
                  $21-35 billion lost annually to mobile money fraud in Africa. 500M+ users have no effective protection
                  against SMS scams, voice phishing, and transaction fraud.
                </p>
              </div>
              <div>
                <Rocket className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">Our Solution</h3>
                <p className="text-muted-foreground">
                  Build proprietary fraud detection using behavioral biometrics, community intelligence, and real-time
                  transaction verification—not just API aggregation.
                </p>
              </div>
              <div>
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">The Vision</h3>
                <p className="text-muted-foreground">
                  Become the trust infrastructure layer for Africa's digital economy—embedded in every fintech, telco,
                  and e-commerce platform across the continent.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <InfrastructureVision />

        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The Path to $1B+ Valuation</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">Phase 1</div>
              <h3 className="text-xl font-bold mb-2">Consumer Traction</h3>
              <p className="text-muted-foreground text-sm">
                10M users on Mobile Money Guardian. Build the largest African fraud database.
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">Phase 2</div>
              <h3 className="text-xl font-bold mb-2">B2B Platform</h3>
              <p className="text-muted-foreground text-sm">
                API for telcos and fintechs. $250M ARR at $0.50/user from 500M users.
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">Phase 3</div>
              <h3 className="text-xl font-bold mb-2">Infrastructure</h3>
              <p className="text-muted-foreground text-sm">
                Embedded in every digital transaction. The Cloudflare of trust for Africa.
              </p>
            </Card>
          </div>

          <Button size="lg" className="text-base px-8 h-12 rounded-full" asChild>
            <Link href="/mobile-money-guardian">
              Start with Mobile Money Guardian
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
