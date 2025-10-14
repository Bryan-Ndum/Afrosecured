"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AlertTriangle, Activity, MapPin, TrendingUp, Shield, Globe } from "lucide-react"
import useSWR from "swr"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"

interface ThreatLocation {
  country: string
  country_code: string
  city?: string
  latitude: number
  longitude: number
  total_threats: number
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  threat_types: Record<string, number>
  last_threat_time: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ThreatHeatmap() {
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedLocation, setSelectedLocation] = useState<ThreatLocation | null>(null)
  const [liveCount, setLiveCount] = useState(0)
  const [recentThreats, setRecentThreats] = useState<string[]>([])

  const { data, error, mutate } = useSWR(`/api/threat-heatmap?range=${timeRange}`, fetcher, { refreshInterval: 60000 })

  const threats: ThreatLocation[] = data?.data || []

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("geographic-threats-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "geographic_threats",
        },
        (payload) => {
          console.log("[v0] New threat detected:", payload)
          setLiveCount((prev) => prev + 1)

          if (payload.new) {
            const threat = payload.new as any
            setRecentThreats((prev) => [
              `${threat.threat_type} detected in ${threat.city || threat.country}`,
              ...prev.slice(0, 4),
            ])
          }

          mutate()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const getSeverityColor = (location: ThreatLocation) => {
    if (location.critical_count > 0) return "#ef4444"
    if (location.high_count > 5) return "#f97316"
    if (location.medium_count > 10) return "#eab308"
    return "#0f172a"
  }

  const totalThreats = threats.reduce((sum, t) => sum + t.total_threats, 0)
  const criticalThreats = threats.reduce((sum, t) => sum + t.critical_count, 0)
  const affectedCountries = new Set(threats.map((t) => t.country_code)).size

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Global Threat Intelligence</h2>
          <p className="text-slate-400">Real-time monitoring of cybersecurity threats worldwide</p>
        </div>
        <Shield className="w-12 h-12 text-amber-500" />
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Active Threats</p>
              <p className="text-3xl font-bold text-white">{totalThreats.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Live tracking
              </p>
            </div>
            <Activity className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-950/50 to-slate-900 border border-red-900/50 rounded-xl p-6 hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-400">{criticalThreats}</p>
              <p className="text-xs text-red-400 mt-1">Requires immediate action</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-950/50 to-slate-900 border border-blue-900/50 rounded-xl p-6 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Countries Affected</p>
              <p className="text-3xl font-bold text-white">{affectedCountries}</p>
              <p className="text-xs text-blue-400 mt-1">Global coverage</p>
            </div>
            <MapPin className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-950/50 to-slate-900 border border-green-900/50 rounded-xl p-6 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Live Updates</p>
              <p className="text-3xl font-bold text-green-400">{liveCount}</p>
              <p className="text-xs text-green-400 mt-1">Real-time sync</p>
            </div>
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {recentThreats.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-white">Recent Threat Activity</span>
          </div>
          <div className="space-y-2">
            {recentThreats.map((threat, i) => (
              <div key={i} className="text-sm text-slate-400 flex items-center gap-2 animate-fade-in">
                <span className="text-amber-500">•</span>
                {threat}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-slate-300">Time Range:</span>
        <div className="flex gap-2">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/50"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {range === "1h"
                ? "Last Hour"
                : range === "24h"
                  ? "Last 24h"
                  : range === "7d"
                    ? "Last 7 Days"
                    : "Last 30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="relative h-[700px] bg-slate-950">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 147,
              center: [0, 20],
            }}
            className="w-full h-full"
          >
            <ZoomableGroup zoom={1} center={[0, 20]} minZoom={1} maxZoom={8}>
              <Geographies geography="/world-110m.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#334155", outline: "none" },
                        pressed: { fill: "#475569", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Threat Markers */}
              {threats.map((location, index) => (
                <Marker
                  key={index}
                  coordinates={[location.longitude, location.latitude]}
                  onClick={() => setSelectedLocation(location)}
                >
                  <g className="cursor-pointer group">
                    {/* Outer pulse ring */}
                    <circle
                      r={12}
                      fill={getSeverityColor(location)}
                      opacity={0.2}
                      className="animate-ping"
                      style={{ animationDuration: "2s" }}
                    />

                    {/* Middle pulse ring */}
                    <circle
                      r={8}
                      fill={getSeverityColor(location)}
                      opacity={0.4}
                      className="animate-ping"
                      style={{ animationDuration: "3s", animationDelay: "0.5s" }}
                    />

                    {/* Main marker */}
                    <circle
                      r={location.total_threats > 100 ? 6 : location.total_threats > 50 ? 5 : 4}
                      fill={getSeverityColor(location)}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="group-hover:scale-125 transition-transform"
                      style={{
                        filter: `drop-shadow(0 0 8px ${getSeverityColor(location)})`,
                      }}
                    />

                    {/* Threat count text */}
                    <text
                      textAnchor="middle"
                      y={1}
                      style={{
                        fontFamily: "system-ui",
                        fontSize: "6px",
                        fontWeight: "bold",
                        fill: "#ffffff",
                        pointerEvents: "none",
                      }}
                    >
                      {location.total_threats > 99 ? "99+" : location.total_threats}
                    </text>

                    {/* Tooltip on hover */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <rect
                        x={10}
                        y={-40}
                        width={140}
                        height={80}
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth={1}
                        rx={8}
                        opacity={0.95}
                      />
                      <text
                        x={80}
                        y={-25}
                        textAnchor="middle"
                        style={{
                          fontFamily: "system-ui",
                          fontSize: "8px",
                          fontWeight: "bold",
                          fill: "#ffffff",
                        }}
                      >
                        {location.city || location.country}
                      </text>
                      <text
                        x={80}
                        y={-15}
                        textAnchor="middle"
                        style={{
                          fontFamily: "system-ui",
                          fontSize: "6px",
                          fill: "#94a3b8",
                        }}
                      >
                        {location.country_code}
                      </text>
                      <text
                        x={20}
                        y={-2}
                        style={{
                          fontFamily: "system-ui",
                          fontSize: "6px",
                          fill: "#94a3b8",
                        }}
                      >
                        Total: {location.total_threats}
                      </text>
                      {location.critical_count > 0 && (
                        <text
                          x={20}
                          y={8}
                          style={{
                            fontFamily: "system-ui",
                            fontSize: "6px",
                            fill: "#f87171",
                          }}
                        >
                          Critical: {location.critical_count}
                        </text>
                      )}
                      {location.high_count > 0 && (
                        <text
                          x={20}
                          y={18}
                          style={{
                            fontFamily: "system-ui",
                            fontSize: "6px",
                            fill: "#fb923c",
                          }}
                        >
                          High: {location.high_count}
                        </text>
                      )}
                      <text
                        x={80}
                        y={32}
                        textAnchor="middle"
                        style={{
                          fontFamily: "system-ui",
                          fontSize: "5px",
                          fill: "#64748b",
                        }}
                      >
                        Click for details
                      </text>
                    </g>
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Enhanced Legend */}
          <div className="absolute bottom-6 left-6 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl p-5 shadow-2xl">
            <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Threat Severity Levels
            </p>
            <div className="space-y-3">
              {[
                { color: "bg-red-500", label: "Critical", desc: "Immediate action required" },
                { color: "bg-orange-500", label: "High", desc: "Significant risk" },
                { color: "bg-yellow-500", label: "Medium", desc: "Moderate concern" },
                { color: "bg-green-500", label: "Low", desc: "Minimal risk" },
              ].map(({ color, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 ${color} rounded-full shadow-lg`}
                    style={{
                      boxShadow: `0 0 10px ${color.replace("bg-", "")}`,
                    }}
                  />
                  <div>
                    <span className="text-sm text-white font-medium">{label}</span>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Scroll to zoom • Drag to pan
              </p>
            </div>
          </div>

          {/* Enhanced Live Indicator */}
          <div className="absolute top-6 right-6 bg-slate-900/95 backdrop-blur-sm border border-green-900/50 rounded-xl px-5 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
              </div>
              <div>
                <span className="text-sm text-white font-bold">Live Monitoring</span>
                <p className="text-xs text-green-400">Updates every 60s</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{selectedLocation.city || selectedLocation.country}</h3>
              <p className="text-slate-400">
                {selectedLocation.country} ({selectedLocation.country_code})
              </p>
            </div>
            <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-400">Total Threats</p>
              <p className="text-2xl font-bold text-white">{selectedLocation.total_threats}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Critical</p>
              <p className="text-2xl font-bold text-red-400">{selectedLocation.critical_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">High</p>
              <p className="text-2xl font-bold text-orange-400">{selectedLocation.high_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Medium</p>
              <p className="text-2xl font-bold text-yellow-400">{selectedLocation.medium_count}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-2">Threat Types</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedLocation.threat_types).map(([type, count]) => (
                <span key={type} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs">
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Affected Locations */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Most Affected Locations</h3>
        <div className="space-y-3">
          {threats.slice(0, 10).map((location, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-sm">#{index + 1}</span>
                <div>
                  <p className="text-white font-medium">{location.city || location.country}</p>
                  <p className="text-xs text-slate-400">{location.country_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white font-semibold">{location.total_threats}</p>
                  <p className="text-xs text-slate-400">threats</p>
                </div>
                {location.critical_count > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-400 text-sm font-medium">{location.critical_count}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
