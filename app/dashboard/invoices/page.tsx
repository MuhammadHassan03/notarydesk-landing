'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useInvoices, type InvoiceStatus } from '@/hooks/use-invoices'
import { INVOICE_STATUS_CONFIG, invoiceNumber } from '@/lib/constants'
import { currency, formatDate } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'

const STATUS_ORDER: InvoiceStatus[] = ['draft', 'sent', 'overdue', 'paid', 'cancelled']

export default function InvoicesListPage() {
  const router = useRouter()
  const { invoices, loading } = useInvoices()
  const [filter, setFilter] = useState<InvoiceStatus | null>(null)

  const filtered = useMemo(() => {
    const list = filter ? invoices.filter(i => i.status === filter) : invoices
    return [...list].sort((a, b) => b.created_at.localeCompare(a.created_at))
  }, [invoices, filter])

  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {}
    invoices.forEach(i => { m[i.status] = (m[i.status] || 0) + 1 })
    return m
  }, [invoices])

  // Stats
  const totalRevenue = useMemo(() => invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0), [invoices])
  const unpaidTotal = useMemo(() => invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0), [invoices])

  return (
    <div>
      <PageHeader title="Invoices" subtitle="Create, send, and track client invoices"
        action={
          <Button variant="gold" href="/dashboard/invoices/new">
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> New invoice
          </Button>
        } />

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total invoices', value: String(invoices.length), icon: 'receipt_long' as const, color: 'var(--primary)' },
          { label: 'Revenue (paid)', value: currency(totalRevenue), icon: 'check_circle' as const, color: 'var(--success)' },
          { label: 'Outstanding', value: currency(unpaidTotal), icon: 'pending' as const, color: unpaidTotal > 0 ? 'var(--warning)' : 'var(--text-tertiary)' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--primary-light)' }}>
              <Icon name={s.icon} size={17} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{s.value}</div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status filter pills ──────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter(null)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all"
          style={{ background: !filter ? 'var(--primary)' : 'var(--surface)', color: !filter ? '#fff' : 'var(--text-secondary)', border: !filter ? 'none' : '1px solid var(--border)' }}>
          All ({invoices.length})
        </button>
        {STATUS_ORDER.filter(s => statusCounts[s]).map(s => {
          const cfg = INVOICE_STATUS_CONFIG[s]
          const active = filter === s
          return (
            <button key={s} onClick={() => setFilter(active ? null : s)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all"
              style={{ background: active ? cfg.color : cfg.bg, color: active ? '#fff' : cfg.color }}>
              <Icon name={cfg.icon} size={13} /> {cfg.label} ({statusCounts[s]})
            </button>
          )
        })}
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="receipt_long" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>{filter ? `No ${INVOICE_STATUS_CONFIG[filter].label.toLowerCase()} invoices` : 'No invoices yet'}</div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Create your first invoice to start getting paid faster</div>
          <Button variant="gold" href="/dashboard/invoices/new"><Icon name="add" size={16} style={{ color: 'inherit' }} /> Create invoice</Button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {filtered.map((inv, i) => {
            const cfg = INVOICE_STATUS_CONFIG[inv.status]
            return (
              <div key={inv.id}
                className="flex items-center gap-3 px-5 py-4 transition-colors cursor-pointer"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none' }}
                onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                {/* Status icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                  <Icon name={cfg.icon} size={18} style={{ color: cfg.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>{inv.client_name}</span>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{invoiceNumber(inv.id)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    <span className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{inv.service_description}</span>
                  </div>
                </div>

                {/* Amount + date */}
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{currency(inv.amount)}</div>
                  <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    {inv.due_date ? `Due ${formatDate(inv.due_date)}` : formatDate(inv.created_at?.split('T')[0])}
                  </span>
                </div>

                <Icon name="chevron_right" size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}