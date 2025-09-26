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
import { SimpleAIChat } from '@/components/ai/simple-ai-chat'
import { useAuthStore } from '@/lib/auth'
import { Bot, Sparkles, MessageCircle, HelpCircle } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

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

      {/* Floating AI Assistant for Navigation Help */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="group relative">
          {/* Main AI Button */}
          <Button 
            size="lg" 
            onClick={() => setIsAIChatOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110 relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-500/20 rounded-full animate-pulse"></div>
            
            {/* Main AI Icon */}
            <Bot className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Sparkle animations */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse delay-1000"></div>
          </Button>
          
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 to-green-600/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-600/20 animate-pulse delay-1000"></div>
          
          {/* Floating particles around the button */}
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-500"></div>
          <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-green-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-1/2 -left-4 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping delay-1000"></div>
          
          {/* Navigation Help Tooltip */}
          <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-gradient-to-r from-slate-900/95 to-emerald-950/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/20 backdrop-blur-xl max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <div className="text-sm font-semibold">Navigation Assistant</div>
              </div>
              <div className="text-xs text-emerald-300 mb-2">
                Click to chat with FlowLink AI!
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-3 w-3 text-emerald-400" />
                  <span>Create payment links</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-3 w-3 text-emerald-400" />
                  <span>Set up compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="h-3 w-3 text-emerald-400" />
                  <span>Manage payroll</span>
                </div>
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/95"></div>
            </div>
          </div>
        </div>
      </div>

            {/* AI Chat Modal */}
            <SimpleAIChat 
              isOpen={isAIChatOpen} 
              onClose={() => setIsAIChatOpen(false)} 
            />
    </ThemeProvider>
  )
}
