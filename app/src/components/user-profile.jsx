"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Crown, Volume2, Type, Sparkles, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoginPrompt } from "@/components/login-prompt"
import { VoiceManager } from "@/components/voice-manager"

export function UserProfile({ user_id }) {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    audios_generated: 0,
    characters_processed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/user-stats/${user_id}`)
        if (!response.ok) throw new Error("Failed to fetch user stats")

        const data = await response.json()
        setStats({
          audios_generated: data.audios_generated || 0,
          characters_processed: data.characters_processed || 0,
        })
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user_id) fetchUserStats()
  }, [user_id])

  // Show login prompt if user is not authenticated
  if (!user_id || !user) {
    return (
      <LoginPrompt
        title="Profile Access Required"
        description="Please log in to view your profile and usage statistics."
        feature="your profile"
      />
    )
  }

  const maxAudios = 100 // Example max for progress calculation
  const maxCharacters = 100000 // Example max for progress calculation
  const audioProgress = Math.min((stats.audios_generated / maxAudios) * 100, 100)
  const characterProgress = Math.min((stats.characters_processed / maxCharacters) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full translate-y-12 -translate-x-12" />

          <CardHeader className="relative text-center pb-2 pt-8">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/20 shadow-lg">
                <AvatarImage
                  src={user?.user_metadata?.picture}
                  alt={user?.user_metadata?.full_name || user?.email}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold">
                  {(user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-6 space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {user?.user_metadata?.full_name || user?.email}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {user?.email}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6 pb-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading your amazing stats...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Audio Stats */}
                  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Volume2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{stats.audios_generated}</p>
                          <p className="text-sm text-muted-foreground">Audio Files Generated</p>
                        </div>
                      </div>
                      <TrendingUp className="w-4 h-4 text-primary/60" />
                    </div>
                    <div className="w-full bg-primary/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Character Stats */}
                  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 p-4 border border-accent/10 hover:border-accent/20 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Type className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-accent-foreground">
                            {stats.characters_processed.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Characters Processed</p>
                        </div>
                      </div>
                      <TrendingUp className="w-4 h-4 text-accent/60" />
                    </div>
                    <div className="w-full bg-accent/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${characterProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div className="text-center pt-4 border-t border-border/50">
                  <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>
                      {stats.audios_generated > 50 ? "Power User" :
                        stats.audios_generated > 10 ? "Active Creator" : "Getting Started"}
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Manager */}
        <VoiceManager user_id={user_id} />
      </div>
    </div>
  )
}
