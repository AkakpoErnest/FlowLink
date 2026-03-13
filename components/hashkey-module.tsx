"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  TrendingUp,
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

const mockTransactions = [
  {
    hash: "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1",
    type: "Received",
    amount: "500.00",
    token: "USDC",
    from: "0x742d35Cc6634C05329",
    to: "0xYour...Wallet",
    status: "confirmed",
    time: "2 min ago",
    direction: "in",
  },
  {
    hash: "0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4",
    type: "Sent",
    amount: "250.00",
    token: "USDC",
    from: "0xYour...Wallet",
    to: "0x1234567890abcdef12",
    status: "confirmed",
    time: "1 hour ago",
    direction: "out",
  },
  {
    hash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
    type: "RWA Subscription",
    amount: "1000.00",
    token: "HSK-MMF",
    from: "0xYour...Wallet",
    to: "0xMMF...Contract",
    status: "confirmed",
    time: "3 hours ago",
    direction: "out",
  },
  {
    hash: "0x321cba654fed987321cba654fed987321cba654fed987321cba654fed987321c",
    type: "Received",
    amount: "100.00",
    token: "USDT",
    from: "0xPayroll...Agent",
    to: "0xYour...Wallet",
    status: "pending",
    time: "5 hours ago",
    direction: "in",
  },
]

const rwaProducts = [
  {
    name: "HashKey Money Market Fund",
    symbol: "HSK-MMF",
    apy: "4.2%",
    tvl: "$12.4M",
    type: "Money Market",
    risk: "Low",
    minInvestment: "$1,000",
    description: "Tokenized money market fund backed by short-term government securities",
  },
  {
    name: "HashKey Bond Token",
    symbol: "HSK-BOND",
    apy: "5.8%",
    tvl: "$8.7M",
    type: "Fixed Income",
    risk: "Low-Medium",
    minInvestment: "$5,000",
    description: "Tokenized bond portfolio with quarterly coupon payments",
  },
]

export function HashKeyModule() {
  const [copied, setCopied] = useState("")

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Layers className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                HashKey Chain
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">Mainnet</Badge>
              </h2>
              <p className="text-slate-400 text-sm">Compliance-ready blockchain for regulated finance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Connected</span>
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
            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5 hover:bg-blue-500/20 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs">Open Explorer</span>
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
                    <p className="text-slate-400 text-xs font-mono">{token.address.slice(0, 10)}...{token.address.slice(-6)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">{token.symbol}</Badge>
                  <p className="text-slate-500 text-xs mt-1">{token.decimals} decimals</p>
                </div>
              </div>
            ))}
            {hashkeyTokens.RWATokens.map(token => (
              <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{token.name}</p>
                    <p className="text-blue-400 text-xs">APY: {token.apy}</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">{token.symbol}</Badge>
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

      {/* RWA Products */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            Real World Assets (RWA) on HashKey
          </CardTitle>
          <CardDescription>Tokenized financial products available on HashKey Chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rwaProducts.map(product => (
              <div key={product.symbol} className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:border-slate-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{product.name}</p>
                      <p className="text-slate-400 text-xs">{product.symbol}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold">{product.apy} APY</Badge>
                </div>
                <p className="text-slate-400 text-xs mb-3">{product.description}</p>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="p-2 bg-slate-800/50 rounded">
                    <p className="text-slate-500">TVL</p>
                    <p className="text-white font-medium">{product.tvl}</p>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded">
                    <p className="text-slate-500">Type</p>
                    <p className="text-white font-medium">{product.type}</p>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded">
                    <p className="text-slate-500">Risk</p>
                    <p className="text-emerald-400 font-medium">{product.risk}</p>
                  </div>
                </div>
                <Button className="w-full h-8 text-xs bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30">
                  Subscribe (Min: {product.minInvestment})
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Recent Transactions on HashKey Chain
          </CardTitle>
          <CardDescription>Your latest on-chain activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockTransactions.map((tx, idx) => (
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
                className="text-slate-500 hover:text-blue-400 shrink-0"
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
