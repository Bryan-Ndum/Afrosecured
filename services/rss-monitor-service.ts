import { createClient } from "@/lib/supabase/server"
import Parser from "rss-parser"

interface RSSFeed {
  name: string
  url: string
  category: string
}

export class RSSMonitorService {
  private feeds: RSSFeed[] = [
    // Major Security News
    { name: "KrebsOnSecurity", url: "https://krebsonsecurity.com/feed/", category: "security-news" },
    { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/", category: "security-news" },
    { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", category: "security-news" },
    { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml", category: "security-news" },
    { name: "Threatpost", url: "https://threatpost.com/feed/", category: "security-news" },

    // Government & CERT
    { name: "CISA Alerts", url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", category: "government" },
    { name: "US-CERT", url: "https://www.us-cert.gov/ncas/current-activity.xml", category: "government" },

    // Vendor Blogs
    { name: "Malwarebytes Labs", url: "https://blog.malwarebytes.com/feed/", category: "vendor" },
    { name: "Kaspersky", url: "https://www.kaspersky.com/blog/feed/", category: "vendor" },
    { name: "Cisco Talos", url: "https://blog.talosintelligence.com/rss/", category: "vendor" },

    // African Tech News
    { name: "ITWeb Security", url: "https://www.itweb.co.za/rss/security.xml", category: "africa" },
    { name: "TechCabal", url: "https://techcabal.com/feed/", category: "africa" },
  ]

  async monitorFeeds(): Promise<void> {
    console.log("[v0] Starting RSS feed monitoring...")
    const parser = new Parser()
    const supabase = await createClient()

    for (const feed of this.feeds) {
      try {
        console.log(`[v0] Fetching ${feed.name}...`)
        const rss = await parser.parseURL(feed.url)

        for (const item of rss.items.slice(0, 5)) {
          // Check if article already exists
          const { data: existing } = await supabase
            .from("cybersecurity_articles")
            .select("id")
            .eq("source_url", item.link)
            .single()

          if (existing) continue

          // Determine threat level from content
          const content = item.contentSnippet || item.content || ""
          let threatLevel = "low"
          if (content.match(/critical|severe|emergency/i)) threatLevel = "critical"
          else if (content.match(/high|dangerous|urgent/i)) threatLevel = "high"
          else if (content.match(/medium|moderate/i)) threatLevel = "medium"

          await supabase.from("cybersecurity_articles").insert({
            title: item.title,
            content: content.substring(0, 5000),
            source: feed.name,
            source_url: item.link,
            published_at: item.pubDate || new Date().toISOString(),
            threat_level: threatLevel,
            category: feed.category,
            tags: item.categories || [],
          })
        }

        console.log(`[v0] Processed ${feed.name}`)
      } catch (error) {
        console.error(`[v0] Error fetching ${feed.name}:`, error)
      }
    }

    console.log("[v0] RSS monitoring complete")
  }
}
