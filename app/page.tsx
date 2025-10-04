import { HeroSection } from "@/components/hero-section"
import { ScamOfTheDay } from "@/components/scam-of-the-day"
import { WeeklyScams } from "@/components/weekly-scams"
import { MonthlyThreats } from "@/components/monthly-threats"
import { IntelligenceDashboard } from "@/components/intelligence-dashboard"
import { TrustedSources } from "@/components/trusted-sources"
import { LiveScamMap } from "@/components/live-scam-map"
import { FeaturesSection } from "@/components/features-section"
import { LiveFeeds } from "@/components/live-feeds"
import { QuickGuides } from "@/components/quick-guides"
import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { AboutSection } from "@/components/about-section"
import { WaitlistSection } from "@/components/waitlist-section"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background cyber-grid">
      <Header />
      <HeroSection />
      <ScamOfTheDay />
      <WeeklyScams />
      <MonthlyThreats />
      <IntelligenceDashboard />
      <TrustedSources />
      <LiveScamMap />
      <FeaturesSection />
      <LiveFeeds />
      <QuickGuides />
      <NewsletterSubscription />
      <AboutSection />
      <WaitlistSection />
    </main>
  )
}
