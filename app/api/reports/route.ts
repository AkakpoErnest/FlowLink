import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

function unauth() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ]
  return lines.join('\n')
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauth()
  // @ts-ignore
  const userId = session.user.id as string

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'payments'

  if (type === 'payments') {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { paymentLink: { select: { code: true, name: true } } },
    })

    const rows = payments.map(p => ({
      id: p.id,
      date: p.createdAt.toISOString().split('T')[0],
      payer: p.payer ?? '',
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      network: p.network,
      kyc_passed: p.kycPassed ? 'yes' : 'no',
      sanctions_checked: p.sanctionsChecked ? 'yes' : 'no',
      compliance_score: p.complianceScore,
      tx_hash: p.txHash ?? '',
      payment_link: p.paymentLink?.code ?? '',
      payment_link_name: p.paymentLink?.name ?? '',
    }))

    const csv = toCsv(rows)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="flowlink-payments-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  }

  if (type === 'invoices') {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const rows = invoices.map(inv => ({
      invoice_number: inv.invoiceNumber,
      date: inv.createdAt.toISOString().split('T')[0],
      due_date: inv.dueAt?.toISOString().split('T')[0] ?? '',
      paid_date: inv.paidAt?.toISOString().split('T')[0] ?? '',
      agent: inv.agentName ?? '',
      issued_to: inv.issuedTo ?? '',
      amount: inv.amount,
      currency: inv.currency,
      network: inv.network,
      status: inv.status,
      compliance_status: inv.complianceStatus,
      tx_hash: inv.txHash ?? '',
      payment_link: inv.paymentLinkCode ?? '',
    }))

    const csv = toCsv(rows)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="flowlink-invoices-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  }

  if (type === 'payroll') {
    const batches = await prisma.payrollBatch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { recipients: true },
    })

    const rows = batches.flatMap(b =>
      b.recipients.map(r => ({
        batch_name: b.name,
        batch_status: b.status,
        batch_date: b.createdAt.toISOString().split('T')[0],
        recipient_name: r.name,
        recipient_email: r.email ?? '',
        wallet_address: r.walletAddress,
        amount: r.amount,
        currency: r.currency,
        country: r.country ?? '',
        kyc_status: r.kycStatus,
        recipient_status: r.status,
        tx_hash: r.txHash ?? '',
      }))
    )

    const csv = toCsv(rows)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="flowlink-payroll-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  }

  return NextResponse.json({ success: false, error: 'Unknown report type' }, { status: 400 })
}
