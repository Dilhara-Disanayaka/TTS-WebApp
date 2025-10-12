"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TTSGenerator } from "@/components/tts-generator"
import { UserProfile } from "@/components/user-profile"
import { AudioHistory } from "@/components/audio-history"
import { useSearchParams } from 'next/navigation'
export default function Dashboard() {
  const [activeView, setActiveView] = useState("generator")
  const searchParams = useSearchParams()
  const user_id = searchParams.get("user_id")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          {activeView === "generator" && <TTSGenerator user_id={user_id} />}
          {activeView === "profile" && <UserProfile user_id={user_id} />}
          {activeView === "history" && <AudioHistory user_id={user_id} />}
        </main>
      </div>
    </div>
  )
}
