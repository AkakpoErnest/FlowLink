"use client"

import { useState } from "react"
import {
  Search, User, Lock, Bell, Building2, Users, Shield,
  CreditCard, Plug, Coins, Hash, Store, Wallet, Globe, FileText
} from "lucide-react"

const settingsSections = [
  {
    title: "Personal",
    items: [
      { icon: User, title: "Personal Details", desc: "Edit your name and email address to keep your profile up to date.", href: "#personal" },
      { icon: Lock, title: "Authentication", desc: "Re-authenticate to change your password or two-factor settings.", href: "#auth" },
      { icon: Bell, title: "Notifications", desc: "Manage which email alerts and updates you'd like to receive.", href: "#notifications" },
    ]
  },
  {
    title: "Company",
    items: [
      { icon: Building2, title: "Company Details", desc: "Update your company information used on all future payables & receivables.", href: "#company" },
      { icon: Users, title: "Team", desc: "Manage team roles and permissions.", href: "#team" },
      { icon: Shield, title: "Team Security", desc: "Manage mandatory team authentication.", href: "#security" },
      { icon: CreditCard, title: "Subscription", desc: "View your current plan, billing history, and available upgrades.", href: "#subscription" },
      { icon: Plug, title: "Integrations", desc: "Connect FlowLink to accounting software and other tools.", href: "#integrations" },
    ]
  },
  {
    title: "Product",
    items: [
      { icon: Coins, title: "Stablecoin Settings", desc: "Configure accepted stablecoins and token preferences for payments.", href: "#stablecoins" },
      { icon: Wallet, title: "Wallet & Chain", desc: "Manage your connected wallet and HashKey Chain settings.", href: "#wallet" },
      { icon: Globe, title: "Payment Links", desc: "Configure default settings for your payment links.", href: "#payment-links" },
      { icon: Shield, title: "Compliance", desc: "Manage KYC/AML rules and compliance thresholds.", href: "#compliance" },
      { icon: FileText, title: "Invoice Settings", desc: "Set invoice numbering, templates, and due date defaults.", href: "#invoices" },
      { icon: Store, title: "Vendor Policy", desc: "Choose who can send bills and block unauthorized vendors.", href: "#vendors" },
    ]
  }
]

export function SettingsModule() {
  const [search, setSearch] = useState("")

  const filtered = settingsSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(section => section.items.length > 0)

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {filtered.map(section => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-slate-900 mb-5">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map(item => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                    <item.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </a>
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
