"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription, DialogFooter,} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Volume2, AudioWaveform as Waveform } from "lucide-react"
import axios from "axios"
//import { redirect } from "next/dist/server/api-utils"
import { useRouter } from "next/navigation"
export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router=useRouter()
  const handleSubmit = async (e) => {
  
    e.preventDefault()
    setIsLoading(true)

    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("Passwords don't match!")
        setIsLoading(false)
        return
      }
      if (fullName.trim().length < 2) {
        alert("Please enter your full name")
        setIsLoading(false)
        return
      }
      try{
           const res=await axios.post('http://127.0.0.1:8000/signup',{email:email,password:password,name:fullName})
           alert(res.data.message)
           console.log(res.data)
           setShowConfirmDialog(true)
      }catch(error){
        console.error("Signup failed:", error)
      }
  



    }else{
      try{
        console.log(email,password)
        const res=await axios.post('http://127.0.0.1:8000/login',({email:email,password:password}))
        console.log('adada')
        if(res.data.access_token){
          localStorage.setItem('accessToken',res.data.access_token)
          alert('Login successful')
          router.push("/Home")
        }else{
            alert('Login failed')
        }
      }catch(error){
        console.error("Login failed:", error)
      }
    }

    // Simulate login/signup
    await new Promise((resolve) => setTimeout(resolve, 1000))

    

    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const res = await axios.get("http://127.0.0.1:8000/auth/google");
      const { auth_url } = res.data;
      if (auth_url) {
        window.location.href = auth_url; // 👈 Redirect browser
      } else {
        alert("No Google login URL returned");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    

    setIsGoogleLoading(false)
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFullName("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sinhala TTS
              </h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">
              Advanced Text-to-Speech for{" "}
              <span className="sinhala-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                සිංහල
              </span>
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Transform your Sinhala text into natural, expressive speech with our AI-powered voice synthesis
              technology.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Natural Voice</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center mx-auto">
                <Waveform className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Audio Controls</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center mx-auto">
                <Volume2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">High Quality</p>
            </div>
          </div>
        </div>

        {/* Right side - Login/Signup Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? "Create your account" : "Sign in to your account"}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Join us to start converting Sinhala text to speech"
                  : "Enter your credentials to access the TTS system"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-border bg-card hover:bg-accent/10 text-foreground"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isGoogleLoading ? "Connecting..." : `Continue with Google`}
                  </div>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-input border-border"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-input border-border"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading
                    ? isSignUp
                      ? "Creating account..."
                      : "Signing in..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm your email</DialogTitle>
      <DialogDescription>
        We’ve sent a confirmation link to <b>{email}</b>.  
        Please check your inbox and verify your email address before logging in.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button
        onClick={() => {
          setShowConfirmDialog(false)
          setIsSignUp(false)  // switch back to login form
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          setFullName("")
        }}
        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
      >
        OK
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}
