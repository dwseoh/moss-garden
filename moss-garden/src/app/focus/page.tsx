"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pause, Play, Wind, Moon, Sun, ArrowLeft } from "lucide-react"
import NatureBackground from "@/components/nature-background"
import SoundControls from "@/components/sound-controls"

export default function FocusSession() {
  const searchParams = useSearchParams()
  const duration = Number.parseInt(searchParams.get("duration") || "25")
  const isShared = searchParams.get("shared") === "true"

  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert to seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [mossGrowth, setMossGrowth] = useState(0)
  const [showBreathingBreak, setShowBreathingBreak] = useState(false)
  const [breathingCount, setBreathingCount] = useState(0)
  const [soundsPlaying, setSoundsPlaying] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get location for weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        () => setLocation({ lat: 40.7128, lon: -74.006 }),
        { timeout: 5000 },
      )
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && !showBreathingBreak) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Session complete
            completeSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, showBreathingBreak])

  // Moss growth logic
  useEffect(() => {
    if (isRunning && !isPaused && !showBreathingBreak) {
      const totalSeconds = duration * 60
      const elapsedSeconds = totalSeconds - timeLeft
      const growthPercentage = (elapsedSeconds / totalSeconds) * 100
      setMossGrowth(growthPercentage)
    }
  }, [timeLeft, duration, isRunning, isPaused, showBreathingBreak])

  // Breathing breaks every 25 minutes
  useEffect(() => {
    if (isRunning && !isPaused) {
      const elapsedMinutes = Math.floor((duration * 60 - timeLeft) / 60)
      if (elapsedMinutes > 0 && elapsedMinutes % 25 === 0 && !showBreathingBreak) {
        triggerBreathingBreak()
      }
    }
  }, [timeLeft, duration, isRunning, isPaused, showBreathingBreak])

  const triggerBreathingBreak = () => {
    setShowBreathingBreak(true)
    setBreathingCount(0)

    // Auto-advance breathing prompts
    breathingIntervalRef.current = setInterval(() => {
      setBreathingCount((prev) => {
        if (prev >= 2) {
          setShowBreathingBreak(false)
          if (breathingIntervalRef.current) {
            clearInterval(breathingIntervalRef.current)
          }
          return 0
        }
        return prev + 1
      })
    }, 4000) // 4 seconds per breath
  }

  const completeSession = useCallback(() => {
    // Save session data
    const sessionData = {
      duration: duration,
      completed: true,
      date: new Date().toISOString(),
      mossGrowth: 100,
    }

    const existingSessions = JSON.parse(localStorage.getItem("focusSessions") || "[]")
    existingSessions.push(sessionData)
    localStorage.setItem("focusSessions", JSON.stringify(existingSessions))

    // Navigate to completion screen
    window.location.href = `/complete?duration=${duration}&growth=100`
  }, [duration])

  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      setIsPaused(false)
    } else {
      setIsPaused(!isPaused)
    }
  }

  const exitSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current)
    window.location.href = "/"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get nature time description
  const getNatureTime = () => {
    const now = new Date()
    const hour = now.getHours()
    const minutes = now.getMinutes()
    const month = now.getMonth()

    let timeDescription = ""
    let icon = null

    // Determine nature time based on hour
    if (hour >= 5 && hour < 8) {
      timeDescription = "Dawn Awakening"
      icon = <Sun className="h-4 w-4 text-amber-300" />
    } else if (hour >= 8 && hour < 11) {
      timeDescription = "Morning Clarity"
      icon = <Sun className="h-4 w-4 text-yellow-400" />
    } else if (hour >= 11 && hour < 14) {
      timeDescription = "Midday Warmth"
      icon = <Sun className="h-4 w-4 text-yellow-500" />
    } else if (hour >= 14 && hour < 17) {
      timeDescription = "Afternoon Breeze"
      icon = <Wind className="h-4 w-4 text-blue-300" />
    } else if (hour >= 17 && hour < 20) {
      timeDescription = "Evening Glow"
      icon = <Sun className="h-4 w-4 text-orange-400" />
    } else if (hour >= 20 && hour < 23) {
      timeDescription = "Twilight Transition"
      icon = <Moon className="h-4 w-4 text-blue-200" />
    } else {
      timeDescription = "Night Stillness"
      icon = <Moon className="h-4 w-4 text-blue-100" />
    }

    // Add variation based on minutes
    if (minutes > 45) {
      timeDescription = timeDescription
        .replace("Transition", "Reflection")
        .replace("Warmth", "Abundance")
        .replace("Breeze", "Whisper")
    } else if (minutes > 30) {
      timeDescription = timeDescription.replace("Clarity", "Vitality").replace("Glow", "Radiance")
    } else if (minutes > 15) {
      timeDescription = timeDescription.replace("Awakening", "Emergence").replace("Stillness", "Serenity")
    }

    // Get season and moon phase
    const seasons = [
      "Winter",
      "Winter",
      "Spring",
      "Spring",
      "Spring",
      "Summer",
      "Summer",
      "Summer",
      "Fall",
      "Fall",
      "Fall",
      "Winter",
    ]
    const season = seasons[month]
    const moonPhases = [
      "New",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent",
    ]
    const moonPhase = moonPhases[Math.floor(now.getDate() / 4) % 8]

    return {
      icon,
      timeDescription,
      season,
      moonPhase,
    }
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-stone-900 text-white">
      <NatureBackground focusMode={true} location={location} reducedParticles={true} />

      {/* Breathing Break Overlay */}
      {showBreathingBreak && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-4 border-green-400 flex items-center justify-center mb-6 animate-pulse">
              <Wind className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-2xl font-light mb-4">Take 3 breaths</h2>
            <p className="text-stone-300">Breath {breathingCount + 1} of 3</p>
          </div>
        </div>
      )}

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-6">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center">
          <Button
            onClick={exitSession}
            variant="ghost"
            size="sm"
            className="text-stone-300 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Button>

          {/* Nature Time Display */}
          <div className="flex items-center gap-2 text-xs text-stone-300 bg-black/20 px-3 py-1.5 rounded-full">
            {getNatureTime().icon}
            <span>{getNatureTime().timeDescription}</span>
            <span className="opacity-60">•</span>
            <span className="opacity-60">
              {getNatureTime().season} • {getNatureTime().moonPhase} Moon
            </span>
          </div>

          <div className="text-sm text-stone-300">{isShared && "🌱 Shared"}</div>
        </div>

        {/* Center Moss Circle */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Timer Display */}
          <div className="text-4xl font-light mb-8 text-center">{formatTime(timeLeft)}</div>

          {/* Expanding Moss Circle */}
          <div className="relative">
            <div
              className="rounded-full bg-gradient-to-br from-green-800 to-green-600 transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(80, 80 + mossGrowth * 2)}px`,
                height: `${Math.max(80, 80 + mossGrowth * 2)}px`,
                boxShadow: isRunning && !isPaused ? "0 0 30px rgba(74, 222, 128, 0.4)" : "none",
                animation: isRunning && !isPaused ? "pulse 3s ease-in-out infinite" : "none",
              }}
            >
              {/* Moss texture */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {[...Array(Math.floor(mossGrowth / 10))].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full opacity-70"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      transform: `scale(${0.5 + Math.random() * 0.8})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Growth Progress */}
          <div className="mt-8 text-center">
            <p className="text-sm text-stone-300">Moss Growth: {mossGrowth.toFixed(1)}%</p>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={toggleTimer}
            className={`w-full py-4 text-lg rounded-full flex items-center justify-center gap-2 ${
              isRunning && !isPaused ? "bg-stone-700 hover:bg-stone-600" : "bg-green-700 hover:bg-green-600"
            }`}
          >
            {isRunning && !isPaused ? (
              <>
                <Pause className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                {isRunning ? "Resume" : "Start"}
              </>
            )}
          </Button>

          <SoundControls playing={soundsPlaying} setPlaying={setSoundsPlaying} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </main>
  )
}
