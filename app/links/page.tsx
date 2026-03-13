'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateLinkForm } from '@/components/create-link-form'
import { PaymentLinksTable } from '@/components/payment-links-table'
import { Plus, Link2, QrCode, Eye, Copy, ExternalLink, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function PaymentLinksPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)

  // Mock user data for build
  const user = { name: 'User', email: 'user@example.com' }
  const isAuthenticated = true
  const isConnected = false

  useState(() => {
    setMounted(true)
  })

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Links',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Link2,
    },
    {
      title: 'Active Links',
      value: '18',
      change: '+8%',
      changeType: 'positive' as const,
      icon: QrCode,
    },
    {
      title: 'Total Volume',
      value: '$12,450',
      change: '+23%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ]

  const recentLinks = [
    {
      id: '1',
      title: 'Web3 Conference Ticket',
      amount: '$150.00',
      currency: 'USDC',
      status: 'active',
      clicks: 45,
      payments: 12,
      createdAt: '2024-01-15',
      url: 'https://flowlink.app/l/abc123',
    },
    {
      id: '2',
      title: 'NFT Collection Drop',
      amount: '0.5 ETH',
      currency: 'ETH',
      status: 'completed',
      clicks: 89,
      payments: 67,
      createdAt: '2024-01-14',
      url: 'https://flowlink.app/l/def456',
    },
    {
      id: '3',
      title: 'DeFi Protocol Fee',
      amount: '$25.00',
      currency: 'USDC',
      status: 'active',
      clicks: 23,
      payments: 8,
      createdAt: '2024-01-13',
      url: 'https://flowlink.app/l/ghi789',
    },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Payment Links</h1>
          <p className="text-slate-300">
            Create and manage crypto payment links for your business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <stat.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-emerald-600">
              Create Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your payment links efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setActiveTab('create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Link
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Copy className="h-4 w-4 mr-2" />
                    Bulk Import
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Links */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Recent Payment Links</CardTitle>
                <CardDescription className="text-slate-400">
                  Your latest payment link activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{link.title}</h3>
                          <Badge 
                            variant={link.status === 'active' ? 'default' : 'secondary'}
                            className={link.status === 'active' ? 'bg-emerald-600' : 'bg-slate-600'}
                          >
                            {link.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <span className="font-medium text-white">{link.amount} {link.currency}</span>
                          <span>{link.clicks} clicks</span>
                          <span>{link.payments} payments</span>
                          <span>{link.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <CreateLinkForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}