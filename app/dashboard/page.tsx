'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { RWASubscriptionsModule } from "@/components/rwa-subscriptions-module"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuthStore } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg p-6 border border-emerald-500/20">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}!
            </h2>
            <p className="text-muted-foreground">
              {user?.isWalletConnected 
                ? `Wallet connected: ${user.walletAddress?.slice(0, 6)}...${user.walletAddress?.slice(-4)}`
                : 'Connect your wallet to start creating payment links'
              }
            </p>
          </div>

          {/* Dashboard Overview */}
          <DashboardOverview />
          
          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Links Module */}
            <PaymentLinksModule />
            
            {/* Compliance Vaults Module */}
            <ComplianceVaultsModule />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payroll Rails Module */}
            <PayrollRailsModule />
            
            {/* RWA Subscriptions Module */}
            <RWASubscriptionsModule />
          </div>
        </div>
      </DashboardLayout>

    </ThemeProvider>
  )
}
