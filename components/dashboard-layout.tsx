"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard, Shield, Users, Menu, Bell,
  LogOut, Bot, Layers, Home, Wallet, X, Link2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { AIInvoiceModule } from "@/components/ai-invoice-module"
import { HashKeyModule } from "@/components/hashkey-module"
import { WalletSetupModal } from "@/components/wallet-setup-modal"
import { WalletOnboardingModal } from "@/components/wallet-onboarding-modal"
import { useSession, signOut } from "next-auth/react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { id: "overview", name: "Overview", icon: Home, group: "main" },
  { id: "payment-links", name: "Payment Links", icon: CreditCard, group: "payments" },
  { id: "ai-invoices", name: "AI Invoices", icon: Bot, group: "payments", badge: "New" },
  { id: "payroll-rails", name: "Payroll Rails", icon: Users, group: "payments" },
  { id: "compliance-vaults", name: "Compliance Vaults", icon: Shield, group: "compliance" },
  { id: "hashkey-chain", name: "HashKey Chain", icon: Layers, group: "networks", badge: "HSK" },
]

function WalletBanner({ onSetup }: { onSetup: () => void }) {
  const { data: session } = useSession()
  const [dismissed, setDismissed] = useState(false)

  // @ts-ignore
  const sessionWallet = session?.user?.walletAddress as string | null | undefined

  if (sessionWallet || dismissed) return null

  return (
    <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <Wallet className="h-4 w-4 text-amber-600 shrink-0" />
      <p className="flex-1 text-sm text-amber-800">
        No wallet linked. Set one up to send and receive payments.
      </p>
      <Button
        size="sm"
        onClick={onSetup}
        className="shrink-0 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 text-xs"
        variant="outline"
      >
        Set up wallet
      </Button>
      <button onClick={() => setDismissed(true)} className="text-amber-500 hover:text-amber-700 shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function ProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session, update } = useSession()
  const { address, isConnected } = useAccount()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  // @ts-ignore
  const sessionWallet = session?.user?.walletAddress as string | null | undefined

  const linkWallet = async () => {
    if (!address) return
    setSaving(true)
    setMsg("")
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })
      const data = await res.json()
      if (data.success) {
        // Use the canonical (lowercased) address the server stored in the DB
        await update({ walletAddress: data.data?.walletAddress ?? address.toLowerCase() })
        setMsg("Wallet linked successfully.")
      } else {
        setMsg(data.error ?? "Failed to link wallet.")
      }
    } catch {
      setMsg("Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile &amp; Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Name</Label>
            <Input value={session?.user?.name ?? ""} readOnly className="bg-slate-50 border-slate-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Email</Label>
            <Input value={session?.user?.email ?? "—"} readOnly className="bg-slate-50 border-slate-200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Linked wallet</Label>
            <Input
              value={sessionWallet ?? "No wallet linked"}
              readOnly
              className="bg-slate-800 font-mono text-xs"
            />
          </div>

          {/* Connect via RainbowKit if not yet connected */}
          {!isConnected && !sessionWallet && (
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Connect a wallet to link it</Label>
              <div className="flex justify-center pt-1">
                <ConnectButton
                  label="Connect Wallet"
                  accountStatus="address"
                  showBalance={false}
                />
              </div>
            </div>
          )}

          {/* Show link button when RainbowKit wallet differs from linked wallet */}
          {isConnected && address && address.toLowerCase() !== sessionWallet?.toLowerCase() && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Connected wallet:{" "}
                <span className="font-mono text-slate-300">
                  {address.slice(0, 8)}…{address.slice(-6)}
                </span>
              </p>
              <Button
                size="sm"
                onClick={linkWallet}
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Wallet className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Linking…" : "Link this wallet to account"}
              </Button>
            </div>
          )}
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [walletSetupOpen, setWalletSetupOpen] = useState(false)
  const [walletOnboardingOpen, setWalletOnboardingOpen] = useState(false)
  // Guard so the onboarding modal only auto-fires once per page load
  const [onboardingShown, setOnboardingShown] = useState(false)
  const { data: session } = useSession()
  const { isConnected } = useAccount()
  const searchParams = useSearchParams()
  const router = useRouter()

  // @ts-ignore
  const sessionWalletTop = session?.user?.walletAddress as string | null | undefined

  // Auto-show the onboarding modal for first-time users:
  // trigger when the session is loaded, the user has no linked wallet,
  // and they have not connected a wallet via RainbowKit yet.
  useEffect(() => {
    if (
      !onboardingShown &&
      session?.user &&
      !sessionWalletTop &&
      !isConnected
    ) {
      setOnboardingShown(true)
      setWalletOnboardingOpen(true)
    }
  }, [session, sessionWalletTop, isConnected, onboardingShown])

  useEffect(() => {
    if (searchParams.get("setup") === "wallet") {
      setWalletSetupOpen(true)
      router.replace("/dashboard")
    }
  }, [searchParams, router])

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  const renderContent = () => {
    switch (activeTab) {
      case "payment-links": return <PaymentLinksModule />
      case "compliance-vaults": return <ComplianceVaultsModule />
      case "payroll-rails": return <PayrollRailsModule />
      case "ai-invoices": return <AIInvoiceModule />
      case "hashkey-chain": return <HashKeyModule />
      default: return children
    }
  }

  const name = session?.user?.name ?? ""
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FL"

  const groups = [
    { label: "Dashboard", ids: ["overview"] },
    { label: "Payments", ids: ["payment-links", "ai-invoices", "payroll-rails"] },
    { label: "Compliance", ids: ["compliance-vaults"] },
    { label: "Networks", ids: ["hashkey-chain"] },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center p-1.5">
                <Link2 className="w-full h-full text-white" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-tight">
                  <span className="text-slate-900">Flow</span><span className="text-emerald-600">Link</span>
                </h1>
                <p className="text-[11px] text-slate-500 leading-none mt-0.5">Compliant Payment Infrastructure</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* HashKey Chain indicator */}
            <button
              onClick={() => setActiveTab("hashkey-chain")}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-all"
            >
              <div className="h-2 w-2 bg-emerald-600 rounded-full animate-pulse" />
              <span className="text-emerald-600 text-xs font-medium">HashKey Chain</span>
            </button>
            <Badge className="hidden md:flex bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium">
              Compliant
            </Badge>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                    <span className="text-sm font-semibold text-emerald-600">{initials}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Profile & Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
      <WalletSetupModal open={walletSetupOpen} onClose={() => setWalletSetupOpen(false)} />
      <WalletOnboardingModal
        open={walletOnboardingOpen}
        onClose={() => setWalletOnboardingOpen(false)}
      />

      {/* Wallet setup banner — shown to users without a linked wallet */}
      <WalletBanner onSetup={() => setWalletSetupOpen(true)} />

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
            <nav className="p-4 space-y-4">
              {groups.map((group) => (
                <div key={group.label} className="space-y-0.5">
                  <h3 className="px-3 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    {group.label}
                  </h3>
                  {navigation
                    .filter((item) => group.ids.includes(item.id))
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                          activeTab === item.id
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold px-1.5 py-0">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                </div>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 bg-slate-50">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
