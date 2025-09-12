"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mic, Play, Loader2, Volume2 } from "lucide-react"
import { startTextS } from "./romanize"

export default function DashboardPage() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [audioUrl, setAudioUrl] = useState(null)
  const audioRef = useRef(null)

  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError("")
    setAudioUrl(null)

    try {
      // Convert Sinhala text to romanized text
      const romanizedText = startTextS(text.trim())

      // Send romanized text to backend
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: romanizedText }),
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

  const sampleTexts = [
    "ආයුබෝවන්! මෙය සිංහල කථන පරීක්ෂණයකි.",
    "අද දිනය ඉතා සුන්දර දිනයකි.",
    "ශ්‍රී ලංකාව ඉතා සුන්දර රටකි.",
    "තාක්ෂණය අපගේ ජීවිතය වෙනස් කරයි.",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mic className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SinhalaVoice
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="glass-card border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="h-5 w-5 mr-2 text-blue-600" />
              Sinhala Text to Speech
            </CardTitle>
            <CardDescription>Enter your Sinhala text below to generate natural voice audio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text-input">Sinhala Text</Label>
              <Textarea
                id="text-input"
                placeholder="ඔබගේ සිංහල පෙළ මෙහි ටයිප් කරන්න..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] border-blue-200 focus:border-blue-500"
              />
              <div className="flex justify-between text-sm text-slate-500">
                <span>{text.length} characters</span>
                <span>
                  {
                    text
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }{" "}
                  words
                </span>
              </div>
            </div>

            {/* Sample Texts */}
            <div className="space-y-2">
              <Label>Quick Samples</Label>
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(sample)}
                    className="text-xs border-blue-200 hover:bg-blue-50"
                  >
                    {sample.substring(0, 20)}...
                  </Button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Speech
                </>
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Audio Generated Successfully</span>
                </div>
                <audio
                  ref={audioRef}
                  controls
                  className="w-full"
                  src={audioUrl}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
