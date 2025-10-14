"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Lightbulb, Calendar, Tag } from "lucide-react"

interface DailyTip {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  published_at: string
}

export function AIDailyTips() {
  const [tips, setTips] = useState<DailyTip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    try {
      const response = await fetch("/api/ai-content?type=daily_tip&limit=3")
      const data = await response.json()
      setTips(data.content || [])
    } catch (error) {
      console.error("Failed to fetch daily tips:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Daily Security Tips</h2>
      </div>

      <div className="space-y-4">
        {tips.map((tip) => (
          <Card key={tip.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(tip.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {tip.category}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tip.content}</p>

                {tip.tags && tip.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tip.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
