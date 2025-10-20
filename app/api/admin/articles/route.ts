import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, link, description, source, category, content, threat_level, tags } = body

    // Validate required fields
    if (!title || !link || !description || !source || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert article into database
    const { data, error } = await supabase
      .from("cybersecurity_articles")
      .insert({
        title,
        link,
        pub_date: new Date().toISOString(),
        description,
        source,
        category,
        content: content || null,
        threat_level: threat_level || "medium",
        tags: tags || [],
        ai_processed: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error inserting article:", error)
      return NextResponse.json({ error: error.message || "Failed to add article" }, { status: 500 })
    }

    // Revalidate the intel page to show new article
    revalidatePath("/intel")

    return NextResponse.json({ success: true, article: data }, { status: 201 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
