'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from '@/lib/auth'
import { Wallet, Shield, ArrowRight, Mail, Lock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WalletConnect } from "@/components/wallet-connect"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  
  const { login, signup, isLoading } = useAuthStore()

  // Handle wallet connection
  const handleWalletConnect = () => {
    toast({
      title: "Wallet Connect",
      description: "Wallet connection will be available soon!",
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const success = await login(email, password)
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      })
      router.push('/dashboard')
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive"
      })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !name || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      })
      return
    }

    const success = await signup(email, password, name)
    if (success) {
      toast({
        title: "Account created!",
        description: "Welcome to FlowLink",
      })
      router.push('/dashboard')
    } else {
      toast({
        title: "Signup failed",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/50 to-emerald-900/30 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/hero-bg.jpeg" 
          alt="FlowLink Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                {/* Outer rotating ring */}
                <div className="absolute -inset-4 w-28 h-28 rounded-full border-2 border-emerald-500/30 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                {/* Main logo container */}
                <div className="w-20 h-20 rounded-2xl shadow-2xl border-2 border-emerald-500/20 bg-gradient-to-br from-slate-900/80 via-emerald-950/60 to-slate-800/80 backdrop-blur-xl flex items-center justify-center p-3 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]"></div>
                  <img 
                    src="/flowlink-logo-new.png" 
                    alt="FlowLink Logo" 
                    className="w-full h-full object-contain relative z-10 group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
                
                {/* Glow effects */}
                <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500"></div>
                <div className="absolute -inset-8 bg-gradient-to-r from-emerald-400/5 via-green-400/5 to-teal-400/5 rounded-2xl blur-3xl -z-20"></div>
                
                {/* Floating particles around the logo */}
                <div className="absolute -top-2 -left-2 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-500"></div>
                <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-green-400 rounded-full animate-ping delay-700"></div>
                <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping delay-1000"></div>
              </div>
            </div>
            
            {/* Animated title */}
            <div className="relative">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-emerald-500 transition-all duration-300">
                FlowLink
              </h1>
              {/* Text glow effect */}
              <div className="absolute inset-0 text-3xl font-bold text-emerald-500/20 blur-sm -z-10">
                FlowLink
              </div>
            </div>
            
            <p className="text-muted-foreground mt-2 animate-pulse">Crypto Payments You Can Trust</p>
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="border-emerald-500/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to access your FlowLink dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="login-password" 
                          type="password" 
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 border-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <Card className="border-emerald-500/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>
                    Join FlowLink and start creating payment links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-name" 
                          type="text" 
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 border-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 border-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 border-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <WalletConnect variant="card" />
            </TabsContent>
          </Tabs>

          {/* Security Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span>Multi-chain Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
