"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react"

const categories = [
  { value: "general", label: "General Inquiry" },
  { value: "report", label: "Report a Scam / Threat" },
  { value: "partnership", label: "Partnership / Collaboration" },
  { value: "media", label: "Media & Press" },
  { value: "technical", label: "Technical Support" },
]

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", category: "general", subject: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === "success") {
    return (
      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-400 mb-2">Message Sent Successfully</h3>
          <p className="text-slate-300 mb-4">
            Thank you for reaching out. Our team has received your message and will get back to you as soon as
            possible.
          </p>
          <Button
            onClick={() => setSubmitStatus("idle")}
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-slate-300">
            Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-slate-300">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="you@example.com"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category" className="text-slate-300">
          Category *
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-700">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject" className="text-slate-300">
          Subject *
        </Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder="What is this about?"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-slate-300">
          Message *
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          placeholder="Tell us how we can help..."
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-40"
          required
        />
      </div>

      {submitStatus === "error" && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
