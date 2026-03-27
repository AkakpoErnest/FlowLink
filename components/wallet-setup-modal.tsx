"use client"

import { useState, useCallback } from "react"
import { generateMnemonic, mnemonicToAccount, privateKeyToAccount } from "viem/accounts"
import { english } from "viem/accounts"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import {
  Wallet, ShieldAlert, Eye, EyeOff, Copy, Check,
  AlertTriangle, ArrowRight, Loader2, KeyRound
} from "lucide-react"
import { toast } from "sonner"

interface WalletSetupModalProps {
  open: boolean
  onClose: () => void
}

export function WalletSetupModal({ open, onClose }: WalletSetupModalProps) {
  const { update } = useSession()
  const { address: connectedAddress, isConnected } = useAccount()

  // Create wallet state
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [createdAddress, setCreatedAddress] = useState<string | null>(null)
  const [seedVisible, setSeedVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmedBackup, setConfirmedBackup] = useState(false)

  // Import wallet state
  const [importPhrase, setImportPhrase] = useState("")
  const [importedAddress, setImportedAddress] = useState<string | null>(null)
  const [importError, setImportError] = useState("")

  const [saving, setSaving] = useState(false)

  // ── Generate new wallet ───────────────────────────────────────────────────
  const generateWallet = useCallback(() => {
    const phrase = generateMnemonic(english)
    const account = mnemonicToAccount(phrase)
    setMnemonic(phrase)
    setCreatedAddress(account.address)
    setSeedVisible(false)
    setConfirmedBackup(false)
    setCopied(false)
  }, [])

  const copyMnemonic = () => {
    if (!mnemonic) return
    navigator.clipboard.writeText(mnemonic)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Derive address from import phrase ────────────────────────────────────
  const deriveImportedAddress = () => {
    setImportError("")
    const phrase = importPhrase.trim()
    if (!phrase) return

    // Try as mnemonic (12 or 24 words)
    const words = phrase.split(/\s+/)
    if (words.length === 12 || words.length === 24) {
      try {
        const account = mnemonicToAccount(phrase)
        setImportedAddress(account.address)
        return
      } catch {
        setImportError("Invalid seed phrase — check for typos and try again.")
        setImportedAddress(null)
        return
      }
    }

    // Try as raw private key
    try {
      const pk = phrase.startsWith("0x") ? phrase : `0x${phrase}`
      const account = privateKeyToAccount(pk as `0x${string}`)
      setImportedAddress(account.address)
    } catch {
      setImportError("Not a valid seed phrase or private key.")
      setImportedAddress(null)
    }
  }

  // ── Link wallet address to account ───────────────────────────────────────
  const linkAddress = async (addr: string) => {
    setSaving(true)
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: addr }),
      })
      const data = await res.json()
      if (data.success) {
        // Use the canonical (lowercased) address returned by the server so the
        // session token stays in sync with what is stored in the database.
        await update({ walletAddress: data.data?.walletAddress ?? addr.toLowerCase() })
        toast.success("Wallet linked to your account!")
        onClose()
      } else {
        toast.error(data.error ?? "Failed to link wallet.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const mnemonicWords = mnemonic ? mnemonic.split(" ") : []

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            Set Up Your Wallet
          </DialogTitle>
          <DialogDescription>
            Link a wallet to your account to send and receive payments.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connect" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          {/* ── Connect existing wallet (RainbowKit) ── */}
          <TabsContent value="connect" className="space-y-4 pt-3">
            <p className="text-sm text-slate-400">
              Connect MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet.
            </p>
            <div className="flex justify-center py-2">
              <ConnectButton label="Connect Wallet" accountStatus="address" showBalance={false} />
            </div>
            {isConnected && connectedAddress && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 text-center font-mono">
                  {connectedAddress}
                </p>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={() => linkAddress(connectedAddress)}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  {saving ? "Linking…" : "Link this wallet"}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ── Create new wallet ── */}
          <TabsContent value="create" className="space-y-4 pt-3">
            {!mnemonic ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/8 p-3 flex gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200">
                    FlowLink will generate a wallet for you. <strong>You must save your seed phrase</strong> — it's the only way to recover your wallet. Never share it with anyone.
                  </p>
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={generateWallet}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Generate New Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Address preview */}
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Wallet Address</p>
                  <p className="font-mono text-xs text-emerald-400 break-all">{createdAddress}</p>
                </div>

                {/* Seed phrase display */}
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <p className="text-xs font-semibold text-red-400">Secret Recovery Phrase</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={copyMnemonic}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Copy"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => setSeedVisible(!seedVisible)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title={seedVisible ? "Hide" : "Reveal"}
                      >
                        {seedVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {seedVisible ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      {mnemonicWords.map((word, i) => (
                        <div key={i} className="flex items-center gap-1 bg-slate-800 rounded px-2 py-1">
                          <span className="text-[10px] text-slate-500 w-4">{i + 1}.</span>
                          <span className="text-xs text-white font-mono">{word}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSeedVisible(true)}
                      className="w-full h-20 rounded border border-dashed border-red-500/40 flex items-center justify-center gap-2 text-sm text-red-400 hover:border-red-500/70 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Click to reveal seed phrase
                    </button>
                  )}
                </div>

                {/* Backup confirmation */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-emerald-500"
                    checked={confirmedBackup}
                    onChange={(e) => setConfirmedBackup(e.target.checked)}
                  />
                  <span className="text-xs text-slate-400">
                    I have saved my seed phrase somewhere safe. I understand that losing it means losing access to my wallet forever.
                  </span>
                </label>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateWallet}
                    className="flex-1"
                  >
                    Regenerate
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                    size="sm"
                    disabled={!confirmedBackup || saving}
                    onClick={() => linkAddress(createdAddress!)}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ArrowRight className="h-4 w-4 mr-1" />}
                    {saving ? "Saving…" : "Use this wallet"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Import wallet ── */}
          <TabsContent value="import" className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">
                <KeyRound className="inline h-3 w-3 mr-1" />
                Seed phrase (12 or 24 words) or private key
              </Label>
              <Textarea
                placeholder="word1 word2 word3 … or 0xprivatekey"
                className="font-mono text-xs resize-none h-24"
                value={importPhrase}
                onChange={(e) => {
                  setImportPhrase(e.target.value)
                  setImportedAddress(null)
                  setImportError("")
                }}
              />
              {importError && <p className="text-xs text-red-400">{importError}</p>}
            </div>

            {!importedAddress ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={deriveImportedAddress}
                disabled={!importPhrase.trim()}
              >
                Derive Address
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Derived Address</p>
                  <p className="font-mono text-xs text-emerald-400 break-all">{importedAddress}</p>
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={() => linkAddress(importedAddress)}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  {saving ? "Linking…" : "Link this wallet"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-slate-500"
                  onClick={() => { setImportedAddress(null); setImportPhrase("") }}
                >
                  Use a different phrase
                </Button>
              </div>
            )}

            <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3 flex gap-2">
              <ShieldAlert className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">
                Your seed phrase is processed locally — it is never sent to FlowLink servers. Only the derived address is stored.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
