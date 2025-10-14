import { generateObject } from "ai"
import { z } from "zod"

export class AIContentGenerator {
  async generateDailySecurityTip(): Promise<{
    title: string
    content: string
    category: string
    tags: string[]
  }> {
    const result = await generateObject({
      model: "openai/gpt-4.1",
      schema: z.object({
        title: z.string().describe("Catchy title for the security tip"),
        content: z.string().describe("Detailed security tip (2-3 paragraphs)"),
        category: z.string().describe("Category: password, phishing, social_engineering, mobile, etc"),
        tags: z.array(z.string()).describe("Relevant tags"),
      }),
      prompt: `Generate a practical, actionable cybersecurity tip specifically relevant to people in Africa. 
      Focus on common scams, mobile security, financial fraud, or social engineering tactics prevalent in African countries.
      Make it educational, easy to understand, and immediately applicable.
      Include real-world examples and clear action steps.`,
    })

    return result.object
  }

  async generateWeeklySummary(articles: any[]): Promise<{
    title: string
    content: string
    keyThreats: string[]
    recommendations: string[]
  }> {
    const articlesText = articles
      .slice(0, 20)
      .map((a) => `${a.title}: ${a.summary || a.description}`)
      .join("\n\n")

    const result = await generateObject({
      model: "openai/gpt-4.1",
      schema: z.object({
        title: z.string(),
        content: z.string().describe("Comprehensive weekly summary (4-5 paragraphs)"),
        keyThreats: z.array(z.string()).describe("Top 5 threats this week"),
        recommendations: z.array(z.string()).describe("Top 5 security recommendations"),
      }),
      prompt: `Analyze these cybersecurity articles from the past week and create a comprehensive summary:

${articlesText}

Focus on:
1. Emerging threats relevant to Africa
2. Trends in scam tactics
3. New vulnerabilities
4. Actionable security advice

Write in clear, accessible language for non-technical users.`,
    })

    return result.object
  }

  async analyzeTrendPatterns(reports: any[]): Promise<{
    title: string
    content: string
    pattern: string
    severity: string
    affectedRegions: string[]
    recommendations: string[]
  }> {
    const reportsText = reports
      .slice(0, 50)
      .map((r) => `${r.scam_type}: ${r.description}`)
      .join("\n")

    const result = await generateObject({
      model: "openai/gpt-4.1",
      schema: z.object({
        title: z.string(),
        content: z.string().describe("Detailed trend analysis"),
        pattern: z.string().describe("Identified scam pattern"),
        severity: z.enum(["low", "medium", "high", "critical"]),
        affectedRegions: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      prompt: `Analyze these recent scam reports and identify emerging patterns:

${reportsText}

Identify:
1. Common tactics being used
2. Target demographics
3. Geographic patterns
4. Evolution of scam techniques
5. Preventive measures

Focus on actionable intelligence for African communities.`,
    })

    return result.object
  }

  async moderateSubmission(submission: {
    content: string
    type: string
  }): Promise<{
    isLegitimate: boolean
    confidence: number
    scamType: string
    severity: string
    reasoning: string
    shouldPublish: boolean
  }> {
    const result = await generateObject({
      model: "openai/gpt-4.1",
      schema: z.object({
        isLegitimate: z.boolean().describe("Is this a legitimate scam report?"),
        confidence: z.number().min(0).max(100),
        scamType: z.string(),
        severity: z.enum(["low", "medium", "high", "critical"]),
        reasoning: z.string(),
        shouldPublish: z.boolean(),
      }),
      prompt: `Analyze this user-submitted scam report and determine if it's legitimate:

Type: ${submission.type}
Content: ${submission.content}

Evaluate:
1. Is this a real scam report or spam/abuse?
2. What type of scam is it?
3. How severe is the threat?
4. Should it be published to the community?

Be strict but fair. Reject obvious spam, promotional content, or false reports.`,
    })

    return result.object
  }
}
