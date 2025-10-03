import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
let payments = [
  {
    id: "1",
    linkId: "abc123",
    payer: "0x1234...5678",
    amount: "500.00",
    currency: "USDC",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: "2024-01-15T14:30:00Z",
    kycPassed: true,
    sanctionsChecked: true,
    status: "completed",
    network: "polygon",
    gasUsed: "0.002",
    complianceScore: 98
  },
  {
    id: "2",
    linkId: "def456",
    payer: "0x9876...5432",
    amount: "250.00",
    currency: "USDC",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timestamp: "2024-01-14T09:15:00Z",
    kycPassed: false,
    sanctionsChecked: true,
    status: "pending",
    network: "ethereum",
    gasUsed: "0.005",
    complianceScore: 85
  },
  {
    id: "3",
    linkId: "ghi789",
    payer: "0x5555...9999",
    amount: "1000.00",
    currency: "USDT",
    txHash: "0x5555555555555555555555555555555555555555555555555555555555555555",
    timestamp: "2024-01-13T16:45:00Z",
    kycPassed: true,
    sanctionsChecked: true,
    status: "completed",
    network: "polygon",
    gasUsed: "0.001",
    complianceScore: 99
  },
]

// GET /api/payments - Get all payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get('linkId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let filteredPayments = payments
    
    if (linkId) {
      filteredPayments = filteredPayments.filter(payment => payment.linkId === linkId)
    }
    
    if (status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === status)
    }
    
    // Pagination
    const paginatedPayments = filteredPayments.slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      data: paginatedPayments,
      total: filteredPayments.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create a new payment record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newPayment = {
      id: (payments.length + 1).toString(),
      linkId: body.linkId,
      payer: body.payer,
      amount: body.amount,
      currency: body.currency || "USDC",
      txHash: body.txHash,
      timestamp: new Date().toISOString(),
      kycPassed: body.kycPassed || false,
      sanctionsChecked: body.sanctionsChecked || false,
      status: "pending",
      network: body.network || "polygon",
      gasUsed: body.gasUsed || "0",
      complianceScore: body.complianceScore || 0
    }
    
    payments.push(newPayment)
    
    return NextResponse.json({
      success: true,
      data: newPayment
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// PUT /api/payments - Update a payment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const paymentIndex = payments.findIndex(payment => payment.id === id)
    
    if (paymentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }
    
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: payments[paymentIndex]
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}
