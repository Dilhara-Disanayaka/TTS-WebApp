"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Crown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoginPrompt } from "@/components/login-prompt"

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="border-border/50 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt={user?.user_metadata?.full_name || user?.email}
            />
            <AvatarFallback>
              {(user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-xl font-bold">{user?.user_metadata?.full_name || user?.email}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground mt-2">
            <Crown className="w-3 h-3 mr-1" />
            Premium User
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {loading ? (
            <p className="text-muted-foreground">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{stats.audios_generated}</p>
                <p className="text-xs text-muted-foreground">Audio Files Generated</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">
                  {stats.characters_processed.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Characters Processed</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
