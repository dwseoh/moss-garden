"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Cloud, Droplets, Pause, Play, Trees, Volume, Wind } from "lucide-react"

interface SoundControlsProps {
  playing: boolean
  setPlaying: (playing: boolean) => void
}

export default function SoundControls({ playing, setPlaying }: SoundControlsProps) {
  const [volume, setVolume] = useState(70)
  const [activeSounds, setActiveSounds] = useState({
    forest: true,
    rain: false,
    stream: false,
    wind: false,
  })

  const toggleSound = (sound: keyof typeof activeSounds) => {
    setActiveSounds((prev) => ({
      ...prev,
      [sound]: !prev[sound],
    }))
  }

  return (
    <div className="mt-4 p-4 bg-stone-800/80 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Nature Sounds</h3>
        <button onClick={() => setPlaying(!playing)} className="text-stone-300 hover:text-white transition-colors">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center mb-4">
        <Volume className="h-4 w-4 mr-2 text-stone-400" />
        <Slider value={[volume]} max={100} step={1} onValueChange={(value) => setVolume(value[0])} className="flex-1" />
        <span className="ml-2 text-xs text-stone-400">{volume}%</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => toggleSound("forest")}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
            activeSounds.forest ? "bg-green-800/50 text-green-100" : "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
          }`}
        >
          <Trees className="h-4 w-4" />
          <span className="text-xs">Forest</span>
        </button>

        <button
          onClick={() => toggleSound("rain")}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
            activeSounds.rain ? "bg-blue-800/50 text-blue-100" : "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
          }`}
        >
          <Droplets className="h-4 w-4" />
          <span className="text-xs">Rain</span>
        </button>

        <button
          onClick={() => toggleSound("stream")}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
            activeSounds.stream ? "bg-blue-800/50 text-blue-100" : "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
          }`}
        >
          <Cloud className="h-4 w-4" />
          <span className="text-xs">Stream</span>
        </button>

        <button
          onClick={() => toggleSound("wind")}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
            activeSounds.wind ? "bg-stone-600/50 text-stone-100" : "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
          }`}
        >
          <Wind className="h-4 w-4" />
          <span className="text-xs">Wind</span>
        </button>
      </div>
    </div>
  )
}
