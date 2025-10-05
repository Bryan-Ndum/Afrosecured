import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Target, Users, Globe, Lightbulb, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Header />

      <section className="pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-balance">
              About <span className="text-primary">AfroSecured</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">Africa's Shield for a Safer Digital World</p>
          </div>

          {/* Main Story */}
          <Card className="mb-12 border-primary/20 rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Every day, people around the world, especially across Africa, lose money, data, and confidence to
                  online scams. From fake investment links and romance frauds to phishing sites that look real, the
                  problem is not only digital but deeply human. It affects families, businesses, and communities.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  <span className="font-semibold text-primary">Afrosecured was created to change that reality.</span>
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Born in Africa and built for the world, it is a community-driven cybersecurity platform that helps
                  people verify, scan, and understand the safety of websites, messages, and digital transactions with
                  clarity and confidence.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Our mission is to restore trust in Africa's digital economy and extend that trust globally. We believe
                  that cybersecurity should be accessible to everyone and that transparency is the key to real
                  protection.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  By combining global threat intelligence with African innovation, Afrosecured detects scams faster,
                  educates communities, and builds awareness through honest, easy-to-understand insights. Each scan
                  reveals the truth and empowers users to take control of their safety online.
                </p>

                <p className="text-lg leading-relaxed font-semibold text-primary">
                  Afrosecured believes that Africa can lead the world in redefining digital trust through openness,
                  education, and community-driven security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-primary/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Cybersecurity should be accessible to everyone, not just experts
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
                  <Lightbulb className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Transparency</h3>
                <p className="text-muted-foreground">Honest, easy-to-understand insights with no hidden algorithms</p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-muted-foreground">Community-driven security that educates and empowers users</p>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20 rounded-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-6">
                To restore trust in Africa's digital economy and extend that trust globally by combining global threat
                intelligence with African innovation.
              </p>
              <div className="inline-flex items-center gap-2 text-primary font-semibold">
                <TrendingUp className="w-5 h-5" />
                <span>Africa leading the world in digital trust</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
