"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, Wind } from "lucide-react"

interface NatureClockProps {
  focusMode: boolean
}

export default function NatureClock({ focusMode }: NatureClockProps) {
  const [time, setTime] = useState(new Date())
  const [natureTime, setNatureTime] = useState("")
  const [natureIcon, setNatureIcon] = useState<React.ReactNode>(null)

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update nature time description
  useEffect(() => {
    if (focusMode) {
      const hour = time.getHours()
      const minutes = time.getMinutes()

      // Determine nature time based on hour
      if (hour >= 5 && hour < 8) {
        setNatureTime("Dawn Awakening")
        setNatureIcon(<Sun className="h-8 w-8 text-amber-300" />)
      } else if (hour >= 8 && hour < 11) {
        setNatureTime("Morning Clarity")
        setNatureIcon(<Sun className="h-8 w-8 text-yellow-400" />)
      } else if (hour >= 11 && hour < 14) {
        setNatureTime("Midday Warmth")
        setNatureIcon(<Sun className="h-8 w-8 text-yellow-500" />)
      } else if (hour >= 14 && hour < 17) {
        setNatureTime("Afternoon Breeze")
        setNatureIcon(<Wind className="h-8 w-8 text-blue-300" />)
      } else if (hour >= 17 && hour < 20) {
        setNatureTime("Evening Glow")
        setNatureIcon(<Sun className="h-8 w-8 text-orange-400" />)
      } else if (hour >= 20 && hour < 23) {
        setNatureTime("Twilight Transition")
        setNatureIcon(<Moon className="h-8 w-8 text-blue-200" />)
      } else {
        setNatureTime("Night Stillness")
        setNatureIcon(<Moon className="h-8 w-8 text-blue-100" />)
      }

      // Add some variation based on minutes
      if (minutes > 45) {
        setNatureTime((prev) =>
          prev.replace("Transition", "Reflection").replace("Warmth", "Abundance").replace("Breeze", "Whisper"),
        )
      } else if (minutes > 30) {
        setNatureTime((prev) => prev.replace("Clarity", "Vitality").replace("Glow", "Radiance"))
      } else if (minutes > 15) {
        setNatureTime((prev) => prev.replace("Awakening", "Emergence").replace("Stillness", "Serenity"))
      }
    }
  }, [time, focusMode])

  // Format standard time
  const formatStandardTime = () => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format standard date
  const formatStandardDate = () => {
    return time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
  }

  return (
    <div className="w-full flex flex-col items-center">
      {focusMode ? (
        // Nature Time Display
        <div className="text-center">
          <div className="mb-4 flex justify-center">{natureIcon}</div>
          <h2 className="text-4xl font-light mb-2">{natureTime}</h2>
          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-3"></div>
          <p className="text-stone-300 text-sm">
            {time.toLocaleDateString([], { month: "long" })} ·{" "}
            {["Waxing", "Full", "Waning", "New"][Math.floor(time.getDate() / 8) % 4]} Moon Phase
          </p>
        </div>
      ) : (
        // Standard Time Display
        <div className="text-center">
          <h2 className="text-5xl font-light mb-2">{formatStandardTime()}</h2>
          <p className="text-stone-300">{formatStandardDate()}</p>
        </div>
      )}

      {/* Clock Face - visible in both modes but styled differently */}
      <div
        className={`mt-8 relative w-64 h-64 rounded-full ${
          focusMode ? "bg-green-900/20 border-4 border-green-700/30" : "bg-stone-800 border border-stone-700"
        }`}
      >
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-3 ${focusMode ? "bg-green-600/60" : "bg-stone-600"}`}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-120px)`,
              transformOrigin: "center 150px",
              left: "calc(50% - 0.5px)",
            }}
          ></div>
        ))}

        {/* Clock hands */}
        {focusMode ? (
          // Nature clock - more organic, less precise
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Sun/Moon position indicator */}
              <div
                className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-lg"
                style={{
                  transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg) translateY(-60px)`,
                  transformOrigin: "center 128px",
                  left: "calc(50% - 16px)",
                }}
              ></div>

              {/* Center decoration */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-green-700/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-green-500/60"></div>
              </div>
            </div>
          </div>
        ) : (
          // Standard clock hands
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">

              {/* Hour hand */}
              <div
                className="absolute w-1.5 h-16 bg-white rounded-full"
                style={{
                  transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)`,
                  transformOrigin: "bottom center",
                  top: "50%",
                  left: "50%",
                  marginLeft: "-3px", // half of 1.5 (width)
                  marginTop: "-64px", // center the pivot
                }}
              ></div>

              {/* Minute hand */}
              <div
                className="absolute w-1 h-24 bg-white rounded-full"
                style={{
                  transform: `rotate(${time.getMinutes() * 6}deg)`,
                  transformOrigin: "bottom center",
                  top: "50%",
                  left: "50%",
                  marginLeft: "-2px",
                  marginTop: "-96px",
                }}
              ></div>

              {/* Second hand */}
              <div
                className="absolute w-0.5 h-28 bg-red-500 rounded-full"
                style={{
                  transform: `rotate(${time.getSeconds() * 6}deg)`,
                  transformOrigin: "bottom center",
                  top: "50%",
                  left: "50%",
                  marginLeft: "-1px",
                  marginTop: "-112px",
                }}
              ></div>

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"></div>
            </div>
          </div>

        )}
      </div>
    </div>
  )
}
