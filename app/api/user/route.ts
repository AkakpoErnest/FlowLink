import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

function unauth() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, walletAddress: true, createdAt: true },
  })

  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: user })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const body = await request.json()
  const data: Record<string, unknown> = {}

  if (body.walletAddress !== undefined) {
    const addr = body.walletAddress ? (body.walletAddress as string).toLowerCase() : null
    if (addr && !/^0x[0-9a-fA-F]{40}$/.test(body.walletAddress as string)) {
      return NextResponse.json(
        { success: false, error: 'Invalid EVM wallet address' },
        { status: 400 }
      )
    }
    if (addr) {
      const conflict = await prisma.user.findFirst({ where: { walletAddress: addr } })
      if (conflict && conflict.id !== userId) {
        return NextResponse.json(
          { success: false, error: 'Wallet address is already linked to another account' },
          { status: 409 }
        )
      }
    }
    data.walletAddress = addr
  }

  if (body.name !== undefined) data.name = body.name

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, walletAddress: true },
  })

  return NextResponse.json({ success: true, data: user })
}
