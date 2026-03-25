'use client'

import { useMemo } from 'react'
import { useJobs } from '@/hooks/use-jobs'
import { useExpenses } from '@/hooks/use-expenses'
import { useMileageTrips } from '@/hooks/use-mileage'
import { currency } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { PageHeader } from '@/components/layout'

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function last12Months() {
  const months: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
    })
  }
  return months
}

// ── Bar chart component ────────────────────────────────────────────────────

function BarChart({ data, color = 'var(--primary)', height = 160, valueFormat = currency }: {
  data: { label: string; value: number }[]
  color?: string
  height?: number
  valueFormat?: (v: number) => string
}) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        const isThis = i === data.length - 1
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group relative" style={{ minWidth: 0 }}>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}>
              {valueFormat(d.value)}
            </div>
            {/* Bar */}
            <div className="w-full rounded-t-md transition-all"
              style={{
                height: `${Math.max(pct, d.value > 0 ? 4 : 0)}%`,
                background: isThis ? color : `${color}70`,
                minHeight: d.value > 0 ? '4px' : '0',
              }} />
            {/* Label */}
            <span className="text-[9px] font-medium truncate w-full text-center"
              style={{ color: 'var(--text-tertiary)' }}>
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Horizontal bar ─────────────────────────────────────────────────────────

function HBar({ label, value, max, color, subtitle }: {
  label: string; value: number; max: number; color: string; subtitle?: string
}) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="text-[13px] font-bold" style={{ color }}>{subtitle || String(value)}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ── Section card ───────────────────────────────────────────────────────────

function ChartCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name={icon as any} size={17} style={{ color: 'var(--primary)' }} />
        <span className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { jobs, loading: jobsLoading } = useJobs()
  const { expenses, loading: expLoading } = useExpenses()
  const { trips, loading: milesLoading } = useMileageTrips()

  const loading = jobsLoading || expLoading || milesLoading
  const months = useMemo(() => last12Months(), [])

  // ── Monthly income ─────────────────────────────────────────────────────
  const monthlyIncome = useMemo(() => {
    const map: Record<string, number> = {}
    jobs.filter(j => j.status === 'completed').forEach(j => {
      const key = getMonthKey(j.created_at)
      map[key] = (map[key] || 0) + j.fee + (j.travel_fee || 0)
    })
    return months.map(m => ({ label: m.label, value: map[m.key] || 0 }))
  }, [jobs, months])

  // ── Monthly jobs count ─────────────────────────────────────────────────
  const monthlyJobs = useMemo(() => {
    const map: Record<string, number> = {}
    jobs.forEach(j => {
      const key = getMonthKey(j.created_at)
      map[key] = (map[key] || 0) + 1
    })
    return months.map(m => ({ label: m.label, value: map[m.key] || 0 }))
  }, [jobs, months])

  // ── Monthly mileage ────────────────────────────────────────────────────
  const monthlyMiles = useMemo(() => {
    const map: Record<string, number> = {}
    trips.forEach(t => {
      const key = getMonthKey(t.trip_date)
      map[key] = (map[key] || 0) + t.distance_miles
    })
    return months.map(m => ({ label: m.label, value: map[m.key] || 0 }))
  }, [trips, months])

  // ── Payment status breakdown ───────────────────────────────────────────
  const paymentBreakdown = useMemo(() => {
    const paid   = jobs.filter(j => j.payment_status === 'paid').length
    const unpaid = jobs.filter(j => j.payment_status === 'unpaid').length
    const partial = jobs.filter(j => j.payment_status === 'partial').length
    const total = jobs.length || 1
    return [
      { label: 'Paid', value: paid, color: 'var(--success)', subtitle: `${paid} jobs` },
      { label: 'Unpaid', value: unpaid, color: 'var(--warning)', subtitle: `${unpaid} jobs` },
      { label: 'Partial', value: partial, color: 'var(--info)', subtitle: `${partial} jobs` },
    ].filter(x => x.value > 0).map(x => ({ ...x, max: total }))
  }, [jobs])

  // ── Job type breakdown ─────────────────────────────────────────────────
  const jobTypeBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    jobs.forEach(j => {
      const t = (j.job_type || 'other').replace(/_/g, ' ')
      const label = t.charAt(0).toUpperCase() + t.slice(1)
      map[label] = (map[label] || 0) + 1
    })
    const total = jobs.length || 1
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({
        label, value, max: total,
        color: ['var(--primary)', 'var(--accent)', 'var(--info)', 'var(--success)', 'var(--warning)'][i % 5],
        subtitle: `${value} jobs`,
      }))
  }, [jobs])

  // ── Expense categories ─────────────────────────────────────────────────
  const expenseBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount })
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], i) => ({
        label, value, max: total,
        color: ['var(--primary)', 'var(--accent)', 'var(--info)', 'var(--success)', 'var(--warning)', 'var(--danger)'][i % 6],
        subtitle: currency(value),
      }))
  }, [expenses])

  // ── Top clients by revenue ─────────────────────────────────────────────
  const topClients = useMemo(() => {
    const map: Record<string, number> = {}
    jobs.filter(j => j.status === 'completed').forEach(j => {
      const name = j.client_name || 'Unknown'
      map[name] = (map[name] || 0) + j.fee + (j.travel_fee || 0)
    })
    const maxVal = Math.max(...Object.values(map), 1)
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value, max: maxVal, color: 'var(--primary)', subtitle: currency(value) }))
  }, [jobs])

  // ── Summary stats ──────────────────────────────────────────────────────
  const totalIncome    = useMemo(() => jobs.filter(j => j.status === 'completed').reduce((s, j) => s + j.fee + (j.travel_fee || 0), 0), [jobs])
  const avgFee         = useMemo(() => jobs.filter(j => j.status === 'completed').length > 0 ? totalIncome / jobs.filter(j => j.status === 'completed').length : 0, [jobs, totalIncome])
  const totalMiles     = useMemo(() => trips.reduce((s, t) => s + t.distance_miles, 0), [trips])
  const totalExpenses  = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Revenue trends, job performance, and business insights" />

      {/* ── Summary strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        {[
          { label: 'Total revenue', value: currency(totalIncome), icon: 'attach_money', color: 'var(--success)' },
          { label: 'Avg. fee / job', value: currency(avgFee), icon: 'trending_up', color: 'var(--primary)' },
          { label: 'Total miles', value: `${Math.round(totalMiles)} mi`, icon: 'route', color: 'var(--info)' },
          { label: 'Total expenses', value: currency(totalExpenses), icon: 'account_balance_wallet', color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--primary-light)' }}>
              <Icon name={s.icon as any} size={17} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{s.value}</div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-5 mb-5 max-lg:grid-cols-1">

        {/* Monthly income */}
        <ChartCard title="Monthly revenue (12 months)" icon="bar_chart">
          <BarChart data={monthlyIncome} color="var(--primary)" height={160} />
        </ChartCard>

        {/* Monthly jobs */}
        <ChartCard title="Jobs per month (12 months)" icon="work">
          <BarChart data={monthlyJobs} color="var(--info)" height={160} valueFormat={v => `${v} jobs`} />
        </ChartCard>

        {/* Monthly mileage */}
        <ChartCard title="Miles driven per month (12 months)" icon="route">
          <BarChart data={monthlyMiles} color="var(--success)" height={160} valueFormat={v => `${v.toFixed(0)} mi`} />
        </ChartCard>

        {/* Payment status */}
        <ChartCard title="Payment status breakdown" icon="payments">
          {paymentBreakdown.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>No jobs yet</p>
          ) : (
            paymentBreakdown.map(x => (
              <HBar key={x.label} label={x.label} value={x.value} max={x.max} color={x.color} subtitle={x.subtitle} />
            ))
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">

        {/* Job types */}
        <ChartCard title="Jobs by type" icon="category">
          {jobTypeBreakdown.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>No jobs yet</p>
          ) : (
            jobTypeBreakdown.map(x => (
              <HBar key={x.label} label={x.label} value={x.value} max={x.max} color={x.color} subtitle={x.subtitle} />
            ))
          )}
        </ChartCard>

        {/* Top clients */}
        <ChartCard title="Top clients by revenue" icon="people">
          {topClients.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>No completed jobs yet</p>
          ) : (
            topClients.map(x => (
              <HBar key={x.label} label={x.label} value={x.value} max={x.max} color="var(--primary)" subtitle={x.subtitle} />
            ))
          )}
        </ChartCard>

        {/* Expense categories */}
        <ChartCard title="Expenses by category" icon="account_balance_wallet">
          {expenseBreakdown.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>No expenses yet</p>
          ) : (
            expenseBreakdown.map(x => (
              <HBar key={x.label} label={x.label} value={x.value} max={x.max} color={x.color} subtitle={x.subtitle} />
            ))
          )}
        </ChartCard>

      </div>
    </div>
  )
}
