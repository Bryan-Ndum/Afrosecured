"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation" // Added useRouter to refresh page data after subscription
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const categories = [
  { id: "romance", label: "Romance Scams", description: "Dating and relationship fraud" },
  { id: "investment", label: "Investment Fraud", description: "Crypto and financial scams" },
  { id: "tech_support", label: "Tech Support", description: "Fake technical assistance" },
  { id: "phishing", label: "Phishing", description: "Email and identity theft" },
  { id: "employment", label: "Employment", description: "Job and work-from-home scams" },
]

export function DigestSignup() {
  const router = useRouter() // Added router to refresh page after subscription
  const [email, setEmail] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [frequency, setFrequency] = useState("weekly")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const supabase = createClient()

      const { error } = await supabase.from("digest_subscribers").insert({
        email,
        preferences: {
          frequency,
          categories: selectedCategories,
        },
        is_active: true,
      })

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - email already exists
          throw new Error("This email is already subscribed to the digest.")
        }
        throw error
      }

      setSubmitStatus("success")
      setEmail("")
      setSelectedCategories(["all"])

      router.refresh()
    } catch (error) {
      console.error("Error subscribing:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to subscribe")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (categoryId === "all") {
      setSelectedCategories(checked ? ["all"] : [])
    } else {
      setSelectedCategories((prev) => {
        const newCategories = checked
          ? [...prev.filter((c) => c !== "all"), categoryId]
          : prev.filter((c) => c !== categoryId)
        return newCategories.length === 0 ? ["all"] : newCategories
      })
    }
  }

  if (submitStatus === "success") {
    return (
      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-400 mb-2">Successfully Subscribed!</h3>
          <p className="text-slate-300 mb-4">
            Welcome to the AfroSecure community! You'll receive your first digest this Sunday.
          </p>
          <Button
            onClick={() => setSubmitStatus("idle")}
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            Subscribe Another Email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <Label htmlFor="email" className="text-slate-300">
          Email Address *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pl-10"
            required
          />
        </div>
      </div>

      {/* Category Preferences */}
      <div>
        <Label className="text-slate-300 mb-3 block">Content Preferences</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={selectedCategories.includes("all")}
              onCheckedChange={(checked) => handleCategoryChange("all", checked as boolean)}
              className="border-slate-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
            />
            <Label htmlFor="all" className="text-slate-300 font-medium">
              All Categories
            </Label>
          </div>

          {categories.map((category) => (
            <div key={category.id} className="flex items-start space-x-2 ml-6">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                disabled={selectedCategories.includes("all")}
                className="border-slate-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 mt-1"
              />
              <div>
                <Label htmlFor={category.id} className="text-slate-300 text-sm">
                  {category.label}
                </Label>
                <p className="text-xs text-slate-500">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === "error" && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe to Weekly Digest"}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        By subscribing, you agree to receive weekly emails from AfroSecure. You can unsubscribe at any time.
      </p>
    </form>
  )
}
