"use client"

import { useState } from "react"
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSwitchChain,
} from "wagmi"
import { parseEther, parseUnits } from "viem"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { CheckCircle, AlertTriangle, Clock, ExternalLink, Loader2, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getChain, getToken, isNativeToken } from "@/lib/chains"
import { toast } from "sonner"

const ERC20_TRANSFER_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

interface LineItem {
  description: string
  quantity: number
  unitPrice: string
  total: string
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  issuedTo: string | null
  issuedToAddress: string | null
  amount: number
  subtotal: number | null
  currency: string
  network: string
  status: string
  lineItems: LineItem[] | null
  notes: string | null
  dueAt: string | null
  paidAt: string | null
  txHash: string | null
  paymentLinkCode: string | null
  hspCheckoutUrl: string | null
  createdAt: string
}

interface Props {
  invoice: InvoiceData
  senderName: string
  recipientAddress: string | null
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600 border-slate-200", icon: Clock },
  pending: { label: "Pending Payment", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
}

function isOverdue(dueAt: string | null, status: string) {
  if (status === "paid" || !dueAt) return false
  return new Date(dueAt) < new Date()
}

export function InvoicePaymentClient({ invoice, senderName, recipientAddress }: Props) {
  const { address, isConnected, chain } = useAccount()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  const [txSubmitted, setTxSubmitted] = useState(false)
  const [localStatus, setLocalStatus] = useState(invoice.status)
  const [localTxHash, setLocalTxHash] = useState(invoice.txHash)

  const targetChain = getChain(invoice.network)
  const onCorrectChain = chain?.id === targetChain?.id
  const explorerUrl = targetChain?.explorerUrl ?? ""

  const {
    sendTransaction,
    data: nativeTxHash,
    isPending: isSendingNative,
    reset: resetTx,
  } = useSendTransaction()

  const {
    writeContract,
    data: erc20TxHash,
    isPending: isSendingErc20,
    reset: resetWrite,
  } = useWriteContract()

  const txHash = localTxHash ?? nativeTxHash ?? erc20TxHash
  const isSending = isSendingNative || isSendingErc20

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: (nativeTxHash ?? erc20TxHash) as `0x${string}` | undefined,
    query: { enabled: !!(nativeTxHash ?? erc20TxHash) },
  })

  // Mark paid in DB once confirmed
  const handleConfirmed = async (hash: string) => {
    setLocalTxHash(hash)
    setLocalStatus("paid")
    setTxSubmitted(true)
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", txHash: hash }),
      })
      toast.success("Payment confirmed!")
    } catch {
      // non-fatal
    }
  }

  // Watch for confirmation
  if ((nativeTxHash || erc20TxHash) && isConfirmed && !txSubmitted) {
    handleConfirmed((nativeTxHash ?? erc20TxHash) as string)
  }

  const handlePay = async () => {
    if (!recipientAddress || !targetChain) {
      toast.error("Payment not available — no wallet configured")
      return
    }
    if (!onCorrectChain) {
      switchChain({ chainId: targetChain.id })
      return
    }

    const tokenInfo = getToken(invoice.network, invoice.currency)
    const native = tokenInfo ? isNativeToken(tokenInfo) : false

    try {
      if (native) {
        sendTransaction({
          to: recipientAddress as `0x${string}`,
          value: parseEther(invoice.amount.toString()),
          chainId: targetChain.id,
        })
      } else {
        if (!tokenInfo?.address) {
          toast.error(`No contract address for ${invoice.currency} on ${invoice.network}`)
          return
        }
        writeContract({
          address: tokenInfo.address as `0x${string}`,
          abi: ERC20_TRANSFER_ABI,
          functionName: "transfer",
          args: [
            recipientAddress as `0x${string}`,
            parseUnits(invoice.amount.toString(), tokenInfo.decimals ?? 6),
          ],
          chainId: targetChain.id,
        })
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Transaction failed")
    }
  }

  const effectiveStatus = isOverdue(invoice.dueAt, localStatus) ? "overdue" : localStatus
  const cfg = statusConfig[effectiveStatus] ?? statusConfig.pending
  const StatusIcon = cfg.icon

  const isPaid = localStatus === "paid" || txSubmitted

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flowlink-logo-final.png" alt="FlowLink" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-bold text-xl tracking-tight">
              <span className="text-slate-900">Flow</span><span className="text-emerald-600">Link</span>
            </span>
          </div>
          <Badge className={`text-xs border ${cfg.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </Badge>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        {/* Invoice card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top: from/to */}
          <div className="p-6 border-b border-slate-100 space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Invoice from</p>
              <p className="text-slate-800 font-semibold">{senderName}</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Invoice</p>
                <p className="font-mono text-sm text-slate-600">{invoice.invoiceNumber}</p>
              </div>
              {invoice.dueAt && (
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Due</p>
                  <p className={`text-sm font-medium ${effectiveStatus === "overdue" ? "text-red-600" : "text-slate-700"}`}>
                    {new Date(invoice.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Line items */}
          {Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0 && (
            <div className="px-6 py-4 space-y-0 border-b border-slate-100">
              {invoice.lineItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm text-slate-700">{item.description}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-slate-400">{item.quantity} × {parseFloat(item.unitPrice || "0").toFixed(2)}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800 ml-4 whitespace-nowrap">
                    {parseFloat(item.total).toFixed(2)} {invoice.currency}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="px-6 py-4 flex justify-between items-center">
            <span className="text-slate-500 text-sm">Total due</span>
            <span className="text-2xl font-bold text-slate-900">
              {invoice.amount.toFixed(2)} <span className="text-base font-medium text-slate-500">{invoice.currency}</span>
            </span>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-6 pb-4 text-sm text-slate-500 border-t border-slate-100 pt-3">
              <span className="font-medium text-slate-600">Notes: </span>
              {invoice.notes}
            </div>
          )}
        </div>

        {/* HSP hosted checkout — shown when available and invoice unpaid */}
        {!isPaid && invoice.hspCheckoutUrl && effectiveStatus !== 'draft' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Pay via HashKey HSP</p>
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
                Powered by HashKey HSP
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Use HashKey Settlement Protocol for a seamless checkout experience.
            </p>
            <a
              href={invoice.hspCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              Pay via HSK
              <ExternalLink className="h-4 w-4" />
            </a>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className="bg-white px-2">or pay with wallet below</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment section */}
        {isPaid ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800 text-lg">Payment Complete</p>
              <p className="text-emerald-600 text-sm mt-0.5">Thank you! This invoice has been paid.</p>
            </div>
            {txHash && (
              <a
                href={`${explorerUrl}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 underline"
              >
                View transaction <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ) : effectiveStatus === "draft" ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-slate-600 font-medium">This invoice hasn&apos;t been sent yet</p>
            <p className="text-slate-400 text-sm mt-1">The sender needs to send this invoice before payment is available.</p>
          </div>
        ) : !recipientAddress ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-slate-600 font-medium">Payment unavailable</p>
            <p className="text-slate-400 text-sm mt-1">The invoice owner hasn&apos;t connected a wallet yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <p className="text-slate-700 font-medium text-sm">Pay with your wallet</p>

            {!isConnected ? (
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            ) : !onCorrectChain ? (
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => targetChain && switchChain({ chainId: targetChain.id })}
                disabled={isSwitching}
              >
                {isSwitching ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Switch to {targetChain?.name ?? invoice.network}
              </Button>
            ) : isConfirming ? (
              <Button className="w-full bg-emerald-600 text-white" disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirming transaction...
              </Button>
            ) : (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base h-12 font-semibold"
                disabled={isSending}
                onClick={handlePay}
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirm in wallet...
                  </span>
                ) : (
                  `Pay ${invoice.amount.toFixed(2)} ${invoice.currency}`
                )}
              </Button>
            )}

            {isConnected && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Connected: {address?.slice(0, 6)}…{address?.slice(-4)}</span>
                <ConnectButton.Custom>
                  {({ openAccountModal }) => (
                    <button onClick={openAccountModal} className="underline hover:text-slate-600">
                      Change wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}

            <div className="text-xs text-slate-400 text-center border-t border-slate-100 pt-3">
              Powered by <span className="font-medium text-slate-500">FlowLink</span> on {targetChain?.name ?? invoice.network}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
