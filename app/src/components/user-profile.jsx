"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Settings, Crown } from "lucide-react"

export function UserProfile({ user }) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-2xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Crown className="w-3 h-3 mr-1" />
              Premium User
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">47</p>
                <p className="text-xs text-muted-foreground">Audio Generated</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">12.5k</p>
                <p className="text-xs text-muted-foreground">Characters Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Update your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email Address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-medium">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-xs text-muted-foreground">January 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email Verified</p>
                    <p className="text-xs text-green-500">Verified ✓</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                Save Changes
              </Button>
              <Button variant="outline" className="border-border hover:bg-accent/10 bg-transparent">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
