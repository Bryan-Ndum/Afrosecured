"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, MessageCircle, Heart, Share, AlertTriangle, Clock } from "lucide-react"

interface SocialMention {
  id: string
  platform: string
  post_id: string
  author: string | null
  content: string
  url: string | null
  engagement_count: number
  scam_keywords: string[] | null
  created_at: string
}

interface SocialFeedProps {
  mentions: SocialMention[]
}

const platformColors = {
  twitter: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  reddit: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  facebook: "bg-blue-600/20 text-blue-300 border-blue-600/30",
}

const platformIcons = {
  twitter: "𝕏",
  reddit: "r/",
  facebook: "f",
}

export function SocialFeed({ mentions }: SocialFeedProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const filteredMentions = selectedPlatform
    ? mentions.filter((mention) => mention.platform === selectedPlatform)
    : mentions

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const truncateContent = (content: string, maxLength = 280) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const highlightKeywords = (content: string, keywords: string[] | null) => {
    if (!keywords || keywords.length === 0) return content

    let highlightedContent = content
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi")
      highlightedContent = highlightedContent.replace(
        regex,
        '<span class="bg-yellow-500/20 text-yellow-400 px-1 rounded">$1</span>',
      )
    })

    return highlightedContent
  }

  return (
    <div className="space-y-4">
      {filteredMentions.map((mention) => (
        <Card key={mention.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sm font-semibold">
                  {platformIcons[mention.platform as keyof typeof platformIcons] || mention.platform[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={platformColors[mention.platform as keyof typeof platformColors]}
                    >
                      {mention.platform}
                    </Badge>
                    {mention.author && <span className="text-slate-400 text-sm">@{mention.author}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(mention.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className="text-slate-300 mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(truncateContent(mention.content), mention.scam_keywords),
              }}
            />

            {mention.scam_keywords && mention.scam_keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {mention.scam_keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {mention.engagement_count}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Heart className="w-4 h-4" />
                  {Math.floor(mention.engagement_count * 0.7)}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Share className="w-4 h-4" />
                  {Math.floor(mention.engagement_count * 0.3)}
                </div>
              </div>

              {mention.url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-slate-700 hover:border-slate-600 bg-transparent"
                >
                  <a href={mention.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Post
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredMentions.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No social media mentions found for the selected criteria.</p>
        </div>
      )}
    </div>
  )
}
