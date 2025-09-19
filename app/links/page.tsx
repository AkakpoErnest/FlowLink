'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateLinkForm } from '@/components/create-link-form'
import { PaymentLinksTable } from '@/components/payment-links-table'
import { Plus, Link2, QrCode, Eye, Copy, ExternalLink, DollarSign, Users, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { useAccount } from 'wagmi'

export default function PaymentLinksPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, isAuthenticated } = useAuthStore()
  const { address, isConnected } = useAccount()

  // Mock data for demonstration
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450.00",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Active Links",
      value: "23",
      change: "+3 new",
      icon: Link2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Payments",
      value: "156",
      change: "+12 this week",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Success Rate",
      value: "98.7%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentLinks = [
    {
      id: "1",
      title: "Webinar Registration",
      amount: "$50.00",
      token: "USDC",
      status: "active",
      payments: 12,
      createdAt: "2 hours ago",
      link: "flowlink.com/pay/web123",
    },
    {
      id: "2", 
      title: "Premium Subscription",
      amount: "$99.00",
      token: "ETH",
      status: "active",
      payments: 8,
      createdAt: "5 hours ago",
      link: "flowlink.com/pay/sub456",
    },
    {
      id: "3",
      title: "Event Ticket",
      amount: "$25.00",
      token: "USDT",
      status: "completed",
      payments: 45,
      createdAt: "1 day ago",
      link: "flowlink.com/pay/event789",
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to access your payment links</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/50 to-emerald-900/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Payment Links
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your crypto payment links with built-in compliance
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <Badge variant="outline" className="border-emerald-500/30">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Wallet Connected
              </Badge>
            )}
            <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Link
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 font-medium">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create">Create Link</TabsTrigger>
            <TabsTrigger value="manage">Manage Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Links */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payment Links</CardTitle>
                <CardDescription>Your latest payment links and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-emerald-100">
                          <Link2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{link.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {link.amount} {link.token} • {link.payments} payments • {link.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                          {link.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('create')}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>Create New Link</CardTitle>
                  <CardDescription>Start accepting crypto payments instantly</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>QR Code Generator</CardTitle>
                  <CardDescription>Generate QR codes for your links</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>View Analytics</CardTitle>
                  <CardDescription>Track your payment performance</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Create Link Tab */}
          <TabsContent value="create">
            <CreateLinkForm />
          </TabsContent>

          {/* Manage Links Tab */}
          <TabsContent value="manage">
            <PaymentLinksTable />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>Detailed insights into your payment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon...</p>
                  <p className="text-sm">Track revenue, conversion rates, and more</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}