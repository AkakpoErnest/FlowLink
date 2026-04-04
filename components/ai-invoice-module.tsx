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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Wallet,
} from "lucide-react"
import type { Invoice } from "@/app/api/invoices/route"
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_KEY } from "@/lib/chains"

const CHAINS = SUPPORTED_CHAINS.filter(c => !c.testnet)

interface Agent {
  id: string
  name: string
  description: string | null
  walletAddress: string | null
  capabilities: string[]
  status: string
  totalEarned: number
  invoiceCount: number
  createdAt: string
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600 border-slate-200", icon: FileText },
  pending: { label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-500 border-slate-200", icon: X },
}

const networkConfig = {
  hashkey: { label: "HashKey Chain", color: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  polygon: { label: "Polygon", color: "text-purple-600", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  ethereum: { label: "Ethereum", color: "text-slate-600", badge: "bg-slate-100 text-slate-600 border-slate-200" },
}

interface LineItem {
  description: string
  quantity: number
  unitPrice: string
  total: string
}

export function AIInvoiceModule() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, overdue: 0, totalValue: "0", paidValue: "0" })
  const [showCreate, setShowCreate] = useState(false)
  const [showRegisterAgent, setShowRegisterAgent] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [createdPaymentLink, setCreatedPaymentLink] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [agentLoading, setAgentLoading] = useState(false)

  // New invoice form state
  const [form, setForm] = useState({
    selectedAgentId: "",
    agentName: "",
    agentDescription: "",
    issuedTo: "",
    issuedToAddress: "",
    description: "",
    currency: "cUSD",
    network: DEFAULT_CHAIN_KEY,
    dueAt: "",
    kycRequired: true,
  })
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: "", total: "0.00" },
  ])

  // Register agent form state
  const [agentForm, setAgentForm] = useState({
    name: "",
    description: "",
    walletAddress: "",
    capabilitiesText: "",
  })

  useEffect(() => {
    fetchInvoices()
    fetchAgents()
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

  const fetchAgents = async () => {
    const res = await fetch("/api/agents")
    const data = await res.json()
    if (data.success) {
      setAgents(data.data)
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

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (agent) {
      setForm({
        ...form,
        selectedAgentId: agentId,
        agentName: agent.name,
        agentDescription: agent.description ?? "",
      })
    } else {
      setForm({ ...form, selectedAgentId: "", agentName: "", agentDescription: "" })
    }
  }

  const createInvoice = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: form.selectedAgentId || null,
          agentName: form.agentName,
          issuedTo: form.issuedTo,
          issuedToAddress: form.issuedToAddress,
          description: form.description,
          currency: form.currency,
          network: form.network,
          dueAt: form.dueAt,
          kycRequired: form.kycRequired,
          lineItems,
          amount: totalAmount,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const linkCode = data.data?.paymentLinkCode
        if (linkCode) {
          setCreatedPaymentLink(`${window.location.origin}/l/${linkCode}`)
        }
        setForm({ selectedAgentId: "", agentName: "", agentDescription: "", issuedTo: "", issuedToAddress: "", description: "", currency: "cUSD", network: DEFAULT_CHAIN_KEY, dueAt: "", kycRequired: true })
        setLineItems([{ description: "", quantity: 1, unitPrice: "", total: "0.00" }])
        setShowCreate(false)
        fetchInvoices()
        fetchAgents()
      } else {
        alert(data.error || "Failed to create invoice")
      }
    } finally {
      setLoading(false)
    }
  }

  const registerAgent = async () => {
    setAgentLoading(true)
    const capabilities = agentForm.capabilitiesText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: agentForm.name,
        description: agentForm.description || null,
        walletAddress: agentForm.walletAddress || null,
        capabilities,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setShowRegisterAgent(false)
      setAgentForm({ name: "", description: "", walletAddress: "", capabilitiesText: "" })
      fetchAgents()
    }
    setAgentLoading(false)
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

      {/* Payment link created banner */}
      {createdPaymentLink && (
        <div className="flex items-center justify-between gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-emerald-300 font-semibold text-sm">Invoice created — share this link with your client</p>
              <p className="font-mono text-xs text-emerald-400/80 truncate">{createdPaymentLink}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
              onClick={() => { navigator.clipboard.writeText(createdPaymentLink); }}
            >
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white"
              onClick={() => setCreatedPaymentLink(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: stats.total, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Paid", value: stats.paid, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Value", value: `$${parseFloat(stats.totalValue).toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-slate-500 text-xs">{s.label}</p>
                <p className="text-slate-900 font-bold text-lg">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Card with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Bot className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">AI Agent Invoices</CardTitle>
                <CardDescription>Crypto-native invoicing for AI agents and automated services</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="invoices">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="agents">
                Agents
              </TabsTrigger>
            </TabsList>

            {/* ── Invoices Tab ── */}
            <TabsContent value="invoices" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                {/* Filter tabs */}
                <div className="flex gap-2">
                  {["all", "pending", "paid", "overdue", "draft"].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filterStatus === s ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:text-slate-900"}`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                <Dialog open={showCreate} onOpenChange={setShowCreate}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      New Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-emerald-400" />
                        Create AI Agent Invoice
                      </DialogTitle>
                      <DialogDescription>Issue a crypto invoice from an AI agent</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                      {/* Agent Selector */}
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-emerald-400 text-xs font-medium mb-2 flex items-center gap-1"><Bot className="h-3 w-3" /> Agent Details</p>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-slate-700 text-xs">Select Agent</Label>
                            <Select
                              value={form.selectedAgentId}
                              onValueChange={handleAgentSelect}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Choose a registered agent..." />
                              </SelectTrigger>
                              <SelectContent className="">
                                {agents.length === 0 && (
                                  <SelectItem value="__none__" disabled>No agents registered yet</SelectItem>
                                )}
                                {agents.map(agent => (
                                  <SelectItem key={agent.id} value={agent.id}>
                                    {agent.name} {agent.walletAddress ? `(${agent.walletAddress.slice(0, 6)}...${agent.walletAddress.slice(-4)})` : "(no wallet)"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {form.selectedAgentId && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-slate-700 text-xs">Agent Name</Label>
                                <Input
                                  value={form.agentName}
                                  onChange={e => setForm({ ...form, agentName: e.target.value })}
                                  className="mt-1"
                                  readOnly
                                />
                              </div>
                              <div>
                                <Label className="text-slate-700 text-xs">Agent Description</Label>
                                <Input
                                  value={form.agentDescription}
                                  onChange={e => setForm({ ...form, agentDescription: e.target.value })}
                                  className="mt-1"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-slate-700 text-xs">Invoice To (Name)</Label>
                          <Input
                            value={form.issuedTo}
                            onChange={e => setForm({ ...form, issuedTo: e.target.value })}
                            placeholder="Client name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 text-xs">Client Wallet Address</Label>
                          <Input
                            value={form.issuedToAddress}
                            onChange={e => setForm({ ...form, issuedToAddress: e.target.value })}
                            placeholder="0x..."
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-700 text-xs">Description</Label>
                        <Textarea
                          value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          placeholder="Invoice description / service rendered"
                          className="mt-1"
                          rows={2}
                        />
                      </div>

                      {/* Payment Settings */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-slate-700 text-xs">Network</Label>
                          <Select
                            value={form.network}
                            onValueChange={v => {
                              const chain = CHAINS.find(c => c.key === v)
                              setForm({ ...form, network: v, currency: chain?.tokens[0]?.symbol ?? 'cUSD' })
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="">
                              {CHAINS.map(c => (
                                <SelectItem key={c.key} value={c.key}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-700 text-xs">Token</Label>
                          <Select value={form.currency} onValueChange={v => setForm({ ...form, currency: v })}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="">
                              {(CHAINS.find(c => c.key === form.network)?.tokens ?? []).map(t => (
                                <SelectItem key={t.symbol} value={t.symbol}>{t.symbol}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-700 text-xs">Due Date</Label>
                          <Input
                            type="date"
                            value={form.dueAt}
                            onChange={e => setForm({ ...form, dueAt: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* KYC Toggle */}
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-slate-900 text-sm">Require KYC</p>
                          <p className="text-slate-500 text-xs">Payer must complete KYC before payment</p>
                        </div>
                        <Switch
                          checked={form.kycRequired}
                          onCheckedChange={v => setForm({ ...form, kycRequired: v })}
                        />
                      </div>

                      {/* Line Items */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-slate-700 text-xs">Line Items</Label>
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
                                className="col-span-5 text-xs h-8"
                                placeholder="Description"
                                value={item.description}
                                onChange={e => updateLineItem(idx, "description", e.target.value)}
                              />
                              <Input
                                className="col-span-2 text-xs h-8"
                                placeholder="Qty"
                                type="number"
                                value={item.quantity}
                                onChange={e => updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)}
                              />
                              <Input
                                className="col-span-2 text-xs h-8"
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
                        <div className="flex justify-end mt-3 pt-3 border-t border-slate-200">
                          <div className="text-right">
                            <p className="text-slate-500 text-xs">Total Amount</p>
                            <p className="text-emerald-600 font-bold text-xl font-mono">${totalAmount} <span className="text-sm">{form.currency}</span></p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={createInvoice}
                        disabled={loading || !form.issuedTo || !lineItems[0].description}
                      >
                        {loading ? "Creating..." : "Create Invoice"}
                        <Zap className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bot className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No invoices found</p>
                  <p className="text-xs mt-1">Create your first AI agent invoice to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map(invoice => {
                    const status = statusConfig[invoice.status]
                    const network = networkConfig[invoice.network as keyof typeof networkConfig] ?? networkConfig.hashkey
                    const StatusIcon = status.icon
                    return (
                      <div
                        key={invoice.id}
                        className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all cursor-pointer group"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                              <Bot className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-slate-900 font-medium text-sm">{invoice.invoiceNumber}</p>
                                <Badge className={`text-xs border ${network.badge}`}>{network.label}</Badge>
                                {invoice.paymentLinkCode && (
                                  <button
                                    onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(`${window.location.origin}/l/${invoice.paymentLinkCode}`) }}
                                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                                  >
                                    <Copy className="h-2.5 w-2.5" /> Copy Link
                                  </button>
                                )}
                              </div>
                              <p className="text-slate-600 text-xs">{invoice.agentName} → {invoice.issuedTo}</p>
                              <p className="text-slate-500 text-xs mt-0.5 truncate max-w-sm">{invoice.description}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <Badge className={`text-xs border ${status.color} flex items-center gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                            <p className="text-emerald-600 font-bold font-mono">${parseFloat(String(invoice.amount)).toLocaleString()} {invoice.currency}</p>
                            <p className="text-slate-500 text-xs">Due: {new Date(invoice.dueAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* ── Agents Tab ── */}
            <TabsContent value="agents" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-600 text-sm">{agents.length} registered agent{agents.length !== 1 ? "s" : ""}</p>
                <Dialog open={showRegisterAgent} onOpenChange={setShowRegisterAgent}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      Register Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-emerald-600" />
                        Register Agent
                      </DialogTitle>
                      <DialogDescription>Register an agent with a wallet address to issue invoices on-chain</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <div>
                        <Label className="text-slate-700 text-xs">Agent Name *</Label>
                        <Input
                          value={agentForm.name}
                          onChange={e => setAgentForm({ ...agentForm, name: e.target.value })}
                          placeholder="e.g. Analytics Agent"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-xs">Description</Label>
                        <Textarea
                          value={agentForm.description}
                          onChange={e => setAgentForm({ ...agentForm, description: e.target.value })}
                          placeholder="What does this agent do?"
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-xs">Wallet Address</Label>
                        <Input
                          value={agentForm.walletAddress}
                          onChange={e => setAgentForm({ ...agentForm, walletAddress: e.target.value })}
                          placeholder="0x... (payments will be sent here)"
                          className="mt-1"
                        />
                        <p className="text-slate-500 text-xs mt-1">Payments from invoices issued by this agent will go directly to this wallet.</p>
                      </div>
                      <div>
                        <Label className="text-slate-700 text-xs">Capabilities (comma-separated)</Label>
                        <Input
                          value={agentForm.capabilitiesText}
                          onChange={e => setAgentForm({ ...agentForm, capabilitiesText: e.target.value })}
                          placeholder="data-analysis, reporting, automation"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={registerAgent}
                        disabled={agentLoading || !agentForm.name}
                      >
                        {agentLoading ? "Registering..." : "Register Agent"}
                        <Bot className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {agents.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bot className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No agents registered</p>
                  <p className="text-xs mt-1">Register an agent with a wallet address to start issuing on-chain invoices</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agents.map(agent => (
                    <div key={agent.id} className="p-4 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg">
                            <Bot className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-slate-900 font-medium text-sm">{agent.name}</p>
                              <Badge className={`text-xs border ${agent.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {agent.status}
                              </Badge>
                            </div>
                            {agent.description && <p className="text-slate-500 text-xs mt-0.5">{agent.description}</p>}
                            {agent.walletAddress && (
                              <div className="flex items-center gap-1 mt-1">
                                <Wallet className="h-3 w-3 text-slate-400" />
                                <span className="text-slate-600 text-xs font-mono">
                                  {agent.walletAddress.slice(0, 10)}...{agent.walletAddress.slice(-6)}
                                </span>
                                <button onClick={() => copyToClipboard(agent.walletAddress!)} className="text-slate-400 hover:text-slate-600">
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-slate-500 text-xs">{agent.invoiceCount} invoice{agent.invoiceCount !== 1 ? "s" : ""}</p>
                          <p className="text-emerald-600 text-xs font-mono">${agent.totalEarned.toLocaleString()} earned</p>
                          {(agent.capabilities as string[]).length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-end">
                              {(agent.capabilities as string[]).slice(0, 3).map(cap => (
                                <span key={cap} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{cap}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
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
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-emerald-600 text-xs font-medium mb-1 flex items-center gap-1"><Bot className="h-3 w-3" /> From Agent</p>
                    <p className="text-slate-900 font-medium">{selectedInvoice.agentName}</p>
                    <p className="text-slate-500 text-xs">{selectedInvoice.agentDescription}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-500 text-xs font-medium mb-1">Billed To</p>
                    <p className="text-slate-900 font-medium">{selectedInvoice.issuedTo}</p>
                    {selectedInvoice.issuedToAddress && (
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-slate-600 text-xs font-mono">{selectedInvoice.issuedToAddress.slice(0, 10)}...{selectedInvoice.issuedToAddress.slice(-6)}</p>
                        <button onClick={() => copyToClipboard(selectedInvoice.issuedToAddress!)} className="text-slate-400 hover:text-slate-600">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 text-xs mb-2">Description</p>
                  <p className="text-slate-900 text-sm">{selectedInvoice.description}</p>
                </div>

                {/* Line Items */}
                <div>
                  <p className="text-slate-500 text-xs mb-2">Line Items</p>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200">
                        <TableHead className="text-slate-500 text-xs">Description</TableHead>
                        <TableHead className="text-slate-500 text-xs text-center">Qty</TableHead>
                        <TableHead className="text-slate-500 text-xs text-right">Unit Price</TableHead>
                        <TableHead className="text-slate-500 text-xs text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.lineItems.map((item, idx) => (
                        <TableRow key={idx} className="border-slate-100">
                          <TableCell className="text-slate-900 text-sm">{item.description}</TableCell>
                          <TableCell className="text-slate-700 text-sm text-center">{item.quantity}</TableCell>
                          <TableCell className="text-slate-700 text-sm text-right font-mono">${item.unitPrice}</TableCell>
                          <TableCell className="text-emerald-600 text-sm text-right font-mono font-bold">${item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-2 pt-2 border-t border-slate-200">
                    <div className="text-right">
                      <p className="text-slate-500 text-xs">Total Due</p>
                      <p className="text-emerald-600 font-bold text-2xl font-mono">${parseFloat(String(selectedInvoice.amount)).toLocaleString()} {selectedInvoice.currency}</p>
                      <p className="text-slate-500 text-xs">on {(networkConfig[selectedInvoice.network as keyof typeof networkConfig] ?? networkConfig.hashkey).label}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 bg-slate-50 rounded">
                    <p className="text-slate-500">Issued</p>
                    <p className="text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <p className="text-slate-500">Due</p>
                    <p className={selectedInvoice.status === "overdue" ? "text-red-600" : "text-slate-900"}>
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
                    <button onClick={() => copyToClipboard(selectedInvoice.txHash!)} className="text-slate-400 hover:text-slate-600 shrink-0">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Pay Now Button */}
                {selectedInvoice.paymentLinkCode && selectedInvoice.status !== "paid" && (
                  <div className="space-y-2">
                    <a
                      href={`/l/${selectedInvoice.paymentLinkCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Pay Now — {selectedInvoice.currency} on HashKey Chain
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
                      onClick={() => copyToClipboard(`${window.location.origin}/l/${selectedInvoice.paymentLinkCode}`)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Payment Link
                    </Button>
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
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
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
