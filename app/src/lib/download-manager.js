class DownloadManager {
  downloads = new Map()
  listeners = new Set()

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    const downloads = Array.from(this.downloads.values())
    this.listeners.forEach((listener) => listener(downloads))
  }

  async downloadFile(url, filename) {
    const id = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const download = {
      id,
      filename,
      progress: 0,
      status: "pending", // "pending" | "downloading" | "completed" | "error"
    }

    this.downloads.set(id, download)
    this.notify()

    try {
      download.status = "downloading"
      this.notify()

      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        download.progress = progress
        this.notify()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Trigger real file download
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      download.status = "completed"
      download.progress = 100
      this.notify()

      // Auto-remove completed download after 3 seconds
      setTimeout(() => {
        this.downloads.delete(id)
        this.notify()
      }, 3000)
    } catch (error) {
      download.status = "error"
      download.error = error instanceof Error ? error.message : "Download failed"
      this.notify()
    }
  }

  async downloadMultiple(files) {
    const promises = files.map((file) => this.downloadFile(file.url, file.filename))
    await Promise.allSettled(promises)
  }

  cancelDownload(id) {
    const download = this.downloads.get(id)
    if (download && download.status === "downloading") {
      download.status = "error"
      download.error = "Download cancelled"
      this.notify()
    }
  }

  clearCompleted() {
    const completed = Array.from(this.downloads.entries())
      .filter(([, download]) => download.status === "completed")
      .map(([id]) => id)

    completed.forEach((id) => this.downloads.delete(id))
    this.notify()
  }

  getActiveDownloads() {
    return Array.from(this.downloads.values()).filter(
      (download) => download.status === "downloading" || download.status === "pending"
    )
  }
}

export const downloadManager = new DownloadManager()
