"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { Mic, Volume2, Download, AudioWaveform as Waveform, Sparkles, Info, LogIn } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function TTSGenerator({ user_id }) {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError("")
    setAudioUrl(null)
    console.log("Generating speech for user ID:", user_id)
    try {
      // Convert Sinhala text to romanized text
      // Send romanized text to backend
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ text: text.trim(), user_id: user_id || null })
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

      {!user_id && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You're using TTS Generator as a guest.
                  <Button
                    variant="link"
                    className="h-auto p-0 ml-1 text-blue-600 dark:text-blue-400 font-semibold"
                    onClick={() => router.push('/login')}
                  >
                    <LogIn className="w-3 h-3 mr-1" />
                    Log in
                  </Button>
                  to save your audio files and access history.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                {!user_id && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      💡 This audio file won't be saved to your history.
                      <Button
                        variant="link"
                        className="h-auto p-0 ml-1 text-yellow-700 dark:text-yellow-300 text-xs font-medium"
                        onClick={() => router.push('/login')}
                      >
                        Log in
                      </Button>
                      to save and manage your files.
                    </p>
                  </div>
                )}
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
