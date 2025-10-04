"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const scamTypes = [
  { value: "romance", label: "Romance Scam" },
  { value: "investment", label: "Investment Fraud" },
  { value: "tech_support", label: "Tech Support Scam" },
  { value: "phishing", label: "Phishing/Email Scam" },
  { value: "employment", label: "Employment Scam" },
  { value: "other", label: "Other" },
]

export function ReportForm() {
  const [formData, setFormData] = useState({
    reporterEmail: "",
    scamType: "",
    title: "",
    description: "",
    location: "",
    evidenceUrls: [] as string[],
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
      const supabase = createClient()

      const { error } = await supabase.from("user_reports").insert({
        reporter_email: formData.reporterEmail || null,
        scam_type: formData.scamType,
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        evidence_urls: formData.evidenceUrls.length > 0 ? formData.evidenceUrls : null,
        status: "pending",
      })

      if (error) throw error

      setSubmitStatus("success")
      setFormData({
        reporterEmail: "",
        scamType: "",
        title: "",
        description: "",
        location: "",
        evidenceUrls: [],
      })
    } catch (error) {
      console.error("Error submitting report:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit report")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addEvidenceUrl = () => {
    setFormData((prev) => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, ""],
    }))
  }

  const updateEvidenceUrl = (index: number, url: string) => {
    setFormData((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.map((item, i) => (i === index ? url : item)),
    }))
  }

  const removeEvidenceUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index),
    }))
  }

  if (submitStatus === "success") {
    return (
      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-400 mb-2">Report Submitted Successfully</h3>
          <p className="text-slate-300 mb-4">
            Thank you for helping protect the community. Your report has been submitted for review and will be
            investigated by our team.
          </p>
          <Button
            onClick={() => setSubmitStatus("idle")}
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            Submit Another Report
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Contact Information (Optional)</h3>
        <div>
          <Label htmlFor="email" className="text-slate-300">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.reporterEmail}
            onChange={(e) => setFormData((prev) => ({ ...prev, reporterEmail: e.target.value }))}
            placeholder="your.email@example.com"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Optional. We may contact you for additional information about your report.
          </p>
        </div>
      </div>

      {/* Scam Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Scam Details</h3>

        <div>
          <Label htmlFor="scamType" className="text-slate-300">
            Scam Type *
          </Label>
          <Select
            value={formData.scamType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, scamType: value }))}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select scam type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {scamTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title" className="text-slate-300">
            Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Brief description of the scam"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-slate-300">
            Detailed Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Provide as much detail as possible about the scam, including how it happened, what was promised, and any red flags you noticed..."
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-32"
            required
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-slate-300">
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="Country or region where the scam occurred"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Evidence */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Evidence (Optional)</h3>
        <p className="text-sm text-slate-400">
          Add URLs to screenshots, documents, or other evidence. Do not include personal information.
        </p>

        {formData.evidenceUrls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => updateEvidenceUrl(index, e.target.value)}
              placeholder="https://example.com/screenshot.png"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeEvidenceUrl(index)}
              className="border-slate-700 hover:border-red-500 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEvidenceUrl}
          className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-transparent"
        >
          <Upload className="w-4 h-4 mr-2" />
          Add Evidence URL
        </Button>
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
        disabled={isSubmitting || !formData.scamType || !formData.title || !formData.description}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      >
        {isSubmitting ? "Submitting Report..." : "Submit Report"}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        By submitting this report, you agree that the information provided is accurate to the best of your knowledge.
      </p>
    </form>
  )
}
