"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  FilePlus,
  FileText,
  FileEdit,
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  DollarSign,
  Send,
  Copy,
  ExternalLink,
  Trash2,
  Calendar,
  X,
  User,
  Eye,
  MoreHorizontal,
  ChevronDown,
  Plus,
} from "lucide-react"
import type { Invoice } from "@/app/api/invoices/route"
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_KEY } from "@/lib/chains"
import { toast } from "sonner"
import { AgentRulesWidget } from "@/components/agent-rules-widget"

// All chains (including testnet for hackathon)
const CHAINS = SUPPORTED_CHAINS

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

interface LineItem {
  description: string
  quantity: number
  unitPrice: string
  total: string
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600 border-slate-200", icon: FileEdit },
  pending: { label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-500 border-slate-200", icon: AlertTriangle },
}

const CURRENCIES = ["USDC", "USDT", "HSK", "cUSD"]

const emptyLineItem = (): LineItem => ({ description: "", quantity: 1, unitPrice: "", total: "0.00" })

// ─── Create Invoice Modal ────────────────────────────────────────────────────

interface CreateInvoiceModalProps {
  open: boolean
  onClose: () => void
  onCreated: (invoice: Invoice, paymentUrl?: string) => void
  agents: Agent[]
}

function CreateInvoiceModal({ open, onClose, onCreated, agents }: CreateInvoiceModalProps) {
  const today = new Date().toISOString().split("T")[0]
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)

  // Form fields
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [issueDate, setIssueDate] = useState(today)
  const [dueDate, setDueDate] = useState(defaultDue)
  const [currency, setCurrency] = useState("USDC")
  const [network, setNetwork] = useState(DEFAULT_CHAIN_KEY)
  const [notes, setNotes] = useState("")
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLineItem()])
  const [saveDraft, setSaveDraft] = useState(false)

  // Fetch next invoice number on open
  useEffect(() => {
    if (!open) return
    setStep(1)
    setRecipientName("")
    setRecipientEmail("")
    setIssueDate(today)
    setDueDate(defaultDue)
    setCurrency("USDC")
    setNetwork(DEFAULT_CHAIN_KEY)
    setNotes("")
    setLineItems([emptyLineItem()])
    setSaveDraft(false)
    // Fetch next number
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const year = new Date().getFullYear()
          const next = (d.stats?.total ?? 0) + 1
          setInvoiceNumber(`FL-${year}-${String(next).padStart(3, "0")}`)
        }
      })
      .catch(() => {})
  }, [open])

  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    updated[idx] = { ...updated[idx], [field]: value }
    if (field === "quantity" || field === "unitPrice") {
      const qty = field === "quantity" ? Number(value) : Number(updated[idx].quantity)
      const price =
        field === "unitPrice" ? parseFloat(value as string) || 0 : parseFloat(updated[idx].unitPrice) || 0
      updated[idx].total = (qty * price).toFixed(2)
    }
    setLineItems(updated)
  }

  const subtotal = lineItems.reduce((s, i) => s + parseFloat(i.total || "0"), 0)
  const total = subtotal

  const canProceedStep1 = recipientName.trim() || recipientEmail.trim()
  const canProceedStep2 = lineItems.some((i) => i.description && parseFloat(i.total) > 0)

  const handleSubmit = async (asDraft: boolean) => {
    setLoading(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          recipientName,
          recipientEmail,
          issuedTo: recipientName || recipientEmail,
          issuedToAddress: recipientEmail,
          issueDate,
          dueAt: dueDate,
          currency,
          network,
          notes,
          lineItems,
          subtotal,
          amount: total,
          status: asDraft ? "draft" : "pending",
        }),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.error || "Failed to create invoice")
        return
      }
      const paymentUrl = data.data.paymentLinkCode
        ? `${window.location.origin}/pay/invoice/${data.data.id}`
        : undefined
      toast.success(asDraft ? "Invoice saved as draft" : "Invoice sent!")
      onCreated(data.data, paymentUrl)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            New Invoice
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {step === 1 && "Recipient details"}
            {step === 2 && "Line items"}
            {step === 3 && "Review & send"}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  s === step
                    ? "bg-emerald-600 text-white"
                    : s < step
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {s < step ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`h-px w-8 ${s < step ? "bg-emerald-300" : "bg-slate-200"}`} />}
            </div>
          ))}
          <span className="ml-2 text-xs text-slate-500">
            Step {step} of 3
          </span>
        </div>

        {/* ── Step 1: Recipient ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Recipient Name</Label>
                <Input
                  placeholder="Acme Corp"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">Email or Wallet Address</Label>
                <Input
                  placeholder="client@example.com or 0x..."
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Invoice #</Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="border-slate-200 font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Issue Date
                </Label>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Due Date
                </Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">Network</Label>
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAINS.map((c) => (
                      <SelectItem key={c.key} value={c.key}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Next: Line Items
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Line Items ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-slate-600 font-medium">Description</TableHead>
                    <TableHead className="text-slate-600 font-medium w-20 text-center">Qty</TableHead>
                    <TableHead className="text-slate-600 font-medium w-32 text-right">Unit Price</TableHead>
                    <TableHead className="text-slate-600 font-medium w-28 text-right">Amount</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="py-2 pr-2">
                        <Input
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                          className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-slate-800"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-2">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateLineItem(idx, "quantity", Number(e.target.value))}
                          className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-center text-slate-800"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-2">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(idx, "unitPrice", e.target.value)}
                          className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-right text-slate-800"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-2 text-right font-medium text-slate-800">
                        {parseFloat(item.total).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="py-2 pl-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-slate-400 hover:text-red-500"
                          disabled={lineItems.length === 1}
                          onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              onClick={() => setLineItems([...lineItems, emptyLineItem()])}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Line Item
            </Button>

            {/* Subtotal */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2 border-t border-slate-200 pt-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-800 text-base">
                  <span>Total</span>
                  <span>{total.toFixed(2)} {currency}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700">Notes (optional)</Label>
              <Textarea
                placeholder="Payment terms, bank details, or any other notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-slate-200 text-slate-800 resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="text-slate-600">
                Back
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Review Invoice
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Invoice preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold text-slate-900">Invoice</p>
                  <p className="text-slate-500 font-mono text-sm mt-0.5">{invoiceNumber}</p>
                </div>
                <div className="text-right text-sm text-slate-500 space-y-0.5">
                  <p>Issue: <span className="text-slate-700">{issueDate}</span></p>
                  <p>Due: <span className="text-slate-700">{dueDate}</span></p>
                </div>
              </div>

              {/* Bill to */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Bill To</p>
                  <p className="font-medium text-slate-800">{recipientName || "—"}</p>
                  <p className="text-slate-500">{recipientEmail || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Payment</p>
                  <p className="font-medium text-slate-800">{currency}</p>
                  <p className="text-slate-500">{CHAINS.find(c => c.key === network)?.name || network}</p>
                </div>
              </div>

              {/* Line items */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-slate-400 font-normal py-1.5">Description</th>
                    <th className="text-center text-slate-400 font-normal py-1.5 w-12">Qty</th>
                    <th className="text-right text-slate-400 font-normal py-1.5 w-24">Price</th>
                    <th className="text-right text-slate-400 font-normal py-1.5 w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.filter(i => i.description).map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-50">
                      <td className="py-2 text-slate-700">{item.description}</td>
                      <td className="py-2 text-center text-slate-500">{item.quantity}</td>
                      <td className="py-2 text-right text-slate-500">{parseFloat(item.unitPrice || "0").toFixed(2)}</td>
                      <td className="py-2 text-right font-medium text-slate-800">{parseFloat(item.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end pt-1">
                <div className="w-48 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-200 pt-1.5">
                    <span>Total</span>
                    <span>{total.toFixed(2)} {currency}</span>
                  </div>
                </div>
              </div>

              {notes && (
                <div className="pt-2 border-t border-slate-100 text-sm text-slate-500">
                  <span className="font-medium text-slate-600">Notes: </span>{notes}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="text-slate-600">
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-slate-600 border-slate-200"
                  disabled={loading}
                  onClick={() => handleSubmit(true)}
                >
                  Save as Draft
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  disabled={loading}
                  onClick={() => handleSubmit(false)}
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Invoice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Invoice Detail Modal ────────────────────────────────────────────────────

interface InvoiceDetailModalProps {
  invoice: Invoice | null
  onClose: () => void
  onMarkPaid: (invoice: Invoice) => void
}

function InvoiceDetailModal({ invoice, onClose, onMarkPaid }: InvoiceDetailModalProps) {
  if (!invoice) return null

  const paymentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/invoice/${invoice.id}`
  const cfg = statusConfig[invoice.status] ?? statusConfig.draft

  const copyLink = () => {
    navigator.clipboard.writeText(paymentUrl)
    toast.success("Payment link copied!")
  }

  return (
    <Dialog open={!!invoice} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center justify-between pr-6">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              {invoice.invoiceNumber}
            </span>
            <Badge className={`text-xs border ${cfg.color} flex items-center gap-1`}><cfg.icon className="h-3 w-3" />{cfg.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Bill To</p>
              <p className="font-medium text-slate-800">{invoice.issuedTo || "—"}</p>
              {invoice.issuedToAddress && <p className="text-slate-500 font-mono text-xs truncate">{invoice.issuedToAddress}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Amount</p>
              <p className="font-bold text-slate-800 text-lg">{invoice.amount.toFixed(2)} <span className="text-sm font-normal text-slate-500">{invoice.currency}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Network</p>
              <p className="text-slate-700 capitalize">{invoice.network}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Due</p>
              <p className="text-slate-700">{invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString() : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Creator</p>
              <p className="text-slate-700">{invoice.agentId ? `Agent: ${invoice.agentName}` : "You"}</p>
            </div>
          </div>

          {/* Line items */}
          {Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0 && (
            <div className="rounded-lg border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-slate-500 font-normal px-3 py-2">Description</th>
                    <th className="text-center text-slate-500 font-normal px-3 py-2 w-12">Qty</th>
                    <th className="text-right text-slate-500 font-normal px-3 py-2 w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.lineItems as LineItem[]).map((item, i) => (
                    <tr key={i} className="border-t border-slate-50">
                      <td className="px-3 py-2 text-slate-700">{item.description}</td>
                      <td className="px-3 py-2 text-center text-slate-500">{item.quantity}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-800">{parseFloat(item.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-end">
            <div className="font-bold text-slate-900 text-base">
              Total: {invoice.amount.toFixed(2)} {invoice.currency}
            </div>
          </div>

          {/* Payment link */}
          {invoice.status !== "draft" && (
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <p className="text-xs text-slate-500 font-medium">Payment Link</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-slate-700 flex-1 truncate">{paymentUrl}</code>
                <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs" onClick={copyLink}>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Notes */}
          {(invoice as any).notes && (
            <div className="text-sm text-slate-500 border-t border-slate-100 pt-3">
              <span className="font-medium text-slate-600">Notes: </span>
              {(invoice as any).notes}
            </div>
          )}

          {/* TX hash */}
          {invoice.txHash && (
            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span className="font-medium">Tx: </span>
              <code className="font-mono">{invoice.txHash.slice(0, 12)}…{invoice.txHash.slice(-8)}</code>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {invoice.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                onClick={() => onMarkPaid(invoice)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Mark as Paid
              </Button>
            )}
            {invoice.status !== "draft" && (
              <Button size="sm" variant="outline" className="text-slate-600" onClick={copyLink}>
                <Send className="h-3.5 w-3.5 mr-1.5" /> Share Link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Register Agent Modal ────────────────────────────────────────────────────

interface RegisterAgentModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function RegisterAgentModal({ open, onClose, onCreated }: RegisterAgentModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", walletAddress: "", capabilitiesText: "" })

  const handleSubmit = async () => {
    setLoading(true)
    const capabilities = form.capabilitiesText.split(",").map((s) => s.trim()).filter(Boolean)
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description || null, walletAddress: form.walletAddress || null, capabilities }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) {
      setForm({ name: "", description: "", walletAddress: "", capabilitiesText: "" })
      toast.success("Agent registered!")
      onCreated()
      onClose()
    } else {
      toast.error(data.error || "Failed to register agent")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            Register Agent
          </DialogTitle>
          <DialogDescription>Add an AI agent that can issue invoices autonomously.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-700">Agent Name *</Label>
            <Input placeholder="My Invoice Bot" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-700">Description</Label>
            <Textarea placeholder="What this agent does..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border-slate-200 resize-none" rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-700">Wallet Address (optional)</Label>
            <Input placeholder="0x... (auto-derived if blank)" value={form.walletAddress} onChange={(e) => setForm({ ...form, walletAddress: e.target.value })} className="border-slate-200 font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-700">Capabilities (comma-separated)</Label>
            <Input placeholder="invoicing, payroll, billing" value={form.capabilitiesText} onChange={(e) => setForm({ ...form, capabilitiesText: e.target.value })} className="border-slate-200" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} className="text-slate-600">Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!form.name || loading} onClick={handleSubmit}>
              {loading ? "Registering..." : "Register Agent"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Module ─────────────────────────────────────────────────────────────

export function InvoiceModule() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, overdue: 0, totalValue: "0", paidValue: "0" })
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCreator, setFilterCreator] = useState("all") // "all" | "human" | "agent"
  const [showCreate, setShowCreate] = useState(false)
  const [showRegisterAgent, setShowRegisterAgent] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [createdPaymentUrl, setCreatedPaymentUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("invoices")

  const fetchInvoices = useCallback(async () => {
    const params = new URLSearchParams()
    if (filterStatus !== "all") params.set("status", filterStatus)
    if (filterCreator !== "all") params.set("creatorType", filterCreator)
    const res = await fetch(`/api/invoices${params.toString() ? "?" + params.toString() : ""}`)
    const data = await res.json()
    if (data.success) {
      setInvoices(data.data)
      setStats(data.stats)
    }
  }, [filterStatus, filterCreator])

  const fetchAgents = useCallback(async () => {
    const res = await fetch("/api/agents")
    const data = await res.json()
    if (data.success) setAgents(data.data)
  }, [])

  useEffect(() => {
    fetchInvoices()
    fetchAgents()
  }, [fetchInvoices, fetchAgents])

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
    toast.success("Invoice marked as paid")
  }

  const handleCreated = (invoice: Invoice, paymentUrl?: string) => {
    if (paymentUrl) setCreatedPaymentUrl(paymentUrl)
    fetchInvoices()
    fetchAgents()
  }

  const filteredInvoices = invoices // already filtered by API

  return (
    <div className="space-y-6">
      {/* Payment URL banner */}
      {createdPaymentUrl && (
        <div className="flex items-center justify-between gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-emerald-700 font-semibold text-sm">Invoice sent — share this link with your client</p>
              <p className="font-mono text-xs text-emerald-600/80 truncate">{createdPaymentUrl}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-700 hover:bg-emerald-50"
              onClick={() => { navigator.clipboard.writeText(createdPaymentUrl); toast.success("Copied!") }}
            >
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-700" onClick={() => setCreatedPaymentUrl(null)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            ),
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
          },
          {
            label: "Paid",
            value: stats.paid,
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ),
          },
          {
            label: "Total Value",
            value: `$${parseFloat(stats.totalValue).toLocaleString()}`,
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            ),
          },
        ].map((s) => (
          <Card key={s.label} className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, #0a2e2e, #0f3d3d)" }}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs">{s.label}</p>
                <p className="text-slate-900 font-bold text-lg">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="invoices" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">
              <Bot className="h-3.5 w-3.5 mr-1.5" />
              Agents
              {agents.length > 0 && (
                <span className="ml-1.5 bg-slate-200 text-slate-600 text-xs rounded-full px-1.5 py-0.5">{agents.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Rules
            </TabsTrigger>
          </TabsList>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
            onClick={() => setShowCreate(true)}
          >
            <FilePlus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* ── Invoices Tab ── */}
        <TabsContent value="invoices" className="mt-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {["all", "pending", "paid", "overdue", "draft"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                    filterStatus === s
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {[
                { value: "all", label: "All creators" },
                { value: "human", label: "Human" },
                { value: "agent", label: "Agent" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setFilterCreator(c.value)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterCreator === c.value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm">
            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-slate-700 font-semibold">No invoices yet</p>
                <p className="text-slate-400 text-sm mt-1">Create your first invoice to get started</p>
                <Button
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Invoice
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-slate-500 font-medium">Invoice #</TableHead>
                    <TableHead className="text-slate-500 font-medium">Recipient</TableHead>
                    <TableHead className="text-slate-500 font-medium">Amount</TableHead>
                    <TableHead className="text-slate-500 font-medium">Status</TableHead>
                    <TableHead className="text-slate-500 font-medium">Due</TableHead>
                    <TableHead className="text-slate-500 font-medium">Creator</TableHead>
                    <TableHead className="text-right text-slate-500 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv) => {
                    const cfg = statusConfig[inv.status] ?? statusConfig.draft
                    return (
                      <TableRow key={inv.id} className="border-slate-50 hover:bg-slate-50/50 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                        <TableCell className="font-mono text-sm text-slate-700">{inv.invoiceNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-slate-800 text-sm font-medium">{inv.issuedTo || "—"}</p>
                            {inv.issuedToAddress && (
                              <p className="text-slate-400 text-xs truncate max-w-[140px]">{inv.issuedToAddress}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-800">
                          {inv.amount.toFixed(2)}
                          <span className="text-xs text-slate-400 ml-1">{inv.currency}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs border ${cfg.color} flex items-center gap-1`}><cfg.icon className="h-3 w-3" />{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          {inv.agentId ? (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Bot className="h-3.5 w-3.5 text-purple-500" />
                              {inv.agentName || "Agent"}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <User className="h-3.5 w-3.5 text-emerald-500" />
                              You
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-slate-500 hover:text-slate-800"
                              onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv) }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {inv.status === "pending" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={(e) => { e.stopPropagation(); markAsPaid(inv) }}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* ── Agents Tab ── */}
        <TabsContent value="agents" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-1.5"
              onClick={() => setShowRegisterAgent(true)}
            >
              <Plus className="h-4 w-4" />
              Register Agent
            </Button>
          </div>
          {agents.length === 0 ? (
            <Card className="bg-white border-slate-200">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Bot className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-slate-700 font-semibold">No agents registered</p>
                <p className="text-slate-400 text-sm mt-1">Register an AI agent to issue invoices autonomously</p>
                <Button
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={() => setShowRegisterAgent(true)}
                >
                  <Plus className="h-4 w-4" />
                  Register Agent
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{agent.name}</p>
                          {agent.description && <p className="text-slate-500 text-xs mt-0.5">{agent.description}</p>}
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs border">
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Invoices</p>
                        <p className="font-semibold text-slate-800">{agent.invoiceCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Total Earned</p>
                        <p className="font-semibold text-slate-800">${agent.totalEarned.toFixed(2)}</p>
                      </div>
                    </div>
                    {agent.walletAddress && (
                      <p className="mt-3 text-xs text-slate-400 font-mono truncate">{agent.walletAddress}</p>
                    )}
                    {Array.isArray(agent.capabilities) && agent.capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {agent.capabilities.map((cap) => (
                          <span key={cap} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{cap}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Rules Tab ── */}
        <TabsContent value="rules" className="mt-0">
          <AgentRulesWidget agents={agents} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateInvoiceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
        agents={agents}
      />
      <RegisterAgentModal
        open={showRegisterAgent}
        onClose={() => setShowRegisterAgent(false)}
        onCreated={fetchAgents}
      />
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onMarkPaid={markAsPaid}
      />
    </div>
  )
}
