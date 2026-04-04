"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Plus, Copy, Shield, CheckCircle, Clock, AlertTriangle, Loader2, ExternalLink, Link2, LinkOff, Share2 } from "lucide-react"
import { toast } from "sonner"

interface PaymentLink {
  id: string
  code: string
  name: string | null
  sourceToken: string
  destStable: string
  amountMin: number | null
  amountMax: number | null
  status: string
  totalVolume: number
  transactions: number
  createdAt: string
}

export function PaymentLinksModule() {
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch('/api/payment-links')
      const data = await res.json()
      if (data.success) setLinks(data.data)
    } catch (e) {
      console.error('Failed to fetch payment links:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/l/${code}`)
    toast.success('Link copied!')
  }

  const deactivate = async (id: string) => {
    await fetch('/api/payment-links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'inactive' }),
    })
    fetchLinks()
  }

  const deleteLink = async (id: string) => {
    await fetch(`/api/payment-links?id=${id}`, { method: 'DELETE' })
    fetchLinks()
  }

  const activeLinks = links.filter(l => l.status === 'active')
  const inactiveLinks = links.filter(l => l.status !== 'active')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Links</h2>
          <p className="text-slate-500 mt-0.5 text-sm">Create and share compliant payment links</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-500 text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Payment Link</DialogTitle>
              <DialogDescription>Create a compliant payment link on HashKey Testnet</DialogDescription>
            </DialogHeader>
            <CreateLinkForm onSuccess={() => { setShowCreateDialog(false); fetchLinks() }} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeLinks.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveLinks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : activeLinks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <QrCode className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No active links</p>
              <p className="text-sm mt-1">Create your first payment link to get started</p>
            </div>
          ) : (
            activeLinks.map(link => <LinkCard key={link.id} link={link} onCopy={copyLink} onDeactivate={deactivate} onDelete={deleteLink} />)
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-4 space-y-3">
          {inactiveLinks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No inactive links</p>
            </div>
          ) : (
            inactiveLinks.map(link => <LinkCard key={link.id} link={link} onCopy={copyLink} onDeactivate={deactivate} onDelete={deleteLink} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LinkCard({ link, onCopy, onDeactivate, onDelete }: { link: PaymentLink; onCopy: (c: string) => void; onDeactivate: (id: string) => void; onDelete: (id: string) => void }) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/l/${link.code}`

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-slate-900 truncate">{link.name ?? link.code}</p>
              <Badge className={`flex items-center gap-1 ${link.status === 'active' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {link.status === 'active'
                  ? <Link2 className="h-3 w-3 text-emerald-600" />
                  : <LinkOff className="h-3 w-3 text-slate-400" />}
                {link.status}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-3 truncate">{url}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-teal-500" />
                {link.sourceToken}
              </span>
              {(link.amountMin || link.amountMax) && (
                <span>{link.amountMin ?? '0'} – {link.amountMax ?? '∞'}</span>
              )}
              <span>{link.transactions} payments</span>
              <span>${link.totalVolume.toLocaleString()} volume</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => onCopy(link.code)}>
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <Button variant="outline" size="sm" onClick={() => navigator.share({ url: `${window.location.origin}/l/${link.code}`, title: link.name ?? link.code })}>
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <a href={`/l/${link.code}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
            {link.status === 'active' && (
              <Button variant="outline" size="sm" className="text-amber-600 hover:text-amber-700 hover:border-amber-200" onClick={() => onDeactivate(link.id)}>
                Deactivate
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-200" onClick={() => onDelete(link.id)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [token, setToken] = useState('HSK')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    try {
      const code = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
      const res = await fetch('/api/payment-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name: name || null,
          sourceToken: token,
          destStable: token,
          amountMin: amountMin ? parseFloat(amountMin) : null,
          amountMax: amountMax ? parseFloat(amountMax) : null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Payment link created!')
        onSuccess()
      } else {
        toast.error(data.error ?? 'Failed to create link')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label>Link Name</Label>
        <Input placeholder="e.g. Conference Ticket" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Token</Label>
        <Select value={token} onValueChange={setToken}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="HSK">HSK (HashKey Native)</SelectItem>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Min Amount (optional)</Label>
          <Input type="number" placeholder="0.00" value={amountMin} onChange={e => setAmountMin(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Max Amount (optional)</Label>
          <Input type="number" placeholder="∞" value={amountMax} onChange={e => setAmountMax(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onSuccess} className="flex-1">Cancel</Button>
        <Button onClick={handleCreate} disabled={loading} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating…</> : 'Create Link'}
        </Button>
      </div>
    </div>
  )
}
