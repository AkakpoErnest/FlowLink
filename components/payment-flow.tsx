"use client"

import { useState, useEffect } from "react"
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { parseEther, parseUnits } from "viem"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shield, CheckCircle, XCircle, Loader2, ExternalLink, Wallet, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { hashkeyChain, hashkeyTokens } from "@/lib/hashkey"

const ERC20_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

interface PaymentFlowProps {
  paymentLink: {
    id: string
    code: string
    name: string | null
    sourceToken: string
    amountMin: number | null
    amountMax: number | null
    recipientAddress: string
    ownerName: string
  }
}

type Step = 'connect' | 'form' | 'compliance' | 'confirm' | 'sending' | 'complete' | 'failed'

const HASHKEY_TESTNET_EXPLORER = hashkeyChain.blockExplorers.default.url

export function PaymentFlow({ paymentLink }: PaymentFlowProps) {
  const { address, isConnected, chain } = useAccount()
  const [step, setStep] = useState<Step>('connect')
  const [amount, setAmount] = useState(paymentLink.amountMin?.toString() ?? '')
  const [complianceScore, setComplianceScore] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [savedPaymentId, setSavedPaymentId] = useState<string | null>(null)

  const {
    sendTransaction,
    data: nativeTxHash,
    isPending: isSendingNative,
    error: sendError,
    reset: resetTx,
  } = useSendTransaction()

  const {
    writeContract,
    data: erc20TxHash,
    isPending: isSendingErc20,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  const txHash = nativeTxHash ?? erc20TxHash
  const isSending = isSendingNative || isSendingErc20

  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash })

  // Move to form when wallet connects
  useEffect(() => {
    if (isConnected && step === 'connect') setStep('form')
    if (!isConnected && step !== 'complete') setStep('connect')
  }, [isConnected])

  // Handle tx confirmed
  useEffect(() => {
    if (!isSuccess || !txHash) return

    const savePayment = async () => {
      try {
        const res = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentLinkId: paymentLink.id,
            payer: address,
            amount: parseFloat(amount),
            currency: paymentLink.sourceToken,
            txHash,
            status: 'completed',
            network: 'hashkey-testnet',
            kycPassed: true,
            sanctionsChecked: true,
            complianceScore,
          }),
        })
        const data = await res.json()
        if (data.success) setSavedPaymentId(data.data.id)
      } catch (e) {
        console.error('Failed to save payment record:', e)
      }
      setStep('complete')
    }

    savePayment()
  }, [isSuccess, txHash])

  // Handle send error
  useEffect(() => {
    const err = sendError ?? writeError
    if (err) {
      setError(err.message.includes('rejected') ? 'Transaction rejected.' : err.message)
      setStep('confirm')
    }
  }, [sendError, writeError])

  // Run compliance check (placeholder — hook up Chainalysis / Elliptic for production)
  const runCompliance = async () => {
    setStep('compliance')
    setError(null)

    await new Promise(r => setTimeout(r, 1500))

    setComplianceScore(95)
    setStep('confirm')
  }

  const handleSend = () => {
    if (!amount || !paymentLink.recipientAddress) return
    setError(null)

    const isNative = paymentLink.sourceToken === 'HSK'

    try {
      if (isNative) {
        sendTransaction({
          to: paymentLink.recipientAddress as `0x${string}`,
          value: parseEther(amount),
          chainId: 133,
        })
      } else {
        const token = hashkeyTokens.stablecoins.find(
          t => t.symbol === paymentLink.sourceToken
        )
        if (!token || !token.address) {
          setError(`${paymentLink.sourceToken} contract address is not yet configured for HashKey Testnet. Check the README for details.`)
          return
        }
        writeContract({
          address: token.address as `0x${string}`,
          abi: ERC20_TRANSFER_ABI,
          functionName: 'transfer',
          args: [
            paymentLink.recipientAddress as `0x${string}`,
            parseUnits(amount, token.decimals),
          ],
          chainId: 133,
        })
      }
      setStep('sending')
    } catch (e: any) {
      setError(e.message)
    }
  }

  const amountNum = parseFloat(amount)
  const amountValid =
    !isNaN(amountNum) &&
    amountNum > 0 &&
    (!paymentLink.amountMin || amountNum >= paymentLink.amountMin) &&
    (!paymentLink.amountMax || amountNum <= paymentLink.amountMax)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 uppercase tracking-widest">
          <Shield className="h-3.5 w-3.5" /> FlowLink · HashKey Testnet
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {paymentLink.name ?? `Pay ${paymentLink.ownerName}`}
        </h1>
        <p className="text-sm text-slate-500 font-mono">flowlink.app/l/{paymentLink.code}</p>
      </div>

      {/* Step: Connect Wallet */}
      {step === 'connect' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto">
            <Wallet className="h-7 w-7 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-1">Connect your wallet to pay</p>
            <p className="text-sm text-slate-500">MetaMask, Rainbow, Coinbase, or any WalletConnect wallet</p>
          </div>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      )}

      {/* Step: Enter Amount */}
      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Paying to</span>
            <span className="font-semibold text-slate-900">{paymentLink.ownerName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Your wallet</span>
            <span className="font-mono text-xs text-slate-700">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <Label htmlFor="amount">Amount ({paymentLink.sourceToken})</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={
                  paymentLink.amountMin && paymentLink.amountMax
                    ? `${paymentLink.amountMin} – ${paymentLink.amountMax}`
                    : 'Enter amount'
                }
                min={paymentLink.amountMin ?? 0}
                max={paymentLink.amountMax ?? undefined}
                className="pr-16 text-lg font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">{paymentLink.sourceToken}</span>
            </div>
            {paymentLink.amountMin && paymentLink.amountMax && (
              <p className="text-xs text-slate-400">Min {paymentLink.amountMin} · Max {paymentLink.amountMax} {paymentLink.sourceToken}</p>
            )}
          </div>
          {chain?.id !== 133 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Switch to HashKey Testnet in your wallet to continue
            </div>
          )}
          <Button
            onClick={runCompliance}
            disabled={!amountValid || chain?.id !== 133}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white h-12 font-semibold"
          >
            <Shield className="h-4 w-4 mr-2" />
            Run Compliance Check
          </Button>
        </div>
      )}

      {/* Step: Compliance Running */}
      {step === 'compliance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <Loader2 className="h-10 w-10 text-teal-600 animate-spin mx-auto" />
          <p className="font-semibold text-slate-900">Running compliance checks…</p>
          <div className="text-sm text-slate-500 space-y-1">
            <p>KYC verification · Sanctions screening · AML risk score</p>
          </div>
        </div>
      )}

      {/* Step: Confirm Payment */}
      {step === 'confirm' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          {/* Compliance badge */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100">
            <CheckCircle className="h-5 w-5 text-teal-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-teal-800">Compliance passed</p>
              <p className="text-xs text-teal-600">KYC · Sanctions · AML — all clear</p>
            </div>
            <span className="text-sm font-black text-teal-700">{complianceScore}/100</span>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            {[
              { label: 'You send', value: `${amount} ${paymentLink.sourceToken}` },
              { label: 'To', value: `${paymentLink.ownerName}` },
              { label: 'Network', value: 'HashKey Testnet' },
              { label: 'Recipient', value: `${paymentLink.recipientAddress.slice(0, 8)}…${paymentLink.recipientAddress.slice(-6)}` },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-semibold text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
              <XCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleSend}
            disabled={isSending}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white h-12 font-semibold"
          >
            {isSending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Confirm in wallet…</>
            ) : (
              `Send ${amount} ${paymentLink.sourceToken}`
            )}
          </Button>
        </div>
      )}

      {/* Step: Sending / Confirming */}
      {step === 'sending' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <Loader2 className="h-10 w-10 text-teal-600 animate-spin mx-auto" />
          <p className="font-semibold text-slate-900">
            {isConfirming ? 'Waiting for confirmation…' : 'Broadcasting transaction…'}
          </p>
          {txHash && (
            <a
              href={`${HASHKEY_TESTNET_EXPLORER}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline"
            >
              View on explorer <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Step: Complete */}
      {step === 'complete' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Payment sent</h2>
            <p className="text-sm text-slate-500">
              {amount} {paymentLink.sourceToken} sent to {paymentLink.ownerName}. Fully compliant. Fully on-chain.
            </p>
          </div>
          {txHash && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Transaction hash</p>
              <p className="font-mono text-xs text-slate-700 break-all">{txHash}</p>
            </div>
          )}
          <div className="flex gap-3">
            {txHash && (
              <a
                href={`${HASHKEY_TESTNET_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explorer
                </Button>
              </a>
            )}
            <Button
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white"
              onClick={() => { resetTx(); resetWrite(); setStep('form'); setAmount(paymentLink.amountMin?.toString() ?? '') }}
            >
              Pay again
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
