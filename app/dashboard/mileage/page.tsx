'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useMileageTrips, useMileageSummary } from '@/hooks/use-mileage'
import { currency, formatDate, monthLabel } from '@/lib/formatters'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/shared'

export default function MileageListPage() {
  const router = useRouter()
  const { trips, loading } = useMileageTrips()
  const { summary } = useMileageSummary()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const list = q
      ? trips.filter(t =>
          (t.label || '').toLowerCase().includes(q) ||
          t.start_address.toLowerCase().includes(q) ||
          t.end_address.toLowerCase().includes(q))
      : trips
    return [...list].sort((a, b) => b.trip_date.localeCompare(a.trip_date))
  }, [trips, search])

  // Month stats
  const now = new Date()
  const monthTrips = useMemo(() =>
    trips.filter(t => {
      const d = new Date(t.trip_date + 'T00:00:00')
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }), [trips])
  const monthMiles = useMemo(() => monthTrips.reduce((s, t) => s + t.distance_miles, 0), [monthTrips])
  const monthDeduction = useMemo(() => monthTrips.reduce((s, t) => s + t.irs_deduction, 0), [monthTrips])

  return (
    <div>
      <PageHeader title="Mileage Tracker" subtitle="Log trips and maximize your IRS deductions"
        action={
          <Button variant="gold" href="/dashboard/mileage/new">
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> Log trip
          </Button>
        } />

      {/* ── Summary Hero ─────────────────────────────────────── */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--primary)', color: '#fff' }}>
        <div className="text-[10px] font-bold tracking-[1.5px] uppercase opacity-50 mb-3">{monthLabel()}</div>
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <div className="text-[36px] font-extrabold -tracking-wider leading-none">
              {monthMiles.toFixed(1)} <span className="text-[18px] font-bold opacity-50">mi</span>
            </div>
            <div className="text-[13px] opacity-50 mt-1">
              {monthTrips.length} trip{monthTrips.length !== 1 ? 's' : ''} this month
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: 'rgba(201,168,76,0.2)' }}>
            <Icon name="savings" size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[15px] font-bold" style={{ color: 'var(--accent)' }}>
              {currency(monthDeduction)}
            </span>
          </div>
          <div className="text-[12px] opacity-40">IRS deduction @ ${(summary?.irs_rate || 0.70).toFixed(2)}/mi</div>
        </div>

        {/* All-time stats strip */}
        {summary && (
          <div className="flex gap-6 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <div className="text-[16px] font-bold">{summary.total_miles.toFixed(1)} mi</div>
              <div className="text-[11px] opacity-40">All-time miles</div>
            </div>
            <div>
              <div className="text-[16px] font-bold" style={{ color: 'var(--accent)' }}>{currency(summary.total_deduction)}</div>
              <div className="text-[11px] opacity-40">Total deductions</div>
            </div>
            <div>
              <div className="text-[16px] font-bold">{trips.length}</div>
              <div className="text-[11px] opacity-40">Total trips</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Search ───────────────────────────────────────────── */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }}>
          <Icon name="route" size={17} />
        </span>
        <input className="input-base pl-10" placeholder="Search by label or address..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ── Info banner (web = manual only) ───────────────────── */}
      <div className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
        style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)20' }}>
        <Icon name="info" size={15} style={{ color: 'var(--primary)', marginTop: 2 }} />
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--primary)' }}>
          <strong>Web dashboard</strong> supports manual trip logging. For live GPS tracking,
          use the NotaryDesk mobile app.
        </p>
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] rounded-full animate-spin-slow"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="route" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>
            {search ? 'No matching trips' : 'No trips logged yet'}
          </div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {search ? 'Try a different search' : 'Log your first trip to start tracking IRS deductions'}
          </div>
          {!search && (
            <Button variant="gold" href="/dashboard/mileage/new">
              <Icon name="add" size={16} style={{ color: 'inherit' }} /> Log trip
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {filtered.map((trip, i) => {
            const dateObj = new Date(trip.trip_date + 'T00:00:00')
            const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            const day = dateObj.getDate()
            return (
              <div key={trip.id}
                className="flex items-center gap-3 px-5 py-4 transition-colors cursor-pointer"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none' }}
                onClick={() => router.push(`/dashboard/mileage/${trip.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                {/* Date badge */}
                <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0"
                  style={{ background: 'var(--primary-light)' }}>
                  <span className="text-[9px] font-bold tracking-wider" style={{ color: 'var(--primary)' }}>{monthShort}</span>
                  <span className="text-[16px] font-extrabold leading-none" style={{ color: 'var(--primary)' }}>{day}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {trip.label || trip.start_address}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon name="location_on" size={11} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {trip.start_address} → {trip.end_address}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
                    {trip.distance_miles.toFixed(1)} mi
                  </div>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    <Icon name="savings" size={11} style={{ color: 'var(--accent)' }} />
                    <span className="text-[11px] font-medium" style={{ color: 'var(--accent)' }}>
                      {currency(trip.irs_deduction)}
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