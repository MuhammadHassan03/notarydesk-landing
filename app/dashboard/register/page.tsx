'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/context/authcontext'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','District of Columbia',
]

export default function RegisterPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [state, setState]       = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const pwMatch = password && confirm && password === confirm
  const pwStrength = password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length >= 6 ? 1 : 0

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) { setError('Full name is required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const res = await api.post<any>('/auth/register', {
        email,
        password,
        full_name: fullName.trim(),
        state: state || undefined,
      })

      // OTP flow — email confirmation required
      if (res.needs_verification) {
        router.push(`/dashboard/otp?email=${encodeURIComponent(email)}`)
        return
      }

      // Direct login — email confirmation disabled
      if (res.access_token) {
        signIn(res.access_token, res.refresh_token)
        router.replace('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-[460px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/icon-192.png" alt="NotaryDesk" width={40} height={40} className="rounded-xl" />
          <span className="font-bold text-[19px]" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h1 className="text-[22px] font-extrabold text-center mb-1" style={{ color: 'var(--text)' }}>Create your account</h1>
          <p className="text-[14px] text-center mb-7" style={{ color: 'var(--text-secondary)' }}>
            Start managing your notary business for free
          </p>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] mb-4"
              style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <Icon name="error" size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Full name */}
            <div className="mb-3.5">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <Icon name="person" size={14} style={{ color: 'var(--text-tertiary)' }} /> Full name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="person" size={17} />
                </span>
                <input className="input-base pl-9" placeholder="Jane Smith" value={fullName}
                  onChange={e => setFullName(e.target.value)} required autoFocus />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3.5">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <Icon name="mail" size={14} style={{ color: 'var(--text-tertiary)' }} /> Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="mail" size={17} />
                </span>
                <input className="input-base pl-9" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            {/* State (optional) */}
            <div className="mb-3.5">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <Icon name="location_on" size={14} style={{ color: 'var(--text-tertiary)' }} /> State <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="location_on" size={17} />
                </span>
                <select className="input-base appearance-none pl-9 pr-9 cursor-pointer" value={state} onChange={e => setState(e.target.value)}>
                  <option value="">Select your state...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="expand_more" size={17} />
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="mb-3.5">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <Icon name="lock" size={14} style={{ color: 'var(--text-tertiary)' }} /> Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="lock" size={17} />
                </span>
                <input className="input-base pl-9 pr-10" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
                  style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name={showPw ? 'visibility_off' : 'visibility'} size={17} />
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-1 flex-1 rounded-full transition-all"
                      style={{ background: pwStrength >= n ? ['', '#EF4444', '#F59E0B', '#22C55E'][pwStrength] : 'var(--border)' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <Icon name="lock" size={14} style={{ color: 'var(--text-tertiary)' }} /> Confirm password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="lock" size={17} />
                </span>
                <input className="input-base pl-9" type="password" placeholder="Re-enter password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
              {pwMatch && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[12px] font-medium" style={{ color: 'var(--success)' }}>
                  <Icon name="check_circle" size={13} /> Passwords match
                </div>
              )}
            </div>

            <Button type="submit" variant="gold" fullWidth loading={loading} size="lg" className="mt-1">
              <Icon name="rocket_launch" size={17} style={{ color: 'inherit' }} />
              Create account
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center mt-5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/dashboard/login" className="font-semibold no-underline hover:underline"
              style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}