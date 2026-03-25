'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useJournalEntries } from '@/hooks/use-journal'
import { getDocStyle } from '@/lib/constants'
import { currency, formatDate } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'

export default function JournalListPage() {
  const router = useRouter()
  const { entries, loading } = useJournalEntries()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const list = q
      ? entries.filter(e =>
          e.signer_name.toLowerCase().includes(q) ||
          (e.document_type || '').toLowerCase().includes(q) ||
          (e.signer_address || '').toLowerCase().includes(q))
      : entries
    return [...list].sort((a, b) => b.signing_date.localeCompare(a.signing_date))
  }, [entries, search])

  // Stats
  const totalFees = useMemo(() => entries.reduce((s, e) => s + (e.fee || 0), 0), [entries])
  const finalized = useMemo(() => entries.filter(e => e.is_finalized).length, [entries])

  return (
    <div>
      <PageHeader title="Notary Journal" subtitle="Legally compliant digital journal entries"
        action={
          <Button variant="gold" href="/dashboard/journal/new">
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> New entry
          </Button>
        } />

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total entries', value: String(entries.length), icon: 'menu_book' as const, color: 'var(--primary)' },
          { label: 'Finalized', value: `${finalized} / ${entries.length}`, icon: 'lock' as const, color: 'var(--success)' },
          { label: 'Total fees', value: currency(totalFees), icon: 'attach_money' as const, color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--primary-light)' }}>
              <Icon name={s.icon} size={17} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{s.value}</div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ───────────────────────────────────────────── */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }}>
          <Icon name="description" size={17} />
        </span>
        <input className="input-base pl-10" placeholder="Search by signer name, document type, or address..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] rounded-full animate-spin-slow"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="menu_book" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>
            {search ? 'No matching entries' : 'No journal entries yet'}
          </div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {search ? 'Try a different search' : 'Log your first signing to start your compliant journal'}
          </div>
          {!search && (
            <Button variant="gold" href="/dashboard/journal/new">
              <Icon name="add" size={16} style={{ color: 'inherit' }} /> New entry
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {filtered.map((entry, i) => {
            const doc = getDocStyle(entry.document_type)
            return (
              <div key={entry.id}
                className="flex items-center gap-3 px-5 py-4 transition-colors cursor-pointer"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none' }}
                onClick={() => router.push(`/dashboard/journal/${entry.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                {/* Doc icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: doc.color + '15' }}>
                  <Icon name={doc.icon} size={18} style={{ color: doc.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {entry.signer_name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: doc.color + '15', color: doc.color }}>
                      {entry.document_type || 'Other'}
                    </span>
                    {entry.id_type && (
                      <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                        {entry.id_type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
                    {currency(entry.fee)}
                  </div>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    {entry.is_finalized && (
                      <Icon name="lock" size={11} style={{ color: 'var(--success)' }} />
                    )}
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(entry.signing_date)}
                    </span>
                  </div>
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