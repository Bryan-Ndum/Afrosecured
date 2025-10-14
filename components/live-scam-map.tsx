"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertCircle, Phone, CreditCard, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLiveTime } from "@/hooks/use-live-timestamp"

interface ScamReport {
  id: string
  scam_type: string
  title: string
  location: string | null
  created_at: string
  status: string
}

interface ScamHotspot {
  id: number
  city: string
  country: string
  type: string
  count: number
  lat: number
  lng: number
}

// Static fallback data for demonstration
const fallbackHotspots: ScamHotspot[] = [
  { id: 1, city: "Lagos", country: "Nigeria", type: "Mobile Money Fraud", count: 47, lat: 6.5244, lng: 3.3792 },
  { id: 2, city: "London", country: "UK", type: "Phishing", count: 23, lat: 51.5074, lng: -0.1278 },
  { id: 3, city: "Toronto", country: "Canada", type: "Fake Jobs", count: 18, lat: 43.6532, lng: -79.3832 },
  { id: 4, city: "New York", country: "USA", type: "Investment Scams", count: 31, lat: 40.7128, lng: -74.006 },
  { id: 5, city: "Accra", country: "Ghana", type: "Romance Scams", count: 15, lat: 5.6037, lng: -0.187 },
  {
    id: 6,
    city: "Johannesburg",
    country: "South Africa",
    type: "Mobile Money Fraud",
    count: 29,
    lat: -26.2041,
    lng: 28.0473,
  },
]

const scamTypeIcons = {
  "Mobile Money Fraud": Phone,
  Phishing: AlertCircle,
  "Fake Jobs": CreditCard,
  "Investment Scams": CreditCard,
  "Romance Scams": AlertCircle,
}

export function LiveScamMap() {
  const [selectedHotspot, setSelectedHotspot] = useState<ScamHotspot | null>(null)
  const [recentReports, setRecentReports] = useState<ScamReport[]>([])
  const [hotspots, setHotspots] = useState<ScamHotspot[]>(fallbackHotspots)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const currentTime = useLiveTime(1000)

  const fetchRecentReports = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/reports?status=verified&limit=20")
      if (response.ok) {
        const { data } = await response.json()
        setRecentReports(data || [])

        // Process reports to create dynamic hotspots
        const locationCounts = new Map<string, { count: number; type: string; lat?: number; lng?: number }>()

        data?.forEach((report: ScamReport) => {
          if (report.location) {
            const existing = locationCounts.get(report.location) || { count: 0, type: report.scam_type }
            locationCounts.set(report.location, {
              count: existing.count + 1,
              type: report.scam_type,
              lat: existing.lat,
              lng: existing.lng,
            })
          }
        })

        // Convert to hotspots format (keeping fallback coordinates for now)
        const dynamicHotspots: ScamHotspot[] = Array.from(locationCounts.entries()).map(([location, data], index) => {
          const fallback = fallbackHotspots.find(
            (h) =>
              h.city.toLowerCase().includes(location.toLowerCase()) ||
              location.toLowerCase().includes(h.city.toLowerCase()),
          )
          return {
            id: index + 100,
            city: location,
            country: fallback?.country || "Unknown",
            type: data.type,
            count: data.count,
            lat: fallback?.lat || 0,
            lng: fallback?.lng || 0,
          }
        })

        // Combine with fallback data
        setHotspots([...fallbackHotspots, ...dynamicHotspots])
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentReports()

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchRecentReports, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Live Scam <span className="text-primary">Intelligence Map</span>
          </h2>
          <p className="text-xl text-muted-foreground">Real-time scam activity across Africa and the diaspora</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-sm text-muted-foreground">Last updated: {currentTime.toLocaleTimeString()}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecentReports}
              disabled={isLoading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Global Scam Hotspots
                  <Badge variant="destructive" className="ml-auto">
                    {isLoading ? "Updating..." : "Live"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simplified map representation */}
                <div className="relative bg-muted/10 rounded-lg h-96 overflow-hidden">
                  {/* World map background placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-muted/20" />

                  {/* Hotspot pins */}
                  {hotspots.map((hotspot) => {
                    const Icon = scamTypeIcons[hotspot.type as keyof typeof scamTypeIcons] || AlertCircle
                    return (
                      <button
                        key={hotspot.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                          left: `${((hotspot.lng + 180) / 360) * 100}%`,
                          top: `${((90 - hotspot.lat) / 180) * 100}%`,
                        }}
                        onClick={() => setSelectedHotspot(hotspot)}
                      >
                        <div className="relative">
                          <div className="w-4 h-4 bg-destructive rounded-full animate-ping absolute" />
                          <div className="w-4 h-4 bg-destructive rounded-full relative z-10" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {hotspot.city}: {hotspot.count} reports
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotspot details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Active Threats</h3>
            {hotspots.slice(0, 6).map((hotspot) => {
              const Icon = scamTypeIcons[hotspot.type as keyof typeof scamTypeIcons] || AlertCircle
              return (
                <Card
                  key={hotspot.id}
                  className={`cursor-pointer transition-colors hover:border-primary/50 ${
                    selectedHotspot?.id === hotspot.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedHotspot(hotspot)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-destructive" />
                        <span className="font-medium">{hotspot.city}</span>
                      </div>
                      <Badge variant="secondary">{hotspot.count}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{hotspot.type}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Selected hotspot details */}
        {selectedHotspot && (
          <Card className="mt-8 border-primary/50">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-2">
                {selectedHotspot.city}, {selectedHotspot.country}
              </h4>
              <p className="text-muted-foreground mb-4">
                <strong>{selectedHotspot.count} reports</strong> of {selectedHotspot.type} in the last 24 hours
              </p>
              <div className="bg-muted/20 rounded-lg p-4">
                <h5 className="font-medium mb-2">Quick Protection Tip:</h5>
                <p className="text-sm text-muted-foreground">
                  {selectedHotspot.type === "Mobile Money Fraud" &&
                    "Always verify mobile money transactions through official channels. Never share your PIN or transaction codes."}
                  {selectedHotspot.type === "Phishing" &&
                    "Check email sender addresses carefully. Legitimate companies won't ask for passwords via email."}
                  {selectedHotspot.type === "Fake Jobs" &&
                    "Research companies thoroughly. Never pay upfront fees for job opportunities."}
                  {selectedHotspot.type === "Investment Scams" &&
                    "Be wary of guaranteed high returns. Always verify investment platforms with financial regulators."}
                  {selectedHotspot.type === "Romance Scams" &&
                    "Never send money to someone you've only met online. Video call before developing trust."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {recentReports.length > 0 && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Recent Verified Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {recentReports.slice(0, 4).map((report) => (
                  <div key={report.id} className="bg-card/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{report.scam_type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h6 className="font-medium text-sm mb-1">{report.title}</h6>
                    {report.location && <p className="text-xs text-muted-foreground">{report.location}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
