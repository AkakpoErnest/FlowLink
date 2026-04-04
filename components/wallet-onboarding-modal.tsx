"use client"

import { useState, useCallback } from "react"
import { generateMnemonic, mnemonicToAccount, privateKeyToAccount } from "viem/accounts"
import { english } from "viem/accounts"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
  Plus,
  Download,
} from "lucide-react"
import { toast } from "sonner"

interface WalletOnboardingModalProps {
  open: boolean
  onClose: () => void
}

type Step = "choice" | "create" | "import"

export function WalletOnboardingModal({ open, onClose }: WalletOnboardingModalProps) {
  const { update } = useSession()
  const [step, setStep] = useState<Step>("choice")

  // ── Create wallet state ─────────────────────────────────────────────────
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [createdAddress, setCreatedAddress] = useState<string | null>(null)
  const [seedVisible, setSeedVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmedBackup, setConfirmedBackup] = useState(false)

  // ── Import wallet state ─────────────────────────────────────────────────
  const [importPhrase, setImportPhrase] = useState("")
  const [importedAddress, setImportedAddress] = useState<string | null>(null)
  const [importError, setImportError] = useState("")

  const [saving, setSaving] = useState(false)

  // ── Helpers ─────────────────────────────────────────────────────────────

  const resetCreate = () => {
    setMnemonic(null)
    setCreatedAddress(null)
    setSeedVisible(false)
    setCopied(false)
    setConfirmedBackup(false)
  }

  const resetImport = () => {
    setImportPhrase("")
    setImportedAddress(null)
    setImportError("")
  }

  const goBack = () => {
    setStep("choice")
    resetCreate()
    resetImport()
  }

  const handleSkip = () => {
    onClose()
  }

  // ── Generate wallet ──────────────────────────────────────────────────────
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

  // ── Derive imported address ──────────────────────────────────────────────
  const deriveImportedAddress = () => {
    setImportError("")
    const phrase = importPhrase.trim()
    if (!phrase) return

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

  // ── Save wallet to account ───────────────────────────────────────────────
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
        // Use the canonical lowercase address that the server stored
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

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg">

        {/* ── CHOICE STEP ── */}
        {step === "choice" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-emerald-400" />
                Welcome to FlowLink
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-400 pt-1">
                To send and receive crypto payments you need a wallet. Would you like to create a
                new one or import an existing wallet?
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* Create */}
              <button
                onClick={() => { setStep("create"); generateWallet() }}
                className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/6 p-5 text-left hover:bg-emerald-500/12 hover:border-emerald-500/50 transition-all group"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                  <Plus className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Create new wallet</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Generate a secure wallet with a 12-word seed phrase
                  </p>
                </div>
              </button>

              {/* Import */}
              <button
                onClick={() => setStep("import")}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left hover:bg-slate-100 hover:border-slate-300 transition-all group"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <Download className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Import existing</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Restore a wallet using your seed phrase or private key
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={handleSkip}
              className="mt-1 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
            >
              Skip for now →
            </button>
          </>
        )}

        {/* ── CREATE STEP ── */}
        {step === "create" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <button
                  onClick={goBack}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-400" />
                  Create New Wallet
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-1">
              {/* Address preview */}
              {createdAddress && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                    Wallet Address
                  </p>
                  <p className="font-mono text-xs text-emerald-600 break-all">
                    {createdAddress}
                  </p>
                </div>
              )}

              {/* Seed phrase */}
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-xs font-semibold text-red-400">
                      Write this down — you cannot recover it
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={copyMnemonic}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Copy seed phrase"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setSeedVisible(!seedVisible)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title={seedVisible ? "Hide" : "Reveal"}
                    >
                      {seedVisible ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {seedVisible ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {mnemonicWords.map((word, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 bg-slate-100 rounded px-2 py-1"
                      >
                        <span className="text-[10px] text-slate-400 w-4 shrink-0">{i + 1}.</span>
                        <span className="text-xs text-slate-900 font-mono">{word}</span>
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

                <p className="text-[10px] text-red-300/70 leading-relaxed">
                  Never share your seed phrase with anyone. FlowLink staff will never ask for it.
                  Losing it means permanent loss of access to your wallet.
                </p>
              </div>

              {/* Backup confirmation checkbox */}
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-emerald-500 shrink-0"
                  checked={confirmedBackup}
                  onChange={(e) => setConfirmedBackup(e.target.checked)}
                />
                <span className="text-xs text-slate-400">
                  I&apos;ve saved my seed phrase somewhere safe. I understand that losing it means
                  losing access to my wallet forever.
                </span>
              </label>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateWallet}
                  className="flex-1 text-slate-400 border-slate-600"
                  disabled={saving}
                >
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                  disabled={!confirmedBackup || saving || !createdAddress}
                  onClick={() => linkAddress(createdAddress!)}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                  )}
                  {saving ? "Saving…" : "Use this wallet"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ── IMPORT STEP ── */}
        {step === "import" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <button
                  onClick={goBack}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <DialogTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-slate-300" />
                  Import Existing Wallet
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-1">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
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
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                      Derived Address
                    </p>
                    <p className="font-mono text-xs text-emerald-600 break-all">
                      {importedAddress}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={() => linkAddress(importedAddress)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Linking…" : "Link this wallet"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-slate-500"
                    onClick={resetImport}
                  >
                    Use a different phrase
                  </Button>
                </div>
              )}

              {/* Privacy note */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex gap-2">
                <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">
                  Your seed phrase is processed locally in your browser — it is never sent to
                  FlowLink servers. Only the derived wallet address is stored.
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
