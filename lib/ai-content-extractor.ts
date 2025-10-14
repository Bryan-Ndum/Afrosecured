import { generateObject } from "ai"
import { z } from "zod"

// Schema for AI-extracted threat intelligence
const ThreatIntelligenceSchema = z.object({
  summary: z.string().describe("Concise 2-3 sentence summary of the article"),
  threatLevel: z.enum(["critical", "high", "medium", "low", "info"]).describe("Severity level of the threat"),
  threatIndicators: z.array(z.string()).describe("Key threat indicators, attack vectors, or vulnerabilities mentioned"),
  affectedPlatforms: z
    .array(z.string())
    .describe("Operating systems, software, or platforms affected (e.g., Windows, Linux, Chrome, WordPress)"),
  cveIds: z.array(z.string()).describe("CVE identifiers mentioned in the article"),
  iocs: z
    .object({
      ips: z.array(z.string()).optional().describe("Malicious IP addresses"),
      domains: z.array(z.string()).optional().describe("Malicious domains"),
      hashes: z.array(z.string()).optional().describe("File hashes (MD5, SHA256)"),
      urls: z.array(z.string()).optional().describe("Malicious URLs"),
    })
    .describe("Indicators of Compromise"),
  recommendations: z
    .array(z.string())
    .describe("Security recommendations or mitigation steps mentioned in the article"),
  tags: z
    .array(z.string())
    .describe(
      "Relevant tags for categorization (e.g., ransomware, phishing, data-breach, malware, vulnerability, zero-day)",
    ),
  relevanceToAfrica: z
    .number()
    .min(0)
    .max(10)
    .describe("Relevance score to African users/businesses (0-10, 10 being highly relevant)"),
})

export type ThreatIntelligence = z.infer<typeof ThreatIntelligenceSchema>

/**
 * Extract threat intelligence from article content using AI
 */
export async function extractThreatIntelligence(
  title: string,
  content: string,
  source: string,
): Promise<ThreatIntelligence> {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: ThreatIntelligenceSchema,
      prompt: `You are a cybersecurity analyst extracting threat intelligence from news articles.

Article Source: ${source}
Article Title: ${title}

Article Content:
${content.substring(0, 4000)} 

Extract the following information:
1. A concise summary (2-3 sentences)
2. Threat severity level
3. Key threat indicators and attack vectors
4. Affected platforms/systems
5. Any CVE identifiers mentioned
6. Indicators of Compromise (IPs, domains, hashes, URLs)
7. Security recommendations
8. Relevant tags for categorization
9. Relevance to African users/businesses (consider if the threat affects African infrastructure, businesses, or users)

Be precise and extract only information explicitly mentioned in the article. If information is not available, return empty arrays.`,
      temperature: 0.3, // Lower temperature for more consistent extraction
    })

    return object
  } catch (error) {
    console.error("[v0] AI extraction error:", error)
    // Return minimal intelligence on error
    return {
      summary: content.substring(0, 200) + "...",
      threatLevel: "info",
      threatIndicators: [],
      affectedPlatforms: [],
      cveIds: [],
      iocs: {},
      recommendations: [],
      tags: [],
      relevanceToAfrica: 5,
    }
  }
}

/**
 * Fetch full article content from URL (respecting robots.txt and rate limits)
 */
export async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    // Add delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await fetch(url, {
      headers: {
        "User-Agent": "AfroSecured-Bot/1.0 (Security Research; +https://afrosecured.com)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error(`[v0] Failed to fetch ${url}: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Basic content extraction (remove HTML tags)
    // In production, use a proper HTML parser like cheerio or jsdom
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    return textContent.substring(0, 8000) // Limit content size
  } catch (error) {
    console.error(`[v0] Error fetching article content from ${url}:`, error)
    return null
  }
}
