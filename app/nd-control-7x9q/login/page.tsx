'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Inline base path — login page can't use @/ in some setups
const BASE = '/nd-control-7x9q'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep]         = useState<'password' | 'totp'>('password')
  const [password, setPassword] = useState('')
  const [totp, setTotp]         = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'password', password }),
      })
      if (res.ok) {
        setStep('totp')
      } else {
        const d = await res.json()
        setError(d.error || 'Incorrect password')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function submitTotp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'totp', totp }),
      })
      if (res.ok) {
        router.push(`${BASE}/dashboard`)
        router.refresh()
      } else {
        const d = await res.json()
        setError(d.error || 'Invalid code')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: '#161b22', border: '1px solid #30363d',
    color: '#e6edf3', fontSize: 15, outline: 'none', marginBottom: 12,
    fontFamily: step === 'totp' ? 'monospace' : 'inherit',
    textAlign: step === 'totp' ? 'center' : 'left',
    letterSpacing: step === 'totp' ? '0.3em' : 'normal',
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '11px', borderRadius: 8,
    background: loading ? '#374151' : '#1d4ed8',
    border: 'none', color: '#fff', fontWeight: 600,
    fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#010409',
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: '#0d1117', borderRadius: 14,
        border: '1px solid #21262d', padding: '44px 36px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, background: '#1d4ed8', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>N</span>
          </div>
          <h1 style={{ color: '#e6edf3', fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>
            {step === 'password' ? 'Admin Sign In' : 'Two-Factor Auth'}
          </h1>
          <p style={{ color: '#8b949e', fontSize: 13, margin: 0 }}>
            {step === 'password'
              ? 'Enter your admin password'
              : 'Enter the 6-digit code from Google Authenticator'}
          </p>
        </div>

        {step === 'password' ? (
          <form onSubmit={submitPassword}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              required
              style={inputStyle}
            />
            {error && <p style={{ color: '#f87171', fontSize: 13, margin: '-4px 0 10px' }}>{error}</p>}
            <button type="submit" disabled={loading || !password} style={btnStyle}>
              {loading ? 'Checking…' : 'Continue →'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitTotp}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totp}
              onChange={e => setTotp(e.target.value.replace(/\D/g, ''))}
              placeholder="000 000"
              autoFocus
              required
              style={inputStyle}
            />
            {error && <p style={{ color: '#f87171', fontSize: 13, margin: '-4px 0 10px' }}>{error}</p>}
            <button type="submit" disabled={loading || totp.length !== 6} style={btnStyle}>
              {loading ? 'Verifying…' : 'Verify Code →'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('password'); setError(''); setTotp('') }}
              style={{ ...btnStyle, background: 'transparent', color: '#8b949e', marginTop: 8, fontSize: 12 }}
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}