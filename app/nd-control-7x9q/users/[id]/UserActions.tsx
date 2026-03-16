'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS = ['free', 'pro', 'plus'] as const

export default function UserActions({
  userId,
  currentPlan,
  userEmail,
}: {
  userId: string
  currentPlan: string
  userEmail: string
}) {
  const router = useRouter()
  const [plan, setPlan]       = useState(currentPlan)
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [msg, setMsg]         = useState('')
  const [msgColor, setMsgColor] = useState('#4ade80')

  async function changePlan() {
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/nd-control-7x9q/update-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan }),
    })
    setSaving(false)
    if (res.ok) {
      setMsg(`Plan updated to ${plan}`)
      setMsgColor('#4ade80')
      router.refresh()
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Failed to update plan')
      setMsgColor('#f87171')
    }
  }

  async function deleteUser() {
    if (!confirm(`Permanently delete account for ${userEmail}?\nThis cannot be undone.`)) return
    setDeleting(true)
    const res = await fetch('/api/nd-control-7x9q/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setDeleting(false)
    if (res.ok) {
      router.push('/nd-control-7x9q/users')
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Delete failed')
      setMsgColor('#f87171')
    }
  }

  return (
    <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 10, padding: 20 }}>
      <p style={{ color: '#8b949e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 16px' }}>
        Actions
      </p>

      {/* Change plan */}
      <p style={{ color: '#8b949e', fontSize: 12, margin: '0 0 8px' }}>Change plan</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select
          value={plan}
          onChange={e => setPlan(e.target.value)}
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 8,
            background: '#161b22', border: '1px solid #30363d',
            color: '#e6edf3', fontSize: 13, outline: 'none',
          }}
        >
          {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button
          onClick={changePlan}
          disabled={saving || plan === currentPlan}
          style={{
            padding: '8px 16px', borderRadius: 8,
            background: saving ? '#374151' : '#1d4ed8',
            border: 'none', color: '#fff', fontWeight: 600,
            fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? '…' : 'Save'}
        </button>
      </div>

      {msg && <p style={{ color: msgColor, fontSize: 13, margin: '0 0 16px' }}>{msg}</p>}

      {/* Delete */}
      <div style={{ borderTop: '1px solid #21262d', paddingTop: 16 }}>
        <p style={{ color: '#8b949e', fontSize: 12, margin: '0 0 8px' }}>Danger zone</p>
        <button
          onClick={deleteUser}
          disabled={deleting}
          style={{
            width: '100%', padding: '9px', borderRadius: 8,
            background: '#7f1d1d22', border: '1px solid #b91c1c44',
            color: '#f87171', fontWeight: 600, fontSize: 13,
            cursor: deleting ? 'not-allowed' : 'pointer',
          }}
        >
          {deleting ? 'Deleting…' : '🗑 Delete account permanently'}
        </button>
      </div>
    </div>
  )
}