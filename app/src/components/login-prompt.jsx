"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginPrompt({ title, description, feature }) {
    const router = useRouter()

    const handleLogin = () => {
        router.push('/login')
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-border/50 w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold">{title || "Login Required"}</CardTitle>
                    <CardDescription className="text-center">
                        {description || `Please log in to access ${feature || "this feature"}.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Create an account or sign in to save your audio files, view your history, and access your profile.
                    </p>
                    <Button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Log In / Sign Up
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}