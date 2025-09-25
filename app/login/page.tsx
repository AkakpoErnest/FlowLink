'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useConnect } from 'wagmi'
import { useAuthStore } from '@/lib/auth'
import { Wallet, Shield, ArrowRight, Mail, Lock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  
  const { login, signup, isLoading, connectWallet } = useAuthStore()
  const { address, isConnected } = useAccount()

  // Handle wallet connection
  const handleWalletConnect = () => {
    if (isConnected && address) {
      connectWallet(address)
      toast({
        title: "Wallet Connected!",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
      router.push('/dashboard')
    } else {
      toast({
        title: "Connect Your Wallet",
        description: "Please connect your wallet first using the Connect Wallet button above",
        variant: "destructive"
      })
    }
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
              <div className="w-20 h-20 rounded-2xl shadow-2xl border-2 border-emerald-500/20 bg-white/10 backdrop-blur-sm flex items-center justify-center p-3">
                <img 
                  src="/flowlink-logo-new.png" 
                  alt="FlowLink Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              FlowLink
            </h1>
            <p className="text-muted-foreground mt-2">Crypto Payments You Can Trust</p>
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
              <Card className="border-emerald-500/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Connect Wallet</CardTitle>
                  <CardDescription>
                    Connect your crypto wallet to access FlowLink
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <ConnectButton />
                  </div>
                  
                  {isConnected ? (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-emerald-800 font-medium">✅ Wallet Connected!</p>
                        <p className="text-sm text-emerald-600">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                      </div>
                      <Button 
                        onClick={handleWalletConnect}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Continue to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 font-medium">🔗 Click "Connect Wallet" above</p>
                      <p className="text-sm text-blue-600">
                        Then click "Continue to Dashboard" to proceed
                      </p>
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more
                  </div>
                </CardContent>
              </Card>
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
