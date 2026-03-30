"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAccount, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shield, Wallet, ArrowRight, Chrome, Loader2, Mail, Link2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { address, isConnected, chain } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [googleLoading, setGoogleLoading] = useState(false)
  const [walletLoading, setWalletLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center p-2.5">
              <Link2 className="w-full h-full text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-slate-900">Flow</span><span className="text-blue-600">Link</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Compliant crypto payments on HashKey Chain</p>
        </div>

        {/* Auth Options */}
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="email" className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Email</TabsTrigger>
            <TabsTrigger value="google" className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Google</TabsTrigger>
            <TabsTrigger value="wallet" className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Wallet</TabsTrigger>
          </TabsList>

          {/* Email / Password Tab */}
          <TabsContent value="email">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl text-slate-900">
                  {mode === "login" ? "Welcome back" : "Create account"}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {mode === "login"
                    ? "Sign in with your email and password"
                    : "Register to get started with FlowLink"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {mode === "register" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-slate-700">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {mode === "register" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

                <div className="mt-4 text-center text-sm text-slate-500">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("register"); setPassword(""); setConfirmPassword("") }}
                        className="text-blue-600 hover:underline"
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
                        className="text-blue-600 hover:underline"
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
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-900">Welcome</CardTitle>
                <CardDescription className="text-slate-500">
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

                <p className="text-xs text-center text-slate-500">
                  A new account is created automatically on first sign-in.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-900">Connect Wallet</CardTitle>
                <CardDescription className="text-slate-500">
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

                <p className="text-xs text-center text-slate-500">
                  You'll be asked to sign a message to verify ownership. No gas required.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>KYC / AML screening</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Wallet className="h-4 w-4 text-blue-600" />
            <span>HashKey Chain</span>
          </div>
        </div>
      </div>
    </div>
  )
}
