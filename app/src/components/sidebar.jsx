"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Mic, User, History } from "lucide-react"

export function Sidebar({ activeView, onViewChange }) {
  const menuItems = [
    {
      id: "generator",
      label: "TTS Generator",
      icon: Mic,
      description: "Generate speech from text",
    },
    {
      id: "history",
      label: "Audio History",
      icon: History,
      description: "View generated audio files",
    },
    {
      id: "profile",
      label: "User Profile",
      icon: User,
      description: "Manage your account",
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3",
                  activeView === item.id &&
                    "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
