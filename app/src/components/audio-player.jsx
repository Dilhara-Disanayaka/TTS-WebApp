"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([0.8])
  const [playbackRate, setPlaybackRate] = useState([1])
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0]
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate[0]
    }
  }, [playbackRate])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const resetAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
    audio.pause()
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Card className="p-6 bg-gradient-to-r from-card to-muted/30 border-border/50">
      <audio ref={audioRef} src={audioUrl} />

      <div className="space-y-4">
        {/* Waveform Visualization (Placeholder) */}
        <div className="h-20 bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="flex items-end gap-1 h-12">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300"
                style={{
                  height: `${Math.random() * 100}%`,
                  opacity: i / 40 < progress / 100 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider value={[progress]} onValueChange={handleSeek} max={100} step={0.1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={resetAudio}
              variant="outline"
              size="sm"
              className="border-border hover:bg-accent/10 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={togglePlayPause}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider value={volume} onValueChange={setVolume} max={1} step={0.1} className="w-20" />
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Speed:</span>
              <Slider
                value={playbackRate}
                onValueChange={setPlaybackRate}
                max={2}
                min={0.5}
                step={0.1}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground w-8">{playbackRate[0]}x</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
