import { adminSupabase } from '@/lib/supabase'
import SignupsChart from '@/app/nd-control-7x9q/dashboard/SignupsChart'

async function getStats() {
  // Fix: count: 'exact' must be in the options object alongside head:false
  const [
    { data: users,  count: totalUsers  },
    { data: _j,     count: totalJournals },
    { data: invData, count: totalInvoices },
    { data: mileData },
    { data: expData  },
    { data: _a,     count: totalAppts  },
  ] = await Promise.all([
    adminSupabase.from('profiles').select('id, plan, created_at', { count: 'exact' }),
    adminSupabase.from('journal_entries').select('id', { count: 'exact', head: true }),
    adminSupabase.from('invoices').select('amount, status', { count: 'exact' }),
    adminSupabase.from('mileage_logs').select('distance_miles'),
    adminSupabase.from('expenses').select('amount'),
    adminSupabase.from('appointments').select('id', { count: 'exact', head: true }),
  ])

  const plans = { free: 0, pro: 0, plus: 0 }
  users?.forEach((u: any) => {
    if (u.plan in plans) plans[u.plan as keyof typeof plans]++
  })

  const paidRevenue = invData
    ?.filter((i: any) => i.status === 'paid')
    .reduce((sum: number, i: any) => sum + (i.amount ?? 0), 0) ?? 0

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()
  const recentSignups = users?.filter((u: any) => u.created_at >= weekAgo).length ?? 0

  const totalMiles = mileData?.reduce((s: number, r: any) => s + (r.distance_miles ?? 0), 0) ?? 0
  const totalExpenses = expData?.reduce((s: number, r: any) => s + (r.amount ?? 0), 0) ?? 0

  // Build 30-day signup chart data
  const days: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
    days[d] = 0
  }
  users?.forEach((u: any) => {
    const d = u.created_at?.slice(0, 10)
    if (d && d in days) days[d]++
  })
  const chartData = Object.entries(days).map(([date, count]) => ({ date, count }))

  return {
    totalUsers:    totalUsers ?? 0,
    recentSignups,
    plans,
    totalJournals: totalJournals ?? 0,
    totalInvoices: totalInvoices ?? 0,
    paidRevenue,
    totalMiles,
    totalExpenses,
    totalAppts:    totalAppts ?? 0,
    chartData,
  }
}

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean
}) {
  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${accent ? '#d29922' : '#21262d'}`,
      borderRadius: 10, padding: '18px 20px',
    }}>
      <p style={{ color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 6px' }}>{label}</p>
      <p style={{ color: accent ? '#d29922' : '#e6edf3', fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>{value}</p>
      {sub && <p style={{ color: '#484f58', fontSize: 12, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  const s = await getStats()
  const conv = s.totalUsers > 0
    ? (((s.plans.pro + s.plans.plus) / s.totalUsers) * 100).toFixed(1)
    : '0'

  return (
    <div>
      <h1 style={{ color: '#e6edf3', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Dashboard</h1>
      <p style={{ color: '#484f58', fontSize: 13, margin: '0 0 28px' }}>Live overview — refreshes on every page load</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 12, marginBottom: 12 }}>
        <StatCard label="Total Users"  value={s.totalUsers.toLocaleString()} sub={`+${s.recentSignups} this week`} accent />
        <StatCard label="Free"         value={s.plans.free.toLocaleString()} />
        <StatCard label="Pro"          value={s.plans.pro.toLocaleString()} />
        <StatCard label="Plus"         value={s.plans.plus.toLocaleString()} />
        <StatCard label="Conversion"   value={`${conv}%`} sub="free → paid" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 12, marginBottom: 28 }}>
        <StatCard label="Journals"     value={s.totalJournals.toLocaleString()} />
        <StatCard label="Invoices"     value={s.totalInvoices.toLocaleString()} />
        <StatCard label="Paid Revenue" value={`$${s.paidRevenue.toFixed(0)}`} />
        <StatCard label="Miles"        value={Math.round(s.totalMiles).toLocaleString()} />
        <StatCard label="Expenses"     value={`$${s.totalExpenses.toFixed(0)}`} />
        <StatCard label="Appointments" value={s.totalAppts.toLocaleString()} />
      </div>

      {/* 30-day signups bar chart */}
      <SignupsChart data={s.chartData} />

      {/* Plan distribution bar */}
      <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, padding: 20, marginTop: 16 }}>
        <p style={{ color: '#8b949e', fontSize: 12, fontWeight: 600, margin: '0 0 12px' }}>Plan distribution</p>
        <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 1 }}>
          {s.totalUsers > 0 && (
            <>
              <div style={{ flex: s.plans.free,  background: '#21262d' }} />
              <div style={{ flex: s.plans.pro,   background: '#1d4ed8' }} />
              <div style={{ flex: s.plans.plus,  background: '#d29922' }} />
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          {[
            { label: 'Free', count: s.plans.free,  color: '#484f58' },
            { label: 'Pro',  count: s.plans.pro,   color: '#1d4ed8' },
            { label: 'Plus', count: s.plans.plus,  color: '#d29922' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ color: '#8b949e', fontSize: 12 }}>
                {label}: <strong style={{ color: '#e6edf3' }}>{count}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}