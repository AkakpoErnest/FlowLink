import { type NextRequest, NextResponse } from "next/server"

// Mock payments database
const mockPayments = new Map([
  [
    "1",
    {
      id: "1",
      linkId: "abc123",
      payer: "0x1234567890123456789012345678901234567890",
      amount: "500.00",
      token: "USDC",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      timestamp: "2024-01-15T14:30:00Z",
      kycPassed: true,
      sanctionsChecked: true,
      status: "confirmed",
    },
  ],
  [
    "2",
    {
      id: "2",
      linkId: "def456",
      payer: "0x0987654321098765432109876543210987654321",
      amount: "250.00",
      token: "USDC",
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      timestamp: "2024-01-14T09:15:00Z",
      kycPassed: false,
      sanctionsChecked: true,
      status: "confirmed",
    },
  ],
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { linkId, payer, txHash, kycPassed, sanctionsChecked } = body

    // Validate input
    if (!linkId || !payer || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate payment ID
    const paymentId = (mockPayments.size + 1).toString()

    // Create payment record
    const payment = {
      id: paymentId,
      linkId,
      payer: payer.toLowerCase(),
      amount: "0.00", // Would be fetched from blockchain
      token: "USDC",
      txHash,
      timestamp: new Date().toISOString(),
      kycPassed: kycPassed || false,
      sanctionsChecked: sanctionsChecked || false,
      status: "confirmed",
    }

    // Store payment
    mockPayments.set(paymentId, payment)

    return NextResponse.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Error recording payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return all payments (in production, filter by merchant)
    const payments = Array.from(mockPayments.values())
    return NextResponse.json({ success: true, payments })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
