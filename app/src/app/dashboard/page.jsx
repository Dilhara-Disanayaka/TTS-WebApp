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

  const sampleTexts = [
    "ආයුබෝවන්! මෙය සිංහල කථන පරීක්ෂණයකි.",
    "අද දිනය ඉතා සුන්දර දිනයකි.",
    "ශ්‍රී ලංකාව ඉතා සුන්දර රටකි.",
    "තාක්ෂණය අපගේ ජීවිතය වෙනස් කරයි.",
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Decorative SVG background */}
      <svg className="absolute top-0 left-0 w-full h-80 opacity-30 pointer-events-none select-none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#a5b4fc" fillOpacity="0.3" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
      </svg>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Mic className="h-10 w-10 text-blue-600 drop-shadow-md" />
              <span className="ml-3 text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                SinhalaVoice
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-lg ring-1 ring-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-blue-700">
              <Mic className="h-6 w-6 mr-2 text-blue-500" />
              Sinhala Text to Speech
            </CardTitle>
            <CardDescription className="text-base text-slate-600">Enter your Sinhala text below to generate natural voice audio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-base font-medium text-blue-700">Sinhala Text</Label>
              <Textarea
                id="text-input"
                placeholder="ඔබගේ සිංහල පෙළ මෙහි ටයිප් කරන්න..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[160px] border-blue-200 focus:border-blue-400 bg-white/70 rounded-xl shadow-sm text-lg placeholder:text-slate-400 text-slate-500"
              />
              <div className="flex justify-between text-xs text-slate-500">
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
              <Label className="text-base font-medium text-blue-700">Quick Samples</Label>
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(sample)}
                    className="text-xs border-blue-200 hover:bg-blue-100/60 hover:border-blue-300 rounded-lg transition-all text-slate-600"
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
              className="w-full py-4 text-md font-medium rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md transition-all text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Generate Speech
                </>
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg shadow-sm">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className="p-4 bg-green-50/80 border border-green-200 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Audio Generated Successfully</span>
                </div>
                <audio
                  ref={audioRef}
                  controls
                  className="w-full rounded-lg border border-green-200"
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
