import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sources } = await request.json()

    if (!sources || !Array.isArray(sources)) {
      return NextResponse.json({ error: "Sources array is required" }, { status: 400 })
    }

    const articles = await Promise.all(
      sources.map(async (source) => {
        try {
          // Use RSS2JSON API for RSS feeds
          if (source.type === "rss") {
            const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&api_key=YOUR_API_KEY&count=10`
            const response = await fetch(rssUrl)
            const data = await response.json()

            if (data.status === "ok") {
              return data.items.map((item: any) => ({
                title: item.title,
                description: item.description?.replace(/<[^>]*>/g, "").slice(0, 200),
                url: item.link,
                publishedAt: item.pubDate,
                source: source.name,
                category: source.category,
              }))
            }
          }

          // For direct article URLs, fetch and extract content
          if (source.type === "article") {
            const response = await fetch(source.url)
            const html = await response.text()

            // Basic HTML parsing to extract title and content
            const titleMatch = html.match(/<title>(.*?)<\/title>/i)
            const title = titleMatch ? titleMatch[1] : source.name

            return [
              {
                title,
                description: `Read the full article about ${source.category} scams`,
                url: source.url,
                publishedAt: new Date().toISOString(),
                source: source.name,
                category: source.category,
              },
            ]
          }

          return []
        } catch (error) {
          console.error(`[v0] Failed to fetch from ${source.name}:`, error)
          return []
        }
      }),
    )

    const flattenedArticles = articles.flat().filter(Boolean)

    return NextResponse.json({
      success: true,
      articles: flattenedArticles,
      count: flattenedArticles.length,
    })
  } catch (error) {
    console.error("[v0] Article fetching error:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
