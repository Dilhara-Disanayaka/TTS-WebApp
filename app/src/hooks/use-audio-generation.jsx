"use client"

import { useState, useCallback } from "react"
import { audioStorage } from "@/lib/audio-storage"

export function useAudioGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const generateAudio = useCallback(async (text, options) => {
    if (!text.trim()) {
      setError("Please enter some text to generate speech")
      return null
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          ...options,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate speech")
      }

      // Save to local storage
      audioStorage.addGeneration(data.audio)

      // Update history state
      setHistory(audioStorage.getHistory())

      return data.audio
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const loadHistory = useCallback(() => {
    setHistory(audioStorage.getHistory())
  }, [])

  const removeFromHistory = useCallback((id) => {
    audioStorage.removeGeneration(id)
    setHistory(audioStorage.getHistory())
  }, [])

  const clearHistory = useCallback(() => {
    audioStorage.clearHistory()
    setHistory([])
  }, [])

  return {
    generateAudio,
    isGenerating,
    error,
    history,
    loadHistory,
    removeFromHistory,
    clearHistory,
  }
}
