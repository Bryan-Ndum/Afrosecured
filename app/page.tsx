import { HeroSection } from "@/components/hero-section"
import { TodayThreat } from "@/components/today-threat"
import { RecentScamAlerts } from "@/components/recent-scam-alerts"
import { TrustFramework } from "@/components/trust-framework"
import { SecurityIntegrations } from "@/components/security-integrations"
import { HowItWorks } from "@/components/how-it-works"
import { TrustedSources } from "@/components/trusted-sources"
import { WeeklyScams } from "@/components/weekly-scams"
import { LiveFeeds } from "@/components/live-feeds"
import { QuickGuides } from "@/components/quick-guides"
import { AboutSection } from "@/components/about-section"
import { WaitlistSection } from "@/components/waitlist-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <TodayThreat />
      <RecentScamAlerts />
      <TrustFramework />
      <SecurityIntegrations />
      <HowItWorks />
      <TrustedSources />
      <WeeklyScams />
      <LiveFeeds />
      <QuickGuides />
      <AboutSection />
      <WaitlistSection />
    </main>
  )
}
