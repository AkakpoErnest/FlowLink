"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Shield, Users, Bell,
  LogOut, Layers, Wallet, X, Link2,
  LayoutDashboard, FileText, Send, Settings, Camera, Loader2
} from "lucide-react"
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
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <Wallet className="h-4 w-4 text-amber-400 shrink-0" />
      <p className="flex-1 text-sm text-amber-300">
        No wallet linked. Set one up to send and receive payments.
      </p>
      <Button
        size="sm"
        onClick={onSetup}
        className="shrink-0 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs"
        variant="outline"
      >
        Set up
      </Button>
      <button onClick={() => setDismissed(true)} className="text-amber-500/60 hover:text-amber-400 shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function ProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session, update } = useSession()
  const { address, isConnected } = useAccount()
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [msg, setMsg] = useState("")
  const [editName, setEditName] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // @ts-ignore
  const sessionWallet = session?.user?.walletAddress as string | null | undefined
  const currentAvatar = avatarPreview ?? session?.user?.image ?? null
  const currentName = session?.user?.name ?? ""

  useEffect(() => {
    if (open) {
      setEditName(session?.user?.name ?? "")
      setAvatarPreview(null)
      setMsg("")
    }
  }, [open, session?.user?.name])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { setMsg("Please select an image file."); return }
    if (file.size > 750_000) { setMsg("Image must be under 750KB."); return }
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    setSaving(true)
    setMsg("")
    try {
      if (avatarPreview) {
        setUploadingAvatar(true)
        const avatarRes = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: avatarPreview }),
        })
        const avatarData = await avatarRes.json()
        setUploadingAvatar(false)
        if (!avatarData.success) { setMsg(avatarData.error ?? "Failed to upload avatar."); return }
        await update({ picture: avatarPreview })
      }
      if (editName !== currentName) {
        const res = await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editName }),
        })
        const data = await res.json()
        if (!data.success) { setMsg(data.error ?? "Failed to save name."); return }
        await update({ name: editName })
      }
      setMsg("Profile updated!")
      setAvatarPreview(null)
    } catch {
      setMsg("Something went wrong.")
    } finally {
      setSaving(false)
      setUploadingAvatar(false)
    }
  }

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

  const initials = currentName
    ? currentName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FL"

  const isDirty = avatarPreview !== null || editName !== currentName

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-[#0f172a] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-1">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-900/50 flex items-center justify-center border-2 border-white/10 shadow-sm">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-400 font-bold text-2xl">{initials}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Change photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Display Name</Label>
            <Input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Your name"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Email <span className="text-slate-600">(read-only)</span></Label>
            <Input value={session?.user?.email ?? "—"} readOnly className="bg-white/5 border-white/10 text-slate-400" />
          </div>

          {/* Save button */}
          {isDirty && (
            <Button
              onClick={saveProfile}
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{uploadingAvatar ? "Uploading…" : "Saving…"}</> : "Save Changes"}
            </Button>
          )}

          {/* Wallet */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Linked wallet</Label>
              <Input
                value={sessionWallet ?? "No wallet linked"}
                readOnly
                className="bg-white/5 border-white/10 font-mono text-xs text-slate-300"
              />
            </div>

            {/* @ts-ignore */}
            {(session?.user as any)?.walletType === "managed" && sessionWallet && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                FlowLink managed — signs automatically, no reconnect needed
              </p>
            )}

            {(session?.user as any)?.walletType !== "managed" && !isConnected && sessionWallet && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">External wallet — reconnect MetaMask for on-chain actions</Label>
                <div className="flex justify-center pt-1">
                  <ConnectButton label="Reconnect Wallet" accountStatus="address" showBalance={false} />
                </div>
              </div>
            )}

            {!sessionWallet && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">No wallet linked yet</Label>
                <div className="flex justify-center pt-1">
                  <ConnectButton label="Connect Wallet" accountStatus="address" showBalance={false} />
                </div>
              </div>
            )}

            {isConnected && address && address.toLowerCase() !== sessionWallet?.toLowerCase() && (session?.user as any)?.walletType !== "managed" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Connected:{" "}
                  <span className="font-mono text-slate-300">{address.slice(0, 8)}…{address.slice(-6)}</span>
                </p>
                <Button size="sm" onClick={linkWallet} disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                  <Wallet className="h-3.5 w-3.5 mr-1.5" />
                  {saving ? "Linking…" : "Link this wallet"}
                </Button>
              </div>
            )}
          </div>

          {msg && (
            <p className={`text-xs ${msg.includes("!") ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>
          )}
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
  const email = session?.user?.email ?? ""
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FL"

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Fixed sidebar */}
      <aside className="w-64 bg-[#0a1628] border-r border-white/[0.06] flex flex-col h-screen fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/30 ring-1 ring-white/10">
              <img src="/ai-assistant-icon.png" alt="FlowLink" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-white">Flow</span><span className="text-emerald-400">Link</span>
            </span>
          </div>
        </div>

        {/* Primary action */}
        <div className="p-4">
          <button
            onClick={() => setActiveTab("payment-links")}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-900/30"
          >
            <Send className="w-4 h-4" />
            Send Payment
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-2">
          {navigation.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 pl-[10px]"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-emerald-400" : "text-slate-500")} strokeWidth={1.5} />
                {item.name}
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-xs rounded-md px-1.5 py-0.5 font-medium",
                    isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.06] text-slate-500"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex-1 flex items-center gap-3 hover:bg-white/[0.04] rounded-xl p-2 transition-colors text-left cursor-pointer min-w-0"
              title="Edit profile"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 font-semibold text-sm shrink-0 overflow-hidden ring-1 ring-white/10">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate leading-tight">{session?.user?.name ?? "User"}</p>
                <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{email}</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-colors shrink-0"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Slim topbar */}
        <header className="h-14 bg-[#0f172a] border-b border-white/[0.06] flex items-center justify-end px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] h-8 w-8 p-0 relative">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 font-semibold text-sm ring-1 ring-white/10 overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <span className="text-sm font-medium text-slate-300 hidden md:block">{session?.user?.name}</span>
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
