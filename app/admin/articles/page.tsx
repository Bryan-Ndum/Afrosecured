"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminArticlesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    source: "",
    category: "",
    content: "",
    threat_level: "medium",
    tags: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add article")
      }

      setSuccess(true)
      setFormData({
        title: "",
        link: "",
        description: "",
        source: "",
        category: "",
        content: "",
        threat_level: "medium",
        tags: "",
      })

      // Redirect to intel page after 2 seconds
      setTimeout(() => {
        router.push("/intel")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add article")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/intel">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Intelligence Feed
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Add New Article</h1>
              <p className="text-slate-400">Submit a new scam or breach article to the intelligence feed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-400 font-medium">Article added successfully!</p>
              <p className="text-green-400/70 text-sm">Redirecting to intelligence feed...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Article Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., New phishing scam targets mobile banking users"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-white">
                Article URL *
              </Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                required
                placeholder="https://example.com/article"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Brief summary of the article (2-3 sentences)"
                rows={3}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-white">
                  Source *
                </Label>
                <Input
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  placeholder="e.g., BBC News, Gulf News"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Category *
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Phishing, Romance Scams"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threat_level" className="text-white">
                Threat Level *
              </Label>
              <select
                id="threat_level"
                name="threat_level"
                value={formData.threat_level}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-white">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., phishing, mobile-banking, africa"
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-500">Separate multiple tags with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">
                Full Content (optional)
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full article content or additional details"
                rows={6}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  "Adding Article..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Article
                  </>
                )}
              </Button>
              <Link href="/intel">
                <Button type="button" variant="outline" className="border-slate-700 bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        <div className="mt-6 p-4 bg-slate-900/30 border border-slate-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Tips for Adding Articles</h3>
          <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
            <li>Always link to the original source article</li>
            <li>Write clear, concise descriptions</li>
            <li>Choose appropriate threat levels based on impact</li>
            <li>Use relevant tags to help users find related articles</li>
            <li>Verify information before posting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
