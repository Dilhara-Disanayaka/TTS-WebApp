"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TTSGenerator } from "@/components/tts-generator"
import { UserProfile } from "@/components/user-profile"
import { AudioHistory } from "@/components/audio-history"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("generator")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          {activeView === "generator" && <TTSGenerator />}
          {activeView === "profile" && <UserProfile />}
          {activeView === "history" && <AudioHistory />}
        </main>
      </div>
    </div>
  )
}
