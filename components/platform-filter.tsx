"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const platforms = [
  { id: "all", label: "All Platforms", color: "bg-slate-600" },
  { id: "twitter", label: "Twitter/X", color: "bg-blue-500" },
  { id: "reddit", label: "Reddit", color: "bg-orange-500" },
  { id: "facebook", label: "Facebook", color: "bg-blue-600" },
]

export function PlatformFilter() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  return (
    <div className="space-y-3">
      {platforms.map((platform) => {
        const isSelected = selectedPlatform === platform.id

        return (
          <Button
            key={platform.id}
            variant={isSelected ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              isSelected
                ? "bg-slate-800 text-white border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <div className={`w-2 h-2 rounded-full ${platform.color}`} />
            {platform.label}
            {platform.id === "twitter" && (
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-500/20 text-blue-400">
                45
              </Badge>
            )}
            {platform.id === "reddit" && (
              <Badge variant="secondary" className="ml-auto text-xs bg-orange-500/20 text-orange-400">
                32
              </Badge>
            )}
            {platform.id === "facebook" && (
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-600/20 text-blue-300">
                18
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}
