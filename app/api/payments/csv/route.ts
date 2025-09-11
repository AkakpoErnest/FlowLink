import { type NextRequest, NextResponse } from "next/server"
import { generateCSVExport } from "@/scripts/generate-pdf-receipt"

// Mock payments data
const mockPayments = [
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
  {
    id: "2",
    linkId: "def456",
    payer: "0x0987654321098765432109876543210987654321",
    merchant: "0x9876543210987654321098765432109876543210",
    amount: "250.00",
    token: "USDC",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timestamp: "2024-01-14T09:15:00Z",
    kycPassed: false,
    sanctionsChecked: true,
    memo: "Product purchase",
    status: "confirmed",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    // Filter payments by date range if provided
    let filteredPayments = mockPayments
    if (from || to) {
      filteredPayments = mockPayments.filter((payment) => {
        const paymentDate = new Date(payment.timestamp)
        if (from && paymentDate < new Date(from)) return false
        if (to && paymentDate > new Date(to)) return false
        return true
      })
    }

    // Generate CSV content using the enhanced function
    const csvContent = generateCSVExport(filteredPayments)

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="compliant_payments_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error generating CSV export:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
