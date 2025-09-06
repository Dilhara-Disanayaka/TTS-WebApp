"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import { AudioPlaylist } from "@/components/audio-playlist"
import { DownloadManagerWidget } from "@/components/download-manager-widget"
import { useAudioGeneration } from "@/hooks/use-audio-generation"
import { Mic, Play, History, Settings, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [text, setText] = useState("")
  const [voice, setVoice] = useState("female-1")
  const [speed, setSpeed] = useState([1.0])
  const [pitch, setPitch] = useState([1.0])

  const { generateAudio, isGenerating, currentAudio, audioHistory, error } = useAudioGeneration()

  const handleGenerate = async () => {
    if (!text.trim()) return

    await generateAudio({
      text: text.trim(),
      voice,
      speed: speed[0],
      pitch: pitch[0],
    })
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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Pro Plan</Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="generate">Generate Speech</TabsTrigger>
            <TabsTrigger value="library">Audio Library</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Text Input Section */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-blue-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mic className="h-5 w-5 mr-2 text-blue-600" />
                      Text to Speech
                    </CardTitle>
                    <CardDescription>Enter your Sinhala text below to generate natural voice audio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Voice Settings */}
              <div className="space-y-6">
                <Card className="glass-card border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Voice Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Voice Type</Label>
                      <Select value={voice} onValueChange={setVoice}>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female-1">Female Voice 1</SelectItem>
                          <SelectItem value="female-2">Female Voice 2</SelectItem>
                          <SelectItem value="male-1">Male Voice 1</SelectItem>
                          <SelectItem value="male-2">Male Voice 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Speed: {speed[0]}x</Label>
                      <Slider
                        value={speed}
                        onValueChange={setSpeed}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Pitch: {pitch[0]}x</Label>
                      <Slider
                        value={pitch}
                        onValueChange={setPitch}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Current Audio Player */}
                {currentAudio && (
                  <Card className="glass-card border-blue-100">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Audio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AudioPlayer audio={currentAudio} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <Card className="glass-card border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-600" />
                  Audio Library
                </CardTitle>
                <CardDescription>Manage your generated audio files</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioPlaylist audioList={audioHistory} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DownloadManagerWidget />
    </div>
  )
}
