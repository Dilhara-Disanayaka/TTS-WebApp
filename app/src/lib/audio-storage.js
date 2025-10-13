class AudioStorage {
  storageKey = "sinhala-tts-history"
  maxItems = 20

  getHistory() {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Failed to parse audio history:", error)
      // Clear corrupted data
      this.clearHistory()
      return []
    }
  }

  addGeneration(audio) {
    if (typeof window === "undefined") return

    try {
      const history = this.getHistory()
      
      // Validate audio object
      if (!audio || !audio.id) {
        console.error("Invalid audio object provided")
        return
      }

      // Remove duplicate if exists
      const filteredHistory = history.filter(item => item.id !== audio.id)
      
      // Add new item at the beginning and limit to maxItems
      const updated = [audio, ...filteredHistory.slice(0, this.maxItems - 1)]
      
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
      return true
    } catch (error) {
      console.error("Failed to remove audio generation:", error)
      return false
    }
  }

  clearHistory() {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error("Failed to clear history:", error)
      return false
    }
  }

  getStorageSize() {
    if (typeof window === "undefined") return 0

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? new Blob([stored]).size : 0
    } catch (error) {
      console.error("Failed to get storage size:", error)
      return 0
    }
  }

  exportHistory() {
    const history = this.getHistory()
    const dataStr = JSON.stringify(history, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `sinhala-tts-history-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  importHistory(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          
          if (Array.isArray(importedData)) {
            localStorage.setItem(this.storageKey, JSON.stringify(importedData))
            resolve(importedData.length)
          } else {
            reject(new Error('Invalid file format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
}

export const audioStorage = new AudioStorage()
