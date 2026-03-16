'use client'
import { useState } from 'react'

const TYPES = [
  { id: 'info',    label: 'Info',    bg: '#1e3a5f', border: '#1d4ed8', color: '#93c5fd' },
  { id: 'warning', label: 'Warning', bg: '#3b2200', border: '#d97706', color: '#fbbf24' },
  { id: 'success', label: 'Success', bg: '#14291a', border: '#16a34a', color: '#4ade80' },
  { id: 'danger',  label: 'Danger',  bg: '#2d0a0a', border: '#b91c1c', color: '#f87171' },
] as const

export default function AnnouncementEditor({ current }: { current: any }) {
  const [active,  setActive]  = useState<boolean>(current.active ?? false)
  const [message, setMessage] = useState<string>(current.message ?? '')
  const [type,    setType]    = useState<string>(current.type ?? 'info')
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')

  const typeStyle = TYPES.find(t => t.id === type) ?? TYPES[0]

  async function save() {
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/nd-control-7x9q/save-announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active, message, type }),
    })
    setSaving(false)
    if (res.ok) {
      setMsg('Saved — visible in app within seconds')
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Save failed')
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    background: '#0d1117', border: '1px solid #30363d',
    color: '#e6edf3', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ maxWidth: 540 }}>
      {/* Live preview */}
      {active && message && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 20,
          background: typeStyle.bg, border: `1px solid ${typeStyle.border}`,
        }}>
          <p style={{ color: typeStyle.color, fontSize: 14, margin: 0 }}>📢 {message}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Active toggle */}
        <div
          onClick={() => setActive(a => !a)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#0d1117', border: '1px solid #21262d', borderRadius: 8,
            padding: '13px 16px', cursor: 'pointer',
          }}
        >
          <div>
            <p style={{ color: '#e6edf3', fontSize: 14, fontWeight: 500, margin: '0 0 2px' }}>Show announcement in app</p>
            <p style={{ color: '#484f58', fontSize: 12, margin: 0 }}>
              {active ? 'Currently visible to all users' : 'Currently hidden'}
            </p>
          </div>
          <div style={{
            width: 40, height: 22, borderRadius: 11, position: 'relative',
            background: active ? '#1d4ed8' : '#21262d',
            border: `1px solid ${active ? '#2563eb' : '#30363d'}`,
            flexShrink: 0, transition: 'background .2s',
          }}>
            <div style={{
              position: 'absolute', top: 2, left: active ? 18 : 2,
              width: 16, height: 16, borderRadius: 8,
              background: '#fff', transition: 'left .2s',
            }} />
          </div>
        </div>

        {/* Type selector */}
        <div>
          <label style={{ display: 'block', color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
            Type
          </label>
          <select value={type} onChange={e => setType(e.target.value)} style={inp}>
            {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* Message */}
        <div>
          <label style={{ display: 'block', color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
            Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="e.g. We have scheduled maintenance tonight at 2am UTC…"
            style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {msg && (
          <p style={{
            color: msg.includes('failed') ? '#f87171' : '#4ade80',
            fontSize: 13, margin: 0,
          }}>{msg}</p>
        )}

        <button
          onClick={save}
          disabled={saving}
          style={{
            alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8,
            background: saving ? '#374151' : '#1d4ed8',
            border: 'none', color: '#fff', fontWeight: 600,
            fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : active ? '📢 Publish announcement' : 'Save (inactive)'}
        </button>
      </div>
    </div>
  )
}