import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

function toCsv(rows: Record<string, unknown>[], headers: string[]): string {
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  return [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ].join('\n')
}

function csvResponse(csv: string, filename: string) {
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const type = new URL(request.url).searchParams.get('type') ?? 'payments'
  const date = new Date().toISOString().split('T')[0]

  try {
    if (type === 'payments') {
      const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { paymentLink: { select: { code: true, name: true } } },
      })

      const headers = ['id','date','payer','amount','currency','status','network','kyc_passed','sanctions_checked','compliance_score','tx_hash','payment_link','payment_link_name']
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

      return csvResponse(toCsv(rows, headers), `flowlink-payments-${date}.csv`)
    }

    if (type === 'invoices') {
      const invoices = await prisma.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })

      const headers = ['invoice_number','date','due_date','paid_date','agent','issued_to','amount','currency','network','status','compliance_status','tx_hash','payment_link']
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

      return csvResponse(toCsv(rows, headers), `flowlink-invoices-${date}.csv`)
    }

    if (type === 'payroll') {
      const batches = await prisma.payrollBatch.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { recipients: true },
      })

      const headers = ['batch_name','batch_status','batch_date','recipient_name','recipient_email','wallet_address','amount','currency','country','kyc_status','recipient_status','tx_hash']
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

      return csvResponse(toCsv(rows, headers), `flowlink-payroll-${date}.csv`)
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })

  } catch (err) {
    console.error('[reports] export error:', err)
    return NextResponse.json({ error: 'Export failed — please try again.' }, { status: 500 })
  }
}
