"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Leaf, Users, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import NatureClock from "@/components/nature-clock"
import NatureBackground from "@/components/nature-background"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [weather, setWeather] = useState({ temperature: 20, description: "Clear sky" })
  const [duration, setDuration] = useState(25) // Default 25 minutes
  const [customDuration, setCustomDuration] = useState("")
  const [sharedMode, setSharedMode] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user location for weather data
  useEffect(() => {
    const handleLocationError = () => {
      setLocation({ lat: 40.7128, lon: -74.006 }) // New York as default
    }

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
          },
          handleLocationError,
          { timeout: 5000 },
        )
      } else {
        handleLocationError()
      }
    } catch (error) {
      handleLocationError()
    }
  }, [])

  const startFocusSession = () => {
    const sessionDuration = customDuration ? Number.parseInt(customDuration) : duration
    if (sessionDuration && sessionDuration > 0) {
      window.location.href = `/focus?duration=${sessionDuration}&shared=${sharedMode}`
    }
  }

  const openTerrarium = () => {
    window.location.href = "/terrarium"
  }

  const openProfile = () => {
    window.location.href = "/profile"
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-stone-900 dark:bg-stone-900 text-white dark:text-white">
      <NatureBackground focusMode={false} location={location} />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-6">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center">
          <Button
            onClick={openProfile}
            variant="ghost"
            size="sm"
            className="text-stone-300 hover:text-white hover:bg-stone-800/50 transition-colors"
          >
            <User className="h-5 w-5 mr-2" />
            Profile
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="text-stone-300 hover:text-white hover:bg-stone-800/50 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              onClick={openTerrarium}
              variant="ghost"
              size="sm"
              className="text-stone-300 hover:text-white hover:bg-stone-800/50 transition-colors"
            >
              <Leaf className="h-5 w-5 mr-2" />
              Terrarium
            </Button>
          </div>
        </div>

        {/* Center Clock */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
          <NatureClock focusMode={false} />
        </div>

        {/* Focus Session Setup */}
        <div className="w-full max-w-md space-y-6">
          {/* Duration Selection - Improved UI */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center text-stone-200">Choose Your Focus Time</h3>

            {/* Preset Duration Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setDuration(25)
                  setCustomDuration("")
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  duration === 25 && !customDuration
                    ? "border-green-500 bg-green-900/30 text-green-100"
                    : "border-stone-600 bg-stone-800/50 text-stone-300 hover:border-stone-500"
                }`}
              >
                <div className="text-2xl font-bold">25</div>
                <div className="text-xs opacity-80">minutes</div>
                <div className="text-xs mt-1 opacity-60">Quick Focus</div>
              </button>

              <button
                onClick={() => {
                  setDuration(50)
                  setCustomDuration("")
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  duration === 50 && !customDuration
                    ? "border-green-500 bg-green-900/30 text-green-100"
                    : "border-stone-600 bg-stone-800/50 text-stone-300 hover:border-stone-500"
                }`}
              >
                <div className="text-2xl font-bold">50</div>
                <div className="text-xs opacity-80">minutes</div>
                <div className="text-xs mt-1 opacity-60">Deep Focus</div>
              </button>
            </div>

            {/* Custom Duration */}
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Custom Duration</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter minutes"
                  value={customDuration}
                  onChange={(e) => {
                    setCustomDuration(e.target.value)
                    if (e.target.value) {
                      setDuration(0) // Clear preset selection
                    }
                  }}
                  className="bg-stone-800/50 border-stone-600 text-white placeholder:text-stone-500 rounded-xl"
                  min="1"
                  max="180"
                />
                <span className="text-sm text-stone-400 min-w-[3rem]">minutes</span>
              </div>
            </div>
          </div>

          {/* Shared Garden Mode Toggle */}
          <div className="flex items-center justify-center gap-3 p-3 bg-stone-800/30 rounded-xl">
            <Users className="h-4 w-4 text-stone-400" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sharedMode}
                onChange={(e) => setSharedMode(e.target.checked)}
                className="rounded border-stone-600 bg-stone-800"
              />
              <span className="text-sm text-stone-300">Shared Garden Mode</span>
            </label>
          </div>

          {/* Start Button */}
          <Button
            onClick={startFocusSession}
            disabled={!duration && !customDuration}
            className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 disabled:from-stone-700 disabled:to-stone-600 text-white flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Leaf className="h-5 w-5" />
            Start Focus Session
          </Button>
        </div>
      </div>
    </main>
  )
}
