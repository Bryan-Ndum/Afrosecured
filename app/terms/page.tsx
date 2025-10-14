export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            <strong>Last Updated:</strong> January 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-foreground/90">
              By accessing or using AfroSecured ("the Platform"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, do not use the Platform.
            </p>
            <p className="text-foreground/90">
              AfroSecured is a global cybersecurity platform designed to protect individuals and businesses from online
              scams, fraud, and cyber threats.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Services</h2>
            <p className="text-foreground/90">AfroSecured provides:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Scam detection and analysis tools</li>
              <li>Merchant verification services via Visa integration</li>
              <li>Threat intelligence and real-time alerts</li>
              <li>Community reporting and education</li>
              <li>Virtual card generation for secure payments</li>
              <li>Payment routing optimization</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>

            <h3 className="text-xl font-medium text-foreground">3.1 Account Creation</h3>
            <p className="text-foreground/90">
              You must provide accurate, complete information when creating an account. You are responsible for
              maintaining the confidentiality of your account credentials.
            </p>

            <h3 className="text-xl font-medium text-foreground">3.2 Account Security</h3>
            <p className="text-foreground/90">
              You must notify us immediately of any unauthorized access to your account. We are not liable for losses
              resulting from unauthorized use of your account.
            </p>

            <h3 className="text-xl font-medium text-foreground">3.3 Account Termination</h3>
            <p className="text-foreground/90">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent
              activity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Acceptable Use</h2>

            <h3 className="text-xl font-medium text-foreground">4.1 You May:</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Use the Platform for personal or business security purposes</li>
              <li>Submit scam reports and threat intelligence</li>
              <li>Verify merchants before making payments</li>
              <li>Share security alerts with others</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">4.2 You May NOT:</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Use the Platform for illegal activities</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to hack, disrupt, or compromise the Platform</li>
              <li>Scrape or harvest data without permission</li>
              <li>Impersonate others or create fake accounts</li>
              <li>Use the Platform to harass or threaten others</li>
              <li>Reverse engineer or copy our technology</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Visa Integration Services</h2>

            <h3 className="text-xl font-medium text-foreground">5.1 Merchant Verification</h3>
            <p className="text-foreground/90">
              Our merchant verification service provides risk scores based on available data. We do not guarantee the
              legitimacy of any merchant and are not responsible for transactions you choose to make.
            </p>

            <h3 className="text-xl font-medium text-foreground">5.2 Virtual Cards</h3>
            <p className="text-foreground/90">
              Virtual card generation is subject to Visa's terms and conditions. You are responsible for all charges
              made using virtual cards generated through our Platform.
            </p>

            <h3 className="text-xl font-medium text-foreground">5.3 Payment Routing</h3>
            <p className="text-foreground/90">
              Payment routing suggestions are estimates. Actual fees and exchange rates may vary. We are not responsible
              for losses due to currency fluctuations or routing decisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. User Content</h2>

            <h3 className="text-xl font-medium text-foreground">6.1 Your Content</h3>
            <p className="text-foreground/90">
              You retain ownership of content you submit (scam reports, comments, etc.). By submitting content, you
              grant us a worldwide, non-exclusive license to use, display, and distribute it for security purposes.
            </p>

            <h3 className="text-xl font-medium text-foreground">6.2 Content Standards</h3>
            <p className="text-foreground/90">
              All content must be accurate, respectful, and comply with applicable laws. We reserve the right to remove
              content that violates these standards.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Intellectual Property</h2>
            <p className="text-foreground/90">
              All Platform content, features, and functionality are owned by AfroSecured and protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-foreground/90">
              You may not copy, modify, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Disclaimers and Limitations</h2>

            <h3 className="text-xl font-medium text-foreground">8.1 No Warranty</h3>
            <p className="text-foreground/90">
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE PLATFORM
              WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
            </p>

            <h3 className="text-xl font-medium text-foreground">8.2 Limitation of Liability</h3>
            <p className="text-foreground/90">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AFROSECURED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>

            <h3 className="text-xl font-medium text-foreground">8.3 Security Limitations</h3>
            <p className="text-foreground/90">
              While we strive to provide accurate threat intelligence, we cannot guarantee detection of all scams or
              prevention of all fraud. Users must exercise their own judgment and caution.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Indemnification</h2>
            <p className="text-foreground/90">
              You agree to indemnify and hold AfroSecured harmless from any claims, damages, or expenses arising from
              your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Third-Party Services</h2>
            <p className="text-foreground/90">
              The Platform integrates with third-party services (Visa, threat intelligence providers, etc.). Your use of
              these services is subject to their respective terms and conditions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Pricing and Payment</h2>
            <p className="text-foreground/90">
              Currently, AfroSecured is free to use during our MVP phase. We reserve the right to introduce paid
              features in the future with advance notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Modifications to Terms</h2>
            <p className="text-foreground/90">
              We may modify these Terms at any time. Significant changes will be communicated via email or platform
              notification. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Governing Law</h2>
            <p className="text-foreground/90">
              These Terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be resolved in the courts
              of [Your Jurisdiction].
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">14. Dispute Resolution</h2>
            <p className="text-foreground/90">
              We encourage users to contact us first to resolve disputes informally. If informal resolution fails,
              disputes may be resolved through binding arbitration.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">15. Severability</h2>
            <p className="text-foreground/90">
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in
              full effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">16. Contact Information</h2>
            <p className="text-foreground/90">For questions about these Terms:</p>
            <ul className="list-none space-y-2 text-foreground/90">
              <li>
                <strong>Email:</strong> legal@afrosecured.com
              </li>
              <li>
                <strong>Support:</strong> support@afrosecured.com
              </li>
              <li>
                <strong>Address:</strong> [Your Business Address]
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">17. Entire Agreement</h2>
            <p className="text-foreground/90">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and AfroSecured
              regarding use of the Platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
