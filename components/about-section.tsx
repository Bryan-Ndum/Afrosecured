import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Globe, Users, Eye, Lock } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-balance">
            About <span className="text-primary">AfroSecured</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground mb-6 text-pretty">
              Afrosecured was born out of frustration, watching people I know get scammed online. We built it to help
              everyday users, students, creators, and entrepreneurs to navigate the internet safely with tools that are
              clear, honest, and transparent.
            </p>
            <p className="text-lg text-primary font-semibold">Where safety meets trust.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur text-center border-primary/20 rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-muted-foreground">Our foundation for building confidence</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur text-center border-accent/20 rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
                <Eye className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-muted-foreground">Our promise to you</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur text-center border-destructive/20 rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
                <Heart className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground">Protecting everyday users</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur text-center border-border/50 rounded-2xl">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">500K+</h3>
              <p className="text-muted-foreground">People Protected</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur text-center border-border/50 rounded-2xl">
            <CardContent className="p-6">
              <Globe className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">25+</h3>
              <p className="text-muted-foreground">Countries Covered</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur text-center border-border/50 rounded-2xl">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">15</h3>
              <p className="text-muted-foreground">Languages Supported</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 rounded-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto text-pretty">
              Every scan, every alert, and every security report from Afrosecured shows why something is safe or unsafe.
              No hidden algorithms, no secret filters — just facts you can understand and decide on. Because real
              security isn't about fear, it's about clarity.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
