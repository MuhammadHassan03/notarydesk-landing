import { adminSupabase } from '@/lib/supabase'
import TicketList from './TicketList'

type Props = { searchParams: { status?: string } }

export default async function TicketsPage({ searchParams }: Props) {
  const filter = searchParams.status ?? 'open'

  let query = adminSupabase
    .from('support_tickets')
    .select('id, subject, message, status, created_at, user_id, reply, replied_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (filter !== 'all') {
    query = query.eq('status', filter)
  }

  const { data: tickets, error } = await query

  // Fetch user emails separately to avoid needing a JOIN / FK relationship
  const userIds = [...new Set(tickets?.map((t: any) => t.user_id) ?? [])]
  let emailMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds)
    profiles?.forEach((p: any) => {
      emailMap[p.id] = p.full_name ? `${p.full_name} (${p.email})` : p.email
    })
  }

  const enriched = tickets?.map((t: any) => ({
    ...t,
    userLabel: emailMap[t.user_id] ?? t.user_id,
  })) ?? []

  const tabs = ['open', 'resolved', 'all']

  return (
    <div>
      <h1 style={{ color: '#e6edf3', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Support Tickets</h1>
      <p style={{ color: '#484f58', fontSize: 13, margin: '0 0 20px' }}>
        {enriched.length} ticket{enriched.length !== 1 ? 's' : ''} shown
        {error && <span style={{ color: '#f87171', marginLeft: 8 }}>{error.message}</span>}
      </p>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(s => (
          <a key={s} href={`?status=${s}`} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            textDecoration: 'none', textTransform: 'capitalize',
            background: filter === s ? '#1d4ed8' : '#0d1117',
            border: `1px solid ${filter === s ? '#2563eb' : '#21262d'}`,
            color: filter === s ? '#fff' : '#8b949e',
          }}>
            {s}
          </a>
        ))}
      </div>

      <TicketList tickets={enriched} />
    </div>
  )
}