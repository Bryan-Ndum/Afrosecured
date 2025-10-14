// Behavioral Biometrics Tracking System
// Tracks user behavior patterns for fraud detection

interface BiometricData {
  typing: TypingBiometrics
  mouse: MouseBiometrics
  scroll: ScrollBiometrics
  device: DeviceFingerprint
  network: NetworkAnalysis
}

interface TypingBiometrics {
  keystrokes: KeystrokeEvent[]
  avgSpeed: number
  rhythm: number[]
  holdTimes: number[]
}

interface MouseBiometrics {
  movements: MouseMovement[]
  clicks: ClickEvent[]
  velocity: number
  acceleration: number
  pressure: number[]
}

interface ScrollBiometrics {
  events: ScrollEvent[]
  speed: number
  pattern: number[]
}

interface DeviceFingerprint {
  fingerprint: string
  screen: { width: number; height: number }
  timezone: string
  language: string
  platform: string
  userAgent: string
}

interface NetworkAnalysis {
  ipAddress: string
  vpnDetected: boolean
  proxyDetected: boolean
  torDetected: boolean
}

class BiometricTracker {
  private data: Partial<BiometricData> = {}
  private sessionId: string
  private startTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking() {
    if (typeof window === "undefined") return

    // Track typing patterns
    this.trackTyping()

    // Track mouse behavior
    this.trackMouse()

    // Track scroll behavior
    this.trackScroll()

    // Generate device fingerprint
    this.generateDeviceFingerprint()
  }

  private trackTyping() {
    const keystrokes: KeystrokeEvent[] = []
    let lastKeyTime = 0

    document.addEventListener("keydown", (e) => {
      const currentTime = Date.now()
      const timeSinceLastKey = lastKeyTime ? currentTime - lastKeyTime : 0

      keystrokes.push({
        key: e.key,
        timestamp: currentTime,
        timeSinceLastKey,
        holdTime: 0,
      })

      lastKeyTime = currentTime
    })

    document.addEventListener("keyup", (e) => {
      const lastKeystroke = keystrokes[keystrokes.length - 1]
      if (lastKeystroke && lastKeystroke.key === e.key) {
        lastKeystroke.holdTime = Date.now() - lastKeystroke.timestamp
      }
    })

    this.data.typing = {
      keystrokes,
      avgSpeed: 0,
      rhythm: [],
      holdTimes: [],
    }
  }

  private trackMouse() {
    const movements: MouseMovement[] = []
    const clicks: ClickEvent[] = []
    let lastMouseTime = 0
    let lastX = 0
    let lastY = 0

    document.addEventListener("mousemove", (e) => {
      const currentTime = Date.now()
      const timeDelta = lastMouseTime ? currentTime - lastMouseTime : 0
      const distance = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2))

      movements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: currentTime,
        timeDelta,
        distance,
        velocity: timeDelta > 0 ? distance / timeDelta : 0,
      })

      lastMouseTime = currentTime
      lastX = e.clientX
      lastY = e.clientY
    })

    document.addEventListener("click", (e) => {
      clicks.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        button: e.button,
        pressure: (e as any).pressure || 0.5,
      })
    })

    this.data.mouse = {
      movements,
      clicks,
      velocity: 0,
      acceleration: 0,
      pressure: [],
    }
  }

  private trackScroll() {
    const events: ScrollEvent[] = []
    let lastScrollTime = 0
    let lastScrollY = 0

    document.addEventListener("scroll", () => {
      const currentTime = Date.now()
      const currentY = window.scrollY
      const timeDelta = lastScrollTime ? currentTime - lastScrollTime : 0
      const distance = Math.abs(currentY - lastScrollY)

      events.push({
        y: currentY,
        timestamp: currentTime,
        timeDelta,
        distance,
        speed: timeDelta > 0 ? distance / timeDelta : 0,
      })

      lastScrollTime = currentTime
      lastScrollY = currentY
    })

    this.data.scroll = {
      events,
      speed: 0,
      pattern: [],
    }
  }

  private async generateDeviceFingerprint() {
    const fingerprint = await this.calculateFingerprint()

    this.data.device = {
      fingerprint,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    }
  }

  private async calculateFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
      navigator.deviceMemory,
    ]

    const fingerprint = components.join("|")
    const encoder = new TextEncoder()
    const data = encoder.encode(fingerprint)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  public async analyzeBehavior(): Promise<BiometricAnalysis> {
    const typingAnalysis = this.analyzeTyping()
    const mouseAnalysis = this.analyzeMouse()
    const scrollAnalysis = this.analyzeScroll()

    return {
      typing: typingAnalysis,
      mouse: mouseAnalysis,
      scroll: scrollAnalysis,
      device: this.data.device!,
      consistencyScore: this.calculateConsistencyScore(typingAnalysis, mouseAnalysis, scrollAnalysis),
    }
  }

  private analyzeTyping(): TypingAnalysis {
    const keystrokes = this.data.typing?.keystrokes || []
    if (keystrokes.length < 5) {
      return { avgSpeed: 0, rhythm: [], consistency: 0 }
    }

    const speeds = keystrokes.filter((k) => k.timeSinceLastKey > 0).map((k) => 1000 / k.timeSinceLastKey)

    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
    const rhythm = keystrokes.map((k) => k.timeSinceLastKey)
    const consistency = this.calculateVariance(speeds)

    return { avgSpeed, rhythm, consistency }
  }

  private analyzeMouse(): MouseAnalysis {
    const movements = this.data.mouse?.movements || []
    if (movements.length < 10) {
      return { avgVelocity: 0, avgAcceleration: 0, consistency: 0 }
    }

    const velocities = movements.map((m) => m.velocity)
    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length

    const accelerations = []
    for (let i = 1; i < velocities.length; i++) {
      accelerations.push(velocities[i] - velocities[i - 1])
    }
    const avgAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length

    return {
      avgVelocity,
      avgAcceleration,
      consistency: this.calculateVariance(velocities),
    }
  }

  private analyzeScroll(): ScrollAnalysis {
    const events = this.data.scroll?.events || []
    if (events.length < 5) {
      return { avgSpeed: 0, consistency: 0 }
    }

    const speeds = events.map((e) => e.speed)
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length

    return {
      avgSpeed,
      consistency: this.calculateVariance(speeds),
    }
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map((v) => Math.pow(v - mean, 2))
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length)
  }

  private calculateConsistencyScore(typing: TypingAnalysis, mouse: MouseAnalysis, scroll: ScrollAnalysis): number {
    // Lower variance = higher consistency = lower fraud risk
    const typingScore = 100 - Math.min(typing.consistency, 100)
    const mouseScore = 100 - Math.min(mouse.consistency, 100)
    const scrollScore = 100 - Math.min(scroll.consistency, 100)

    return (typingScore + mouseScore + scrollScore) / 3
  }

  public getData(): Partial<BiometricData> {
    return this.data
  }

  public getSessionId(): string {
    return this.sessionId
  }
}

// Types
interface KeystrokeEvent {
  key: string
  timestamp: number
  timeSinceLastKey: number
  holdTime: number
}

interface MouseMovement {
  x: number
  y: number
  timestamp: number
  timeDelta: number
  distance: number
  velocity: number
}

interface ClickEvent {
  x: number
  y: number
  timestamp: number
  button: number
  pressure: number
}

interface ScrollEvent {
  y: number
  timestamp: number
  timeDelta: number
  distance: number
  speed: number
}

interface BiometricAnalysis {
  typing: TypingAnalysis
  mouse: MouseAnalysis
  scroll: ScrollAnalysis
  device: DeviceFingerprint
  consistencyScore: number
}

interface TypingAnalysis {
  avgSpeed: number
  rhythm: number[]
  consistency: number
}

interface MouseAnalysis {
  avgVelocity: number
  avgAcceleration: number
  consistency: number
}

interface ScrollAnalysis {
  avgSpeed: number
  consistency: number
}

export { BiometricTracker, type BiometricData, type BiometricAnalysis }
