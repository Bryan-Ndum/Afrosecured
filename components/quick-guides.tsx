import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Smartphone, Lock, CreditCard } from "lucide-react"

const guides = [
  {
    icon: Mail,
    title: "Identify Phishing Emails",
    steps: [
      "Check sender address carefully",
      "Look for urgent language or threats",
      "Verify links before clicking",
      "Never share passwords via email",
    ],
    color: "text-destructive",
  },
  {
    icon: Smartphone,
    title: "WhatsApp & Mobile Money Safety",
    steps: [
      "Never share OTP codes",
      "Verify sender identity",
      "Use official banking apps only",
      "Report suspicious messages",
    ],
    color: "text-primary",
  },
  {
    icon: Lock,
    title: "Secure Your Accounts",
    steps: [
      "Enable two-factor authentication",
      "Use unique, strong passwords",
      "Regular security checkups",
      "Monitor account activity",
    ],
    color: "text-accent",
  },
]

export function QuickGuides() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Quick <span className="text-primary">Protection</span> Guides
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Simple, visual guides to protect yourself and your family from common scams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {guides.map((guide, index) => {
            const Icon = guide.icon
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/50">
                    <Icon className={`w-8 h-8 ${guide.color}`} />
                  </div>
                  <CardTitle className="text-xl text-balance">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guide.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full ${guide.color.replace("text-", "bg-")}/20 flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <span className={`text-xs font-bold ${guide.color}`}>{stepIndex + 1}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Infographic showcase */}
        <Card className="bg-gradient-to-r from-secondary/20 to-muted/20 border-border/50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-accent">Visual</span> Learning Resources
              </h3>
              <p className="text-muted-foreground">Download our infographics and share them with your community</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Infographic previews */}
              <div className="bg-card/50 rounded-lg p-6 text-center border border-border/50">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Mobile Money Safety</h4>
                <p className="text-sm text-muted-foreground mb-4">Step-by-step visual guide</p>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">Download PDF →</button>
              </div>

              <div className="bg-card/50 rounded-lg p-6 text-center border border-border/50">
                <Mail className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Phishing Red Flags</h4>
                <p className="text-sm text-muted-foreground mb-4">Spot fake emails instantly</p>
                <button className="text-sm text-destructive hover:text-destructive/80 transition-colors">
                  Download PDF →
                </button>
              </div>

              <div className="bg-card/50 rounded-lg p-6 text-center border border-border/50">
                <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Account Security</h4>
                <p className="text-sm text-muted-foreground mb-4">Protect your digital life</p>
                <button className="text-sm text-accent hover:text-accent/80 transition-colors">Download PDF →</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
