import { Shield, Twitter, Linkedin, Mail, BookOpen, AlertTriangle } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-secondary/20 border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/afrosecured-logo.png" alt="AfroSecured Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-2xl font-bold">AfroSecured</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm text-pretty">
              Protecting Africans and the diaspora from online scams, phishing, and fraud. Building a safer digital
              future for our global community.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/afrosecured"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/afrosecured"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@afrosecured.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* AfroSecured Resources */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              AfroSecured Resources
            </h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/intel" className="hover:text-primary transition-colors">
                  Intelligence Feed
                </a>
              </li>
              <li>
                <a href="/social" className="hover:text-primary transition-colors">
                  Social Monitoring
                </a>
              </li>
              <li>
                <a href="/report" className="hover:text-primary transition-colors">
                  Report Scam
                </a>
              </li>
              <li>
                <a href="/digest" className="hover:text-primary transition-colors">
                  Weekly Digest
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@afrosecured.com" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © AfroSecured 2025. Protecting lives through digital security awareness.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <span>24/7 Threat Monitoring Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
