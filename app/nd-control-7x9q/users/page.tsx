import { adminSupabase } from '@/lib/supabase'
import Link from 'next/link'

const PLAN_COLOR: Record<string, string> = {
  free:  '#484f58',
  pro:   '#1d4ed8',
  plus:  '#d29922',
}

type Props = { searchParams: { q?: string; plan?: string } }

export default async function UsersPage({ searchParams }: Props) {
  let query = adminSupabase
    .from('profiles')
    .select('id, full_name, email, plan, state, created_at, commission_number')
    .order('created_at', { ascending: false })
    .limit(200)

  if (searchParams.plan && searchParams.plan !== 'all') {
    query = query.eq('plan', searchParams.plan)
  }
  if (searchParams.q) {
    query = query.or(
      `email.ilike.%${searchParams.q}%,full_name.ilike.%${searchParams.q}%`
    )
  }

  const { data: users, error } = await query

  const inp = { flex: 1, padding: '9px 12px', borderRadius: 8, background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', fontSize: 13, outline: 'none' } as React.CSSProperties
  const sel = { padding: '9px 12px', borderRadius: 8, background: '#0d1117', border: '1px solid #30363d', color: '#8b949e', fontSize: 13, outline: 'none', cursor: 'pointer' } as React.CSSProperties

  return (
    <div>
      <h1 style={{ color: '#e6edf3', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Users</h1>
      <p style={{ color: '#484f58', fontSize: 13, margin: '0 0 20px' }}>
        {users?.length ?? 0} shown (max 200)
        {error && <span style={{ color: '#f87171', marginLeft: 8 }}>{error.message}</span>}
      </p>

      <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search name or email…"
          style={inp}
        />
        <select name="plan" defaultValue={searchParams.plan ?? 'all'} style={sel}>
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="plus">Plus</option>
        </select>
        <button type="submit" style={{
          padding: '9px 18px', borderRadius: 8, background: '#1d4ed8',
          border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}>
          Search
        </button>
      </form>

      <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              {['Name', 'Email', 'Plan', 'State', 'Joined', ''].map(h => (
                <th key={h} style={{
                  padding: '11px 14px', textAlign: 'left',
                  color: '#484f58', fontSize: 11, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any, i: number) => (
              <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #161b22' : 'none' }}>
                <td style={{ padding: '11px 14px', color: '#e6edf3', fontSize: 13 }}>
                  {u.full_name || <span style={{ color: '#30363d' }}>—</span>}
                </td>
                <td style={{ padding: '11px 14px', color: '#8b949e', fontSize: 12 }}>{u.email}</td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20,
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    background: (PLAN_COLOR[u.plan] ?? '#484f58') + '22',
                    color: PLAN_COLOR[u.plan] ?? '#484f58',
                    border: `1px solid ${(PLAN_COLOR[u.plan] ?? '#484f58')}44`,
                  }}>
                    {u.plan}
                  </span>
                </td>
                <td style={{ padding: '11px 14px', color: '#8b949e', fontSize: 12 }}>{u.state ?? '—'}</td>
                <td style={{ padding: '11px 14px', color: '#484f58', fontSize: 11 }}>
                  {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <Link href={`/nd-control-7x9q/users/${u.id}`} style={{ color: '#1d4ed8', fontSize: 12, textDecoration: 'none' }}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {!users?.length && (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#30363d', fontSize: 14 }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}