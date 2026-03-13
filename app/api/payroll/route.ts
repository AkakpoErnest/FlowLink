import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
let payrollBatches = [
  {
    id: "pr_001",
    name: "Q1 2024 Developer Salaries",
    totalAmount: "78,500",
    currency: "USDC",
    recipients: 45,
    status: "completed",
    created: "2024-01-15T00:00:00Z",
    scheduled: "2024-01-15T00:00:00Z",
    completedAt: "2024-01-15T16:30:00Z",
    complianceScore: 98,
    description: "Quarterly salary payments for development team",
    network: "polygon",
    gasUsed: "0.15"
  },
  {
    id: "pr_002",
    name: "Contractor Payments - Africa",
    totalAmount: "32,400",
    currency: "USDT",
    recipients: 23,
    status: "processing",
    created: "2024-01-14T00:00:00Z",
    scheduled: "2024-01-16T00:00:00Z",
    complianceScore: 95,
    description: "Monthly contractor payments for African operations",
    network: "polygon",
    gasUsed: "0.08"
  },
  {
    id: "pr_003",
    name: "Bonus Distribution - Asia",
    totalAmount: "156,000",
    currency: "SGD",
    recipients: 67,
    status: "draft",
    created: "2024-01-13T00:00:00Z",
    scheduled: "2024-01-20T00:00:00Z",
    complianceScore: 92,
    description: "Annual bonus distribution for Asian team members",
    network: "polygon",
    gasUsed: "0.00"
  },
]

let recipients = [
  {
    id: "rec_001",
    batchId: "pr_001",
    name: "Alice Johnson",
    email: "alice@company.com",
    walletAddress: "0x1234...5678",
    amount: "3500.00",
    currency: "USDC",
    status: "completed",
    kycStatus: "verified",
    country: "US",
    complianceScore: 98
  },
  {
    id: "rec_002",
    batchId: "pr_001",
    name: "Bob Smith",
    email: "bob@company.com",
    walletAddress: "0x9876...5432",
    amount: "4200.00",
    currency: "USDC",
    status: "completed",
    kycStatus: "verified",
    country: "CA",
    complianceScore: 95
  },
  {
    id: "rec_003",
    batchId: "pr_002",
    name: "Charlie Brown",
    email: "charlie@contractor.com",
    walletAddress: "0x5555...9999",
    amount: "1500.00",
    currency: "USDT",
    status: "pending",
    kycStatus: "pending",
    country: "NG",
    complianceScore: 88
  },
]

let countryLimits = [
  {
    country: "US",
    countryName: "United States",
    monthlyLimit: 100000,
    kycRequired: true,
    currentUsage: 78500
  },
  {
    country: "CA",
    countryName: "Canada",
    monthlyLimit: 50000,
    kycRequired: true,
    currentUsage: 42000
  },
  {
    country: "NG",
    countryName: "Nigeria",
    monthlyLimit: 25000,
    kycRequired: true,
    currentUsage: 15000
  },
]

// GET /api/payroll - Get all payroll batches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const includeRecipients = searchParams.get('includeRecipients') === 'true'
    
    let filteredBatches = payrollBatches
    
    if (status) {
      filteredBatches = filteredBatches.filter(batch => batch.status === status)
    }
    
    // Include recipients if requested
    if (includeRecipients) {
      filteredBatches = filteredBatches.map(batch => ({
        ...batch,
        recipientList: recipients.filter(recipient => recipient.batchId === batch.id)
      }))
    }
    
    return NextResponse.json({
      success: true,
      data: filteredBatches,
      total: filteredBatches.length
    })
  } catch (error) {
    console.error('Error fetching payroll batches:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payroll batches' },
      { status: 500 }
    )
  }
}

// POST /api/payroll - Create a new payroll batch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newBatch = {
      id: `pr_${String(payrollBatches.length + 1).padStart(3, '0')}`,
      name: body.name,
      totalAmount: body.totalAmount || "0",
      currency: body.currency || "USDC",
      recipients: body.recipients || 0,
      status: "draft",
      created: new Date().toISOString(),
      scheduled: body.scheduled || new Date().toISOString(),
      complianceScore: 0,
      description: body.description || "",
      network: body.network || "polygon",
      gasUsed: "0.00"
    }
    
    payrollBatches.push(newBatch)
    
    return NextResponse.json({
      success: true,
      data: newBatch
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating payroll batch:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payroll batch' },
      { status: 500 }
    )
  }
}

// PUT /api/payroll - Update a payroll batch
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const batchIndex = payrollBatches.findIndex(batch => batch.id === id)
    
    if (batchIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payroll batch not found' },
        { status: 404 }
      )
    }
    
    payrollBatches[batchIndex] = {
      ...payrollBatches[batchIndex],
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: payrollBatches[batchIndex]
    })
  } catch (error) {
    console.error('Error updating payroll batch:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payroll batch' },
      { status: 500 }
    )
  }
}

// GET /api/payroll/recipients - Get recipients for a batch
export async function GET_RECIPIENTS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get('batchId')
    
    let filteredRecipients = recipients
    
    if (batchId) {
      filteredRecipients = filteredRecipients.filter(recipient => recipient.batchId === batchId)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredRecipients,
      total: filteredRecipients.length
    })
  } catch (error) {
    console.error('Error fetching recipients:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipients' },
      { status: 500 }
    )
  }
}

// GET /api/payroll/limits - Get country limits
export async function GET_LIMITS(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: countryLimits,
      total: countryLimits.length
    })
  } catch (error) {
    console.error('Error fetching country limits:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch country limits' },
      { status: 500 }
    )
  }
}
