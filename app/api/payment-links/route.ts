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

  const links = await prisma.paymentLink.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ success: true, data: links, total: links.length })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()

  // Look up the authenticated user's wallet address to use as recipient
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletAddress: true },
  })

  const link = await prisma.paymentLink.create({
    data: {
      userId,
      code: body.code || `pay-${Date.now()}`,
      name: body.name || null,
      network: body.network || "celo",
      sourceToken: body.sourceToken || "cUSD",
      destStable: body.destStable || "cUSD",
      amountMin: body.amountMin ? parseFloat(body.amountMin) : null,
      amountMax: body.amountMax ? parseFloat(body.amountMax) : null,
      recipientAddress: user?.walletAddress ?? null,
      status: "active",
    },
  })

  return NextResponse.json({ success: true, data: link }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()
  const { id, ...updates } = body

  const existing = await prisma.paymentLink.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
  }

  const link = await prisma.paymentLink.update({ where: { id }, data: updates })
  return NextResponse.json({ success: true, data: link })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 })

  const existing = await prisma.paymentLink.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
  }

  await prisma.paymentLink.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
