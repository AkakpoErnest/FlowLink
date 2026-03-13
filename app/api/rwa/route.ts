import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
let subscriptions = [
  {
    id: "rwa_001",
    name: "US Treasury Bills 3M",
    type: "t-bills",
    amount: "100,000",
    currency: "USDC",
    apy: 5.25,
    maturity: "2024-04-15T00:00:00Z",
    status: "active",
    autoRollover: true,
    nextRollover: "2024-04-15T00:00:00Z",
    complianceScore: 98,
    description: "3-month US Treasury Bills with competitive yield",
    network: "polygon",
    gasUsed: "0.05"
  },
  {
    id: "rwa_002",
    name: "Singapore Government Bonds",
    type: "bonds",
    amount: "250,000",
    currency: "SGD",
    apy: 4.75,
    maturity: "2024-12-31T00:00:00Z",
    status: "active",
    autoRollover: false,
    nextRollover: "N/A",
    complianceScore: 95,
    description: "Long-term Singapore government bonds",
    network: "polygon",
    gasUsed: "0.08"
  },
  {
    id: "rwa_003",
    name: "Hong Kong Treasury Bills",
    type: "t-bills",
    amount: "75,000",
    currency: "HKD",
    apy: 4.95,
    maturity: "2024-03-20T00:00:00Z",
    status: "pending",
    autoRollover: true,
    nextRollover: "2024-03-20T00:00:00Z",
    complianceScore: 97,
    description: "Short-term Hong Kong treasury bills",
    network: "polygon",
    gasUsed: "0.00"
  },
]

let availableProducts = [
  {
    id: "prod_001",
    name: "US Treasury Bills 6M",
    type: "t-bills",
    apy: 5.45,
    minAmount: 10000,
    maxAmount: 1000000,
    currency: "USDC",
    maturity: "6 months",
    compliance: true,
    description: "6-month US Treasury Bills with higher yield"
  },
  {
    id: "prod_002",
    name: "Corporate Bonds AAA",
    type: "bonds",
    apy: 6.25,
    minAmount: 50000,
    maxAmount: 5000000,
    currency: "USDC",
    maturity: "2 years",
    compliance: true,
    description: "High-grade corporate bonds with excellent credit rating"
  },
  {
    id: "prod_003",
    name: "Municipal Bonds",
    type: "bonds",
    apy: 4.85,
    minAmount: 25000,
    maxAmount: 2000000,
    currency: "USDC",
    maturity: "1 year",
    compliance: true,
    description: "Tax-exempt municipal bonds for US residents"
  },
]

// GET /api/rwa - Get all RWA subscriptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    let filteredSubscriptions = subscriptions
    
    if (status) {
      filteredSubscriptions = filteredSubscriptions.filter(sub => sub.status === status)
    }
    
    if (type) {
      filteredSubscriptions = filteredSubscriptions.filter(sub => sub.type === type)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredSubscriptions,
      total: filteredSubscriptions.length
    })
  } catch (error) {
    console.error('Error fetching RWA subscriptions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RWA subscriptions' },
      { status: 500 }
    )
  }
}

// POST /api/rwa - Create a new RWA subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newSubscription = {
      id: `rwa_${String(subscriptions.length + 1).padStart(3, '0')}`,
      name: body.name,
      type: body.type,
      amount: body.amount,
      currency: body.currency || "USDC",
      apy: body.apy || 0,
      maturity: body.maturity,
      status: "pending",
      autoRollover: body.autoRollover || false,
      nextRollover: body.autoRollover ? body.maturity : "N/A",
      complianceScore: 0,
      description: body.description || "",
      network: body.network || "polygon",
      gasUsed: "0.00"
    }
    
    subscriptions.push(newSubscription)
    
    return NextResponse.json({
      success: true,
      data: newSubscription
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating RWA subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create RWA subscription' },
      { status: 500 }
    )
  }
}

// PUT /api/rwa - Update an RWA subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const subscriptionIndex = subscriptions.findIndex(sub => sub.id === id)
    
    if (subscriptionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'RWA subscription not found' },
        { status: 404 }
      )
    }
    
    subscriptions[subscriptionIndex] = {
      ...subscriptions[subscriptionIndex],
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: subscriptions[subscriptionIndex]
    })
  } catch (error) {
    console.error('Error updating RWA subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update RWA subscription' },
      { status: 500 }
    )
  }
}

// GET /api/rwa/products - Get available RWA products
export async function GET_PRODUCTS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let filteredProducts = availableProducts
    
    if (type) {
      filteredProducts = filteredProducts.filter(product => product.type === type)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    console.error('Error fetching RWA products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RWA products' },
      { status: 500 }
    )
  }
}
