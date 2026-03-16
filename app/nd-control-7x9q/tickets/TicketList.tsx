'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  created_at: string
  user_id: string
  userLabel: string
  reply: string | null
  replied_at: string | null
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [replies,  setReplies]  = useState<Record<string, string>>({})
  const [sending,  setSending]  = useState<string | null>(null)
  const [msgs,     setMsgs]     = useState<Record<string, { text: string; ok: boolean }>>({})

  if (!tickets.length) {
    return <p style={{ color: '#484f58', fontSize: 14 }}>No tickets.</p>
  }

  async function sendReply(ticketId: string) {
    const reply = replies[ticketId]?.trim()
    if (!reply) return
    setSending(ticketId)
    const res = await fetch('/api/nd-control-7x9q/reply-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, reply }),
    })
    setSending(null)
    const d = await res.json()
    if (res.ok) {
      setMsgs(m => ({ ...m, [ticketId]: { text: 'Reply sent — ticket marked resolved', ok: true } }))
      setReplies(r => ({ ...r, [ticketId]: '' }))
      setExpanded(null)
      router.refresh()
    } else {
      setMsgs(m => ({ ...m, [ticketId]: { text: d.error ?? 'Failed', ok: false } }))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tickets.map(t => {
        const isOpen = expanded === t.id
        const statusColor = t.status === 'open' ? '#f87171' : '#4ade80'
        const statusBg    = t.status === 'open' ? '#7f1d1d44' : '#14291a44'
        const statusBorder = t.status === 'open' ? '#b91c1c44' : '#16a34a44'

        return (
          <div key={t.id} style={{
            background: '#0d1117',
            border: `1px solid ${t.status === 'open' ? '#b91c1c33' : '#21262d'}`,
            borderRadius: 10, overflow: 'hidden',
          }}>
            {/* Header row */}
            <div
              onClick={() => setExpanded(isOpen ? null : t.id)}
              style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: '#e6edf3', fontSize: 14, fontWeight: 600 }}>{t.subject}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase', background: statusBg,
                    color: statusColor, border: `1px solid ${statusBorder}`,
                  }}>
                    {t.status}
                  </span>
                </div>
                <p style={{ color: '#8b949e', fontSize: 12, margin: '0 0 2px' }}>{t.userLabel}</p>
                <p style={{ color: '#484f58', fontSize: 11, margin: 0 }}>
                  {new Date(t.created_at).toLocaleString()}
                </p>
              </div>
              <span style={{ color: '#484f58', fontSize: 14 }}>{isOpen ? '▲' : '▼'}</span>
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div style={{ borderTop: '1px solid #21262d', padding: '16px 18px' }}>
                <p style={{ color: '#e6edf3', fontSize: 14, lineHeight: 1.7, margin: '0 0 16px', whiteSpace: 'pre-wrap' }}>
                  {t.message}
                </p>

                {/* Existing reply */}
                {t.reply && (
                  <div style={{
                    background: '#14291a', border: '1px solid #16a34a44',
                    borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                  }}>
                    <p style={{ color: '#4ade80', fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>YOUR REPLY</p>
                    <p style={{ color: '#e6edf3', fontSize: 13, margin: 0 }}>{t.reply}</p>
                  </div>
                )}

                {/* Reply form (only for open tickets) */}
                {t.status === 'open' && (
                  <>
                    <textarea
                      value={replies[t.id] ?? ''}
                      onChange={e => setReplies(r => ({ ...r, [t.id]: e.target.value }))}
                      rows={4}
                      placeholder="Type your reply…"
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 8,
                        background: '#161b22', border: '1px solid #30363d',
                        color: '#e6edf3', fontSize: 13, outline: 'none',
                        fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6,
                        marginBottom: 10,
                      }}
                    />
                    <button
                      onClick={() => sendReply(t.id)}
                      disabled={sending === t.id || !replies[t.id]?.trim()}
                      style={{
                        padding: '8px 18px', borderRadius: 8,
                        background: sending === t.id ? '#374151' : '#1d4ed8',
                        border: 'none', color: '#fff', fontWeight: 600,
                        fontSize: 13, cursor: sending === t.id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {sending === t.id ? 'Sending…' : 'Send reply & resolve'}
                    </button>
                  </>
                )}

                {msgs[t.id] && (
                  <p style={{ color: msgs[t.id].ok ? '#4ade80' : '#f87171', fontSize: 12, margin: '8px 0 0' }}>
                    {msgs[t.id].text}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}