import { NextRequest, NextResponse } from 'next/server'

// Mock database - in production, this would be a real database
let vaults = [
  {
    id: "cv_001",
    name: "Institutional Trading Vault",
    status: "active",
    policies: 8,
    blocked: 23,
    allowed: 1247,
    riskScore: 92,
    created: "2024-01-10T00:00:00Z",
    description: "High-volume institutional trading vault with comprehensive compliance",
    totalVolume: 2500000,
    monthlyTransactions: 156
  },
  {
    id: "cv_002",
    name: "Cross-border Payments",
    status: "active",
    policies: 5,
    blocked: 7,
    allowed: 456,
    riskScore: 88,
    created: "2024-01-08T00:00:00Z",
    description: "Specialized vault for international payment processing",
    totalVolume: 850000,
    monthlyTransactions: 89
  },
  {
    id: "cv_003",
    name: "SME Subscription Vault",
    status: "paused",
    policies: 3,
    blocked: 2,
    allowed: 89,
    riskScore: 95,
    created: "2024-01-05T00:00:00Z",
    description: "Small and medium enterprise subscription payments",
    totalVolume: 125000,
    monthlyTransactions: 23
  },
]

let policyRules = [
  {
    id: "pr_001",
    type: "geofencing",
    name: "Geographic Restrictions",
    enabled: true,
    config: { allowedCountries: ["SG", "HK", "US"], blockedCountries: ["KP", "IR"] },
    vaultId: "cv_001"
  },
  {
    id: "pr_002",
    type: "sanctions",
    name: "OFAC Sanctions List",
    enabled: true,
    config: { lists: ["OFAC", "UN", "EU"], autoUpdate: true },
    vaultId: "cv_001"
  },
  {
    id: "pr_003",
    type: "transaction-limit",
    name: "Daily Transaction Limits",
    enabled: true,
    config: { dailyLimit: 100000, perTxLimit: 50000, currency: "USD" },
    vaultId: "cv_001"
  },
  {
    id: "pr_004",
    type: "time-restriction",
    name: "Business Hours Only",
    enabled: false,
    config: { startTime: "09:00", endTime: "17:00", timezone: "Asia/Singapore" },
    vaultId: "cv_002"
  },
]

// GET /api/vaults - Get all compliance vaults
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const includePolicies = searchParams.get('includePolicies') === 'true'
    
    let filteredVaults = vaults
    
    if (status) {
      filteredVaults = filteredVaults.filter(vault => vault.status === status)
    }
    
    // Include policy rules if requested
    if (includePolicies) {
      filteredVaults = filteredVaults.map(vault => ({
        ...vault,
        policyRules: policyRules.filter(rule => rule.vaultId === vault.id)
      }))
    }
    
    return NextResponse.json({
      success: true,
      data: filteredVaults,
      total: filteredVaults.length
    })
  } catch (error) {
    console.error('Error fetching vaults:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vaults' },
      { status: 500 }
    )
  }
}

// POST /api/vaults - Create a new compliance vault
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newVault = {
      id: `cv_${String(vaults.length + 1).padStart(3, '0')}`,
      name: body.name,
      status: "draft",
      policies: 0,
      blocked: 0,
      allowed: 0,
      riskScore: 0,
      created: new Date().toISOString(),
      description: body.description || "",
      totalVolume: 0,
      monthlyTransactions: 0
    }
    
    vaults.push(newVault)
    
    return NextResponse.json({
      success: true,
      data: newVault
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vault:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vault' },
      { status: 500 }
    )
  }
}

// PUT /api/vaults - Update a compliance vault
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const vaultIndex = vaults.findIndex(vault => vault.id === id)
    
    if (vaultIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Vault not found' },
        { status: 404 }
      )
    }
    
    vaults[vaultIndex] = {
      ...vaults[vaultIndex],
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: vaults[vaultIndex]
    })
  } catch (error) {
    console.error('Error updating vault:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vault' },
      { status: 500 }
    )
  }
}

// GET /api/vaults/policies - Get policy rules for a vault
export async function GET_POLICIES(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vaultId = searchParams.get('vaultId')
    
    let filteredRules = policyRules
    
    if (vaultId) {
      filteredRules = filteredRules.filter(rule => rule.vaultId === vaultId)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredRules,
      total: filteredRules.length
    })
  } catch (error) {
    console.error('Error fetching policy rules:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch policy rules' },
      { status: 500 }
    )
  }
}
