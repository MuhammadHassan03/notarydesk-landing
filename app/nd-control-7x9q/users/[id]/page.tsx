import { adminSupabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import UserActions from './UserActions'

const PLAN_COLOR: Record<string, string> = {
  free: '#484f58', pro: '#1d4ed8', plus: '#d29922',
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const userId = params.id

  // Fetch profile and recent records in parallel
  // Note: support_tickets join uses a separate query to avoid needing FK relationships
  const [profile, journals, invoices, trips, expenses, appts, tickets] = await Promise.all([
    adminSupabase.from('profiles').select('*').eq('id', userId).single(),
    adminSupabase.from('journal_entries')
      .select('id, signing_date, signer_name, document_type, fee')
      .eq('user_id', userId).order('signing_date', { ascending: false }).limit(5),
    adminSupabase.from('invoices')
      .select('id, client_name, amount, status, created_at')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
    adminSupabase.from('mileage_logs')
      .select('id, trip_date, distance_miles, irs_deduction, label')
      .eq('user_id', userId).order('trip_date', { ascending: false }).limit(5),
    adminSupabase.from('expenses')
      .select('id, expense_date, description, amount, category')
      .eq('user_id', userId).order('expense_date', { ascending: false }).limit(5),
    adminSupabase.from('appointments')
      .select('id, appointment_date, appointment_time, client_name, status')
      .eq('user_id', userId).order('appointment_date', { ascending: false }).limit(5),
    adminSupabase.from('support_tickets')
      .select('id, subject, status, created_at')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
  ])

  if (!profile.data) notFound()
  const p = profile.data

  function Row({ label, value }: { label: string; value: any }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #161b22' }}>
        <span style={{ color: '#8b949e', fontSize: 13 }}>{label}</span>
        <span style={{ color: '#e6edf3', fontSize: 13, fontWeight: 500 }}>{value ?? '—'}</span>
      </div>
    )
  }

  function MiniTable({ title, data, cols }: { title: string; data: any[] | null; cols: string[] }) {
    return (
      <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <p style={{ color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0, padding: '12px 16px', borderBottom: '1px solid #161b22' }}>
          {title}
        </p>
        {!data?.length
          ? <p style={{ color: '#30363d', fontSize: 13, padding: 16, margin: 0 }}>No records</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {cols.map(c => (
                    <th key={c} style={{ padding: '8px 12px', textAlign: 'left', color: '#484f58', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>
                      {c.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, i: number) => (
                  <tr key={i} style={{ borderTop: '1px solid #161b22' }}>
                    {cols.map(c => (
                      <td key={c} style={{ padding: '8px 12px', color: '#8b949e', fontSize: 12 }}>
                        {String(row[c] ?? '—').slice(0, 40)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    )
  }

  const initial = (p.full_name ?? p.email ?? '?')[0].toUpperCase()
  const planColor = PLAN_COLOR[p.plan] ?? '#484f58'

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 12, background: '#1d4ed8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 22, fontWeight: 700, flexShrink: 0,
        }}>
          {initial}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#e6edf3', fontSize: 20, fontWeight: 700, margin: '0 0 2px' }}>
            {p.full_name ?? 'No name set'}
          </h1>
          <p style={{ color: '#8b949e', fontSize: 13, margin: 0 }}>{p.email}</p>
        </div>
        <span style={{
          padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', background: planColor + '22',
          color: planColor, border: `1px solid ${planColor}44`,
        }}>
          {p.plan}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Profile info */}
        <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
          <p style={{ color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 12px' }}>Profile</p>
          <Row label="User ID"     value={<span style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.id.slice(0, 20)}…</span>} />
          <Row label="State"       value={p.state} />
          <Row label="Business"    value={p.business_name} />
          <Row label="Phone"       value={p.phone} />
          <Row label="Commission"  value={p.commission_number} />
          <Row label="Default Fee" value={p.default_fee ? `$${p.default_fee}` : null} />
          <Row label="Joined"      value={new Date(p.created_at).toLocaleDateString()} />
        </div>

        {/* Actions */}
        <UserActions userId={p.id} currentPlan={p.plan} userEmail={p.email} />
      </div>

      {/* Recent data */}
      <MiniTable title="Recent journal entries" data={journals.data} cols={['signing_date', 'signer_name', 'document_type', 'fee']} />
      <MiniTable title="Recent invoices"        data={invoices.data}  cols={['created_at', 'client_name', 'amount', 'status']} />
      <MiniTable title="Recent mileage trips"   data={trips.data}     cols={['trip_date', 'label', 'distance_miles', 'irs_deduction']} />
      <MiniTable title="Recent expenses"        data={expenses.data}  cols={['expense_date', 'description', 'category', 'amount']} />
      <MiniTable title="Upcoming appointments"  data={appts.data}     cols={['appointment_date', 'appointment_time', 'client_name', 'status']} />
      <MiniTable title="Support tickets"        data={tickets.data}   cols={['created_at', 'subject', 'status']} />
    </div>
  )
}