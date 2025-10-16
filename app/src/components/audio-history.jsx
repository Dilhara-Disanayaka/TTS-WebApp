"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { History, Play, Pause, Download, Search, Calendar, Clock } from "lucide-react"
import { LoginPrompt } from "@/components/login-prompt"
import axios from "axios"

export function AudioHistory({ user_id }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [audioFiles, setAudioFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [playingFileId, setPlayingFileId] = useState(null)

  // Fetch audio files from backend
  useEffect(() => {
    const fetchAudioFiles = async () => {
      if (!user_id) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/audio?user_id=${user_id}`)
        setAudioFiles(response.data)
      } catch (error) {
        console.error("Error fetching audio files:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAudioFiles()
  }, [user_id])

  const filteredFiles = audioFiles.filter((file) =>
    file.text.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const handlePlay = (url, fileId) => {
    if (currentAudio && playingFileId === fileId) {
      // If the same audio is playing, pause it
      currentAudio.pause()
      setCurrentAudio(null)
      setPlayingFileId(null)
    } else {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause()
      }

      // Play new audio
      const audio = new Audio(url)
      setCurrentAudio(audio)
      setPlayingFileId(fileId)

      // Handle when audio ends
      audio.addEventListener('ended', () => {
        setCurrentAudio(null)
        setPlayingFileId(null)
      })

      audio.play()
    }
  }

  const handleDownload = (url, fileName) => {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName || "audio.mp3"
    link.click()
  }

  // Show login prompt if user is not authenticated
  if (!user_id) {
    return (
      <LoginPrompt
        title="Audio History Access Required"
        description="Please log in to view your saved audio files and history."
        feature="audio history"
      />
    )
  }

  if (loading) {
    return <p>Loading audio files...</p>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
          <History className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Audio History</h1>
          <p className="text-muted-foreground">
            View and manage your generated audio files
          </p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audio files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {audioFiles.length} files</span>
          <span>•</span>
          <span>
            Size:{" "}
            {(
              audioFiles.reduce((acc, file) => {
                const size = parseFloat(file.size) || 0
                return acc + size
              }, 0) / 1024
            ).toFixed(2)}{" "}
            MB
          </span>
        </div>
      </div>

      {/* Audio List */}
      <div className="space-y-4">
        {filteredFiles.map((file) => (
          <Card
            key={file.id}
            className="border border-border/50 hover:border-primary/20 transition-colors bg-background/60"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Left section */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      completed
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(file.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-lg font-medium leading-relaxed">
                    {file.text}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {file.duration || "00:00"}
                    </span>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent/10 bg-transparent"
                    onClick={() => handlePlay(file.url, file.id)}
                  >
                    {playingFileId === file.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent/10 bg-transparent"
                    onClick={() => handleDownload(file.url, `${file.text}.mp3`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">
                No audio files found
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Generate your first audio file to see it here"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
