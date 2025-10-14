// IP Geolocation Service using multiple free APIs with fallback
interface GeolocationResult {
  country: string
  countryCode: string
  city?: string
  region?: string
  latitude: number
  longitude: number
  timezone?: string
}

class GeolocationService {
  private cache = new Map<string, GeolocationResult>()
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

  async geolocateIP(ip: string): Promise<GeolocationResult | null> {
    // Check cache first
    const cached = this.cache.get(ip)
    if (cached) return cached

    try {
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,lat,lon,timezone`,
        {
          headers: { "User-Agent": "AfroSecured-ThreatIntel/1.0" },
        },
      )

      if (!response.ok) {
        return this.fallbackGeolocate(ip)
      }

      const data = await response.json()

      if (data.status === "success") {
        const result: GeolocationResult = {
          country: data.country,
          countryCode: data.countryCode,
          city: data.city,
          region: data.regionName,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
        }

        this.cache.set(ip, result)
        return result
      }

      return this.fallbackGeolocate(ip)
    } catch (error) {
      console.error("[v0] IP geolocation failed:", error)
      return this.fallbackGeolocate(ip)
    }
  }

  private async fallbackGeolocate(ip: string): Promise<GeolocationResult | null> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`)

      if (!response.ok) return null

      const data = await response.json()

      const result: GeolocationResult = {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
        latitude: Number.parseFloat(data.latitude),
        longitude: Number.parseFloat(data.longitude),
        timezone: data.timezone,
      }

      this.cache.set(ip, result)
      return result
    } catch (error) {
      console.error("[v0] Fallback geolocation failed:", error)
      return null
    }
  }

  async geocodeCountry(countryName: string): Promise<GeolocationResult | null> {
    const countryCoordinates: Record<string, { code: string; lat: number; lon: number }> = {
      // Africa
      Nigeria: { code: "NG", lat: 9.082, lon: 8.6753 },
      "South Africa": { code: "ZA", lat: -30.5595, lon: 22.9375 },
      Kenya: { code: "KE", lat: -0.0236, lon: 37.9062 },
      Ghana: { code: "GH", lat: 7.9465, lon: -1.0232 },
      Egypt: { code: "EG", lat: 26.8206, lon: 30.8025 },
      // Europe
      "United Kingdom": { code: "GB", lat: 55.3781, lon: -3.436 },
      Germany: { code: "DE", lat: 51.1657, lon: 10.4515 },
      France: { code: "FR", lat: 46.2276, lon: 2.2137 },
      // USA
      "United States": { code: "US", lat: 37.0902, lon: -95.7129 },
      // Add more as needed
    }

    const coords = countryCoordinates[countryName]
    if (!coords) return null

    return {
      country: countryName,
      countryCode: coords.code,
      latitude: coords.lat,
      longitude: coords.lon,
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const geolocationService = new GeolocationService()
