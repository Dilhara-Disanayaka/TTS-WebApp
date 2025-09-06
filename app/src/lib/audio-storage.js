class AudioStorage {
  storageKey = "sinhala-tts-history"

  getHistory() {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  addGeneration(audio) {
    if (typeof window === "undefined") return

    try {
      const history = this.getHistory()
      const updated = [audio, ...history.slice(0, 19)] // Keep last 20 items
      localStorage.setItem(this.storageKey, JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save audio generation:", error)
    }
  }

  removeGeneration(id) {
    if (typeof window === "undefined") return

    try {
      const history = this.getHistory()
      const updated = history.filter((item) => item.id !== id)
      localStorage.setItem(this.storageKey, JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to remove audio generation:", error)
    }
  }

  clearHistory() {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error("Failed to clear history:", error)
    }
  }
}

export const audioStorage = new AudioStorage()
