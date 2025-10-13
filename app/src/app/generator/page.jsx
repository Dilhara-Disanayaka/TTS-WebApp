"use client"

import { Header } from "@/components/header"
import { TTSGenerator } from "@/components/tts-generator"

export default function GeneratorPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto p-6">
                <TTSGenerator user_id={null} />
            </main>
        </div>
    )
}