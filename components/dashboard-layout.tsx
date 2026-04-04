"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Shield, Users, Bell,
  LogOut, Layers, Wallet, X, Link2,
  LayoutDashboard, FileText, Send, Settings
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
import { SettingsModule } from "@/components/settings-module"
import { WalletSetupModal } from "@/components/wallet-setup-modal"
import { WalletOnboardingModal } from "@/components/wallet-onboarding-modal"
import { useSession, signOut } from "next-auth/react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { id: "overview", name: "Dashboard", icon: LayoutDashboard },
  { id: "payment-links", name: "Payment Links", icon: Link2 },
  { id: "ai-invoices", name: "Invoicing", icon: FileText, badge: "AI" },
  { id: "payroll-rails", name: "Payroll", icon: Users },
  { id: "compliance-vaults", name: "Vaults", icon: Shield },
  { id: "hashkey-chain", name: "HashKey Chain", icon: Layers, badge: "HSK" },
  { id: "settings", name: "Settings", icon: Settings },
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
              className="bg-slate-50 font-mono text-xs"
            />
          </div>

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
  const [profileOpen, setProfileOpen] = useState(false)
  const [walletSetupOpen, setWalletSetupOpen] = useState(false)
  const [walletOnboardingOpen, setWalletOnboardingOpen] = useState(false)
  const [onboardingShown, setOnboardingShown] = useState(false)
  const { data: session } = useSession()
  const { isConnected } = useAccount()
  const searchParams = useSearchParams()
  const router = useRouter()

  // @ts-ignore
  const sessionWalletTop = session?.user?.walletAddress as string | null | undefined

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
      case "settings": return <SettingsModule />
      default: return children
    }
  }

  const name = session?.user?.name ?? ""
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FL"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-[15px]">
              Flow<span className="text-emerald-600">Link</span>
            </span>
          </div>
        </div>

        {/* Primary action */}
        <div className="p-4">
          <button
            onClick={() => setActiveTab("payment-links")}
            className="w-full bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Send Payment
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 pl-[10px]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto text-xs bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-lg p-1.5 transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="top" align="start">
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <Wallet className="mr-2 h-4 w-4" />
                <span>Profile &amp; Wallet</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Slim topbar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            onClick={() => setActiveTab("hashkey-chain")}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-all"
          >
            <div className="h-2 w-2 bg-emerald-600 rounded-full animate-pulse" />
            <span className="text-emerald-600 text-xs font-medium">HashKey Chain</span>
          </button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-900 hidden md:block">{session?.user?.name}</span>
            </div>
          </div>
        </header>

        {/* Wallet setup banner */}
        <WalletBanner onSetup={() => setWalletSetupOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
      <WalletSetupModal open={walletSetupOpen} onClose={() => setWalletSetupOpen(false)} />
      <WalletOnboardingModal
        open={walletOnboardingOpen}
        onClose={() => setWalletOnboardingOpen(false)}
      />
    </div>
  )
}
