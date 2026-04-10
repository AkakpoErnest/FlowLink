import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { computeNextRun } from "@/lib/agent-engine"

function unauth() { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

// GET /api/agents/rules?agentId=xxx  — list rules for an agent
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const agentId = req.nextUrl.searchParams.get("agentId")
  if (!agentId) return NextResponse.json({ error: "agentId required" }, { status: 400 })

  const agent = await prisma.agent.findFirst({ where: { id: agentId, userId } })
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })

  const rules = await prisma.agentRule.findMany({
    where: { agentId },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ success: true, data: rules })
}

// POST /api/agents/rules  — create a rule
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const body = await req.json()
  const { agentId, type, config } = body

  if (!agentId || !type || !config) {
    return NextResponse.json({ error: "agentId, type, config are required" }, { status: 400 })
  }

  const agent = await prisma.agent.findFirst({ where: { id: agentId, userId } })
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })

  let nextRun: Date | null = null
  if (type === "scheduled" && config.cron) {
    nextRun = computeNextRun(config.cron as string)
  }

  const rule = await prisma.agentRule.create({
    data: { agentId, type, config, status: "active", nextRun },
  })

  return NextResponse.json({ success: true, data: rule })
}

// PATCH /api/agents/rules  — update status or config
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const body = await req.json()
  const { id, status, config } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const rule = await prisma.agentRule.findFirst({
    where: { id },
    include: { agent: true },
  })
  if (!rule || rule.agent.userId !== userId) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 })
  }

  const updated = await prisma.agentRule.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(config !== undefined ? { config } : {}),
    },
  })

  return NextResponse.json({ success: true, data: updated })
}

// DELETE /api/agents/rules?id=xxx
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  const userId = session.user.id

  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const rule = await prisma.agentRule.findFirst({
    where: { id },
    include: { agent: true },
  })
  if (!rule || rule.agent.userId !== userId) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 })
  }

  await prisma.agentRule.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
