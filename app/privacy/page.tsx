import { Shield, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy explains how AfroSecured™ collects, uses, shares, and protects information when you
              use our website, apps, and related services. By using AfroSecured™, you agree to the practices described
              here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information you provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Account details, such as name, email, password</li>
              <li>Profile information, such as organization, role, country</li>
              <li>Content you submit, such as URLs, messages, reports, comments, attachments</li>
              <li>Support requests and feedback</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Information collected automatically</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Device and log data, such as IP address, browser type, operating system, timestamps, pages viewed</li>
              <li>Usage data, such as feature interactions, clicks, and error reports</li>
              <li>Cookies and similar technologies used for authentication, preferences, analytics, and security</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Information from partners</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Threat intelligence feeds and fraud signals</li>
              <li>Payment and billing information from processors, if you purchase paid features</li>
              <li>Mobile money and card verification results, when you choose to connect those services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use information to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide, maintain, and improve AfroSecured™</li>
              <li>Detect, prevent, and investigate fraud, abuse, malware, and security issues</li>
              <li>Operate scanning, verification, and risk scoring features</li>
              <li>Personalize content, recommendations, and settings</li>
              <li>Communicate with you about updates, security alerts, and support</li>
              <li>Comply with law and enforce our Terms of Service</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4 font-semibold">
              We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. AI and Automated Processing</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ uses machine learning to analyze signals, classify risks, and generate safety insights. We
              may use aggregated, de-identified data to improve our models. You can contact us to object to decisions
              based solely on automated processing that have legal or similar significant effects, where required by
              law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Legal Bases for Processing (EEA and UK users)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Where GDPR or UK law applies, we process personal data on these bases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>To perform a contract with you, for example to provide your account and services</li>
              <li>Legitimate interests, for example to keep services secure and improve features</li>
              <li>Consent, for example for certain cookies or marketing</li>
              <li>Legal obligations, for example compliance and law enforcement requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Similar Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies to keep you signed in, remember preferences, measure usage, and protect against fraud. You
              can control cookies through your browser settings. If you block cookies, some features may not work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Sharing of Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We share information with:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                Service providers that help us run AfroSecured™, such as hosting, analytics, customer support, email
                delivery, payment processing
              </li>
              <li>
                Integration partners you choose to connect, such as mobile money providers, card networks, or
                verification services
              </li>
              <li>Law enforcement or regulators, when required by law or to protect rights and safety</li>
              <li>A new owner in the event of a merger, acquisition, or asset transfer, subject to this Policy</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We require service providers to protect your information and to use it only as instructed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We keep personal information only as long as needed for the purposes in this Policy, for example account
              data for as long as you have an account, and for a reasonable period after closure for backup, audit, and
              legal compliance. We may keep de-identified information for research and product improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use technical and organizational safeguards, including encryption in transit, access controls, logging,
              and regular reviews. No method of transmission or storage is fully secure. You use AfroSecured™ at your
              own risk, and you should protect your account with a strong password and unique credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Your Rights and Choices</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have rights to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Access, correct, update, or delete your personal information</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent where we rely on consent</li>
              <li>Port your data in a usable format</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You can make a request by emailing{" "}
              <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline">
                afrosecured@gmail.com
              </a>
              . We may ask for information to verify your identity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. California Privacy Notice</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are a California resident, you have the right to know categories of personal information collected,
              sources, purposes, and categories of third parties with whom we share it, the right to access, delete,
              correct, and to opt out of the sale or sharing of personal information, and the right to limit the use of
              sensitive personal information. AfroSecured™ does not sell personal information. To exercise rights, email{" "}
              <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline">
                afrosecured@gmail.com
              </a>
              . We will not discriminate against you for exercising your rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ is not directed to children under 13, and we do not knowingly collect personal information
              from children. If you believe a child has provided personal information, contact us and we will take
              appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. International Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may process and store information in the United States and other countries. When we transfer personal
              data internationally, we use appropriate safeguards such as standard contractual clauses or other lawful
              mechanisms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Third Party Links and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              AfroSecured™ may link to external sites or let you connect third party services. Their privacy practices
              apply to their services, not ours. Review their policies before using them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Communications Preferences</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can opt out of non-essential emails by using unsubscribe links or emailing{" "}
              <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline">
                afrosecured@gmail.com
              </a>
              . We may still send service or security notices that are necessary to operate your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">16. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy to reflect changes in our practices. We will post the updated version
              with a new effective date. Material changes will be communicated through the service or by email when
              appropriate. Your continued use of AfroSecured™ after changes means you accept the updated Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">17. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions or requests about this Policy or our data practices, contact:
            </p>
            <div className="space-y-2">
              <p className="font-semibold">AfroSecured™</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:afrosecured@gmail.com" className="text-primary hover:underline">
                  afrosecured@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground">
                Website:{" "}
                <a href="https://www.afrosecured.com" className="text-primary hover:underline">
                  https://www.afrosecured.com
                </a>
              </p>
            </div>
          </section>
        </Card>
      </div>
    </div>
  )
}
