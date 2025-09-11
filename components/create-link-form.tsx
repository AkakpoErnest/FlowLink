"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Copy, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CreateLinkForm() {
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [requireKYC, setRequireKYC] = useState(false)
  const [checkSanctions, setCheckSanctions] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateLink = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          memo,
          requireKYC,
          checkSanctions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment link")
      }

      setGeneratedLink(data.paymentUrl)

      toast({
        title: "Payment link created",
        description: "Your compliant payment link has been generated",
      })

      // Reset form
      setAmount("")
      setMemo("")
      setRequireKYC(false)
      setCheckSanctions(false)
    } catch (error) {
      console.error("Error creating payment link:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create payment link",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Payment Link
        </CardTitle>
        <CardDescription>Generate a compliant payment link with optional KYC and sanctions checking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USDC)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="100.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="memo">Memo (Optional)</Label>
          <Textarea
            id="memo"
            placeholder="Payment for services..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="kyc-toggle">Require KYC</Label>
              <p className="text-sm text-muted-foreground">Payer must pass identity verification</p>
            </div>
            <Switch id="kyc-toggle" checked={requireKYC} onCheckedChange={setRequireKYC} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sanctions-toggle">Check Sanctions</Label>
              <p className="text-sm text-muted-foreground">Verify payer is not on sanctions lists</p>
            </div>
            <Switch id="sanctions-toggle" checked={checkSanctions} onCheckedChange={setCheckSanctions} />
          </div>
        </div>

        <Button onClick={handleCreateLink} className="w-full" disabled={isCreating}>
          {isCreating ? "Creating Link..." : "Create Payment Link"}
        </Button>

        {generatedLink && (
          <div className="space-y-2">
            <Label>Generated Payment Link</Label>
            <div className="flex gap-2">
              <Input value={generatedLink} readOnly className="font-mono text-sm" />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
