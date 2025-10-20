import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, preferences } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("digest_subscribers")
      .insert({
        email,
        preferences: preferences || { frequency: "weekly", categories: ["all"] },
        is_active: true,
      })
      .select()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation - email already exists
        return NextResponse.json({ error: "This email is already subscribed to the digest." }, { status: 409 })
      }
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    revalidatePath("/digest")

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
