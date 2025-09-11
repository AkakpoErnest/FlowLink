import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const mockLinks = new Map([
  [
    "abc123",
    {
      id: "abc123",
      amount: "500.00",
      memo: "Service payment",
      requireKYC: true,
      checkSanctions: true,
      merchant: "0x1234567890123456789012345678901234567890",
      token: "USDC",
      status: "active",
      createdAt: "2024-01-15T10:30:00Z",
    },
  ],
  [
    "def456",
    {
      id: "def456",
      amount: "250.00",
      memo: "Product purchase",
      requireKYC: false,
      checkSanctions: true,
      merchant: "0x1234567890123456789012345678901234567890",
      token: "USDC",
      status: "active",
      createdAt: "2024-01-14T09:15:00Z",
    },
  ],
])

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id
    const paymentLink = mockLinks.get(linkId)

    if (!paymentLink) {
      return NextResponse.json({ error: "Payment link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, paymentLink })
  } catch (error) {
    console.error("Error fetching payment link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
