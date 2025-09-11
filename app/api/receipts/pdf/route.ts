import { type NextRequest, NextResponse } from "next/server"
import { generatePDFReceipt, createPDFFromHTML } from "@/scripts/generate-pdf-receipt"

// Mock payments database - in production, fetch from real database
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { txHash, linkId } = body

    if (!txHash || !linkId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch payment details (in production, query your database)
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

    // Convert to PDF (in production, use proper PDF library)
    const pdfBuffer = await createPDFFromHTML(htmlReceipt)

    // In production, you would:
    // 1. Save the PDF to cloud storage (AWS S3, etc.)
    // 2. Return a signed URL for download
    // For this MVP, we'll return the receipt data and a mock download URL

    const receiptResponse = {
      receiptId,
      linkId,
      txHash,
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/receipts/download/${txHash}`,
      size: pdfBuffer.length,
      format: "PDF",
    }

    return NextResponse.json({
      success: true,
      receipt: receiptResponse,
    })
  } catch (error) {
    console.error("Error generating PDF receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
