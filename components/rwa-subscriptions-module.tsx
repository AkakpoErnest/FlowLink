"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrendingUp, Plus, RefreshCw, BarChart3, Calendar, DollarSign, Shield, Download, Eye } from "lucide-react"

interface RWASubscription {
  id: string
  name: string
  type: "t-bills" | "bonds" | "commodities" | "real-estate"
  amount: string
  currency: string
  apy: number
  maturity: string
  status: "active" | "pending" | "matured" | "cancelled"
  autoRollover: boolean
  nextRollover: string
  complianceScore: number
}

interface YieldProduct {
  id: string
  name: string
  type: string
  apy: number
  minInvestment: number
  maturity: string
  riskRating: "low" | "medium" | "high"
  liquidity: "high" | "medium" | "low"
  compliance: boolean
}

export function RWASubscriptionsModule() {
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<RWASubscription | null>(null)
  const [showLadderingTool, setShowLadderingTool] = useState(false)

  const subscriptions: RWASubscription[] = [
    {
      id: "rwa_001",
      name: "US Treasury Bills 3M",
      type: "t-bills",
      amount: "100,000",
      currency: "USDC",
      apy: 5.25,
      maturity: "2024-04-15",
      status: "active",
      autoRollover: true,
      nextRollover: "2024-04-15",
      complianceScore: 98,
    },
    {
      id: "rwa_002",
      name: "Singapore Government Bonds",
      type: "bonds",
      amount: "250,000",
      currency: "SGD",
      apy: 4.75,
      maturity: "2024-12-31",
      status: "active",
      autoRollover: false,
      nextRollover: "N/A",
      complianceScore: 95,
    },
    {
      id: "rwa_003",
      name: "Hong Kong Treasury Bills",
      type: "t-bills",
      amount: "75,000",
      currency: "HKD",
      apy: 4.95,
      maturity: "2024-03-20",
      status: "pending",
      autoRollover: true,
      nextRollover: "2024-03-20",
      complianceScore: 97,
    },
  ]

  const availableProducts: YieldProduct[] = [
    {
      id: "prod_001",
      name: "US Treasury Bills 1M",
      type: "T-Bills",
      apy: 5.15,
      minInvestment: 10000,
      maturity: "30 days",
      riskRating: "low",
      liquidity: "high",
      compliance: true,
    },
    {
      id: "prod_002",
      name: "US Treasury Bills 3M",
      type: "T-Bills",
      apy: 5.25,
      minInvestment: 25000,
      maturity: "90 days",
      riskRating: "low",
      liquidity: "medium",
      compliance: true,
    },
    {
      id: "prod_003",
      name: "Singapore Government Bonds",
      type: "Government Bonds",
      apy: 4.75,
      minInvestment: 50000,
      maturity: "1 year",
      riskRating: "low",
      liquidity: "medium",
      compliance: true,
    },
    {
      id: "prod_004",
      name: "Corporate Bonds AAA",
      type: "Corporate Bonds",
      apy: 6.25,
      minInvestment: 100000,
      maturity: "2 years",
      riskRating: "medium",
      liquidity: "low",
      compliance: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-card-foreground">RWA Subscriptions</h2>
          <p className="text-muted-foreground mt-1">
            Subscribe to tokenized real-world assets with automated compliance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowLadderingTool(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Yield Laddering
          </Button>
          <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Subscribe to RWA Products</DialogTitle>
                <DialogDescription>Choose from compliant tokenized real-world assets</DialogDescription>
              </DialogHeader>
              <SubscriptionForm products={availableProducts} onClose={() => setShowSubscribeDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">Total Invested</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">$425,000</p>
            <p className="text-xs text-accent flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">Avg. APY</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">5.12%</p>
            <p className="text-xs text-muted-foreground mt-1">Weighted average</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">Auto-Rollover</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">2</p>
            <p className="text-xs text-muted-foreground mt-1">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">Compliance</span>
            </div>
            <p className="text-2xl font-bold text-green-600">96.7%</p>
            <p className="text-xs text-muted-foreground mt-1">Average score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="matured">Matured</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {subscriptions
              .filter((sub) => sub.status === "active")
              .map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onSelect={setSelectedSubscription}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {subscriptions
              .filter((sub) => sub.status === "pending")
              .map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onSelect={setSelectedSubscription}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="matured" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No matured subscriptions</p>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <RWAMarketplace products={availableProducts} />
        </TabsContent>
      </Tabs>

      {/* Subscription Details Dialog */}
      {selectedSubscription && (
        <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedSubscription.name}</DialogTitle>
              <DialogDescription>Subscription details and performance metrics</DialogDescription>
            </DialogHeader>
            <SubscriptionDetails subscription={selectedSubscription} />
          </DialogContent>
        </Dialog>
      )}

      {/* Yield Laddering Tool Dialog */}
      {showLadderingTool && (
        <Dialog open={showLadderingTool} onOpenChange={setShowLadderingTool}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Yield Laddering Tool</DialogTitle>
              <DialogDescription>Optimize your portfolio with strategic maturity scheduling</DialogDescription>
            </DialogHeader>
            <YieldLadderingTool products={availableProducts} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function SubscriptionCard({
  subscription,
  onSelect,
}: { subscription: RWASubscription; onSelect: (sub: RWASubscription) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "matured":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 95) return "text-green-600"
    if (score >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card
      className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(subscription)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-card-foreground">{subscription.name}</h3>
              <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
              {subscription.autoRollover && (
                <Badge variant="outline" className="border-accent/20 text-accent">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Auto-Rollover
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium text-card-foreground">
                  {subscription.amount} {subscription.currency}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">APY</p>
                <p className="font-medium text-green-600">{subscription.apy}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Maturity</p>
                <p className="font-medium text-card-foreground">{subscription.maturity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Compliance</p>
                <p className={`font-medium ${getRiskColor(subscription.complianceScore)}`}>
                  {subscription.complianceScore}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SubscriptionForm({ products, onClose }: { products: YieldProduct[]; onClose: () => void }) {
  const [selectedProduct, setSelectedProduct] = useState<YieldProduct | null>(null)
  const [amount, setAmount] = useState("")
  const [autoRollover, setAutoRollover] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground">Available Products</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-colors ${
                  selectedProduct?.id === product.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-card-foreground">{product.name}</h4>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {product.apy}% APY
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Min: ${product.minInvestment.toLocaleString()}</span>
                    <span>Maturity: {product.maturity}</span>
                    <span className="capitalize">Risk: {product.riskRating}</span>
                    <span className="capitalize">Liquidity: {product.liquidity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground">Subscription Details</h3>
          {selectedProduct ? (
            <div className="space-y-4">
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <h4 className="font-medium text-card-foreground mb-2">{selectedProduct.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">APY</p>
                      <p className="font-medium text-green-600">{selectedProduct.apy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Maturity</p>
                      <p className="font-medium text-card-foreground">{selectedProduct.maturity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Min: ${selectedProduct.minInvestment}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Settlement Currency</Label>
                <Select defaultValue="usdc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                    <SelectItem value="sgd">SGD Stable</SelectItem>
                    <SelectItem value="hkd">HKD Stable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Rollover</Label>
                  <p className="text-sm text-muted-foreground">Automatically reinvest at maturity</p>
                </div>
                <Switch checked={autoRollover} onCheckedChange={setAutoRollover} />
              </div>

              {amount && Number(amount) >= selectedProduct.minInvestment && (
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-card-foreground mb-2">Projected Returns</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Expected Yield</p>
                        <p className="font-medium text-green-600">
                          ${((Number(amount) * selectedProduct.apy) / 100).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total at Maturity</p>
                        <p className="font-medium text-card-foreground">
                          ${(Number(amount) + (Number(amount) * selectedProduct.apy) / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a product to configure your subscription</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90"
          disabled={!selectedProduct || !amount || Number(amount) < (selectedProduct?.minInvestment || 0)}
        >
          Subscribe
        </Button>
      </div>
    </div>
  )
}

function RWAMarketplace({ products }: { products: YieldProduct[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Available RWA Products</h3>
        <div className="flex gap-2">
          <Select defaultValue="apy">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apy">Sort by APY</SelectItem>
              <SelectItem value="risk">Sort by Risk</SelectItem>
              <SelectItem value="maturity">Sort by Maturity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-card-foreground">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.type}</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {product.apy}% APY
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Min Investment</p>
                  <p className="font-medium text-card-foreground">${product.minInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Maturity</p>
                  <p className="font-medium text-card-foreground">{product.maturity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk Rating</p>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      product.riskRating === "low"
                        ? "text-green-600 border-green-200"
                        : product.riskRating === "medium"
                          ? "text-yellow-600 border-yellow-200"
                          : "text-red-600 border-red-200"
                    }`}
                  >
                    {product.riskRating}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Liquidity</p>
                  <Badge variant="outline" className="capitalize">
                    {product.liquidity}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Compliant</span>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SubscriptionDetails({ subscription }: { subscription: RWASubscription }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Value</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">
                  {subscription.amount} {subscription.currency}
                </p>
                <p className="text-xs text-green-600">+2.1% since purchase</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Accrued Interest</span>
                </div>
                <p className="text-2xl font-bold text-green-600">$2,847</p>
                <p className="text-xs text-muted-foreground">Since inception</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Days to Maturity</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">47</p>
                <p className="text-xs text-muted-foreground">Auto-rollover enabled</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Subscription Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Auto-Rollover</p>
                  <p className="text-sm text-muted-foreground">Automatically reinvest at maturity</p>
                </div>
                <Switch checked={subscription.autoRollover} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Compliance Monitoring</p>
                  <p className="text-sm text-muted-foreground">Real-time regulatory compliance tracking</p>
                </div>
                <Switch checked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Annualized Return</span>
                  <span className="text-sm font-medium text-green-600">{subscription.apy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Return</span>
                  <span className="text-sm font-medium text-green-600">+2.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Benchmark Comparison</span>
                  <span className="text-sm font-medium text-green-600">+0.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Score</span>
                  <Badge className="bg-green-100 text-green-800">{subscription.complianceScore}%</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Regulatory Compliance</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentation</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Assessment</span>
                    <span>98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Compliance Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Subscription Agreement", date: "2024-01-10", status: "verified" },
                  { name: "Compliance Certificate", date: "2024-01-10", status: "verified" },
                  { name: "Risk Disclosure", date: "2024-01-10", status: "verified" },
                  { name: "Tax Documentation", date: "2024-01-10", status: "pending" },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          doc.status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {doc.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function YieldLadderingTool({ products }: { products: YieldProduct[] }) {
  const [ladderConfig, setLadderConfig] = useState({
    totalAmount: 500000,
    duration: 12,
    intervals: 4,
  })

  const calculateLadder = () => {
    const amountPerRung = ladderConfig.totalAmount / ladderConfig.intervals
    const intervalMonths = ladderConfig.duration / ladderConfig.intervals

    return Array.from({ length: ladderConfig.intervals }, (_, i) => ({
      rung: i + 1,
      amount: amountPerRung,
      maturity: `${(i + 1) * intervalMonths} months`,
      product: products[i % products.length],
      expectedReturn: (amountPerRung * products[i % products.length].apy) / 100,
    }))
  }

  const ladder = calculateLadder()
  const totalExpectedReturn = ladder.reduce((sum, rung) => sum + rung.expectedReturn, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Ladder Configuration</CardTitle>
            <CardDescription>Set up your yield laddering strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Investment Amount (USD)</Label>
              <Input
                type="number"
                value={ladderConfig.totalAmount}
                onChange={(e) => setLadderConfig({ ...ladderConfig, totalAmount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ladder Duration (months)</Label>
              <Select
                value={ladderConfig.duration.toString()}
                onValueChange={(value) => setLadderConfig({ ...ladderConfig, duration: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Rungs</Label>
              <Select
                value={ladderConfig.intervals.toString()}
                onValueChange={(value) => setLadderConfig({ ...ladderConfig, intervals: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 rungs</SelectItem>
                  <SelectItem value="4">4 rungs</SelectItem>
                  <SelectItem value="6">6 rungs</SelectItem>
                  <SelectItem value="12">12 rungs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Ladder Summary</CardTitle>
            <CardDescription>Expected performance and liquidity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-xl font-bold text-card-foreground">${ladderConfig.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Annual Return</p>
                <p className="text-xl font-bold text-green-600">${totalExpectedReturn.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average APY</p>
                <p className="text-lg font-medium text-card-foreground">
                  {(ladder.reduce((sum, rung) => sum + rung.product.apy, 0) / ladder.length).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Liquidity Events</p>
                <p className="text-lg font-medium text-card-foreground">{ladderConfig.intervals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ladder Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Ladder Structure</CardTitle>
          <CardDescription>Visual representation of your yield ladder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ladder.map((rung) => (
              <div key={rung.rung} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {rung.rung}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{rung.product.name}</p>
                    <p className="text-sm text-muted-foreground">Matures in {rung.maturity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-card-foreground">${rung.amount.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+${rung.expectedReturn.toLocaleString()} return</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
