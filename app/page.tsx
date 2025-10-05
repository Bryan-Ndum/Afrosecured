import { HeroSection } from "@/components/hero-section"
import { TodayThreat } from "@/components/today-threat"
import { SecurityIntegrations } from "@/components/security-integrations"
import { HowItWorks } from "@/components/how-it-works"
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
      <SecurityIntegrations />
      <HowItWorks />
      <WeeklyScams />
      <LiveFeeds />
      <QuickGuides />
      <AboutSection />
      <WaitlistSection />
    </main>
  )
}
