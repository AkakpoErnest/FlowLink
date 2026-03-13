"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard, Shield, TrendingUp, Users, Menu, Bell, Settings,
  LogOut, ChevronDown, Bot, Layers, FileText, Home
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { RWASubscriptionsModule } from "@/components/rwa-subscriptions-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { AIInvoiceModule } from "@/components/ai-invoice-module"
import { HashKeyModule } from "@/components/hashkey-module"
import { useAuthStore } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { id: "overview", name: "Overview", icon: Home, group: "main" },
  { id: "payment-links", name: "Payment Links", icon: CreditCard, group: "payments" },
  { id: "ai-invoices", name: "AI Invoices", icon: Bot, group: "payments", badge: "New" },
  { id: "payroll-rails", name: "Payroll Rails", icon: Users, group: "payments" },
  { id: "compliance-vaults", name: "Compliance Vaults", icon: Shield, group: "compliance" },
  { id: "rwa-subscriptions", name: "RWA Subscriptions", icon: TrendingUp, group: "compliance" },
  { id: "hashkey-chain", name: "HashKey Chain", icon: Layers, group: "networks", badge: "HSK" },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "payment-links": return <PaymentLinksModule />
      case "compliance-vaults": return <ComplianceVaultsModule />
      case "rwa-subscriptions": return <RWASubscriptionsModule />
      case "payroll-rails": return <PayrollRailsModule />
      case "ai-invoices": return <AIInvoiceModule />
      case "hashkey-chain": return <HashKeyModule />
      default: return children
    }
  }

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "FL"

  const groups = [
    { label: "Dashboard", ids: ["overview"] },
    { label: "Payments", ids: ["payment-links", "ai-invoices", "payroll-rails"] },
    { label: "Compliance", ids: ["compliance-vaults", "rwa-subscriptions"] },
    { label: "Networks", ids: ["hashkey-chain"] },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1">
                <img src="/flowlink-logo-new.png" alt="FlowLink" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">FlowLink</h1>
                <p className="text-xs text-slate-500">Compliant Payment Infrastructure</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* HashKey Chain indicator */}
            <button
              onClick={() => setActiveTab("hashkey-chain")}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full hover:bg-blue-500/20 transition-all"
            >
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-xs font-medium">HashKey Chain</span>
            </button>
            <Badge className="hidden md:flex bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              Compliant
            </Badge>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-sm font-medium text-emerald-400">{initials}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-slate-900/50 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
            <nav className="p-4 space-y-2">
              {groups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  {navigation
                    .filter((item) => group.ids.includes(item.id))
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeTab === item.id
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
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
        <main className={`flex-1 p-6 ${sidebarOpen ? "" : "ml-0"}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
