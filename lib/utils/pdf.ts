import type { Profile } from '@/lib/types'

interface InvoiceData {
  id: string
  client_name: string
  client_email?: string | null
  client_phone?: string | null
  service_description: string
  amount: number
  status: string
  due_date?: string | null
  payment_method?: string | null
  notes?: string | null
  created_at: string
}

/**
 * Generate a professional invoice HTML string for printing/PDF export.
 * Includes logo if available, NotaryDesk watermark, proper branding.
 */
export function generateInvoiceHTML(invoice: InvoiceData, profile: Partial<Profile>): string {
  const invNum = `INV-${invoice.id.slice(0, 8).toUpperCase()}`
  const createdDate = new Date(invoice.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const dueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Upon receipt'

  const logoHtml = profile.logo_url
    ? `<img src="${profile.logo_url}" alt="Logo" style="max-height:60px;max-width:180px;object-fit:contain;display:block;margin-bottom:8px;" />`
    : ''

  const businessName = profile.business_name || profile.full_name || 'Your Notary Business'

  const statusColor: Record<string, string> = {
    paid: '#16A34A', sent: '#2563EB', overdue: '#DC2626', draft: '#64748B',
  }
  const statusBadge = invoice.status
    ? `<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;background:${statusColor[invoice.status] ?? '#64748B'}22;color:${statusColor[invoice.status] ?? '#64748B'};border:1px solid ${statusColor[invoice.status] ?? '#64748B'}44;">${invoice.status}</span>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${invNum} — ${businessName}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #fff;
      padding: 48px 52px;
      max-width: 820px;
      margin: 0 auto;
      font-size: 13px;
      line-height: 1.6;
    }

    /* ── Header ── */
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:36px; padding-bottom:24px; border-bottom:2px solid #1B3A5C; }
    .from-block .biz-name { font-size:20px; font-weight:800; color:#1B3A5C; margin-bottom:2px; }
    .from-block .biz-meta { font-size:11px; color:#64748B; line-height:1.8; }
    .inv-block { text-align:right; }
    .inv-block .inv-title { font-size:32px; font-weight:900; color:#C9A84C; letter-spacing:-1px; }
    .inv-block .inv-num { font-size:12px; color:#64748B; margin-top:2px; }
    .inv-block .inv-status { margin-top:6px; }

    /* ── Bill-to / Date grid ── */
    .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px; }
    .meta-col h5 { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#94A3B8; margin-bottom:6px; }
    .meta-col .meta-val { font-size:13px; color:#0F172A; font-weight:600; }
    .meta-col .meta-sub { font-size:12px; color:#64748B; }

    /* ── Line items table ── */
    .table-wrap { margin-bottom:20px; }
    .items-table { width:100%; border-collapse:collapse; border-radius:8px; overflow:hidden; }
    .items-table thead tr { background:#F1F5F9; }
    .items-table th {
      padding:10px 14px; font-size:10px; font-weight:700; text-transform:uppercase;
      letter-spacing:0.8px; color:#64748B; text-align:left;
    }
    .items-table th:last-child { text-align:right; }
    .items-table tbody tr { border-bottom:1px solid #E2E8F0; }
    .items-table tbody tr:last-child { border-bottom:none; }
    .items-table td { padding:14px; font-size:13px; color:#0F172A; vertical-align:top; }
    .items-table td:last-child { text-align:right; font-weight:700; color:#1B3A5C; }
    .items-table tbody { background:#fff; }

    /* ── Totals ── */
    .totals-section { display:flex; justify-content:flex-end; margin-bottom:28px; }
    .totals-box { min-width:220px; }
    .totals-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #E2E8F0; }
    .totals-row:last-child { border-bottom:none; padding-top:10px; }
    .totals-row .tot-label { font-size:12px; color:#64748B; }
    .totals-row .tot-val   { font-size:13px; font-weight:600; color:#0F172A; }
    .totals-row.grand .tot-label { font-size:13px; font-weight:700; color:#1B3A5C; }
    .totals-row.grand .tot-val   { font-size:22px; font-weight:900; color:#C9A84C; }

    /* ── Notes ── */
    .notes-block { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:14px 16px; margin-bottom:16px; }
    .notes-block h5 { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94A3B8; margin-bottom:6px; }
    .notes-block p  { font-size:12px; color:#475569; }

    /* ── Payment method ── */
    .pay-block { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
    .pay-block .pay-label { font-size:11px; color:#64748B; }
    .pay-block .pay-val   { font-size:12px; font-weight:600; color:#1B3A5C; background:#EFF6FF; border-radius:6px; padding:3px 10px; }

    /* ── Footer ── */
    .footer { display:flex; justify-content:space-between; align-items:center; padding-top:18px; border-top:1px solid #E2E8F0; }
    .footer-left  { font-size:11px; color:#94A3B8; }
    .footer-right { font-size:10px; color:#CBD5E1; }

    @media print {
      body { padding: 24px 28px; }
      .footer { position: fixed; bottom: 20px; left: 28px; right: 28px; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="from-block">
      ${logoHtml}
      <div class="biz-name">${businessName}</div>
      <div class="biz-meta">
        ${profile.commission_number ? `Commission #${profile.commission_number}<br>` : ''}
        ${profile.state ? `${profile.state}<br>` : ''}
        ${profile.business_address ? `${profile.business_address}<br>` : ''}
        ${profile.phone ? `${profile.phone}` : ''}
      </div>
    </div>
    <div class="inv-block">
      <div class="inv-title">INVOICE</div>
      <div class="inv-num">${invNum}</div>
      <div class="inv-status">${statusBadge}</div>
    </div>
  </div>

  <!-- Bill To / Dates -->
  <div class="meta-grid">
    <div class="meta-col">
      <h5>Bill To</h5>
      <div class="meta-val">${invoice.client_name}</div>
      ${invoice.client_email ? `<div class="meta-sub">${invoice.client_email}</div>` : ''}
      ${invoice.client_phone ? `<div class="meta-sub">${invoice.client_phone}</div>` : ''}
    </div>
    <div class="meta-col" style="text-align:right;">
      <h5>Invoice Date</h5>
      <div class="meta-val">${createdDate}</div>
      <br>
      <h5>Due Date</h5>
      <div class="meta-val">${dueDate}</div>
    </div>
  </div>

  <!-- Line Items -->
  <div class="table-wrap">
    <table class="items-table">
      <thead>
        <tr>
          <th style="width:60%">Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${invoice.service_description}</td>
          <td>1</td>
          <td>$${invoice.amount.toFixed(2)}</td>
          <td>$${invoice.amount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div class="totals-section">
    <div class="totals-box">
      <div class="totals-row">
        <span class="tot-label">Subtotal</span>
        <span class="tot-val">$${invoice.amount.toFixed(2)}</span>
      </div>
      <div class="totals-row grand">
        <span class="tot-label">Total Due</span>
        <span class="tot-val">$${invoice.amount.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <!-- Payment method -->
  ${invoice.payment_method ? `
  <div class="pay-block">
    <span class="pay-label">Accepted payment:</span>
    <span class="pay-val">${invoice.payment_method}</span>
  </div>` : ''}

  <!-- Notes -->
  ${invoice.notes ? `
  <div class="notes-block">
    <h5>Notes</h5>
    <p>${invoice.notes}</p>
  </div>` : ''}

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      Thank you for your business, ${invoice.client_name.split(' ')[0]}!
    </div>
    <div class="footer-right">Generated by NotaryDesk · ${new Date().toLocaleDateString()}</div>
  </div>

</body>
</html>`
}

/**
 * Open a print dialog with the invoice HTML — user can save as PDF.
 */
export function printInvoice(html: string) {
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(html)
  doc.close()

  iframe.contentWindow?.focus()
  setTimeout(() => {
    iframe.contentWindow?.print()
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
    }, 1500)
  }, 300)
}

/**
 * Download invoice as HTML file (fallback).
 */
export function downloadInvoiceHTML(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Download a PDF from the API.
 * Uses raw axios to bypass JSON unwrap interceptor for blob responses.
 */
export async function downloadPdf(endpoint: string, filename: string) {
  const { getStoredTokens } = await import('@/lib/api/tokens')
  const { API_URL } = await import('@/lib/api/client')
  const axios = (await import('axios')).default
  const { access } = getStoredTokens()
  const res = await axios.get(`${API_URL}${endpoint}`, {
    responseType: 'blob',
    headers: {
      Authorization: access ? `Bearer ${access}` : '',
    },
  })
  const blob = new Blob([res.data], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
