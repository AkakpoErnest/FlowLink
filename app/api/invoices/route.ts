import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"

export type Invoice = {
  id: string
  userId: string
  invoiceNumber: string
  agentId: string | null
  agentName: string | null
  agentDescription?: string | null
  issuedTo: string | null
  issuedToAddress: string | null
  amount: number
  subtotal: number | null
  currency: string
  network: "hashkey" | "polygon" | "ethereum" | string
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
  description: string | null
  notes: string | null
  lineItems: Array<{ description: string; quantity: number; unitPrice: string; total: string }>
  issueDate: string | null
  dueAt: string
  paidAt: string | null
  txHash: string | null
  complianceStatus: string
  paymentLinkCode: string | null
  createdAt: string
  updatedAt: string
  issuedAt: string // alias for createdAt, provided for compatibility
}

function unauth() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const agentId = searchParams.get("agentId")
  const network = searchParams.get("network")
  const creatorType = searchParams.get("creatorType") // "human" | "agent" | null

  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(agentId ? { agentId } : {}),
      ...(network ? { network } : {}),
      ...(creatorType === "human" ? { agentId: null } : {}),
      ...(creatorType === "agent" ? { agentId: { not: null } } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  const stats = {
    total: invoices.length,
    pending: invoices.filter((i) => i.status === "pending").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalValue: invoices.reduce((sum, i) => sum + i.amount, 0).toFixed(2),
    paidValue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0)
      .toFixed(2),
  }

  return NextResponse.json({ success: true, data: invoices, stats })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()

  const amount = parseFloat(body.amount ?? body.subtotal ?? "0")
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ success: false, error: "amount must be a positive number" }, { status: 400 })
  }

  if (body.recipientAddress) {
    const walletRegex = /^0x[a-fA-F0-9]{40}$/
    if (!walletRegex.test(body.recipientAddress)) {
      return NextResponse.json({ success: false, error: "recipientAddress must be a valid wallet address" }, { status: 400 })
    }
  }

  if (body.recipientEmail && body.recipientEmail.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.recipientEmail)) {
      return NextResponse.json({ success: false, error: "recipientEmail must be a valid email address" }, { status: 400 })
    }
  }

  const count = await prisma.invoice.count({ where: { userId } })
  const year = new Date().getFullYear()
  const invoiceNumber = body.invoiceNumber || `FL-${year}-${String(count + 1).padStart(3, "0")}`

  // Resolve recipient wallet for payment link creation
  // For human invoices the recipient address is the person paying (payer), so the
  // recipientAddress on the payment link should be the SENDER (the logged-in user)
  let recipientAddress: string | null = null
  let agentName: string | null = body.agentName || null

  if (body.agentId) {
    const agent = await prisma.agent.findFirst({ where: { id: body.agentId, userId } })
    if (agent?.walletAddress) {
      recipientAddress = agent.walletAddress
      agentName = agent.name
    }
  }

  if (!recipientAddress && body.recipientAddress) {
    recipientAddress = body.recipientAddress
  }

  if (!recipientAddress) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { walletAddress: true } })
    recipientAddress = user?.walletAddress ?? null
  }

  const network = body.network || 'celo'
  const currency = body.currency || 'USDC'
  const lineItems = body.lineItems || []
  const subtotal = parseFloat(body.subtotal ?? body.amount ?? "0")
  const status = body.status || 'pending'

  const invoice = await prisma.invoice.create({
    data: {
      userId,
      invoiceNumber,
      agentId: body.agentId || null,
      agentName,
      issuedTo: body.issuedTo || body.recipientName || null,
      issuedToAddress: body.issuedToAddress || body.recipientEmail || null,
      amount,
      subtotal,
      currency,
      network,
      status,
      description: body.description || null,
      notes: body.notes || null,
      lineItems,
      issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
      dueAt: body.dueAt ? new Date(body.dueAt) : new Date(Date.now() + 14 * 86400000),
      complianceStatus: 'pending',
    },
  })

  // Auto-create a payment link if we have a recipient address and invoice is being sent
  let paymentLinkCode: string | null = null
  if (recipientAddress && status === 'pending') {
    const linkCode = `inv-${invoice.id.slice(-8)}`
    const link = await prisma.paymentLink.create({
      data: {
        userId,
        code: linkCode,
        name: `Invoice ${invoice.invoiceNumber}${body.issuedTo || body.recipientName ? ` — ${body.issuedTo || body.recipientName}` : ''}`,
        network,
        sourceToken: currency,
        destStable: currency,
        amountMin: amount,
        amountMax: amount,
        recipientAddress,
        status: 'active',
      },
    })
    paymentLinkCode = link.code
    await prisma.invoice.update({ where: { id: invoice.id }, data: { paymentLinkCode: link.code } })
  }

  if (body.agentId) {
    await prisma.agent.update({ where: { id: body.agentId }, data: { invoiceCount: { increment: 1 } } }).catch(() => {})
  }

  await logAudit({
    userId,
    action: 'invoice.created',
    entityId: invoice.id,
    entityType: 'Invoice',
  })

  return NextResponse.json({
    success: true,
    data: { ...invoice, paymentLinkCode },
  }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()
  const { id, ...updates } = body

  const existing = await prisma.invoice.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = { ...updates }
  if (updates.status === "paid" && !existing.paidAt) {
    data.paidAt = new Date()
  }
  if (updates.dueAt) data.dueAt = new Date(updates.dueAt)
  if (updates.amount) data.amount = parseFloat(updates.amount)

  const invoice = await prisma.invoice.update({ where: { id }, data })
  return NextResponse.json({ success: true, data: invoice })
}
