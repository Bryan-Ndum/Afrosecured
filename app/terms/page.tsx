import { Shield, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>

        <Card className="p-8 space-y-8">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Effective Date:</strong> October 2025
            </p>
            <p className="mb-2">
              <strong>Company:</strong> AfroSecured™
            </p>
            <p className="mb-2">
              <strong>Website:</strong>{" "}
              <a href="https://www.afrosecured.com" className="text-primary hover:underline">
                https://www.afrosecured.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <strong>Contact:</strong>
              <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline flex items-center gap-1">
                <Mail className="w-4 h-4" />
                afrosecured@gmail.com
              </a>
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using AfroSecured™, you agree to these Terms of Service and our Privacy Policy. If you do
              not agree, you may not use AfroSecured™. If you use AfroSecured™ on behalf of an organization, you confirm
              that you have authority to bind that organization to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. About AfroSecured™</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ is a cybersecurity intelligence platform built to help users verify, scan, and understand the
              safety of websites, messages, and digital transactions. Our mission is to make the digital world safer and
              more transparent, starting with Africa and expanding globally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 13 years old to use AfroSecured™. If you are under 18, you must have permission and
              supervision from a parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Your Account</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for keeping your account secure. Do not share your password or allow others to access
              your account. Notify us immediately at{" "}
              <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline">
                afrosecured@gmail.com
              </a>{" "}
              if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Use of the Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AfroSecured™ grants you a limited, non-exclusive, revocable license to use the platform for lawful
              purposes. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Attempt to hack, disrupt, or overload the service</li>
              <li>Use AfroSecured™ to send spam or malicious content</li>
              <li>Reverse engineer or copy AfroSecured™'s systems or algorithms</li>
              <li>Upload harmful code, viruses, or exploit scripts</li>
              <li>Misuse or misrepresent scan results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. User Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you submit information, reports, or data through AfroSecured™, you retain ownership of your content.
              However, you grant AfroSecured™ permission to use, analyze, and process it to improve our detection models
              and services. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Security and Reliability</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ uses standard security practices to protect your data, but no system is completely secure.
              You use the service at your own risk and agree that AfroSecured™ is not liable for losses arising from
              unauthorized access or downtime.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ may integrate or link to third-party APIs or services such as Visa, MTN Mobile Money, or
              threat intelligence sources. These third parties have their own terms, and AfroSecured™ is not responsible
              for their actions or data handling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All AfroSecured™ logos, code, features, and content are the property of AfroSecured™. You may not
              reproduce or distribute any part of the platform without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ provides information "as is" without guarantees of accuracy, reliability, or completeness. We
              do not provide financial or legal advice. Always verify results independently before making financial or
              security decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ is not liable for any indirect, incidental, or consequential damages arising from your use of
              the service. Our total liability is limited to the amount you paid, if any, in the 12 months before the
              claim, or $100—whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate access at any time if you violate these terms or misuse the service. You may
              stop using AfroSecured™ at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Updates and Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service periodically. Updates will be posted on this page with a new
              effective date. Continuing to use AfroSecured™ after an update means you accept the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of North Carolina, United States, without regard to conflict of law
              rules. Disputes will be handled in the courts of North Carolina unless otherwise required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions, concerns, or feedback, contact us at:
            </p>
            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline">
                  afrosecured@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground">
                🌐{" "}
                <a href="https://www.afrosecured.com" className="text-primary hover:underline">
                  www.afrosecured.com
                </a>
              </p>
            </div>
          </section>
        </Card>
      </div>
    </div>
  )
}
