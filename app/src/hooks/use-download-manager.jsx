"use client"

import { useState, useEffect } from "react"
import { downloadManager } from "@/lib/download-manager"

export function useDownloadManager() {
  const [downloads, setDownloads] = useState([])

  useEffect(() => {
    const unsubscribe = downloadManager.subscribe(setDownloads)
    return unsubscribe
  }, [])

  const downloadAudio = async (audio) => {
    const filename = `sinhala-voice-${audio.id}.${audio.format}`
    await downloadManager.downloadFile(audio.url, filename)
  }

  const downloadMultipleAudio = async (audioList) => {
    const files = audioList.map((audio) => ({
      url: audio.url,
      filename: `sinhala-voice-${audio.id}.${audio.format}`,
    }))
    await downloadManager.downloadMultiple(files)
  }

  const cancelDownload = (id) => {
    downloadManager.cancelDownload(id)
  }

  const clearCompleted = () => {
    downloadManager.clearCompleted()
  }

  const activeDownloads = downloads.filter(
    (d) => d.status === "downloading" || d.status === "pending"
  )
  const hasActiveDownloads = activeDownloads.length > 0

  return {
    downloads,
    activeDownloads,
    hasActiveDownloads,
    downloadAudio,
    downloadMultipleAudio,
    cancelDownload,
    clearCompleted,
  }
}
