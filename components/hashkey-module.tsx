"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  DollarSign,
  Activity,
} from "lucide-react"
import { hashkeyChain, hashkeyTokens, hashkeyCompliance } from "@/lib/hashkey"
import { useAccount } from "wagmi"

interface TxRow {
  hash: string
  type: string
  amount: string
  token: string
  from: string
  to: string
  status: string
  time: string
  direction: "in" | "out"
}

export function HashKeyModule() {
  const [copied, setCopied] = useState("")
  const [transactions, setTransactions] = useState<TxRow[]>([])
  const [loadingTx, setLoadingTx] = useState(true)
  const { isConnected, chain } = useAccount()

  useEffect(() => {
    fetch("/api/payments?limit=10&network=hashkey-testnet")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setTransactions(
            json.data.map((p: any) => ({
              hash: p.txHash || p.id,
              type: p.payer ? "Received" : "Payment",
              amount: Number(p.amount).toFixed(2),
              token: p.currency,
              from: p.payer || "—",
              to: "—",
              status: p.status === "completed" ? "confirmed" : p.status,
              time: new Date(p.createdAt).toLocaleDateString(),
              direction: "in" as const,
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoadingTx(false))
  }, [])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Layers className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                HashKey Chain
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">Testnet</Badge>
              </h2>
              <p className="text-slate-400 text-sm">Compliance-ready blockchain for regulated finance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isConnected ? (chain?.id === 133 ? 'HashKey Testnet' : `Wrong network`) : 'Not connected'}
            </span>
          </div>
        </div>

        {/* Chain stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "Chain ID", value: `${hashkeyChain.id}`, icon: Layers },
            { label: "Native Token", value: hashkeyChain.nativeCurrency.symbol, icon: DollarSign },
            { label: "Block Explorer", value: "Blockscout", icon: ExternalLink },
            { label: "KYC Required", value: hashkeyCompliance.kycRequired ? "Yes" : "No", icon: Shield },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-3.5 w-3.5 text-slate-500" />
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </div>
              <p className="text-white font-semibold text-sm">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* RPC + Explorer links */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-300 text-xs font-mono">{hashkeyChain.rpcUrls.default.http[0]}</span>
            <button onClick={() => copy(hashkeyChain.rpcUrls.default.http[0], "rpc")} className="text-slate-500 hover:text-slate-300">
              {copied === "rpc" ? <CheckCircle className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          <a
            href={hashkeyChain.blockExplorers.default.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 hover:bg-emerald-500/20 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs">Open Explorer</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supported Tokens */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Supported Tokens
            </CardTitle>
            <CardDescription>Stablecoins and assets on HashKey Chain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hashkeyTokens.stablecoins.map(token => (
              <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">{token.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{token.name}</p>
                    <p className="text-slate-400 text-xs font-mono">
                      {token.address
                        ? `${token.address.slice(0, 10)}...${token.address.slice(-6)}`
                        : 'Address TBD — check HashKey testnet explorer'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">{token.symbol}</Badge>
                  <p className="text-slate-500 text-xs mt-1">{token.decimals} decimals</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Info */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              Compliance Framework
            </CardTitle>
            <CardDescription>HashKey Chain regulatory standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                { label: "KYC Verification", status: true, detail: hashkeyCompliance.kycProviders.join(", ") },
                { label: "Sanctions Screening", status: true, detail: "Real-time OFAC & global screening" },
                { label: "Travel Rule Compliant", status: true, detail: "FATF Travel Rule compliance" },
                { label: "AML Monitoring", status: true, detail: "Automated transaction monitoring" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-slate-400 text-xs">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-2">Supported Jurisdictions</p>
              <div className="flex flex-wrap gap-2">
                {hashkeyCompliance.supportedJurisdictions.map(j => (
                  <Badge key={j} className="bg-slate-700 text-slate-300 border-slate-600 text-xs">{j}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-slate-700/30 rounded">
                <p className="text-slate-500">Daily Limit</p>
                <p className="text-white font-medium">$1,000,000</p>
              </div>
              <div className="p-2 bg-slate-700/30 rounded">
                <p className="text-slate-500">Monthly Limit</p>
                <p className="text-white font-medium">$10,000,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Recent Transactions on HashKey Chain
          </CardTitle>
          <CardDescription>Your latest on-chain activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {loadingTx ? (
            <div className="text-center py-8 text-slate-400">Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No transactions yet</div>
          ) : null}
          {transactions.map((tx, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all">
              <div className={`p-2 rounded-full ${tx.direction === "in" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                {tx.direction === "in"
                  ? <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                  : <ArrowUpRight className="h-4 w-4 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium">{tx.type}</p>
                  <Badge className={`text-xs border ${tx.status === "confirmed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}`}>
                    {tx.status === "confirmed" ? <CheckCircle className="h-2.5 w-2.5 mr-1" /> : <Clock className="h-2.5 w-2.5 mr-1" />}
                    {tx.status}
                  </Badge>
                </div>
                <p className="text-slate-400 text-xs font-mono truncate">{tx.hash.slice(0, 20)}...{tx.hash.slice(-8)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold text-sm font-mono ${tx.direction === "in" ? "text-emerald-400" : "text-red-400"}`}>
                  {tx.direction === "in" ? "+" : "-"}{tx.amount} {tx.token}
                </p>
                <p className="text-slate-500 text-xs">{tx.time}</p>
              </div>
              <a
                href={`${hashkeyChain.blockExplorers.default.url}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-emerald-400 shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
