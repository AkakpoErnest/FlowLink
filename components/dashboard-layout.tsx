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
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-300 hover:text-white">
                  <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>
                  <span className="hidden md:block text-sm">{user?.name || "Account"}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                  <Settings className="h-4 w-4 mr-2 text-slate-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-60" : "w-0"} transition-all duration-300 overflow-hidden border-r border-slate-800 bg-slate-900/50 flex-shrink-0`}
        >
          <nav className="p-3 space-y-1 h-full overflow-y-auto">
            {groups.map(group => {
              const groupItems = navigation.filter(n => group.ids.includes(n.id))
              return (
                <div key={group.label} className="mb-3">
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-1">{group.label}</p>
                  {groupItems.map(item => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-9 px-3 mb-0.5 ${
                          isActive
                            ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <Badge className={`text-xs px-1.5 py-0 h-4 ${
                            item.badge === "New"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          }`}>
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
