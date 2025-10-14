export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            <strong>Last Updated:</strong> January 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-foreground/90">
              AfroSecured ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our cybersecurity platform and
              services.
            </p>
            <p className="text-foreground/90">
              We serve a global community, with special focus on protecting vulnerable populations including students,
              small businesses, and elderly users from online scams and fraud.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>

            <h3 className="text-xl font-medium text-foreground">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Account information (email, name, password)</li>
              <li>Scam reports and threat submissions</li>
              <li>Payment information for Visa verification services</li>
              <li>Communications with our support team</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Location data (country, city - for threat mapping)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">2.3 Threat Intelligence Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>URLs, email addresses, and phone numbers you submit for scanning</li>
              <li>Suspicious transaction details for fraud detection</li>
              <li>Merchant information for verification purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                <strong>Fraud Prevention:</strong> Analyze threats and protect users from scams
              </li>
              <li>
                <strong>Service Delivery:</strong> Provide scam detection, merchant verification, and security tools
              </li>
              <li>
                <strong>Threat Intelligence:</strong> Build and maintain our global threat database
              </li>
              <li>
                <strong>Communication:</strong> Send security alerts, updates, and educational content
              </li>
              <li>
                <strong>Improvement:</strong> Enhance our platform and develop new features
              </li>
              <li>
                <strong>Compliance:</strong> Meet legal obligations and enforce our terms
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Information Sharing and Disclosure</h2>

            <h3 className="text-xl font-medium text-foreground">4.1 We Share Information With:</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                <strong>Service Providers:</strong> Visa, Supabase, threat intelligence partners
              </li>
              <li>
                <strong>Law Enforcement:</strong> When required by law or to prevent fraud
              </li>
              <li>
                <strong>Community:</strong> Anonymized threat data for public safety
              </li>
            </ul>

            <h3 className="text-xl font-medium text-foreground">4.2 We Do NOT:</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Sell your personal information to third parties</li>
              <li>Share your payment details with anyone except Visa</li>
              <li>Use your data for advertising purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
            <p className="text-foreground/90">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>End-to-end encryption for sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication</li>
              <li>Automated threat monitoring</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Your Rights (GDPR & Global Privacy)</h2>
            <p className="text-foreground/90">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your data
              </li>
              <li>
                <strong>Portability:</strong> Export your data in a standard format
              </li>
              <li>
                <strong>Objection:</strong> Opt-out of certain data processing
              </li>
              <li>
                <strong>Restriction:</strong> Limit how we use your data
              </li>
            </ul>
            <p className="text-foreground/90">To exercise these rights, contact us at privacy@afrosecured.com</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Data Retention</h2>
            <p className="text-foreground/90">
              We retain your information for as long as necessary to provide our services and comply with legal
              obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Account data: Until you delete your account</li>
              <li>Threat reports: 7 years for security research</li>
              <li>Transaction logs: As required by financial regulations</li>
              <li>Anonymized data: Indefinitely for threat intelligence</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. International Data Transfers</h2>
            <p className="text-foreground/90">
              AfroSecured operates globally. Your information may be transferred to and processed in countries other
              than your own. We ensure appropriate safeguards are in place for international transfers, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Encryption and security measures</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Children's Privacy</h2>
            <p className="text-foreground/90">
              Our services are not intended for children under 13. We do not knowingly collect information from
              children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Cookies and Tracking</h2>
            <p className="text-foreground/90">
              We use cookies and similar technologies to improve your experience. You can control cookies through your
              browser settings. Essential cookies are required for the platform to function.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Changes to This Policy</h2>
            <p className="text-foreground/90">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or
              platform notification. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Contact Us</h2>
            <p className="text-foreground/90">For privacy-related questions or concerns:</p>
            <ul className="list-none space-y-2 text-foreground/90">
              <li>
                <strong>Email:</strong> privacy@afrosecured.com
              </li>
              <li>
                <strong>Data Protection Officer:</strong> dpo@afrosecured.com
              </li>
              <li>
                <strong>Address:</strong> [Your Business Address]
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Supervisory Authority</h2>
            <p className="text-foreground/90">
              If you are in the EU/EEA, you have the right to lodge a complaint with your local data protection
              authority.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
