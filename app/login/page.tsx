"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAccount, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shield, Wallet, ArrowRight, Chrome, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { address, isConnected, chain } = useAccount()
  const { signMessageAsync } = useSignMessage()

  // Redirect already-authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard")
    }
  }, [status, router])

  const [googleLoading, setGoogleLoading] = useState(false)
  const [walletLoading, setWalletLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  // Email/password form state
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "register") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        return
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters")
        return
      }

      setEmailLoading(true)
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || "Registration failed")
          return
        }

        toast.success("Account created! Signing you in...")
        // Auto sign in after registration
        const result = await signIn("email-password", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard?setup=wallet",
        })
        if (result?.ok) {
          router.push("/dashboard?setup=wallet")
        } else {
          toast.error("Sign-in after registration failed")
        }
      } finally {
        setEmailLoading(false)
      }
    } else {
      setEmailLoading(true)
      try {
        const result = await signIn("email-password", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        })
        if (result?.ok) {
          router.push("/dashboard")
        } else {
          toast.error("Invalid email or password")
        }
      } finally {
        setEmailLoading(false)
      }
    }
  }

  const handleWalletSignIn = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet first")
      return
    }

    try {
      setWalletLoading(true)

      const nonceRes = await fetch("/api/auth/nonce")
      const { nonce } = await nonceRes.json()

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to FlowLink",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id ?? 133,
        nonce,
      })

      const signature = await signMessageAsync({ message: message.prepareMessage() })

      const result = await signIn("siwe", {
        message: JSON.stringify(message),
        signature,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.ok) {
        router.push("/dashboard")
      } else {
        toast.error("Wallet sign-in failed")
      }
    } catch (err: any) {
      if (err?.code === 4001) {
        toast.error("Signature rejected")
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setWalletLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/50 to-emerald-900/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img src="/hero-bg.jpeg" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute -inset-4 w-28 h-28 rounded-full border-2 border-emerald-500/30 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full transform -translate-x-1/2" />
                </div>
                <div className="w-20 h-20 rounded-2xl shadow-2xl border-2 border-emerald-500/20 bg-gradient-to-br from-slate-900/80 via-emerald-950/60 to-slate-800/80 backdrop-blur-xl flex items-center justify-center p-3 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                  <img src="/flowlink-logo-new.png" alt="FlowLink Logo" className="w-full h-full object-contain relative z-10" />
                </div>
                <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl blur-2xl -z-10" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              FlowLink
            </h1>
            <p className="text-muted-foreground mt-2">Crypto Payments You Can Trust</p>
          </div>

          {/* Auth Options */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>

            {/* Email / Password Tab */}
            <TabsContent value="email">
              <Card className="border-emerald-500/20 shadow-2xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">
                    {mode === "login" ? "Welcome back" : "Create account"}
                  </CardTitle>
                  <CardDescription>
                    {mode === "login"
                      ? "Sign in with your email and password"
                      : "Register to get started with FlowLink"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    {mode === "register" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    {mode === "register" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={emailLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      size="lg"
                    >
                      {emailLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="mr-2 h-4 w-4" />
                      )}
                      {emailLoading
                        ? mode === "register" ? "Creating account..." : "Signing in..."
                        : mode === "register" ? "Create Account" : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {mode === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => { setMode("register"); setPassword(""); setConfirmPassword("") }}
                          className="text-emerald-400 hover:underline"
                        >
                          Register
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => { setMode("login"); setPassword(""); setConfirmPassword("") }}
                          className="text-emerald-400 hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Google Tab */}
            <TabsContent value="google">
              <Card className="border-emerald-500/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Welcome</CardTitle>
                  <CardDescription>
                    Sign in with your Google account to access FlowLink
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium"
                    size="lg"
                  >
                    {googleLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Chrome className="mr-2 h-4 w-4" />
                    )}
                    {googleLoading ? "Redirecting..." : "Continue with Google"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    A new account is created automatically on first sign-in.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <Card className="border-emerald-500/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Connect Wallet</CardTitle>
                  <CardDescription>
                    Sign in with your wallet — no email required
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <ConnectButton
                      label="Connect Wallet"
                      accountStatus="address"
                      showBalance={false}
                    />
                  </div>

                  {isConnected && address && (
                    <Button
                      onClick={handleWalletSignIn}
                      disabled={walletLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      size="lg"
                    >
                      {walletLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wallet className="mr-2 h-4 w-4" />
                      )}
                      {walletLoading ? "Signing..." : "Sign in with Wallet"}
                      {!walletLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    You'll be asked to sign a message to verify ownership. No gas required.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-4">
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
