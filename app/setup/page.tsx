export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Quick Setup Guide</h1>
          <p className="text-xl text-muted-foreground">Get AfroSecured running in 5 minutes</p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Run Database Scripts</h2>
                <p className="text-muted-foreground mb-4">Execute these scripts in order to set up your database:</p>
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg font-mono text-sm">
                  <div>✓ scripts/012_seed_geographic_threat_data.sql</div>
                  <div>✓ scripts/013_create_error_logging.sql</div>
                  <div>✓ scripts/014_create_behavioral_biometrics.sql</div>
                  <div>✓ scripts/015_create_risk_assessments_table.sql</div>
                  <div>✓ scripts/016_create_payguard_tables.sql</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Add API Keys (Optional)</h2>
                <p className="text-muted-foreground mb-4">
                  Add these to your Vercel environment variables for full functionality:
                </p>
                <div className="grid gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">AlienVault OTX</h3>
                    <p className="text-sm text-muted-foreground mb-2">Threat intelligence feed</p>
                    <a
                      href="https://otx.alienvault.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Get API Key →
                    </a>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">VirusTotal</h3>
                    <p className="text-sm text-muted-foreground mb-2">URL and file scanning</p>
                    <a
                      href="https://www.virustotal.com/gui/join-us"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Get API Key →
                    </a>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">AbuseIPDB</h3>
                    <p className="text-sm text-muted-foreground mb-2">IP reputation checking</p>
                    <a
                      href="https://www.abuseipdb.com/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Get API Key →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Test Core Features</h2>
                <div className="grid gap-3">
                  <a
                    href="/intel"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">Threat Heatmap</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                  <a
                    href="/visa-verify"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">Visa Verification</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                  <a
                    href="/payguard"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">PayGuard Dashboard</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                  <a
                    href="/extension"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">Chrome Extension</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono">bryanndum12@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span className="font-mono">Admin@2024Secure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <a href="/admin" className="font-mono text-primary hover:underline">
                  /admin
                </a>
              </div>
            </div>
          </div>

          {/* What Works Now */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">What Works Right Now</h2>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Threat Intelligence Heatmap (35+ threats)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Merchant Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Risk Scoring Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Behavioral Biometrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>PayGuard with FraudFreeze</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Admin Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Community Reporting</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Start Using AfroSecured
          </a>
        </div>
      </div>
    </div>
  )
}
