'use client'
import { useState } from 'react'

export default function BroadcastPage() {
  const [tier,    setTier]    = useState('all')
  const [subject, setSubject] = useState('')
  const [body,    setBody]    = useState('')
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result,  setResult]  = useState('')

  const TEMPLATES = [
    { label: '— choose template —', subject: '', body: '' },
    {
      label: 'Maintenance notice',
      subject: 'Scheduled maintenance — NotaryDesk',
      body: 'Hi,\n\nWe have scheduled maintenance on [DATE] from [TIME] to [TIME] UTC.\n\nThe app will be briefly unavailable. We apologise for the inconvenience.\n\nThe NotaryDesk Team',
    },
    {
      label: 'New feature',
      subject: "What's new in NotaryDesk",
      body: 'Hi,\n\nWe shipped something new: [FEATURE NAME].\n\n[Brief description].\n\nUpdate your app to get access.\n\nThe NotaryDesk Team',
    },
    {
      label: 'General update',
      subject: 'Update from NotaryDesk',
      body: 'Hi,\n\n[Your message here]\n\nThe NotaryDesk Team',
    },
  ]

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm(`Send to ALL ${tier === 'all' ? 'users' : tier + ' users'}?\nThis cannot be undone.`)) return
    setStatus('sending')
    setResult('')
    try {
      const res = await fetch('/api/nd-control-7x9q/broadcast-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, subject, body }),
      })
      const d = await res.json()
      if (res.ok) {
        setStatus('done')
        setResult(`Sent to ${d.count} recipients`)
        setSubject('')
        setBody('')
      } else {
        setStatus('error')
        setResult(d.error ?? 'Failed')
      }
    } catch {
      setStatus('error')
      setResult('Network error')
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    background: '#0d1117', border: '1px solid #30363d',
    color: '#e6edf3', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div>
      <h1 style={{ color: '#e6edf3', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Broadcast Email</h1>
      <p style={{ color: '#484f58', fontSize: 13, margin: '0 0 24px' }}>
        Send an email to all users or a specific plan tier.
      </p>

      <div style={{ maxWidth: 580 }}>
        <div style={{
          background: '#3b1818', border: '1px solid #b91c1c44',
          borderRadius: 8, padding: '10px 14px', marginBottom: 20,
          color: '#f87171', fontSize: 13,
        }}>
          ⚠ This sends real emails to real users. Double-check before sending.
        </div>

        <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Template picker */}
          <div>
            <label style={{ display: 'block', color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
              Template (optional)
            </label>
            <select
              onChange={e => {
                const t = TEMPLATES[Number(e.target.value)]
                if (t) { setSubject(t.subject); setBody(t.body) }
              }}
              style={{ ...inp, cursor: 'pointer' }}
            >
              {TEMPLATES.map((t, i) => <option key={i} value={i}>{t.label}</option>)}
            </select>
          </div>

          {/* Recipient tier */}
          <div>
            <label style={{ display: 'block', color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
              Send to
            </label>
            <select value={tier} onChange={e => setTier(e.target.value)} style={inp}>
              <option value="all">All users</option>
              <option value="free">Free users only</option>
              <option value="pro">Pro users only</option>
              <option value="plus">Plus users only</option>
              <option value="paid">All paid users (Pro + Plus)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required style={inp} placeholder="Email subject line" />
          </div>

          <div>
            <label style={{ display: 'block', color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} required rows={9}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} placeholder="Email body (plain text — line breaks preserved)" />
          </div>

          {result && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, fontSize: 13,
              background: status === 'done' ? '#14291a44' : '#7f1d1d44',
              border: `1px solid ${status === 'done' ? '#16a34a44' : '#b91c1c44'}`,
              color: status === 'done' ? '#4ade80' : '#f87171',
            }}>
              {result}
            </div>
          )}

          <button type="submit" disabled={status === 'sending'}
            style={{
              alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8,
              background: status === 'sending' ? '#374151' : '#d29922',
              border: 'none', color: status === 'sending' ? '#8b949e' : '#000',
              fontWeight: 700, fontSize: 14, cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'sending' ? 'Sending…' : 'Send broadcast'}
          </button>
        </form>
      </div>
    </div>
  )
}