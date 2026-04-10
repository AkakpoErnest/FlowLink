import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { deriveAgentWallet } from "@/lib/agent-wallet"

function unauth() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const agents = await prisma.agent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ success: true, data: agents, total: agents.length })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const body = await request.json()

  // Create agent first to get DB-generated id
  const agent = await prisma.agent.create({
    data: {
      userId,
      name: body.name,
      description: body.description || null,
      walletAddress: body.walletAddress || null,
      capabilities: body.capabilities || [],
      status: "active",
    },
  })

  // Auto-derive a deterministic wallet address from the master mnemonic
  let walletAddress = agent.walletAddress
  if (!walletAddress && process.env.DEPLOYER_MNEMONIC) {
    try {
      const agentIndex = agent.id.charCodeAt(0) % 100
      const { address } = deriveAgentWallet(agentIndex)
      walletAddress = address
      await prisma.agent.update({ where: { id: agent.id }, data: { walletAddress: address } })
    } catch {
      // Non-fatal: agent still created without wallet address
    }
  }

  return NextResponse.json({ success: true, data: { ...agent, walletAddress } }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const body = await request.json()
  const { id, ...updates } = body

  const existing = await prisma.agent.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 })
  }

  const agent = await prisma.agent.update({ where: { id }, data: updates })
  return NextResponse.json({ success: true, data: agent })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })
  }

  const existing = await prisma.agent.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 })
  }

  await prisma.agent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
