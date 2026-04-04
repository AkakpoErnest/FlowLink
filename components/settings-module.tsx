"use client"

import { useState, useEffect } from "react"
import {
  Search, User, Lock, Bell, Building2, Users, Shield,
  CreditCard, Plug, Coins, Hash, Store, Wallet, Globe, FileText,
  ChevronRight, ArrowLeft, Loader2, Check, Eye, EyeOff,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"

// ─── Panel definitions ─────────────────────────────────────────────────────

type PanelId =
  | "personal" | "auth" | "notifications"
  | "company" | "team" | "security" | "subscription" | "integrations"
  | "stablecoins" | "wallet-chain" | "payment-links-cfg" | "compliance" | "invoices-cfg" | "vendors"

const settingsSections = [
  {
    title: "Personal",
    items: [
      { id: "personal" as PanelId, icon: User, title: "Personal Details", desc: "Edit your name and email address to keep your profile up to date." },
      { id: "auth" as PanelId, icon: Lock, title: "Authentication", desc: "Re-authenticate to change your password or two-factor settings." },
      { id: "notifications" as PanelId, icon: Bell, title: "Notifications", desc: "Manage which email alerts and updates you'd like to receive." },
    ],
  },
  {
    title: "Company",
    items: [
      { id: "company" as PanelId, icon: Building2, title: "Company Details", desc: "Update your company information used on all future payables & receivables." },
      { id: "team" as PanelId, icon: Users, title: "Team", desc: "Manage team roles and permissions." },
      { id: "security" as PanelId, icon: Shield, title: "Team Security", desc: "Manage mandatory team authentication." },
      { id: "subscription" as PanelId, icon: CreditCard, title: "Subscription", desc: "View your current plan, billing history, and available upgrades." },
      { id: "integrations" as PanelId, icon: Plug, title: "Integrations", desc: "Connect FlowLink to accounting software and other tools." },
    ],
  },
  {
    title: "Product",
    items: [
      { id: "stablecoins" as PanelId, icon: Coins, title: "Stablecoin Settings", desc: "Configure accepted stablecoins and token preferences for payments." },
      { id: "wallet-chain" as PanelId, icon: Wallet, title: "Wallet & Chain", desc: "Manage your connected wallet and HashKey Chain settings." },
      { id: "payment-links-cfg" as PanelId, icon: Globe, title: "Payment Links", desc: "Configure default settings for your payment links." },
      { id: "compliance" as PanelId, icon: Shield, title: "Compliance", desc: "Manage KYC/AML rules and compliance thresholds." },
      { id: "invoices-cfg" as PanelId, icon: FileText, title: "Invoice Settings", desc: "Set invoice numbering, templates, and due date defaults." },
      { id: "vendors" as PanelId, icon: Store, title: "Vendor Policy", desc: "Choose who can send bills and block unauthorized vendors." },
    ],
  },
]

// ─── Personal Details Panel ────────────────────────────────────────────────

function PersonalDetailsPanel({ onBack }: { onBack: () => void }) {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? "")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  useEffect(() => { setName(session?.user?.name ?? "") }, [session?.user?.name])

  const save = async () => {
    setSaving(true); setMsg(null)
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (data.success) {
        await update({ name })
        setMsg({ type: "ok", text: "Changes saved." })
      } else {
        setMsg({ type: "err", text: data.error ?? "Failed to save." })
      }
    } catch {
      setMsg({ type: "err", text: "Something went wrong." })
    } finally {
      setSaving(false)
    }
  }

  const isDirty = name !== (session?.user?.name ?? "")
  const isOAuth = !!(session?.user?.email && !(session?.user as any)?.hasPassword)

  return (
    <div className="space-y-6">
      <PanelHeader title="Personal Details" icon={User} onBack={onBack} />

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-slate-700 font-medium">Display Name</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm text-slate-700 font-medium">
            Email <span className="text-slate-400 font-normal">(read-only)</span>
          </Label>
          <Input
            value={session?.user?.email ?? "—"}
            readOnly
            className="mt-1.5 bg-slate-50 text-slate-500"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
        </div>

        {msg && (
          <p className={`text-sm flex items-center gap-1.5 ${msg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}>
            {msg.type === "ok" && <Check className="h-4 w-4" />}
            {msg.text}
          </p>
        )}

        <Button
          onClick={save}
          disabled={!isDirty || saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

// ─── Authentication Panel ──────────────────────────────────────────────────

function AuthenticationPanel({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession()
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" })
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const isGoogleOnly = !!(session?.user?.email) // heuristic: all users might not have password

  const save = async () => {
    if (form.newPw !== form.confirm) {
      setMsg({ type: "err", text: "Passwords do not match." }); return
    }
    if (form.newPw.length < 8) {
      setMsg({ type: "err", text: "Password must be at least 8 characters." }); return
    }
    setSaving(true); setMsg(null)
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.current || undefined, newPassword: form.newPw }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "ok", text: "Password updated successfully." })
        setForm({ current: "", newPw: "", confirm: "" })
      } else {
        setMsg({ type: "err", text: data.error ?? "Failed to update password." })
      }
    } catch {
      setMsg({ type: "err", text: "Something went wrong." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PanelHeader title="Authentication" icon={Lock} onBack={onBack} />

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
          Set or change your password. If you signed up via Google, you can add a password to enable email login as well.
        </div>

        <div>
          <Label className="text-sm text-slate-700 font-medium">Current Password</Label>
          <div className="relative mt-1.5">
            <Input
              type={show.current ? "text" : "password"}
              value={form.current}
              onChange={e => setForm({ ...form, current: e.target.value })}
              placeholder="Enter current password (if set)"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, current: !s.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Leave blank if you don't have a password yet.</p>
        </div>

        <div>
          <Label className="text-sm text-slate-700 font-medium">New Password</Label>
          <div className="relative mt-1.5">
            <Input
              type={show.newPw ? "text" : "password"}
              value={form.newPw}
              onChange={e => setForm({ ...form, newPw: e.target.value })}
              placeholder="At least 8 characters"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, newPw: !s.newPw }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {show.newPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.newPw.length > 0 && (
            <div className="mt-1.5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  form.newPw.length < 8 ? "w-1/4 bg-red-400" :
                  form.newPw.length < 12 ? "w-1/2 bg-yellow-400" :
                  "w-full bg-emerald-500"
                }`}
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm text-slate-700 font-medium">Confirm New Password</Label>
          <div className="relative mt-1.5">
            <Input
              type={show.confirm ? "text" : "password"}
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repeat new password"
              className={`pr-10 ${form.confirm && form.confirm !== form.newPw ? "border-red-300 focus:ring-red-300" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.confirm && form.confirm !== form.newPw && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
          )}
        </div>

        {msg && (
          <p className={`text-sm flex items-center gap-1.5 ${msg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}>
            {msg.type === "ok" && <Check className="h-4 w-4" />}
            {msg.text}
          </p>
        )}

        <Button
          onClick={save}
          disabled={!form.newPw || !form.confirm || saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Update Password"}
        </Button>
      </div>
    </div>
  )
}

// ─── Notifications Panel ───────────────────────────────────────────────────

function NotificationsPanel({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({
    paymentReceived: true,
    invoicePaid: true,
    payrollCompleted: true,
    complianceAlert: true,
    productUpdates: false,
    marketing: false,
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const rows = [
    { key: "paymentReceived" as const, label: "Payment received", desc: "When someone pays via your payment link" },
    { key: "invoicePaid" as const, label: "Invoice paid", desc: "When a client pays an invoice" },
    { key: "payrollCompleted" as const, label: "Payroll completed", desc: "When a payroll batch finishes" },
    { key: "complianceAlert" as const, label: "Compliance alerts", desc: "KYC failures, sanctions matches" },
    { key: "productUpdates" as const, label: "Product updates", desc: "New features and improvements" },
    { key: "marketing" as const, label: "Marketing emails", desc: "Tips, guides, and promotions" },
  ]

  return (
    <div className="space-y-6">
      <PanelHeader title="Notifications" icon={Bell} onBack={onBack} />
      <div className="divide-y divide-slate-100">
        {rows.map(r => (
          <div key={r.key} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{r.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
            </div>
            <Switch checked={prefs[r.key]} onCheckedChange={() => toggle(r.key)} />
          </div>
        ))}
      </div>
      <Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white">
        {saved ? <><Check className="h-4 w-4 mr-2" />Saved</> : "Save Preferences"}
      </Button>
    </div>
  )
}

// ─── Coming Soon Panel ─────────────────────────────────────────────────────

function ComingSoonPanel({ title, icon: Icon, onBack }: { title: string; icon: React.ComponentType<{ className?: string }>; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <PanelHeader title={title} icon={Icon} onBack={onBack} />
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-indigo-400" />
        </div>
        <p className="text-slate-900 font-semibold">Coming soon</p>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">This section is under development. Check back in a future update.</p>
      </div>
    </div>
  )
}

// ─── Shared panel header ───────────────────────────────────────────────────

function PanelHeader({ title, icon: Icon, onBack }: { title: string; icon: React.ComponentType<{ className?: string }>; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
      <button
        onClick={onBack}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export function SettingsModule() {
  const [search, setSearch] = useState("")
  const [activePanel, setActivePanel] = useState<PanelId | null>(null)

  const filtered = settingsSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(section => section.items.length > 0)

  const renderPanel = () => {
    switch (activePanel) {
      case "personal":       return <PersonalDetailsPanel onBack={() => setActivePanel(null)} />
      case "auth":           return <AuthenticationPanel onBack={() => setActivePanel(null)} />
      case "notifications":  return <NotificationsPanel onBack={() => setActivePanel(null)} />
      default: {
        const all = settingsSections.flatMap(s => s.items)
        const item = all.find(i => i.id === activePanel)
        if (!item) return null
        return <ComingSoonPanel title={item.title} icon={item.icon} onBack={() => setActivePanel(null)} />
      }
    }
  }

  if (activePanel) {
    return (
      <div className="max-w-xl mx-auto py-8 px-6">
        {renderPanel()}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search settings…"
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {filtered.map(section => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-slate-900 mb-5">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all group text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                    <item.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-12">No settings found for "{search}"</p>
        )}
      </div>
    </div>
  )
}
