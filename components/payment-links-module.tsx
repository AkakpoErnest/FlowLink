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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode, Plus, Copy, Shield, CheckCircle, Clock, AlertTriangle, Download, Eye, Settings } from "lucide-react"

interface PaymentLink {
  id: string
  name: string
  amount: string
  currency: string
  status: "active" | "expired" | "pending"
  kycRequired: boolean
  created: string
  used: number
  limit: number
  compliance: "verified" | "pending" | "failed"
}

export function PaymentLinksModule() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null)

  const paymentLinks: PaymentLink[] = [
    {
      id: "pl_001",
      name: "Institutional Client - Series A",
      amount: "250,000",
      currency: "USDC",
      status: "active",
      kycRequired: true,
      created: "2024-01-15",
      used: 1,
      limit: 1,
      compliance: "verified",
    },
    {
      id: "pl_002",
      name: "SME Subscription Payment",
      amount: "45,000",
      currency: "HKD",
      status: "active",
      kycRequired: false,
      created: "2024-01-14",
      used: 3,
      limit: 5,
      compliance: "verified",
    },
    {
      id: "pl_003",
      name: "Cross-border Settlement",
      amount: "100,000",
      currency: "SGD",
      status: "pending",
      kycRequired: true,
      created: "2024-01-13",
      used: 0,
      limit: 1,
      compliance: "pending",
    },
  ]

  const generateQRCode = (linkId: string) => {
    // In a real app, this would generate an actual QR code
    return `https://flowlink.app/pay/${linkId}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-card-foreground">Payment Links</h2>
          <p className="text-muted-foreground mt-1">Create compliant payment links with KYC gating and risk scoring</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Payment Link</DialogTitle>
              <DialogDescription>Generate a compliant payment link with optional KYC verification</DialogDescription>
            </DialogHeader>
            <CreatePaymentLinkForm onClose={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Links</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {paymentLinks
              .filter((link) => link.status === "active")
              .map((link) => (
                <PaymentLinkCard key={link.id} link={link} onSelect={setSelectedLink} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {paymentLinks
              .filter((link) => link.status === "pending")
              .map((link) => (
                <PaymentLinkCard key={link.id} link={link} onSelect={setSelectedLink} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No expired payment links</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Link Details Dialog */}
      {selectedLink && (
        <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedLink.name}</DialogTitle>
              <DialogDescription>Payment link details and QR code</DialogDescription>
            </DialogHeader>
            <PaymentLinkDetails link={selectedLink} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function PaymentLinkCard({ link, onSelect }: { link: PaymentLink; onSelect: (link: PaymentLink) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card
      className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(link)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-card-foreground">{link.name}</h3>
              <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
              {link.kycRequired && (
                <Badge variant="outline" className="border-accent/20 text-accent">
                  <Shield className="h-3 w-3 mr-1" />
                  KYC Required
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>
                Amount: {link.amount} {link.currency}
              </span>
              <span>
                Used: {link.used}/{link.limit}
              </span>
              <span>Created: {link.created}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {getComplianceIcon(link.compliance)}
              <span className="text-xs text-muted-foreground capitalize">{link.compliance}</span>
            </div>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CreatePaymentLinkForm({ onClose }: { onClose: () => void }) {
  const [kycRequired, setKycRequired] = useState(false)
  const [allowlistOnly, setAllowlistOnly] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Link Name</Label>
          <Input id="name" placeholder="e.g., Institutional Client Payment" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" placeholder="0.00" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Settlement Currency</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usdc">USDC</SelectItem>
              <SelectItem value="hkd">HKD Stable</SelectItem>
              <SelectItem value="sgd">SGD Stable</SelectItem>
              <SelectItem value="usdt">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="usage-limit">Usage Limit</Label>
          <Input id="usage-limit" type="number" placeholder="1" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>KYC Verification Required</Label>
            <p className="text-sm text-muted-foreground">Only verified wallets can complete payment</p>
          </div>
          <Switch checked={kycRequired} onCheckedChange={setKycRequired} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Allowlist Only</Label>
            <p className="text-sm text-muted-foreground">Restrict to pre-approved wallet addresses</p>
          </div>
          <Switch checked={allowlistOnly} onCheckedChange={setAllowlistOnly} />
        </div>
      </div>

      {kycRequired && (
        <Card className="bg-muted/50 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-card-foreground">KYC Integration</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This link will require POAP or KYChain attestation before payment processing. Compliance receipts will
                  be automatically generated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-primary hover:bg-primary/90">Create Payment Link</Button>
      </div>
    </div>
  )
}

function PaymentLinkDetails({ link }: { link: PaymentLink }) {
  const qrCodeUrl = `https://flowlink.app/pay/${link.id}`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">QR Code</CardTitle>
            <CardDescription>Scan to access payment link</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-mono bg-muted px-3 py-1 rounded">{qrCodeUrl}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
            <CardDescription>Configuration and compliance status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium text-card-foreground">
                  {link.amount} {link.currency}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Usage</p>
                <p className="font-medium text-card-foreground">
                  {link.used}/{link.limit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className="capitalize">{link.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">KYC Required</p>
                <p className="font-medium text-card-foreground">{link.kycRequired ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-card-foreground mb-3">Compliance Status</h4>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Risk scoring: Passed</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Sanctions screening: Clear</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Regulatory compliance: Verified</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Edit Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <CardDescription>Recent payments using this link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Payment completed</p>
                  <p className="text-xs text-muted-foreground">Wallet: 0x1234...5678 • KYC Verified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-card-foreground">
                  {link.amount} {link.currency}
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
