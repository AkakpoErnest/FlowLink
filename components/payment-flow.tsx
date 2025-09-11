"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Wallet, Shield, AlertTriangle, CheckCircle, Download, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentLink {
  id: string
  amount: string
  memo: string
  requireKYC: boolean
  checkSanctions: boolean
  merchant: string
  token: string
  status: string
}

interface ComplianceStatus {
  kycOk: boolean
  sanctionsOk: boolean
  loading: boolean
}

interface PaymentFlowProps {
  paymentLink: PaymentLink
}

export function PaymentFlow({ paymentLink }: PaymentFlowProps) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [compliance, setCompliance] = useState<ComplianceStatus>({
    kycOk: false,
    sanctionsOk: false,
    loading: false,
  })
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState("")
  const { toast } = useToast()

  const connectWallet = async () => {
    // Mock wallet connection - in production, use Web3 library
    const mockAddress = "0x1234567890123456789012345678901234567890"
    setWalletAddress(mockAddress)
    setWalletConnected(true)

    toast({
      title: "Wallet Connected",
      description: "Successfully connected to your wallet",
    })

    // Trigger compliance check
    checkCompliance(mockAddress)
  }

  const checkCompliance = async (address: string) => {
    setCompliance((prev) => ({ ...prev, loading: true }))

    try {
      const response = await fetch(
        `/api/compliance/preflight?addr=${encodeURIComponent(address)}&linkId=${encodeURIComponent(paymentLink.id)}`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check compliance")
      }

      setCompliance({
        kycOk: data.compliance.kycOk,
        sanctionsOk: data.compliance.sanctionsOk,
        loading: false,
      })

      if (!data.compliance.kycOk || !data.compliance.sanctionsOk) {
        toast({
          title: "Compliance Check Failed",
          description: "Please resolve compliance issues before proceeding",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Compliance Check Passed",
          description: "All compliance requirements met",
        })
      }
    } catch (error) {
      console.error("Error checking compliance:", error)
      setCompliance((prev) => ({ ...prev, loading: false }))
      toast({
        title: "Compliance Check Error",
        description: error instanceof Error ? error.message : "Failed to check compliance",
        variant: "destructive",
      })
    }
  }

  const processPayment = async () => {
    setPaymentStatus("processing")

    try {
      // Mock payment processing - in production, interact with smart contract
      const mockTxHash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"

      // Record payment in backend
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linkId: paymentLink.id,
          payer: walletAddress,
          txHash: mockTxHash,
          kycPassed: compliance.kycOk,
          sanctionsChecked: compliance.sanctionsOk,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to record payment")
      }

      setTxHash(mockTxHash)
      setPaymentStatus("success")

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully",
      })
    } catch (error) {
      console.error("Error processing payment:", error)
      setPaymentStatus("error")
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      })
    }
  }

  const downloadReceipt = async () => {
    try {
      const response = await fetch("/api/receipts/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash,
          linkId: paymentLink.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate receipt")
      }

      // Open download URL
      window.open(data.receipt.downloadUrl, "_blank")

      toast({
        title: "Receipt Generated",
        description: "Your payment receipt is ready for download",
      })
    } catch (error) {
      console.error("Error generating receipt:", error)
      toast({
        title: "Receipt Error",
        description: error instanceof Error ? error.message : "Failed to generate receipt",
        variant: "destructive",
      })
    }
  }

  const canPay =
    walletConnected &&
    !compliance.loading &&
    (!paymentLink.requireKYC || compliance.kycOk) &&
    (!paymentLink.checkSanctions || compliance.sanctionsOk) &&
    paymentStatus === "idle"

  if (paymentStatus === "success") {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>Your payment has been processed and recorded on the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  ${paymentLink.amount} {paymentLink.token}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction:</span>
                <span className="font-mono text-xs">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default">Confirmed</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button className="flex-1" onClick={downloadReceipt}>
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === "error") {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Payment Failed</CardTitle>
            <CardDescription>There was an error processing your payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setPaymentStatus("idle")} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Payment Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Request</CardTitle>
          <CardDescription>Complete your secure payment below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="text-2xl font-bold">${paymentLink.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token:</span>
              <span className="font-medium">{paymentLink.token}</span>
            </div>
            {paymentLink.memo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memo:</span>
                <span className="font-medium">{paymentLink.memo}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Compliance Requirements</h4>
            <div className="flex gap-2">
              {paymentLink.requireKYC && <Badge variant="secondary">KYC Required</Badge>}
              {paymentLink.checkSanctions && <Badge variant="secondary">Sanctions Check</Badge>}
              {!paymentLink.requireKYC && !paymentLink.checkSanctions && (
                <Badge variant="outline">No Requirements</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection */}
      {!walletConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </CardTitle>
            <CardDescription>Connect your wallet to proceed with the payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance Check
              </CardTitle>
              <CardDescription>Verifying compliance requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Wallet: </span>
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>

              {compliance.loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Checking compliance...
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentLink.requireKYC && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">KYC Verification</span>
                      <Badge variant={compliance.kycOk ? "default" : "destructive"}>
                        {compliance.kycOk ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  )}
                  {paymentLink.checkSanctions && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sanctions Check</span>
                      <Badge variant={compliance.sanctionsOk ? "default" : "destructive"}>
                        {compliance.sanctionsOk ? "Clear" : "Blocked"}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {!compliance.loading && (!compliance.kycOk || !compliance.sanctionsOk) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {!compliance.kycOk && "KYC verification required. "}
                    {!compliance.sanctionsOk && "Address appears on sanctions list. "}
                    Please resolve these issues before proceeding.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Payment Action */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>
                {canPay ? "Ready to process your payment" : "Resolve compliance issues to continue"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={processPayment} disabled={!canPay || paymentStatus === "processing"} className="w-full">
                {paymentStatus === "processing" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay $${paymentLink.amount} ${paymentLink.token}`
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
