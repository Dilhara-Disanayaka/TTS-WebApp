"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
} from "lucide-react"

export function AudioPlayer({ audioUrl, title, duration = 0, onDownload, className }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration)
  const [volume, setVolume] = useState([1])
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState([1])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setAudioDuration(audio.duration)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0]
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate[0]
    }
  }, [playbackRate])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (value) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audioDuration, audio.currentTime + 10)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        {/* Title */}
        <div className="mb-4">
          <h3 className="font-medium text-foreground truncate" title={title}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatTime(audioDuration)} • {playbackRate[0]}x speed
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={audioDuration || 100}
            step={0.1}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={skipBackward} disabled={isLoading}>
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
            disabled={isLoading}
            className="w-12 h-12 bg-transparent"
          >
            {isLoading ? (
              <RotateCcw className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handleStop} disabled={isLoading}>
            <Square className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={skipForward} disabled={isLoading}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleMute} className="p-2">
              {isMuted || volume[0] === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={isMuted ? [0] : volume}
              onValueChange={setVolume}
              max={1}
              step={0.1}
              className="flex-1"
            />
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Speed: {playbackRate[0]}x
            </span>
            <Slider
              value={playbackRate}
              onValueChange={setPlaybackRate}
              max={2}
              min={0.5}
              step={0.1}
              className="flex-1"
            />
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
