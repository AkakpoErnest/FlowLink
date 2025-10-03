import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
let paymentLinks = [
  {
    id: "1",
    code: "pay-alice-100",
    sourceToken: "USDC",
    destStable: "USDC",
    amountMin: 100,
    amountMax: 1000,
    status: "ACTIVE",
    createdAt: "2024-01-15T10:30:00Z",
    transactions: 23,
    volume: 15420,
    description: "Payment link for Alice's services",
    merchantId: "merchant_001"
  },
  {
    id: "2", 
    code: "pay-bob-500",
    sourceToken: "ETH",
    destStable: "USDC",
    amountMin: 0.5,
    amountMax: 2.0,
    status: "ACTIVE",
    createdAt: "2024-01-14T15:45:00Z",
    transactions: 8,
    volume: 12400,
    description: "Payment link for Bob's consulting",
    merchantId: "merchant_002"
  },
  {
    id: "3",
    code: "pay-charlie-250",
    sourceToken: "MATIC",
    destStable: "USDC",
    amountMin: 1000,
    amountMax: 5000,
    status: "DRAFT",
    createdAt: "2024-01-13T09:20:00Z",
    transactions: 0,
    volume: 0,
    description: "Payment link for Charlie's products",
    merchantId: "merchant_003"
  },
]

// GET /api/payment-links - Get all payment links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const merchantId = searchParams.get('merchantId')
    
    let filteredLinks = paymentLinks
    
    if (status) {
      filteredLinks = filteredLinks.filter(link => link.status === status.toUpperCase())
    }
    
    if (merchantId) {
      filteredLinks = filteredLinks.filter(link => link.merchantId === merchantId)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredLinks,
      total: filteredLinks.length
    })
  } catch (error) {
    console.error('Error fetching payment links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment links' },
      { status: 500 }
    )
  }
}

// POST /api/payment-links - Create a new payment link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newLink = {
      id: (paymentLinks.length + 1).toString(),
      code: body.code || `pay-${Date.now()}`,
      sourceToken: body.sourceToken || "USDC",
      destStable: body.destStable || "USDC",
      amountMin: body.amountMin || 0,
      amountMax: body.amountMax || 10000,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      transactions: 0,
      volume: 0,
      description: body.description || "",
      merchantId: body.merchantId || "merchant_001"
    }
    
    paymentLinks.push(newLink)
    
    return NextResponse.json({
      success: true,
      data: newLink
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment link' },
      { status: 500 }
    )
  }
}

// PUT /api/payment-links - Update a payment link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const linkIndex = paymentLinks.findIndex(link => link.id === id)
    
    if (linkIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment link not found' },
        { status: 404 }
      )
    }
    
    paymentLinks[linkIndex] = {
      ...paymentLinks[linkIndex],
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: paymentLinks[linkIndex]
    })
  } catch (error) {
    console.error('Error updating payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment link' },
      { status: 500 }
    )
  }
}

// DELETE /api/payment-links - Delete a payment link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment link ID is required' },
        { status: 400 }
      )
    }
    
    const linkIndex = paymentLinks.findIndex(link => link.id === id)
    
    if (linkIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment link not found' },
        { status: 404 }
      )
    }
    
    paymentLinks.splice(linkIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Payment link deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment link' },
      { status: 500 }
    )
  }
}
