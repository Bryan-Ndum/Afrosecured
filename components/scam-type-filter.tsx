"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, DollarSign, Phone, Mail, Briefcase, AlertCircle } from "lucide-react"

const scamTypes = [
  { id: "all", label: "All Types", icon: AlertCircle, color: "bg-slate-600" },
  { id: "romance", label: "Romance", icon: Heart, color: "bg-pink-500" },
  { id: "investment", label: "Investment", icon: DollarSign, color: "bg-green-500" },
  { id: "tech_support", label: "Tech Support", icon: Phone, color: "bg-blue-500" },
  { id: "phishing", label: "Phishing", icon: Mail, color: "bg-purple-500" },
  { id: "employment", label: "Employment", icon: Briefcase, color: "bg-cyan-500" },
]

export function ScamTypeFilter() {
  const [selectedType, setSelectedType] = useState("all")

  return (
    <div className="space-y-3">
      {scamTypes.map((type) => {
        const Icon = type.icon
        const isSelected = selectedType === type.id

        return (
          <Button
            key={type.id}
            variant={isSelected ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              isSelected
                ? "bg-slate-800 text-white border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <div className={`w-2 h-2 rounded-full ${type.color}`} />
            <Icon className="w-4 h-4" />
            {type.label}
            {type.id === "romance" && (
              <Badge variant="secondary" className="ml-auto text-xs bg-pink-500/20 text-pink-400">
                247
              </Badge>
            )}
            {type.id === "investment" && (
              <Badge variant="secondary" className="ml-auto text-xs bg-green-500/20 text-green-400">
                189
              </Badge>
            )}
            {type.id === "tech_support" && (
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-500/20 text-blue-400">
                156
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}
