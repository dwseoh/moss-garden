"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Home, ZoomIn, ZoomOut, Award, Calendar } from "lucide-react"

interface FocusSession {
  duration: number
  completed: boolean
  date: string
  mossGrowth: number
  isDefault?: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: string
}

export default function Terrarium() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [zoom, setZoom] = useState(1)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = JSON.parse(localStorage.getItem("focusSessions") || "[]")

    // Add default moss patch if no sessions exist
    if (savedSessions.length === 0) {
      const defaultPatch = {
        duration: 25,
        completed: true,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        mossGrowth: 100,
        isDefault: true,
      }
      savedSessions.push(defaultPatch)
    }

    setSessions(savedSessions)
    calculateAchievements(savedSessions)
  }, [])

  useEffect(() => {
    drawTerrarium()
  }, [sessions, zoom])

  const calculateAchievements = (sessions: FocusSession[]) => {
    const totalSessions = sessions.length
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
    const consecutiveDays = calculateConsecutiveDays(sessions)

    const achievementList: Achievement[] = [
      {
        id: "first-session",
        name: "First Growth",
        description: "Complete your first focus session",
        unlocked: totalSessions >= 1,
        icon: "🌱",
      },
      {
        id: "week-warrior",
        name: "Week Warrior",
        description: "Focus for 7 consecutive days",
        unlocked: consecutiveDays >= 7,
        icon: "🏆",
      },
      {
        id: "hour-master",
        name: "Hour Master",
        description: "Accumulate 60 minutes of focus time",
        unlocked: totalMinutes >= 60,
        icon: "⏰",
      },
      {
        id: "moss-garden",
        name: "Moss Garden",
        description: "Complete 10 focus sessions",
        unlocked: totalSessions >= 10,
        icon: "🏡",
      },
      {
        id: "zen-master",
        name: "Zen Master",
        description: "Accumulate 300 minutes of focus time",
        unlocked: totalMinutes >= 300,
        icon: "🧘",
      },
    ]

    setAchievements(achievementList)
  }

  const calculateConsecutiveDays = (sessions: FocusSession[]) => {
    if (sessions.length === 0) return 0

    const dates = sessions.map((session) => new Date(session.date).toDateString())
    const uniqueDates = [...new Set(dates)].sort()

    let consecutive = 1
    let maxConsecutive = 1

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        consecutive++
        maxConsecutive = Math.max(maxConsecutive, consecutive)
      } else {
        consecutive = 1
      }
    }

    return maxConsecutive
  }

  const drawTerrarium = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Clear canvas
    ctx.fillStyle = "#1c1917" // stone-900
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw terrarium container with glass effect
    ctx.strokeStyle = "#a8a29e" // stone-400
    ctx.lineWidth = 4
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)

    // Add glass reflection
    ctx.strokeStyle = "#e7e5e4" // stone-200
    ctx.lineWidth = 2
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110)

    // Draw soil base with texture
    const soilGradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height - 60)
    soilGradient.addColorStop(0, "#44403c") // stone-700
    soilGradient.addColorStop(1, "#1c1917") // stone-900
    ctx.fillStyle = soilGradient
    ctx.fillRect(60, canvas.height - 150, canvas.width - 120, 90)

    // Add soil texture
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = "#57534e" // stone-600
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(
        60 + Math.random() * (canvas.width - 120),
        canvas.height - 150 + Math.random() * 90,
        1 + Math.random() * 2,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Draw moss patches for each session with enhanced design
    sessions.forEach((session, index) => {
      const sessionDate = new Date(session.date)
      const month = sessionDate.getMonth()
      const hour = sessionDate.getHours()

      const x = 100 + (index % 8) * 80 + (Math.random() - 0.5) * 30
      const y = canvas.height - 160 + (Math.random() - 0.5) * 30
      const baseSize = Math.max(25, session.duration / 1.5) * zoom

      // Determine moss characteristics based on season and time
      let primaryColor = "#22c55e" // default green
      let secondaryColor = "#15803d"
      let tertiaryColor = "#14532d"
      let accentColor = "#4ade80"

      // Seasonal variations
      if (month >= 2 && month <= 4) {
        // Spring - bright green with yellow tints
        primaryColor = "#84cc16" // lime-500
        secondaryColor = "#65a30d" // lime-600
        tertiaryColor = "#4d7c0f" // lime-700
        accentColor = "#bef264" // lime-300
      } else if (month >= 5 && month <= 7) {
        // Summer - lush green
        primaryColor = "#10b981" // emerald-500
        secondaryColor = "#059669" // emerald-600
        tertiaryColor = "#047857" // emerald-700
        accentColor = "#6ee7b7" // emerald-300
      } else if (month >= 8 && month <= 10) {
        // Fall - golden moss
        primaryColor = "#f59e0b" // amber-500
        secondaryColor = "#d97706" // amber-600
        tertiaryColor = "#b45309" // amber-700
        accentColor = "#fcd34d" // amber-300
      } else {
        // Winter - blue-tinted moss
        primaryColor = "#0891b2" // cyan-600
        secondaryColor = "#0e7490" // cyan-700
        tertiaryColor = "#155e75" // cyan-800
        accentColor = "#67e8f9" // cyan-300
      }

      // Time-based variations
      if (hour >= 20 || hour < 6) {
        // Night patches are darker and more muted
        primaryColor = secondaryColor
        secondaryColor = tertiaryColor
        accentColor = primaryColor
      }

      // Draw multiple layers for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerSize = baseSize * (1 - layer * 0.15)
        const layerOpacity = 1 - layer * 0.2

        // Main moss body with radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerSize)
        gradient.addColorStop(0, layer === 0 ? accentColor : primaryColor)
        gradient.addColorStop(0.4, primaryColor)
        gradient.addColorStop(0.8, secondaryColor)
        gradient.addColorStop(1, tertiaryColor)

        ctx.globalAlpha = layerOpacity
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, layerSize, 0, Math.PI * 2)
        ctx.fill()

        // Add organic edge variation
        ctx.fillStyle = primaryColor
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const edgeX = x + Math.cos(angle) * layerSize * (0.8 + Math.random() * 0.4)
          const edgeY = y + Math.sin(angle) * layerSize * (0.8 + Math.random() * 0.4)
          ctx.beginPath()
          ctx.arc(edgeX, edgeY, 2 + Math.random() * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1

      // Add detailed texture patterns
      const textureCount = session.isDefault ? 8 : Math.max(8, Math.floor(session.duration / 5))
      for (let i = 0; i < textureCount; i++) {
        const textureX = x + (Math.random() - 0.5) * baseSize * 1.2
        const textureY = y + (Math.random() - 0.5) * baseSize * 1.2
        const textureSize = 1 + Math.random() * 4

        // Vary texture based on position
        const distanceFromCenter = Math.sqrt((textureX - x) ** 2 + (textureY - y) ** 2)
        if (distanceFromCenter < baseSize * 0.6) {
          ctx.fillStyle = accentColor
          ctx.globalAlpha = 0.8
        } else {
          ctx.fillStyle = primaryColor
          ctx.globalAlpha = 0.6
        }

        ctx.beginPath()
        ctx.arc(textureX, textureY, textureSize, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Add special glow for recent sessions
      const daysSinceSession = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceSession < 3) {
        ctx.shadowColor = accentColor
        ctx.shadowBlur = 15
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(x, y, baseSize * 1.1, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      // Add special markers for default patch
      if (session.isDefault) {
        ctx.strokeStyle = "#fbbf24" // amber-400
        ctx.lineWidth = 3
        ctx.setLineDash([8, 4])
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(x, y, baseSize + 8, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }
    })

    // Enhanced seasonal ambient effects
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) {
      // Spring - floating pollen and small flowers
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = "#fef08a" // yellow-200
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(Math.random() * canvas.width, Math.random() * (canvas.height / 2), 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      // Small flowers
      for (let i = 0; i < 5; i++) {
        const flowerX = Math.random() * canvas.width
        const flowerY = Math.random() * (canvas.height / 3)
        ctx.fillStyle = "#f472b6" // pink-400
        ctx.globalAlpha = 0.4
        for (let petal = 0; petal < 5; petal++) {
          const angle = (petal / 5) * Math.PI * 2
          ctx.beginPath()
          ctx.arc(flowerX + Math.cos(angle) * 3, flowerY + Math.sin(angle) * 3, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    } else if (month >= 8 && month <= 10) {
      // Fall - falling leaves with more variety
      const leafColors = ["#f59e0b", "#dc2626", "#ea580c", "#ca8a04"]
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = leafColors[Math.floor(Math.random() * leafColors.length)]
        ctx.globalAlpha = 0.5
        ctx.save()
        ctx.translate(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.rotate(Math.random() * Math.PI * 2)
        ctx.beginPath()
        ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = 1
    } else if (month >= 11 || month <= 1) {
      // Winter - frost crystals
      for (let i = 0; i < 15; i++) {
        const crystalX = Math.random() * canvas.width
        const crystalY = Math.random() * (canvas.height / 2)
        ctx.strokeStyle = "#e0f2fe" // sky-100
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.moveTo(crystalX - 3, crystalY)
        ctx.lineTo(crystalX + 3, crystalY)
        ctx.moveTo(crystalX, crystalY - 3)
        ctx.lineTo(crystalX, crystalY + 3)
        ctx.moveTo(crystalX - 2, crystalY - 2)
        ctx.lineTo(crystalX + 2, crystalY + 2)
        ctx.moveTo(crystalX - 2, crystalY + 2)
        ctx.lineTo(crystalX + 2, crystalY - 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
  }

  const goHome = () => {
    window.location.href = "/"
  }

  const zoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3))
  }

  const zoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5))
  }

  return (
    <main className="min-h-screen bg-stone-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-light">Your Terrarium</h1>
          <Button
            onClick={goHome}
            variant="outline"
            className="border-stone-600 text-stone-300 hover:bg-stone-800/50 bg-transparent transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terrarium View */}
          <div className="lg:col-span-2">
            <div className="bg-stone-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Garden Overview</h2>
                <div className="flex gap-2">
                  <Button onClick={zoomOut} size="sm" variant="outline" className="hover:bg-stone-700 bg-transparent">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button onClick={zoomIn} size="sm" variant="outline" className="hover:bg-stone-700 bg-transparent">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                className="w-full border border-stone-700 rounded"
                style={{ maxHeight: "400px" }}
              />

              <p className="text-sm text-stone-400 mt-2">
                {sessions.length} moss patches • Zoom: {(zoom * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Stats and Achievements */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-stone-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Sessions</span>
                  <span>{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Time</span>
                  <span>{sessions.reduce((sum, s) => sum + s.duration, 0)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Average Session</span>
                  <span>
                    {sessions.length > 0
                      ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length)
                      : 0}{" "}
                    min
                  </span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-stone-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-2 rounded ${
                      achievement.unlocked ? "bg-green-900/30 border border-green-700/50" : "bg-stone-700/50"
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className={`font-medium ${achievement.unlocked ? "text-green-300" : "text-stone-400"}`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-stone-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
