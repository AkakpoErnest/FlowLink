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
      // Save avatar if changed
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
      // Save name if changed
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-1">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center border-2 border-white shadow-sm">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-700 font-bold text-2xl">{initials}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
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
            <Label className="text-xs text-slate-500">Display Name</Label>
            <Input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Your name"
              className="border-slate-200"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Email <span className="text-slate-400">(read-only)</span></Label>
            <Input value={session?.user?.email ?? "—"} readOnly className="bg-slate-50 border-slate-200 text-slate-500" />
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
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Linked wallet</Label>
              <Input
                value={sessionWallet ?? "No wallet linked"}
                readOnly
                className="bg-slate-50 font-mono text-xs"
              />
            </div>

            {!isConnected && sessionWallet && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Wallet saved — reconnect for on-chain actions</Label>
                <div className="flex justify-center pt-1">
                  <ConnectButton label="Reconnect Wallet" accountStatus="address" showBalance={false} />
                </div>
              </div>
            )}

            {!isConnected && !sessionWallet && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Connect a wallet to link it</Label>
                <div className="flex justify-center pt-1">
                  <ConnectButton label="Connect Wallet" accountStatus="address" showBalance={false} />
                </div>
              </div>
            )}

            {isConnected && address && address.toLowerCase() !== sessionWallet?.toLowerCase() && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Connected:{" "}
                  <span className="font-mono text-slate-700">{address.slice(0, 8)}…{address.slice(-6)}</span>
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
            <p className={`text-xs ${msg.includes("!") ? "text-emerald-600" : "text-red-500"}`}>{msg}</p>
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
            <img src="/ai-assistant-icon.png" alt="FlowLink" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <span className="font-bold text-xl tracking-tight">
              <span className="text-slate-900">Flow</span><span className="text-emerald-600">Link</span>
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
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex-1 flex items-center gap-3 hover:bg-slate-50 rounded-lg p-1.5 transition-colors text-left cursor-pointer min-w-0"
              title="Edit profile"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0 overflow-hidden ring-2 ring-transparent hover:ring-emerald-200 transition-all">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name}</p>
                <p className="text-xs text-slate-400 truncate">Edit profile</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
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
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-end px-6 sticky top-0 z-30">
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
