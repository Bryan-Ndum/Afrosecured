export default function SecurityToolsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Security Tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced cybersecurity tools powered by AI and real-time threat intelligence
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* AI Scam Analyzer */}
          <a
            href="/tools/ai-analyzer"
            className="group p-6 rounded-lg border-2 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI Scam Analyzer</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Paste suspicious messages, emails, or texts and get instant AI-powered analysis with threat scoring
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Launch Tool
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* URL Scanner */}
          <a
            href="/tools/url-scanner"
            className="group p-6 rounded-lg border-2 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">URL Threat Scanner</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Scan suspicious links in real-time with comprehensive threat intelligence and safety ratings
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Launch Tool
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Phone Lookup */}
          <a
            href="/tools/phone-lookup"
            className="group p-6 rounded-lg border-2 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Phone Number Lookup</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Check if a phone number is associated with known scams, spam, or fraudulent activity
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Launch Tool
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Email Header Analyzer */}
          <a
            href="/tools/email-analyzer"
            className="group p-6 rounded-lg border-2 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Email Header Analyzer</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Analyze email headers to detect spoofing, phishing attempts, and verify sender authenticity
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Launch Tool
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Threat Intelligence Dashboard */}
          <a
            href="/tools/threat-dashboard"
            className="group p-6 rounded-lg border-2 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Live Threat Dashboard</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Real-time visualization of global scam activity with interactive maps and threat analytics
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Launch Tool
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Scam Pattern Matcher */}
          <a
            href="/tools/pattern-matcher"
            className="group p-6 rounded-lg border-2 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Scam Pattern Matcher</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              ML-powered pattern recognition to identify emerging scam tactics and match against known patterns
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Launch Tool
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* API Access Section */}
        <div className="max-w-4xl mx-auto p-8 rounded-lg border-2 border-primary/30 bg-card/50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">Developer API Access</h3>
              <p className="text-muted-foreground mb-4">
                Integrate Afrosecured's threat intelligence into your applications with our comprehensive API. Get
                real-time scam detection, URL scanning, and threat analysis programmatically.
              </p>
              <a
                href="/api-docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                View API Documentation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
