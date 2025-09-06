"use client"

import { useState } from "react"
import { AudioPlayer } from "./audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Download, Trash2, Music, DownloadCloud } from "lucide-react"
import { useDownloadManager } from "@/hooks/use-download-manager"

export function AudioPlaylist({ audioList, onRemove, className }) {
  const [currentAudio, setCurrentAudio] = useState(null)
  const [selectedAudios, setSelectedAudios] = useState(new Set())
  const { downloadAudio, downloadMultipleAudio } = useDownloadManager()

  const handlePlayAudio = (audio) => {
    setCurrentAudio(audio)
  }

  const handleSelectAudio = (audioId, checked) => {
    const newSelected = new Set(selectedAudios)
    if (checked) {
      newSelected.add(audioId)
    } else {
      newSelected.delete(audioId)
    }
    setSelectedAudios(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAudios(new Set(audioList.map((audio) => audio.id)))
    } else {
      setSelectedAudios(new Set())
    }
  }

  const handleDownloadSelected = async () => {
    const selectedAudioList = audioList.filter((audio) => selectedAudios.has(audio.id))
    await downloadMultipleAudio(selectedAudioList)
    setSelectedAudios(new Set())
  }

  const formatFileSize = (kb) => {
    if (kb < 1024) return `${kb} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (audioList.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Music className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No audio files yet. Generate some speech to see them here!
          </p>
        </CardContent>
      </Card>
    )
  }

  const allSelected = selectedAudios.size === audioList.length
  const someSelected = selectedAudios.size > 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Audio Player */}
      {currentAudio && (
        <AudioPlayer
          audioUrl={currentAudio.url}
          title={currentAudio.text}
          duration={currentAudio.duration}
          onDownload={() => downloadAudio(currentAudio)}
        />
      )}

      {/* Playlist */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audio Library ({audioList.length})
              </CardTitle>
              <CardDescription>Your generated Sinhala audio files</CardDescription>
            </div>

            {/* Bulk Actions */}
            {someSelected && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadSelected}>
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Download Selected ({selectedAudios.size})
                </Button>
              </div>
            )}
          </div>

          {/* Select All */}
          {audioList.length > 1 && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="select-all" checked={allSelected} onCheckedChange={handleSelectAll} />
              <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                Select all
              </label>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {audioList.map((audio) => (
                <div
                  key={audio.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    currentAudio?.id === audio.id
                      ? "bg-primary/10 border-primary/20"
                      : "bg-card hover:bg-muted/50"
                  }`}
                >
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={selectedAudios.has(audio.id)}
                    onCheckedChange={(checked) => handleSelectAudio(audio.id, checked)}
                  />

                  {/* Play Button */}
                  <Button variant="ghost" size="sm" onClick={() => handlePlayAudio(audio)} className="shrink-0">
                    <Play className="h-4 w-4" />
                  </Button>

                  {/* Audio Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" title={audio.fullText}>
                      {audio.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {audio.voice}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDuration(audio.duration)}</span>
                      <span className="text-xs text-muted-foreground">{formatFileSize(audio.size)}</span>
                      <span className="text-xs text-muted-foreground">{audio.format.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(audio.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => downloadAudio(audio)} title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    {onRemove && (
                      <Button variant="ghost" size="sm" onClick={() => onRemove(audio.id)} title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
