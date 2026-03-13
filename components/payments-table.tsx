"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockPayments = [
  {
    id: "1",
    linkId: "abc123",
    payer: "0x1234...5678",
    amount: "500.00",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: "2024-01-15 14:30",
    kycPassed: true,
    sanctionsChecked: true,
  },
  {
    id: "2",
    linkId: "def456",
    payer: "0x9876...5432",
    amount: "250.00",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timestamp: "2024-01-14 09:15",
    kycPassed: false,
    sanctionsChecked: true,
  },
]

export function PaymentsTable() {
  const { toast } = useToast()

  const downloadReceipt = async (txHash: string, linkId: string) => {
    try {
      const response = await fetch("/api/receipts/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash,
          linkId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate receipt")
      }

      // Open the receipt in a new tab
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

  const exportCSV = async () => {
    try {
      const response = await fetch("/api/payments/csv")

      if (!response.ok) {
        throw new Error("Failed to export CSV")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export Complete",
        description: "Payment data exported to CSV successfully",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Export Error",
        description: "Failed to export payment data",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>View completed payments and download receipts</CardDescription>
          </div>
          <Button onClick={exportCSV} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Tx Hash</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.timestamp}</TableCell>
                <TableCell className="font-mono text-sm">{payment.payer}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={payment.kycPassed ? "default" : "secondary"} className="text-xs">
                      {payment.kycPassed ? "KYC ✓" : "KYC ✗"}
                    </Badge>
                    <Badge variant={payment.sanctionsChecked ? "default" : "secondary"} className="text-xs">
                      Sanctions ✓
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadReceipt(payment.txHash, payment.linkId)}>
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
