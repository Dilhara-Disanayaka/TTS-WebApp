"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { Mic, Volume2, Download, AudioWaveform as Waveform, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TTSGenerator() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState("")
  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError("")
    setAudioUrl(null)

    try {
      // Convert Sinhala text to romanized text
      // Send romanized text to backend
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      // Create audio URL from response
      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      // // Auto play the audio
      // setTimeout(() => {
      //   if (audioRef.current) {
      //     audioRef.current.play()
      //   }
      // }, 100)

    } catch (err) {
      console.error('Error generating speech:', err)
      setError('Failed to generate speech. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = `sinhala-tts-${Date.now()}.mp3`
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
          <Mic className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">TTS Generator</h1>
          <p className="text-muted-foreground">Convert your Sinhala text to natural speech</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Text Input Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waveform className="w-5 h-5 text-primary" />
              Text Input
            </CardTitle>
            <CardDescription>Enter your Sinhala text below to generate speech</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="ඔබේ සිංහල පෙළ මෙහි ටයිප් කරන්න..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] sinhala-text text-lg bg-input border-border resize-none"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{text.length} characters</span>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </Badge>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Generate Speech
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Audio Output Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-accent" />
              Audio Output
            </CardTitle>
            <CardDescription>Generated audio with playback controls</CardDescription>
          </CardHeader>
          <CardContent>
            {audioUrl ? (
              <div className="space-y-4">
                <AudioPlayer audioUrl={audioUrl} />
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 border-border hover:bg-accent/10 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download MP3
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Volume2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">No audio generated yet</p>
                  <p className="text-sm text-muted-foreground">Enter text and click generate to create speech</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
