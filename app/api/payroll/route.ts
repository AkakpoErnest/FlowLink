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
  const includeRecipients = searchParams.get("includeRecipients") === "true"

  const batches = await prisma.payrollBatch.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      recipients: includeRecipients,
    },
  })

  return NextResponse.json({ success: true, data: batches, total: batches.length })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()

  const batch = await prisma.payrollBatch.create({
    data: {
      userId,
      name: body.name,
      totalAmount: parseFloat(body.totalAmount) || 0,
      currency: body.currency || "USDC",
      status: "pending",
      network: body.network || "hashkey-testnet",
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      recipients: body.recipients
        ? {
            create: body.recipients.map((r: any) => ({
              name: r.name,
              email: r.email || null,
              walletAddress: r.walletAddress,
              amount: parseFloat(r.amount),
              currency: r.currency || body.currency || "USDC",
              country: r.country || null,
            })),
          }
        : undefined,
    },
    include: { recipients: true },
  })

  return NextResponse.json({ success: true, data: batch }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()
  const { id, ...updates } = body

  const existing = await prisma.payrollBatch.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = { ...updates }
  if (updates.scheduledAt) data.scheduledAt = new Date(updates.scheduledAt)
  if (updates.completedAt) data.completedAt = new Date(updates.completedAt)
  if (updates.totalAmount) data.totalAmount = parseFloat(updates.totalAmount)

  const batch = await prisma.payrollBatch.update({ where: { id }, data })
  return NextResponse.json({ success: true, data: batch })
}
