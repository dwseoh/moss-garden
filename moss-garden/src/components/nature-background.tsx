"use client"

import { useEffect, useRef, useState } from "react"

interface NatureBackgroundProps {
  focusMode: boolean
  location: { lat: number; lon: number } | null
  reducedParticles?: boolean
}

export default function NatureBackground({ focusMode, location, reducedParticles = false }: NatureBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [weather, setWeather] = useState<{
    condition: "clear" | "rain" | "snow" | "cloudy"
    temperature: number
    description: string
  }>({
    condition: "clear",
    temperature: 22,
    description: "Loading weather data...",
  })

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check if we have an API key
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

        if (location && apiKey) {
          // Use the actual Weather API
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location.lat},${location.lon}&aqi=no`,
          )

          if (response.ok) {
            const data = await response.json()

            // Map the API response to our weather state
            let condition: "clear" | "rain" | "snow" | "cloudy" = "clear"

            // Map WeatherAPI condition codes to our simplified conditions
            // This is a simplified mapping - you might want to expand this
            const conditionCode = data.current.condition.code

            if ([1000, 1003].includes(conditionCode)) {
              condition = "clear" // Clear or partly cloudy
            } else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) {
              condition = "rain" // Various rain conditions
            } else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) {
              condition = "snow" // Various snow conditions
            } else {
              condition = "cloudy" // Default to cloudy for other conditions
            }

            setWeather({
              condition,
              temperature: data.current.temp_c,
              description: data.current.condition.text,
            })

            return // Exit early if we successfully fetched weather
          }
        }

        // Fallback to simulated weather if API call fails or no API key
        // Simulate API response based on current time to show different conditions
        const hour = new Date().getHours()
        let simulatedCondition: "clear" | "rain" | "snow" | "cloudy"
        let simulatedTemp: number
        let simulatedDesc: string

        // Simulate different weather based on time of day
        if (hour >= 6 && hour < 10) {
          simulatedCondition = "clear"
          simulatedTemp = 18
          simulatedDesc = "Clear morning sky"
        } else if (hour >= 10 && hour < 14) {
          simulatedCondition = "cloudy"
          simulatedTemp = 22
          simulatedDesc = "Partly cloudy"
        } else if (hour >= 14 && hour < 18) {
          simulatedCondition = "rain"
          simulatedTemp = 20
          simulatedDesc = "Light rain"
        } else {
          simulatedCondition = "clear"
          simulatedTemp = 15
          simulatedDesc = "Clear night"
        }

        setWeather({
          condition: simulatedCondition,
          temperature: simulatedTemp,
          description: simulatedDesc,
        })
      } catch (error) {
        console.error("Error with weather data:", error)
        // Default fallback
        setWeather({
          condition: "clear",
          temperature: 21,
          description: "Weather data unavailable",
        })
      }
    }

    fetchWeather()

    // In a real app, you might want to refresh weather data periodically
    const interval = setInterval(fetchWeather, 600000) // Every 10 minutes

    return () => clearInterval(interval)
  }, [location])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles for nature elements
    const particles: Particle[] = []
    const maxParticles = focusMode ? (reducedParticles ? 30 : 100) : 20

    const raindrops: Raindrop[] = []
    const maxRaindrops = weather.condition === "rain" ? 200 : 0

    // Create snowflakes if weather is snowy
    const snowflakes: Snowflake[] = []
    const maxSnowflakes = weather.condition === "snow" ? 150 : 0

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      type: "leaf" | "light" | "dust"
      rotation: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 2
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 0.5 - 0.25
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = Math.random() * 0.02 - 0.01

        // Determine particle type and color
        const rand = Math.random()
        if (focusMode) {
          if (rand < 0.3) {
            this.type = "leaf"
            this.color = ["#4ade80", "#22c55e", "#15803d"][Math.floor(Math.random() * 3)]
            this.size = Math.random() * 8 + 4
          } else if (rand < 0.7) {
            this.type = "light"
            this.color = ["#fef08a", "#fde047", "#facc15"][Math.floor(Math.random() * 3)]
            this.size = Math.random() * 4 + 1
          } else {
            this.type = "dust"
            this.color = ["#e2e8f0", "#cbd5e1", "#94a3b8"][Math.floor(Math.random() * 3)]
            this.size = Math.random() * 3 + 1
          }
        } else {
          this.type = "dust"
          this.color = ["#475569", "#334155", "#1e293b"][Math.floor(Math.random() * 3)]
          this.size = Math.random() * 2 + 1
        }
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        // Reset position if out of bounds
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        if (this.type === "leaf") {
          // Draw a simple leaf shape
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.ellipse(0, 0, this.size, this.size * 2, 0, 0, Math.PI * 2)
          ctx.fill()

          // Leaf vein
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, -this.size * 2)
          ctx.lineTo(0, this.size * 2)
          ctx.stroke()
        } else if (this.type === "light") {
          // Draw a glowing light particle
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size)
          gradient.addColorStop(0, this.color)
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Draw a simple dust particle
          ctx.fillStyle = this.color
          ctx.globalAlpha = 0.6
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }
    }

    class Raindrop {
      x: number
      y: number
      length: number
      speed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.length = Math.random() * 10 + 10
        this.speed = Math.random() * 10 + 15
      }

      update() {
        this.y += this.speed

        // Reset position if out of bounds
        if (this.y > canvas.height) {
          this.y = -this.length
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        ctx.strokeStyle = "rgba(180, 210, 240, 0.8)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y + this.length)
        ctx.stroke()
      }
    }

    class Snowflake {
      x: number
      y: number
      size: number
      speed: number
      sway: number
      swayAmount: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.size = Math.random() * 3 + 1
        this.speed = Math.random() * 2 + 1
        this.sway = 0
        this.swayAmount = Math.random() * 2 - 1
      }

      update() {
        this.y += this.speed
        this.sway += 0.01
        this.x += Math.sin(this.sway) * this.swayAmount

        // Reset position if out of bounds
        if (this.y > canvas.height) {
          this.y = -this.size
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle())
    }

    // Initialize raindrops
    for (let i = 0; i < maxRaindrops; i++) {
      raindrops.push(new Raindrop())
    }

    // Initialize snowflakes
    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push(new Snowflake())
    }

    // Animation loop
    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

      // Get current hour to determine day/night
      const hour = new Date().getHours()
      const isDaytime = hour >= 6 && hour < 18

      if (focusMode) {
        // Nature-inspired gradient, adjusted for weather and time of day
        if (weather.condition === "rain") {
          gradient.addColorStop(0, "#1e293b") // Darker blue for rain
          gradient.addColorStop(0.5, "#334155") // Mid blue
          gradient.addColorStop(1, "#1e3a8a") // Deep blue
        } else if (weather.condition === "snow") {
          gradient.addColorStop(0, "#1e293b") // Dark blue
          gradient.addColorStop(0.5, "#334155") // Mid blue
          gradient.addColorStop(1, "#1f2937") // Slate
        } else if (weather.condition === "cloudy") {
          if (isDaytime) {
            gradient.addColorStop(0, "#64748b") // Slate blue for cloudy day
            gradient.addColorStop(0.5, "#475569")
            gradient.addColorStop(1, "#334155")
          } else {
            gradient.addColorStop(0, "#1e293b") // Darker for cloudy night
            gradient.addColorStop(0.5, "#0f172a")
            gradient.addColorStop(1, "#020617")
          }
        } else {
          // Clear weather
          if (isDaytime) {
            gradient.addColorStop(0, "#0ea5e9") // Sky blue for day
            gradient.addColorStop(0.5, "#0284c7")
            gradient.addColorStop(1, "#065f46") // Forest green at bottom
          } else {
            gradient.addColorStop(0, "#020617") // Dark blue for night
            gradient.addColorStop(0.5, "#0f172a")
            gradient.addColorStop(1, "#134e4a") // Dark teal at bottom
          }
        }
      } else {
        // Standard dark mode gradient
        gradient.addColorStop(0, "#0f172a")
        gradient.addColorStop(1, "#1e293b")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw raindrops or snowflakes based on weather
      if (weather.condition === "rain" && focusMode) {
        raindrops.forEach((raindrop) => {
          raindrop.update()
          raindrop.draw()
        })
      } else if (weather.condition === "snow" && focusMode) {
        snowflakes.forEach((snowflake) => {
          snowflake.update()
          snowflake.draw()
        })
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Add more particles in focus mode
      if (focusMode && particles.length < maxParticles && Math.random() > 0.95) {
        particles.push(new Particle())
      }

      // Remove excess particles when exiting focus mode
      if (!focusMode && particles.length > maxParticles) {
        particles.pop()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [focusMode, weather, reducedParticles])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Weather indicator - moved to bottom right to avoid overlap */}
      <div className="absolute bottom-4 right-4 z-10 text-white text-xs bg-black/30 px-3 py-1.5 rounded-full flex items-center">
        <span className="mr-1">{weather.temperature}°C</span>
        <span className="mx-1">•</span>
        <span>{weather.description}</span>
      </div>
    </>
  )
}
