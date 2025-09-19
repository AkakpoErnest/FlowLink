"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, TrendingUp, Users, Menu, Bell, Settings, LogOut, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { RWASubscriptionsModule } from "@/components/rwa-subscriptions-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module" // Added payroll rails import

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigation = [
    { id: "overview", name: "Overview", icon: TrendingUp },
    { id: "payment-links", name: "Payment Links", icon: CreditCard },
    { id: "compliance-vaults", name: "Compliance Vaults", icon: Shield },
    { id: "rwa-subscriptions", name: "RWA Subscriptions", icon: TrendingUp },
    { id: "payroll-rails", name: "Payroll Rails", icon: Users },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "payment-links":
        return <PaymentLinksModule />
      case "compliance-vaults":
        return <ComplianceVaultsModule />
      case "rwa-subscriptions":
        return <RWASubscriptionsModule />
      case "payroll-rails": // Added payroll rails case
        return <PayrollRailsModule />
      default:
        return children
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">FlowLink</h1>
                <p className="text-xs text-muted-foreground">Compliant Payment Infrastructure</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Singapore Regulated
            </Badge>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium">AD</span>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden border-r border-border bg-sidebar/50 backdrop-blur-sm`}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
