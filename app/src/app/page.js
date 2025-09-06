"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Download, Play, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Mic className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SinhalaVoice
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transform Sinhala Text
              </span>
              <br />
              <span className="text-slate-900">into Natural Voice</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto text-pretty">
              Experience the most advanced Sinhala text-to-speech technology. Convert your text into natural, expressive
              voice with professional quality audio generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features for Everyone</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional-grade Sinhala text-to-speech with advanced customization options
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Natural Voice Quality</CardTitle>
                <CardDescription>
                  Advanced AI-powered voice synthesis that produces natural, expressive Sinhala speech
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Easy Downloads</CardTitle>
                <CardDescription>
                  Download your generated audio in high-quality formats with batch processing support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">User-Friendly Interface</CardTitle>
                <CardDescription>Intuitive design with powerful audio player and management features</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Text?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users creating professional Sinhala voice content
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Mic className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">SinhalaVoice</span>
            </div>
            <p className="text-slate-400">© 2024 SinhalaVoice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
