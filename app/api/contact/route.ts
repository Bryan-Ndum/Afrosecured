import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const CATEGORIES = ["general", "report", "partnership", "media", "technical"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const subject = typeof body.subject === "string" ? body.subject.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const category = CATEGORIES.includes(body.category) ? body.category : "general"

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    // Length guards to prevent abuse
    if (name.length > 120 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "One or more fields exceed the maximum length." }, { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Contact service is not configured." }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({ name, email, subject, category, message, status: "new" })
      .select("id")
      .single()

    if (error) {
      console.error("Contact insert error:", error.message)
      return NextResponse.json({ error: "Failed to send your message. Please try again." }, { status: 500 })
    }

    // Enqueue an admin notification using the existing notification queue.
    // Non-blocking: a failure here should not fail the user's submission.
    try {
      await supabase.from("notification_queue").insert({
        channel: "email",
        recipient_type: "admin",
        recipient_id: "afrosecured@gmail.com",
        template: "contact_message",
        status: "pending",
        data: { contact_message_id: data.id, name, email, subject, category },
      })
    } catch (notifyError) {
      console.error("Contact notification enqueue failed:", notifyError)
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
