import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const mockLinks = new Map()
const mockPayments = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, memo, requireKYC, checkSanctions } = body

    // Validate input
    if (!amount || isNaN(Number.parseFloat(amount))) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Generate unique link ID
    const linkId = Math.random().toString(36).substring(2, 15)

    // Create payment link
    const paymentLink = {
      id: linkId,
      amount: Number.parseFloat(amount).toFixed(2),
      memo: memo || "",
      requireKYC: requireKYC || false,
      checkSanctions: checkSanctions || false,
      merchant: "0x1234567890123456789012345678901234567890", // Mock merchant address
      token: "USDC",
      status: "active",
      createdAt: new Date().toISOString(),
    }

    // Store in mock database
    mockLinks.set(linkId, paymentLink)

    // Return payment URL
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/pay/${linkId}`

    return NextResponse.json({
      success: true,
      linkId,
      paymentUrl,
      paymentLink,
    })
  } catch (error) {
    console.error("Error creating payment link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return all payment links (in production, filter by merchant)
    const links = Array.from(mockLinks.values())
    return NextResponse.json({ success: true, links })
  } catch (error) {
    console.error("Error fetching payment links:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
