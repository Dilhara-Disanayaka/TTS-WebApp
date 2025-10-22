"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { VoiceUpload } from "./voice-upload"
import { Mic, Trash2, Volume2, Clock, HardDrive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function VoiceManager({ user_id, onVoiceUploaded, isModal = false }) {
    const [userVoices, setUserVoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const { toast } = useToast()

    const fetchUserVoices = async () => {
        try {
            const response = await fetch(`/api/user-voices?user_id=${user_id}`)
            if (response.ok) {
                const data = await response.json()
                setUserVoices(data.voices || [])
            }
        } catch (error) {
            console.error('Error fetching user voices:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user_id) {
            fetchUserVoices()
        }
    }, [user_id])

    const handleVoiceUploaded = (newVoice) => {
        // Add a temporary unique key for rendering before the voice has a database ID
        const voiceWithKey = { ...newVoice, tempId: Date.now() + Math.random() }
        setUserVoices(prev => [...prev, voiceWithKey])
        // Call parent callback if provided
        if (onVoiceUploaded) {
            onVoiceUploaded(voiceWithKey)
        }
    }

    const handleDeleteVoice = async (voiceId) => {
        setDeletingId(voiceId)
        try {
            const response = await fetch(`/api/user-voices?voice_id=${voiceId}&user_id=${user_id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete voice')
            }

            setUserVoices(prev => prev.filter(voice => voice.id !== voiceId))

            toast({
                title: "Voice Deleted",
                description: "Your custom voice has been removed successfully.",
            })
        } catch (error) {
            console.error('Error deleting voice:', error)
            toast({
                title: "Delete Failed",
                description: "Failed to delete voice. Please try again.",
                variant: "destructive"
            })
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatDuration = (seconds) => {
        if (!seconds) return 'Unknown'
        return `${Math.round(seconds)}s`
    }

    const CardWrapper = isModal ? 'div' : Card

    if (loading) {
        return (
            <CardWrapper>
                {!isModal && (
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mic className="w-5 h-5" />
                            Voice Manager
                        </CardTitle>
                        <CardDescription>
                            Manage your custom voices for personalized TTS generation
                        </CardDescription>
                    </CardHeader>
                )}
                <CardContent className={!isModal ? "" : "pt-4"}>
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                </CardContent>
            </CardWrapper>
        )
    }

    return (
        <CardWrapper>
            {!isModal && (
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mic className="w-5 h-5 text-primary" />
                        Voice Manager
                    </CardTitle>
                    <CardDescription>
                        Upload and manage your custom voices for personalized TTS generation
                    </CardDescription>
                </CardHeader>
            )}
            <CardContent className={`space-y-4 ${!isModal ? "" : "pt-4"}`}>
                {/* Upload Section */}
                <VoiceUpload user_id={user_id} onVoiceUploaded={handleVoiceUploaded} />

                {/* Voices List */}
                {userVoices.length > 0 ? (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Your Custom Voices</h4>
                        {userVoices.map((voice) => (
                            <Card key={voice.id || voice.tempId} className="border-border/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                                                <Volume2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-medium">{voice.name}</h5>
                                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                        Custom Voice
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDuration(voice.duration)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <HardDrive className="w-3 h-3" />
                                                        {voice.size} KB
                                                    </span>
                                                    <span>
                                                        Uploaded {formatDate(voice.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={!voice.id || deletingId === voice.id}
                                                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                                >
                                                    {deletingId === voice.id ? (
                                                        <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Custom Voice</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{voice.name}"? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteVoice(voice.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete Voice
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No custom voices uploaded yet</p>
                        <p className="text-xs">Upload your first voice to get started with personalized TTS</p>
                    </div>
                )}
            </CardContent>
        </CardWrapper>
    )
}