'use client'
import { useState } from 'react'

const LABELS: Record<string, { label: string; desc: string }> = {
  journal:         { label: 'Journal entries',    desc: 'Digital notary journal' },
  mileage:         { label: 'Mileage tracking',   desc: 'GPS trip logging' },
  invoices:        { label: 'Invoice module',     desc: 'Create and send invoices' },
  appointments:    { label: 'Appointments',       desc: 'Appointment calendar' },
  aiIdScanner:     { label: 'AI ID scanner',      desc: 'Auto-fill from ID photo' },
  smsInvoices:     { label: 'SMS invoices',       desc: 'Send invoices via SMS' },
  taxExport:       { label: 'Tax export',         desc: 'Annual tax PDF export' },
  offlineMode:     { label: 'Offline mode',       desc: 'Work without internet' },
  googleOAuth:     { label: 'Google sign-in',     desc: 'OAuth with Google' },
  maintenanceMode: { label: '🔴 Maintenance mode', desc: 'Shows banner in app' },
}

export default function FlagsEditor({ initialFlags }: { initialFlags: Record<string, boolean> }) {
  const [flags, setFlags]   = useState(initialFlags)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  function toggle(key: string) {
    setFlags(f => ({ ...f, [key]: !f[key] }))
    setMsg('')
  }

  async function save() {
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/nd-control-7x9q/save-flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flags }),
    })
    setSaving(false)
    if (res.ok) {
      setMsg('Saved — changes are live immediately')
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Save failed')
    }
  }

  const isError = msg.includes('failed') || msg.includes('error')

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        {Object.entries(flags).map(([key, enabled], i, arr) => {
          const meta = LABELS[key] ?? { label: key, desc: '' }
          return (
            <div
              key={key}
              onClick={() => toggle(key)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', cursor: 'pointer',
                borderBottom: i < arr.length - 1 ? '1px solid #161b22' : 'none',
                background: enabled ? '#0d1117' : '#0a0a0f',
                transition: 'background .15s',
              }}
            >
              <div>
                <p style={{ color: enabled ? '#e6edf3' : '#484f58', fontSize: 14, fontWeight: 500, margin: '0 0 2px' }}>
                  {meta.label}
                </p>
                <p style={{ color: '#484f58', fontSize: 11, margin: 0, fontFamily: 'monospace' }}>
                  {key}
                  {meta.desc && <span style={{ fontFamily: 'system-ui', marginLeft: 8 }}>· {meta.desc}</span>}
                </p>
              </div>

              {/* Toggle */}
              <div style={{
                width: 40, height: 22, borderRadius: 11, position: 'relative', flexShrink: 0,
                background: enabled ? '#1d4ed8' : '#21262d',
                border: `1px solid ${enabled ? '#2563eb' : '#30363d'}`,
                transition: 'background .2s',
              }}>
                <div style={{
                  position: 'absolute', top: 2,
                  left: enabled ? 18 : 2,
                  width: 16, height: 16, borderRadius: 8,
                  background: '#fff', transition: 'left .2s',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {msg && (
        <p style={{ color: isError ? '#f87171' : '#4ade80', fontSize: 13, margin: '0 0 12px' }}>
          {msg}
        </p>
      )}

      <button
        onClick={save}
        disabled={saving}
        style={{
          padding: '10px 24px', borderRadius: 8,
          background: saving ? '#374151' : '#1d4ed8',
          border: 'none', color: '#fff', fontWeight: 600,
          fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}