import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

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

  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(agentId ? { agentId } : {}),
      ...(network ? { network } : {}),
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

  const count = await prisma.invoice.count({ where: { userId } })
  const year = new Date().getFullYear()
  const invoiceNumber = `FL-${year}-${String(count + 1).padStart(3, "0")}`

  const invoice = await prisma.invoice.create({
    data: {
      userId,
      invoiceNumber,
      agentId: body.agentId || null,
      agentName: body.agentName || null,
      issuedTo: body.issuedTo || null,
      issuedToAddress: body.issuedToAddress || null,
      amount: parseFloat(body.amount),
      currency: body.currency || "USDC",
      network: body.network || "hashkey-testnet",
      status: "draft",
      description: body.description || null,
      lineItems: body.lineItems || [],
      dueAt: body.dueAt ? new Date(body.dueAt) : new Date(Date.now() + 14 * 86400000),
      complianceStatus: "pending",
    },
  })

  return NextResponse.json({ success: true, data: invoice }, { status: 201 })
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
