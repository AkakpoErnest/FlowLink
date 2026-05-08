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

    if (type === 'statement') {
      const [user, payments, invoices, paymentLinks] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, walletAddress: true } }),
        prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { paymentLink: { select: { code: true, name: true } } } }),
        prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
        prisma.paymentLink.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      ])

      const totalVolume = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
      const pendingInvoices = invoices.filter(i => i.status === 'pending').length
      const paidInvoices = invoices.filter(i => i.status === 'paid').length
      const invoiceVolume = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
      const activeLinks = paymentLinks.filter(l => l.status === 'active').length

      const row = (cells: string[], bold = false) =>
        `<tr>${cells.map(c => `<td style="${bold ? 'font-weight:700;' : ''}padding:9px 10px;border-bottom:1px solid #f0f0f0;font-size:13px;color:${bold ? '#111' : '#444'}">${c}</td>`).join('')}</tr>`

      const statusBadge = (s: string) => {
        const colors: Record<string, string> = {
          completed: '#d1fae5;color:#065f46',
          paid: '#d1fae5;color:#065f46',
          pending: '#fef3c7;color:#92400e',
          failed: '#fee2e2;color:#991b1b',
          overdue: '#fee2e2;color:#991b1b',
          cancelled: '#f3f4f6;color:#6b7280',
          active: '#dbeafe;color:#1e40af',
          draft: '#f3f4f6;color:#6b7280',
        }
        const c = colors[s] ?? '#f3f4f6;color:#6b7280'
        return `<span style="background:${c};padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">${s}</span>`
      }

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>FlowLink Account Statement — ${date}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f6f9fc;margin:0;padding:0;color:#111}
  .page{max-width:900px;margin:0 auto;padding:40px 24px}
  .header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px}
  .logo{font-size:26px;font-weight:800;letter-spacing:-0.5px}
  .logo span{color:#059669}
  .meta{text-align:right;font-size:12px;color:#888;line-height:1.8}
  .divider{border:none;border-top:2px solid #e5e7eb;margin:28px 0}
  .section{margin-bottom:32px}
  .section-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:12px}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:8px}
  .stat{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px}
  .stat-label{font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .stat-value{font-size:22px;font-weight:800;color:#111}
  .stat-sub{font-size:11px;color:#6b7280;margin-top:3px}
  .wallet-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;font-size:13px}
  .wallet-box strong{color:#065f46}
  table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;font-size:13px}
  thead tr{background:#f9fafb}
  th{padding:10px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;border-bottom:2px solid #e5e7eb}
  .empty{text-align:center;padding:32px;color:#9ca3af;font-size:13px}
  .footer{margin-top:40px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:20px}
  .print-btn{display:inline-block;margin:0 0 24px;padding:10px 24px;background:#059669;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
  @media print{.no-print{display:none}body{background:#fff}.page{padding:24px 0}}
</style></head><body>
<div class="page">
  <button class="print-btn no-print" onclick="window.print()">⬇ Print / Save as PDF</button>

  <div class="header">
    <div>
      <div class="logo">Flow<span>Link</span></div>
      <div style="font-size:13px;color:#6b7280;margin-top:4px">Account Statement</div>
    </div>
    <div class="meta">
      <div><strong>${user?.name ?? 'Account'}</strong></div>
      <div>${user?.email ?? ''}</div>
      <div>Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>

  <hr class="divider">

  <!-- Summary stats -->
  <div class="section">
    <div class="section-title">Summary</div>
    <div class="stats">
      <div class="stat">
        <div class="stat-label">Total Volume Received</div>
        <div class="stat-value">$${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="stat-sub">${payments.filter(p => p.status === 'completed').length} completed payment${payments.filter(p => p.status === 'completed').length !== 1 ? 's' : ''}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Invoice Revenue</div>
        <div class="stat-value">$${invoiceVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="stat-sub">${paidInvoices} paid · ${pendingInvoices} pending</div>
      </div>
      <div class="stat">
        <div class="stat-label">Active Payment Links</div>
        <div class="stat-value">${activeLinks}</div>
        <div class="stat-sub">${paymentLinks.length} total link${paymentLinks.length !== 1 ? 's' : ''}</div>
      </div>
    </div>
  </div>

  ${user?.walletAddress ? `
  <div class="section">
    <div class="section-title">Wallet</div>
    <div class="wallet-box">
      <strong>Linked Wallet:</strong>&nbsp;
      <span style="font-family:monospace">${user.walletAddress}</span>
    </div>
  </div>` : ''}

  <hr class="divider">

  <!-- Payments -->
  <div class="section">
    <div class="section-title">Payments (${payments.length})</div>
    ${payments.length === 0 ? '<div class="empty">No payments yet</div>' : `
    <table>
      <thead><tr>
        <th>Date</th><th>From</th><th>Amount</th><th>Network</th><th>Via</th><th>Status</th><th>Tx Hash</th>
      </tr></thead>
      <tbody>
        ${payments.map(p => row([
          p.createdAt.toLocaleDateString(),
          p.payer ? `<span style="font-family:monospace;font-size:11px">${p.payer.slice(0, 8)}…${p.payer.slice(-6)}</span>` : '—',
          `<strong>${p.amount} ${p.currency}</strong>`,
          p.network,
          p.paymentLink?.name ?? p.paymentLink?.code ?? '—',
          statusBadge(p.status),
          p.txHash ? `<span style="font-family:monospace;font-size:10px">${p.txHash.slice(0, 12)}…</span>` : '—',
        ])).join('')}
      </tbody>
    </table>`}
  </div>

  <hr class="divider">

  <!-- Invoices -->
  <div class="section">
    <div class="section-title">Invoices (${invoices.length})</div>
    ${invoices.length === 0 ? '<div class="empty">No invoices yet</div>' : `
    <table>
      <thead><tr>
        <th>Invoice #</th><th>Issued To</th><th>Amount</th><th>Network</th><th>Due</th><th>Status</th><th>Paid</th>
      </tr></thead>
      <tbody>
        ${invoices.map(inv => row([
          `<strong>${inv.invoiceNumber}</strong>`,
          inv.issuedTo ?? '—',
          `<strong>${inv.amount} ${inv.currency}</strong>`,
          inv.network,
          inv.dueAt ? inv.dueAt.toLocaleDateString() : '—',
          statusBadge(inv.status),
          inv.paidAt ? inv.paidAt.toLocaleDateString() : '—',
        ])).join('')}
      </tbody>
    </table>`}
  </div>

  <hr class="divider">

  <!-- Payment Links -->
  <div class="section">
    <div class="section-title">Payment Links (${paymentLinks.length})</div>
    ${paymentLinks.length === 0 ? '<div class="empty">No payment links yet</div>' : `
    <table>
      <thead><tr>
        <th>Name</th><th>Code</th><th>Network</th><th>Amount</th><th>Transactions</th><th>Volume</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${paymentLinks.map(l => row([
          l.name,
          `<span style="font-family:monospace;font-size:11px">${l.code}</span>`,
          l.network,
          l.amountMin === l.amountMax ? `${l.amountMin} ${l.sourceToken}` : `${l.amountMin}–${l.amountMax} ${l.sourceToken}`,
          String(l.transactions ?? 0),
          `$${(l.totalVolume ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          statusBadge(l.status),
        ])).join('')}
      </tbody>
    </table>`}
  </div>

  <div class="footer">
    FlowLink · flowlink.ink · Statement generated ${new Date().toISOString()}
  </div>
</div>
</body></html>`

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })

  } catch (err) {
    console.error('[reports] export error:', err)
    return NextResponse.json({ error: 'Export failed — please try again.' }, { status: 500 })
  }
}
