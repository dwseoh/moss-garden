"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Eye } from "lucide-react"
import NatureBackground from "@/components/nature-background"

export default function SessionComplete() {
  const searchParams = useSearchParams()
  const duration = Number.parseInt(searchParams.get("duration") || "25")
  const growth = Number.parseInt(searchParams.get("growth") || "100")

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

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

  const goHome = () => {
    window.location.href = "/"
  }

  const viewTerrarium = () => {
    window.location.href = "/terrarium"
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-stone-900 text-white">
      <NatureBackground focusMode={true} location={location} />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md space-y-8">
          {/* Dense Moss Visualization */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-700 to-green-500 shadow-2xl">
                {/* Dense moss texture */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-green-300 rounded-full opacity-80"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        transform: `scale(${0.6 + Math.random() * 0.8})`,
                      }}
                    />
                  ))}
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Completion Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-light">You've nourished your moss</h1>
            <p className="text-stone-300 text-lg">{duration} minutes of focused growth</p>
            <p className="text-stone-400">Come back tomorrow to see it thrive</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-8">
            <Button
              onClick={viewTerrarium}
              className="w-full py-4 text-lg rounded-full bg-green-700 hover:bg-green-600 text-white flex items-center justify-center gap-2"
            >
              <Eye className="h-5 w-5" />
              View Your Terrarium
            </Button>

            <Button
              onClick={goHome}
              variant="outline"
              className="w-full py-4 text-lg rounded-full border-stone-600 text-stone-300 hover:bg-stone-800 flex items-center justify-center gap-2 bg-transparent"
            >
              <Home className="h-5 w-5" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
