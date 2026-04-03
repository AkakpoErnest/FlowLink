"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard, Shield, Users, Menu, Bell,
  LogOut, Bot, Layers, Home, Wallet, X, Link2,
  Settings, Newspaper, HelpCircle, ChevronUp
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { AIInvoiceModule } from "@/components/ai-invoice-module"
import { HashKeyModule } from "@/components/hashkey-module"
import { WalletSetupModal } from "@/components/wallet-setup-modal"
import { WalletOnboardingModal } from "@/components/wallet-onboarding-modal"
import { useSession, signOut } from "next-auth/react"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"

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

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [walletSetupOpen, setWalletSetupOpen] = useState(false)
  const [walletOnboardingOpen, setWalletOnboardingOpen] = useState(false)
  // Guard so the onboarding modal only auto-fires once per page load
  const [onboardingShown, setOnboardingShown] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const { isConnected } = useAccount()
  const searchParams = useSearchParams()
  const router = useRouter()

  // @ts-ignore
  const sessionWalletTop = session?.user?.walletAddress as string | null | undefined

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

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
          <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col">
            <nav className="p-4 space-y-4 flex-1">
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

            {/* Profile section at bottom of sidebar */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                </div>
                <ChevronUp className={cn("w-4 h-4 text-slate-400 transition-transform", profileOpen ? "rotate-180" : "")} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50">
                  {/* User info header */}
                  <div className="px-4 py-5 flex flex-col items-center border-b border-slate-100">
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xl mb-3">
                      {initials}
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{session?.user?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{session?.user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </Link>
                    <Link
                      href="https://docs.hashkeychain.net"
                      target="_blank"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Newspaper className="w-4 h-4 text-slate-400" />
                      Product &amp; News
                    </Link>
                    <Link
                      href="https://docs.hashkeychain.net/docs/Build-on-HashKey-Chain/Tools/Faucet"
                      target="_blank"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      FAQ
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
