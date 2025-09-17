"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, User, Settings, Trash2 } from "lucide-react"

export default function Profile() {
  const [username, setUsername] = useState("")
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    // Load user data
    const savedUsername = localStorage.getItem("username") || "Nature Lover"
    setUsername(savedUsername)

    // Load session stats
    const sessions = JSON.parse(localStorage.getItem("focusSessions") || "[]")
    setTotalSessions(sessions.length)
    setTotalTime(sessions.reduce((sum: number, session: any) => sum + session.duration, 0))
  }, [])

  const saveUsername = () => {
    localStorage.setItem("username", username)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all your focus session data? This cannot be undone.")) {
      localStorage.removeItem("focusSessions")
      localStorage.removeItem("mossHighScore")
      setTotalSessions(0)
      setTotalTime(0)
      alert("All data cleared successfully.")
    }
  }

  const goHome = () => {
    window.location.href = "/"
  }

  return (
    <main className="min-h-screen bg-stone-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light">Profile</h1>
          <Button
            onClick={goHome}
            variant="outline"
            className="border-stone-600 text-stone-300 hover:bg-stone-800/50 bg-transparent transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-stone-800 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Username</label>
                <div className="flex gap-2">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-stone-700 border-stone-600 text-white"
                    placeholder="Enter your username"
                  />
                  <Button onClick={saveUsername} size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-stone-800 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Your Journey</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-stone-700 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{totalSessions}</div>
                <div className="text-sm text-stone-300">Total Sessions</div>
              </div>

              <div className="text-center p-4 bg-stone-700 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{totalTime}</div>
                <div className="text-sm text-stone-300">Minutes Focused</div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-stone-800 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </h2>

            <div className="space-y-4">
              <Button
                onClick={clearAllData}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>

              <p className="text-xs text-stone-400">
                This will permanently delete all your focus sessions and achievements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
