"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Bot,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Send,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  TrendingUp,
  X,
} from "lucide-react"
import type { Invoice } from "@/app/api/invoices/route"

const statusConfig = {
  draft: { label: "Draft", color: "bg-slate-500/20 text-slate-300 border-slate-500/30", icon: FileText },
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: CheckCircle },
  overdue: { label: "Overdue", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: AlertTriangle },
  cancelled: { label: "Cancelled", color: "bg-slate-600/20 text-slate-400 border-slate-600/30", icon: X },
}

const networkConfig = {
  hashkey: { label: "HashKey Chain", color: "text-blue-400", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  polygon: { label: "Polygon", color: "text-purple-400", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  ethereum: { label: "Ethereum", color: "text-slate-400", badge: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
}

interface LineItem {
  description: string
  quantity: number
  unitPrice: string
  total: string
}

export function AIInvoiceModule() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, overdue: 0, totalValue: "0", paidValue: "0" })
  const [showCreate, setShowCreate] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  // New invoice form state
  const [form, setForm] = useState({
    agentName: "",
    agentDescription: "",
    issuedTo: "",
    issuedToAddress: "",
    description: "",
    currency: "USDC" as "USDC" | "USDT" | "HSK",
    network: "hashkey" as "hashkey" | "polygon" | "ethereum",
    dueAt: "",
    kycRequired: true,
  })
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: "", total: "0.00" },
  ])

  useEffect(() => {
    fetchInvoices()
  }, [filterStatus])

  const fetchInvoices = async () => {
    const url = filterStatus === "all" ? "/api/invoices" : `/api/invoices?status=${filterStatus}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.success) {
      setInvoices(data.data)
      setStats(data.stats)
    }
  }

  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    updated[idx] = { ...updated[idx], [field]: value }
    if (field === "quantity" || field === "unitPrice") {
      const qty = field === "quantity" ? Number(value) : Number(updated[idx].quantity)
      const price = field === "unitPrice" ? parseFloat(value as string) || 0 : parseFloat(updated[idx].unitPrice) || 0
      updated[idx].total = (qty * price).toFixed(2)
    }
    setLineItems(updated)
  }

  const totalAmount = lineItems.reduce((sum, item) => sum + parseFloat(item.total || "0"), 0).toFixed(2)

  const createInvoice = async () => {
    setLoading(true)
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        lineItems,
        amount: totalAmount,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setShowCreate(false)
      setForm({ agentName: "", agentDescription: "", issuedTo: "", issuedToAddress: "", description: "", currency: "USDC", network: "hashkey", dueAt: "", kycRequired: true })
      setLineItems([{ description: "", quantity: 1, unitPrice: "", total: "0.00" }])
      fetchInvoices()
    }
    setLoading(false)
  }

  const markAsPaid = async (invoice: Invoice) => {
    await fetch("/api/invoices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoice.id, status: "paid" }),
    })
    fetchInvoices()
    if (selectedInvoice?.id === invoice.id) {
      setSelectedInvoice({ ...selectedInvoice, status: "paid", paidAt: new Date().toISOString() })
    }
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: stats.total, icon: FileText, color: "text-blue-400" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
          { label: "Paid", value: stats.paid, icon: CheckCircle, color: "text-emerald-400" },
          { label: "Total Value", value: `$${parseFloat(stats.totalValue).toLocaleString()}`, icon: DollarSign, color: "text-purple-400" },
        ].map((s) => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-700/50`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-slate-400 text-xs">{s.label}</p>
                <p className="text-white font-bold text-lg">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Card */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bot className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">AI Agent Invoices</CardTitle>
                <CardDescription>Crypto-native invoicing for AI agents and automated services</CardDescription>
              </div>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="h-4 w-4" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    Create AI Agent Invoice
                  </DialogTitle>
                  <DialogDescription>Issue a crypto invoice from an AI agent</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  {/* Agent Info */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-xs font-medium mb-2 flex items-center gap-1"><Bot className="h-3 w-3" /> Agent Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-slate-300 text-xs">Agent Name</Label>
                        <Input
                          value={form.agentName}
                          onChange={e => setForm({ ...form, agentName: e.target.value })}
                          placeholder="e.g. Analytics Agent"
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 text-xs">Agent Description</Label>
                        <Input
                          value={form.agentDescription}
                          onChange={e => setForm({ ...form, agentDescription: e.target.value })}
                          placeholder="What does this agent do?"
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-slate-300 text-xs">Invoice To (Name)</Label>
                      <Input
                        value={form.issuedTo}
                        onChange={e => setForm({ ...form, issuedTo: e.target.value })}
                        placeholder="Client name"
                        className="bg-slate-800 border-slate-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-xs">Client Wallet Address</Label>
                      <Input
                        value={form.issuedToAddress}
                        onChange={e => setForm({ ...form, issuedToAddress: e.target.value })}
                        placeholder="0x..."
                        className="bg-slate-800 border-slate-600 text-white mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 text-xs">Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Invoice description / service rendered"
                      className="bg-slate-800 border-slate-600 text-white mt-1"
                      rows={2}
                    />
                  </div>

                  {/* Payment Settings */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-slate-300 text-xs">Currency</Label>
                      <Select value={form.currency} onValueChange={v => setForm({ ...form, currency: v as any })}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="HSK">HSK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300 text-xs">Network</Label>
                      <Select value={form.network} onValueChange={v => setForm({ ...form, network: v as any })}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="hashkey">HashKey Chain</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300 text-xs">Due Date</Label>
                      <Input
                        type="date"
                        value={form.dueAt}
                        onChange={e => setForm({ ...form, dueAt: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-white mt-1"
                      />
                    </div>
                  </div>

                  {/* KYC Toggle */}
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Require KYC</p>
                      <p className="text-slate-400 text-xs">Payer must complete KYC before payment</p>
                    </div>
                    <Switch
                      checked={form.kycRequired}
                      onCheckedChange={v => setForm({ ...form, kycRequired: v })}
                    />
                  </div>

                  {/* Line Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-slate-300 text-xs">Line Items</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-400 hover:text-emerald-300 h-6 text-xs"
                        onClick={() => setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: "", total: "0.00" }])}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {lineItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                          <Input
                            className="col-span-5 bg-slate-800 border-slate-600 text-white text-xs h-8"
                            placeholder="Description"
                            value={item.description}
                            onChange={e => updateLineItem(idx, "description", e.target.value)}
                          />
                          <Input
                            className="col-span-2 bg-slate-800 border-slate-600 text-white text-xs h-8"
                            placeholder="Qty"
                            type="number"
                            value={item.quantity}
                            onChange={e => updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)}
                          />
                          <Input
                            className="col-span-2 bg-slate-800 border-slate-600 text-white text-xs h-8"
                            placeholder="Price"
                            value={item.unitPrice}
                            onChange={e => updateLineItem(idx, "unitPrice", e.target.value)}
                          />
                          <div className="col-span-2 text-right">
                            <span className="text-emerald-400 text-xs font-mono">${item.total}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="col-span-1 h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}
                            disabled={lineItems.length === 1}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3 pt-3 border-t border-slate-700">
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Total Amount</p>
                        <p className="text-emerald-400 font-bold text-xl font-mono">${totalAmount} <span className="text-sm">{form.currency}</span></p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={createInvoice}
                    disabled={loading || !form.agentName || !form.issuedTo || !lineItems[0].description}
                  >
                    {loading ? "Creating..." : "Create Invoice"}
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-3">
            {["all", "pending", "paid", "overdue", "draft"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filterStatus === s ? "bg-emerald-600 text-white" : "bg-slate-700/50 text-slate-400 hover:text-white"}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No invoices found</p>
              <p className="text-xs mt-1">Create your first AI agent invoice to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map(invoice => {
                const status = statusConfig[invoice.status]
                const network = networkConfig[invoice.network]
                const StatusIcon = status.icon
                return (
                  <div
                    key={invoice.id}
                    className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:border-slate-500/50 transition-all cursor-pointer group"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Bot className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">{invoice.invoiceNumber}</p>
                            <Badge className={`text-xs border ${network.badge}`}>{network.label}</Badge>
                          </div>
                          <p className="text-slate-400 text-xs">{invoice.agentName} → {invoice.issuedTo}</p>
                          <p className="text-slate-500 text-xs mt-0.5 truncate max-w-sm">{invoice.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <Badge className={`text-xs border ${status.color} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                        <p className="text-emerald-400 font-bold font-mono">${parseFloat(invoice.amount).toLocaleString()} {invoice.currency}</p>
                        <p className="text-slate-500 text-xs">Due: {new Date(invoice.dueAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    {selectedInvoice.invoiceNumber}
                  </DialogTitle>
                  <Badge className={`border ${statusConfig[selectedInvoice.status].color}`}>
                    {statusConfig[selectedInvoice.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Agent + Client */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-xs font-medium mb-1 flex items-center gap-1"><Bot className="h-3 w-3" /> From Agent</p>
                    <p className="text-white font-medium">{selectedInvoice.agentName}</p>
                    <p className="text-slate-400 text-xs">{selectedInvoice.agentDescription}</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-slate-400 text-xs font-medium mb-1">Billed To</p>
                    <p className="text-white font-medium">{selectedInvoice.issuedTo}</p>
                    {selectedInvoice.issuedToAddress && (
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-slate-400 text-xs font-mono">{selectedInvoice.issuedToAddress.slice(0, 10)}...{selectedInvoice.issuedToAddress.slice(-6)}</p>
                        <button onClick={() => copyToClipboard(selectedInvoice.issuedToAddress)} className="text-slate-500 hover:text-slate-300">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs mb-2">Description</p>
                  <p className="text-white text-sm">{selectedInvoice.description}</p>
                </div>

                {/* Line Items */}
                <div>
                  <p className="text-slate-400 text-xs mb-2">Line Items</p>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400 text-xs">Description</TableHead>
                        <TableHead className="text-slate-400 text-xs text-center">Qty</TableHead>
                        <TableHead className="text-slate-400 text-xs text-right">Unit Price</TableHead>
                        <TableHead className="text-slate-400 text-xs text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.lineItems.map((item, idx) => (
                        <TableRow key={idx} className="border-slate-700">
                          <TableCell className="text-white text-sm">{item.description}</TableCell>
                          <TableCell className="text-slate-300 text-sm text-center">{item.quantity}</TableCell>
                          <TableCell className="text-slate-300 text-sm text-right font-mono">${item.unitPrice}</TableCell>
                          <TableCell className="text-emerald-400 text-sm text-right font-mono font-bold">${item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-2 pt-2 border-t border-slate-700">
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Total Due</p>
                      <p className="text-emerald-400 font-bold text-2xl font-mono">${parseFloat(selectedInvoice.amount).toLocaleString()} {selectedInvoice.currency}</p>
                      <p className="text-slate-500 text-xs">on {networkConfig[selectedInvoice.network].label}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 bg-slate-700/30 rounded">
                    <p className="text-slate-500">Issued</p>
                    <p className="text-white">{new Date(selectedInvoice.issuedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-2 bg-slate-700/30 rounded">
                    <p className="text-slate-500">Due</p>
                    <p className={selectedInvoice.status === "overdue" ? "text-red-400" : "text-white"}>
                      {new Date(selectedInvoice.dueAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedInvoice.paidAt && (
                    <div className="p-2 bg-emerald-500/10 rounded">
                      <p className="text-slate-500">Paid</p>
                      <p className="text-emerald-400">{new Date(selectedInvoice.paidAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* TX Hash */}
                {selectedInvoice.txHash && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-emerald-400 text-xs font-medium">Payment Confirmed</p>
                      <p className="text-slate-400 text-xs font-mono truncate">{selectedInvoice.txHash}</p>
                    </div>
                    <button onClick={() => copyToClipboard(selectedInvoice.txHash!)} className="text-slate-400 hover:text-white shrink-0">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Actions */}
                {selectedInvoice.status !== "paid" && selectedInvoice.status !== "cancelled" && (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      onClick={() => markAsPaid(selectedInvoice)}
                    >
                      <Send className="h-4 w-4" />
                      Mark as Paid
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2"
                      onClick={() => copyToClipboard(selectedInvoice.invoiceNumber)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy ID
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
