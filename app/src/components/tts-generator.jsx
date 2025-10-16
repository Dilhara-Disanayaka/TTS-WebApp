"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { Mic, Volume2, Download, AudioWaveform as Waveform, Sparkles, Info, LogIn, User, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VoiceManager } from "./voice-manager"

export function TTSGenerator({ user_id }) {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("dinithi")
  const [availableVoices, setAvailableVoices] = useState([])
  const [isLoadingVoices, setIsLoadingVoices] = useState(true)
  const [isVoiceManagerOpen, setIsVoiceManagerOpen] = useState(false)
  const router = useRouter()

  // Fetch available voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        let url = '/api/voices'
        if (user_id && user_id !== 'null') {
          url += `?user_id=${user_id}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setAvailableVoices(data.voices || [])
          console.log('Fetched voices:', data.voices)
        } else {
          console.error('Failed to fetch voices')
          // Fallback to default voices
          setAvailableVoices([
            { id: "dinithi", name: "Dinithi" },
            { id: "jerry", name: "Jerry" },
            { id: "obama", name: "Obama" }
          ])
        }
      } catch (error) {
        console.error('Error fetching voices:', error)
        // Fallback to default voices
        setAvailableVoices([
          { id: "dinithi", name: "Dinithi" },
          { id: "jerry", name: "Jerry" },
          { id: "obama", name: "Obama" }
        ])
      } finally {
        setIsLoadingVoices(false)
      }
    }

    fetchVoices()
  }, [user_id])

  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError("")
    setAudioUrl(null)
    console.log("Generating speech for user ID:", user_id, "with voice:", selectedVoice)
    try {
      // Send text and voice selection to backend
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          user_id: user_id || null,
          voice: selectedVoice
        })
      })

      console.log("Sending request to backend with voice:", selectedVoice)

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      // Create audio URL from response
      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

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
      link.download = `sinhala-tts-${selectedVoice}-${Date.now()}.wav`
      link.click()
    }
  }

  const handleVoiceChange = (value) => {
    if (value === "add_voice") {
      // Check if user is logged in
      if (!user_id || user_id === 'null') {
        router.push('/login')
        return
      }
      // Open voice manager modal
      setIsVoiceManagerOpen(true)
      return
    }
    setSelectedVoice(value)
  }

  const handleVoiceUploaded = (newVoice) => {
    // Add the new voice to available voices and select it
    const voiceWithCustomFlag = { ...newVoice, is_custom: true }
    setAvailableVoices(prev => [...prev, voiceWithCustomFlag])
    setSelectedVoice(newVoice.id)
    setIsVoiceManagerOpen(false)
  }

  const handleCloseVoiceManager = () => {
    setIsVoiceManagerOpen(false)
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
          <CardContent>
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
                    <LogIn className=" mr-1" />
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
                className="min-h-[150px] sinhala-text text-lg bg-input border-border resize-none"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{text.length} characters</span>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </Badge>
              </div>
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <Label htmlFor="voice-select" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Voice Selection
              </Label>
              <Select
                value={selectedVoice}
                onValueChange={handleVoiceChange}
                disabled={isLoadingVoices || isGenerating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex items-center gap-2">
                        <span>{voice.name}</span>
                        {voice.is_custom ? (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Your Voice
                          </Badge>
                        ) : voice.id !== "dinithi" ? (
                          <Badge variant="outline" className="text-xs">
                            Voice Clone
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                  {user_id && user_id !== 'null' && (
                    <SelectItem value="add_voice" className="border-t border-gray-200 mt-2 pt-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Plus className="w-4 h-4" />
                        <span>Add Your Voice</span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {selectedVoice !== "dinithi" && (
                <p className="text-xs text-muted-foreground">
                  This voice uses AI voice conversion technology for enhanced quality. This may take slightly longer to generate.
                </p>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating || isLoadingVoices}
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

      {/* Voice Manager Modal */}
      <Dialog open={isVoiceManagerOpen} onOpenChange={setIsVoiceManagerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Upload Your Voice
            </DialogTitle>
          </DialogHeader>
          <VoiceManager
            user_id={user_id}
            onVoiceUploaded={handleVoiceUploaded}
            isModal={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
