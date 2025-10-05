import { Card, CardContent } from "@/components/ui/card"
import { Heart, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-balance">
            About <span className="text-primary">Afrosecured</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground mb-6 text-pretty hyphens-none">
              Afrosecured was born out of frustration, watching people I know get scammed online. Friends losing money
              to fake stores, family members tricked by phishing messages, and small businesses falling for fake links.
              That is why we built Afrosecured. It is not just to protect people, but to restore trust and transparency
              in the online world.
            </p>
            <Link href="/transparency">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Read Our Commitment →
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card backdrop-blur text-center border-2 border-primary/30 rounded-2xl hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Lock className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-muted-foreground hyphens-none">
                Building confidence through reliable, honest security solutions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card backdrop-blur text-center border-2 border-primary/30 rounded-2xl hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Eye className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-muted-foreground hyphens-none">
                Clear explanations with no hidden algorithms or secret filters
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card backdrop-blur text-center border-2 border-primary/30 rounded-2xl hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Heart className="w-10 h-10 text-primary group-hover:scale-110 group-hover:fill-primary transition-all duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground hyphens-none">
                Protecting everyday users, students, creators, and entrepreneurs
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-primary/20 rounded-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto text-pretty hyphens-none">
              Every scan, every alert, and every security report from Afrosecured shows why something is safe or unsafe.
              No hidden algorithms, no secret filters, just facts you can understand and decide on. Because real
              security is not about fear, it is about clarity.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
