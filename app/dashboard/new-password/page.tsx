'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'

/**
 * New Password Page
 * ==================
 * User arrives here after clicking the reset link in their email.
 * Supabase appends tokens as URL hash fragments or query params.
 * We extract the access_token and use it to set the new password.
 */

export default function NewPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')
  const [token, setToken]         = useState<string | null>(null)
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const pwMatch = password && confirm && password === confirm
  const pwStrength = password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length >= 6 ? 1 : 0

  // Extract token from URL (Supabase sends it as hash fragment or query param)
  useEffect(() => {
    // Check query params first
    const queryToken = searchParams.get('access_token') || searchParams.get('token')
    if (queryToken) { setToken(queryToken); return }

    // Check hash fragments (Supabase default)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const hashToken = params.get('access_token')
      if (hashToken) { setToken(hashToken); return }
    }
  }, [searchParams])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!token) { setError('Reset token not found. Please request a new reset link.'); return }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        access_token: token,
        new_password: password,
      })
      setSuccess(true)
      setToast({ msg: 'Password updated!', type: 'success' })
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/icon-192.png" alt="NotaryDesk" width={40} height={40} className="rounded-xl" />
          <span className="font-bold text-[19px]" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

          {!success ? (
            <>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'var(--primary-light)' }}>
                <Icon name="lock" size={32} style={{ color: 'var(--primary)' }} />
              </div>

              <h1 className="text-[22px] font-extrabold text-center mb-2" style={{ color: 'var(--text)' }}>
                Set new password
              </h1>
              <p className="text-[14px] text-center mb-7" style={{ color: 'var(--text-secondary)' }}>
                Choose a strong password to secure your account
              </p>

              {!token && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] mb-4"
                  style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  <Icon name="error" size={15} />
                  No reset token found. Please use the link from your email, or request a new one.
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] mb-4"
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                  <Icon name="error" size={15} /> {error}
                </div>
              )}

              <form onSubmit={handleReset}>
                {/* New password */}
                <div className="mb-3.5">
                  <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                    <Icon name="lock" size={14} style={{ color: 'var(--text-tertiary)' }} /> New password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                      <Icon name="lock" size={17} />
                    </span>
                    <input className="input-base pl-9 pr-10" type={showPw ? 'text' : 'password'}
                      placeholder="Min. 8 characters" value={password}
                      onChange={e => setPassword(e.target.value)} required autoFocus />
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

                {/* Confirm */}
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

                {/* Requirements */}
                <div className="rounded-xl px-4 py-3 mb-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <p className="text-[12px] font-bold mb-2" style={{ color: 'var(--text)' }}>Requirements</p>
                  {[
                    { label: 'At least 8 characters', ok: password.length >= 8 },
                    { label: 'Contains a number', ok: /\d/.test(password) },
                    { label: 'Passwords match', ok: !!pwMatch },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-2 py-1">
                      <Icon name={r.ok ? 'check_circle' : 'circle'} size={14}
                        style={{ color: r.ok ? 'var(--success)' : 'var(--text-tertiary)' }} />
                      <span className="text-[12px]" style={{ color: r.ok ? 'var(--success)' : 'var(--text-tertiary)' }}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button type="submit" variant="gold" fullWidth loading={loading} size="lg"
                  disabled={!token || password.length < 8 || password !== confirm}>
                  <Icon name="lock" size={16} style={{ color: 'inherit' }} />
                  Update password
                </Button>
              </form>
            </>
          ) : (
            /* Success state */
            <>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'var(--success-bg)' }}>
                <Icon name="check_circle" size={32} style={{ color: 'var(--success)' }} />
              </div>

              <h1 className="text-[22px] font-extrabold text-center mb-2" style={{ color: 'var(--text)' }}>
                Password updated!
              </h1>
              <p className="text-[14px] text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
                Your password has been changed successfully. You can now sign in with your new password.
              </p>

              <Button variant="gold" fullWidth size="lg" href="/dashboard/login">
                <Icon name="login" size={16} style={{ color: 'inherit' }} />
                Sign in
              </Button>
            </>
          )}

          <p className="text-center mt-5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/dashboard/forgot-password" className="font-semibold no-underline hover:underline"
              style={{ color: 'var(--primary)' }}>
              Request new reset link
            </Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}