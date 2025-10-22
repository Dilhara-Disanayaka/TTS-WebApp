"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mic, Upload, X, Play, Pause, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function VoiceUpload({ user_id, onVoiceUploaded }) {
    const [isUploading, setIsUploading] = useState(false)
    const [voiceName, setVoiceName] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const fileInputRef = useRef(null)
    const audioRef = useRef(null)
    const { toast } = useToast()

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('audio/')) {
            toast({
                title: "Invalid File",
                description: "Please select an audio file.",
                variant: "destructive"
            })
            return
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select a file smaller than 10MB.",
                variant: "destructive"
            })
            return
        }

        setSelectedFile(file)

        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
    }

    const handleUpload = async () => {
        if (!selectedFile || !voiceName.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide both a voice name and audio file.",
                variant: "destructive"
            })
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('user_id', user_id)
            formData.append('voice_name', voiceName.trim())

            const response = await fetch('/api/user-voices', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }

            const result = await response.json()

            toast({
                title: "Voice Uploaded Successfully",
                description: `Your voice "${voiceName}" is now available for TTS generation.`,
            })

            // Reset form
            setVoiceName("")
            setSelectedFile(null)
            setPreviewUrl(null)
            setIsDialogOpen(false)

            // Notify parent component
            if (onVoiceUploaded) {
                onVoiceUploaded(result)
            }

        } catch (error) {
            console.error('Error uploading voice:', error)
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload voice. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    const clearFile = () => {
        setSelectedFile(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        setIsPlaying(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const togglePreview = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    const handleAudioEnded = () => {
        setIsPlaying(false)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your Voice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mic className="w-5 h-5 text-primary" />
                        Upload Your Voice
                    </DialogTitle>
                    <DialogDescription>
                        Upload a clear audio sample of your voice (3-60 seconds) to create a custom voice for TTS generation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Voice Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="voice-name">Voice Name</Label>
                        <Input
                            id="voice-name"
                            placeholder="e.g., My Voice"
                            value={voiceName}
                            onChange={(e) => setVoiceName(e.target.value)}
                            disabled={isUploading}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label>Audio File</Label>
                        {!selectedFile ? (
                            <div
                                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 cursor-pointer transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-1">
                                    Click to upload an audio file
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    WAV, MP3, or other audio formats • Max 10MB
                                </p>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <Mic className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {previewUrl && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={togglePreview}
                                                    disabled={isUploading}
                                                >
                                                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={clearFile}
                                                disabled={isUploading}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Guidelines */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                            <strong>Tips for best results:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Use clear, high-quality audio</li>
                                <li>Speak naturally without background noise</li>
                                <li>3-60 seconds of continuous speech</li>
                                <li>Include varied intonation and emotion</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || !voiceName.trim() || isUploading}
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                Uploading Voice...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Voice
                            </>
                        )}
                    </Button>
                </div>

                {/* Hidden audio element for preview */}
                {previewUrl && (
                    <audio
                        ref={audioRef}
                        src={previewUrl}
                        onEnded={handleAudioEnded}
                        className="hidden"
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}