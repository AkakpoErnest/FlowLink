import { type NextRequest, NextResponse } from "next/server"
import { generatePDFReceipt } from "@/scripts/generate-pdf-receipt"

// Mock payments database
const mockPayments = new Map([
  [
    "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    {
      id: "1",
      linkId: "abc123",
      payer: "0x1234567890123456789012345678901234567890",
      merchant: "0x9876543210987654321098765432109876543210",
      amount: "500.00",
      token: "USDC",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      timestamp: "2024-01-15T14:30:00Z",
      kycPassed: true,
      sanctionsChecked: true,
      memo: "Service payment",
      status: "confirmed",
    },
  ],
])

export async function GET(request: NextRequest, { params }: { params: { txHash: string } }) {
  try {
    const txHash = params.txHash

    // Fetch payment details
    const payment = mockPayments.get(txHash)
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Generate receipt ID
    const receiptId = `CPR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Prepare receipt data
    const receiptData = {
      receiptId,
      linkId: payment.linkId,
      txHash: payment.txHash,
      payer: payment.payer,
      merchant: payment.merchant,
      amount: payment.amount,
      token: payment.token,
      timestamp: payment.timestamp,
      kycPassed: payment.kycPassed,
      sanctionsChecked: payment.sanctionsChecked,
      memo: payment.memo,
    }

    // Generate HTML receipt
    const htmlReceipt = generatePDFReceipt(receiptData)

    // Return HTML that can be printed as PDF by the browser
    return new NextResponse(htmlReceipt, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="receipt_${receiptId}.html"`,
      },
    })
  } catch (error) {
    console.error("Error downloading receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
