import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.user.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [activeLinks, payments, pendingInvoices] = await Promise.all([
      prisma.paymentLink.count({ where: { userId, status: 'active' } }),
      prisma.payment.findMany({ where: { userId }, select: { amount: true }, take: 1000 }),
      prisma.invoice.count({ where: { userId, status: 'pending' } }),
    ])

    const totalVolume = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const totalPayments = payments.length

    return NextResponse.json({ totalVolume, activePaymentLinks: activeLinks, totalPayments, pendingInvoices })
  } catch (e) {
    console.error('Dashboard stats error:', e)
    return NextResponse.json({ totalVolume: 0, activePaymentLinks: 0, totalPayments: 0, pendingInvoices: 0 })
  }
}
