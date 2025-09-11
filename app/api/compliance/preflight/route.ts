import { type NextRequest, NextResponse } from "next/server"

// Mock compliance databases
const kycPasses = new Set([
  "0x1234567890123456789012345678901234567890",
  "0x0987654321098765432109876543210987654321",
  // Add more addresses that pass KYC
])

const sanctionsBlocks = new Set([
  "0x6666666666666666666666666666666666666666",
  "0x1111111111111111111111111111111111111111",
  // Add more sanctioned addresses
])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("addr")
    const linkId = searchParams.get("linkId")

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Normalize address to lowercase for comparison
    const normalizedAddress = address.toLowerCase()

    // Check KYC status
    const kycOk = kycPasses.has(normalizedAddress) || normalizedAddress.endsWith("0")

    // Check sanctions status
    const sanctionsOk = !sanctionsBlocks.has(normalizedAddress) && !normalizedAddress.includes("666")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      address: normalizedAddress,
      linkId,
      compliance: {
        kycOk,
        sanctionsOk,
        checkedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error checking compliance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
