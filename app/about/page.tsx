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
              About <span className="text-primary">AfroSecured™</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Enterprise-Grade Digital Trust Infrastructure for Africa and Beyond
            </p>
          </div>

          {/* Main Story */}
          <Card className="mb-12 border-primary/20 rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Digital fraud costs African businesses and consumers billions annually. From sophisticated phishing
                  campaigns to mobile money scams, the threat landscape continues to evolve faster than traditional
                  security solutions can adapt.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  <span className="font-semibold text-primary">
                    AfroSecured™ delivers real-time threat intelligence and fraud prevention infrastructure designed
                    specifically for African markets.
                  </span>
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  We aggregate threat data from global sources including Cisco Talos (PhishTank), AlienVault OTX,
                  VirusTotal, and regional security feeds to provide comprehensive protection against emerging threats.
                  Our platform processes millions of data points daily to identify and neutralize scams before they
                  impact users.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Built on enterprise-grade infrastructure with offline-first architecture, AfroSecured™ operates
                  effectively even in low-connectivity environments. We partner with mobile money providers, financial
                  institutions, and telecommunications companies to deliver network-level fraud prevention at scale.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Our B2B API enables fintechs, e-commerce platforms, and payment processors to integrate real-time
                  fraud scoring, transaction verification, and threat intelligence into their existing systems. We
                  provide the infrastructure layer that makes digital commerce safer and more trustworthy across the
                  continent.
                </p>

                <p className="text-lg leading-relaxed font-semibold text-primary">
                  AfroSecured™ is building Africa's digital trust infrastructure through advanced threat intelligence,
                  machine learning, and strategic partnerships with leading technology providers.
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
                <h3 className="text-xl font-bold mb-3">Scalability</h3>
                <p className="text-muted-foreground">
                  Enterprise infrastructure designed to protect millions of transactions daily
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
                  <Lightbulb className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Intelligence</h3>
                <p className="text-muted-foreground">
                  Real-time threat data from Cisco Talos, AlienVault, VirusTotal, and regional sources
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Partnership</h3>
                <p className="text-muted-foreground">
                  Strategic integrations with telcos, banks, and payment providers across Africa
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20 rounded-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-6">
                To provide enterprise-grade fraud prevention infrastructure that enables secure digital commerce across
                Africa through real-time threat intelligence, machine learning, and strategic partnerships with leading
                financial and telecommunications providers.
              </p>
              <div className="inline-flex items-center gap-2 text-primary font-semibold">
                <TrendingUp className="w-5 h-5" />
                <span>Building Africa's Digital Trust Infrastructure</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
