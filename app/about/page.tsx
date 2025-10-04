import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Eye, Lock, Globe, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-balance">
              About <span className="text-primary">AfroSecured</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">Where safety meets trust</p>
          </div>

          {/* Main Story */}
          <Card className="mb-12 border-primary/20 rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Afrosecured was born out of frustration, watching people I know get scammed online. Friends losing
                  money to fake stores, family members tricked by phishing messages, and small businesses falling for
                  "verified" links that weren't what they seemed. It opened my eyes to how little trust people have in
                  the online world, and how much that trust matters.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  That's why Afrosecured isn't just about protection, it is about restoring confidence. We built it to
                  help everyday users, students, creators, and entrepreneurs to navigate the internet safely with tools
                  that are clear, honest, and transparent.
                </p>

                <p className="text-lg leading-relaxed font-semibold text-primary">
                  At Afrosecured, trust is our foundation and transparency is our promise. We're here to make the
                  digital world safer, fairer, and more open with one secured connection at a time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12 border-primary/30 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full shrink-0">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Every scan, every alert, and every security report from Afrosecured shows why something is safe or
                    unsafe. No hidden algorithms, no secret filters — just facts you can understand and decide on.
                    Because real security isn't about fear, it's about clarity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-primary/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Trust</h3>
                <p className="text-muted-foreground">Building confidence through reliable, honest security solutions</p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Transparency</h3>
                <p className="text-muted-foreground">Clear explanations with no hidden algorithms or secret filters</p>
              </CardContent>
            </Card>

            <Card className="text-center border-destructive/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Protecting everyday users, students, creators, and entrepreneurs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20 rounded-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                To make the digital world safer, fairer, and more open — one secured connection at a time. We empower
                communities with the knowledge and tools they need to navigate the internet with confidence.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
