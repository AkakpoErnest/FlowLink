import { NextRequest, NextResponse } from 'next/server'

export interface Invoice {
  id: string
  invoiceNumber: string
  agentId: string
  agentName: string
  agentDescription: string
  issuedTo: string
  issuedToAddress: string
  amount: string
  currency: 'USDC' | 'USDT' | 'HSK'
  network: 'hashkey' | 'polygon' | 'ethereum'
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
  description: string
  lineItems: { description: string; quantity: number; unitPrice: string; total: string }[]
  issuedAt: string
  dueAt: string
  paidAt?: string
  txHash?: string
  paymentLink?: string
  complianceStatus: 'pending' | 'approved' | 'rejected'
  kycRequired: boolean
  metadata?: Record<string, string>
}

// In-memory store (replace with DB in production)
let invoices: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'FL-2026-001',
    agentId: 'agent_analyst_01',
    agentName: 'FlowLink Analytics Agent',
    agentDescription: 'AI-powered on-chain analytics and reporting',
    issuedTo: 'Acme Corp',
    issuedToAddress: '0x742d35Cc6634C0532925a3b8D4C9C1234567890',
    amount: '500.00',
    currency: 'USDC',
    network: 'hashkey',
    status: 'pending',
    description: 'Monthly analytics report generation — March 2026',
    lineItems: [
      { description: 'On-chain analytics dashboard', quantity: 1, unitPrice: '300.00', total: '300.00' },
      { description: 'Compliance report generation', quantity: 2, unitPrice: '100.00', total: '200.00' },
    ],
    issuedAt: '2026-03-01T00:00:00Z',
    dueAt: '2026-03-15T00:00:00Z',
    complianceStatus: 'approved',
    kycRequired: true,
  },
  {
    id: 'inv_002',
    invoiceNumber: 'FL-2026-002',
    agentId: 'agent_payroll_02',
    agentName: 'FlowLink Payroll Agent',
    agentDescription: 'Automated payroll processing for crypto teams',
    issuedTo: 'TechStart Ghana',
    issuedToAddress: '0x1234567890abcdef1234567890abcdef12345678',
    amount: '2500.00',
    currency: 'USDC',
    network: 'hashkey',
    status: 'paid',
    description: 'Q1 2026 payroll processing for 25 employees',
    lineItems: [
      { description: 'Payroll processing (25 employees)', quantity: 25, unitPrice: '100.00', total: '2500.00' },
    ],
    issuedAt: '2026-01-01T00:00:00Z',
    dueAt: '2026-01-15T00:00:00Z',
    paidAt: '2026-01-10T00:00:00Z',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    complianceStatus: 'approved',
    kycRequired: false,
  },
  {
    id: 'inv_003',
    invoiceNumber: 'FL-2026-003',
    agentId: 'agent_compliance_03',
    agentName: 'FlowLink Compliance Agent',
    agentDescription: 'Automated KYC/AML screening and compliance reporting',
    issuedTo: 'Digital Finance Ltd',
    issuedToAddress: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    amount: '750.00',
    currency: 'USDT',
    network: 'polygon',
    status: 'overdue',
    description: 'KYC screening service — February 2026',
    lineItems: [
      { description: 'KYC verifications', quantity: 50, unitPrice: '10.00', total: '500.00' },
      { description: 'Sanctions screening', quantity: 50, unitPrice: '5.00', total: '250.00' },
    ],
    issuedAt: '2026-02-01T00:00:00Z',
    dueAt: '2026-02-15T00:00:00Z',
    complianceStatus: 'approved',
    kycRequired: true,
  },
]

// GET /api/invoices
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const agentId = searchParams.get('agentId')
  const network = searchParams.get('network')

  let filtered = invoices

  if (status) filtered = filtered.filter(i => i.status === status)
  if (agentId) filtered = filtered.filter(i => i.agentId === agentId)
  if (network) filtered = filtered.filter(i => i.network === network)

  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'pending').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalValue: invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0).toFixed(2),
    paidValue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.amount), 0).toFixed(2),
  }

  return NextResponse.json({ success: true, data: filtered, stats })
}

// POST /api/invoices
export async function POST(request: NextRequest) {
  const body = await request.json()

  const count = invoices.length + 1
  const year = new Date().getFullYear()
  const invoiceNumber = `FL-${year}-${String(count).padStart(3, '0')}`

  const newInvoice: Invoice = {
    id: `inv_${Date.now()}`,
    invoiceNumber,
    agentId: body.agentId || `agent_${Date.now()}`,
    agentName: body.agentName,
    agentDescription: body.agentDescription || '',
    issuedTo: body.issuedTo,
    issuedToAddress: body.issuedToAddress || '',
    amount: body.amount,
    currency: body.currency || 'USDC',
    network: body.network || 'hashkey',
    status: 'draft',
    description: body.description,
    lineItems: body.lineItems || [],
    issuedAt: new Date().toISOString(),
    dueAt: body.dueAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    complianceStatus: 'pending',
    kycRequired: body.kycRequired ?? true,
    metadata: body.metadata,
  }

  invoices.push(newInvoice)

  return NextResponse.json({ success: true, data: newInvoice }, { status: 201 })
}

// PUT /api/invoices — update status / add payment info
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, ...updates } = body

  const idx = invoices.findIndex(i => i.id === id)
  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 })
  }

  if (updates.status === 'paid' && !invoices[idx].paidAt) {
    updates.paidAt = new Date().toISOString()
  }

  invoices[idx] = { ...invoices[idx], ...updates }

  return NextResponse.json({ success: true, data: invoices[idx] })
}
