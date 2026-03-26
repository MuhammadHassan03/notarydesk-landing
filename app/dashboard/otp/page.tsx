'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'

export default function OtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const { signIn } = useAuth()

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // Auto-focus first input
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // digits only
    const v = value.slice(-1) // single digit
    setDigits(prev => {
      const next = [...prev]
      next[index] = v
      return next
    })
    if (v && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [digits])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    const next = [...digits]
    for (let i = 0; i < text.length; i++) { next[i] = text[i] }
    setDigits(next)
    inputRefs.current[Math.min(text.length, 5)]?.focus()
  }, [digits])

  const code = digits.join('')

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) { setToast({ msg: 'Enter all 6 digits.', type: 'error' }); return }
    setLoading(true)
    try {
      const res = await api.post<any>('/auth/verify-otp', { email, token: code })

      if (res.access_token) {
        // signIn loads profile → sets needsOnboarding → route guard redirects
        signIn(res.access_token, res.refresh_token)
        setToast({ msg: 'Email verified! Redirecting...', type: 'success' })
      } else {
        setToast({ msg: 'Verification failed. Try again.', type: 'error' })
      }
    } catch (e: any) {
      setToast({ msg: e.message || 'Invalid or expired code.', type: 'error' })
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
    setLoading(false)
  }, [code, email, signIn, router])

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (code.length === 6 && !loading) handleVerify()
  }, [code]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return
    setResending(true)
    try {
      await api.post('/auth/resend-otp', { email })
      setToast({ msg: 'New code sent!', type: 'success' })
      setCooldown(60)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to resend.', type: 'error' })
    }
    setResending(false)
  }, [email, cooldown])

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center">
          <p className="text-[15px] mb-4" style={{ color: 'var(--text)' }}>No email provided.</p>
          <Button variant="outline" href="/dashboard/register">Go to register</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/icon-192.png" alt="NotaryDesk" width={40} height={40} className="rounded-xl" />
          <span className="font-bold text-[19px]" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'var(--primary-light)' }}>
            <Icon name="mail" size={32} style={{ color: 'var(--primary)' }} />
          </div>

          <h1 className="text-[22px] font-extrabold mb-2" style={{ color: 'var(--text)' }}>
            Check your email
          </h1>
          <p className="text-[14px] mb-1" style={{ color: 'var(--text-secondary)' }}>
            We sent a 6-digit verification code to
          </p>
          <p className="text-[14px] font-bold mb-6" style={{ color: 'var(--primary)' }}>
            {email}
          </p>

          {/* OTP inputs */}
          <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-[22px] font-bold rounded-xl border-none outline-none transition-all"
                style={{
                  background: d ? 'var(--primary-light)' : 'var(--surface)',
                  color: 'var(--primary)',
                  border: d ? '2px solid var(--primary)' : '2px solid var(--border)',
                }}
              />
            ))}
          </div>

          <Button variant="gold" fullWidth size="lg" onClick={handleVerify} loading={loading}
            disabled={code.length !== 6}>
            <Icon name="verified" size={18} style={{ color: 'inherit' }} />
            Verify email
          </Button>

          {/* Resend */}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--divider)' }}>
            <p className="text-[13px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Didn't receive the code?
            </p>
            {cooldown > 0 ? (
              <p className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Resend in {cooldown}s
              </p>
            ) : (
              <button onClick={handleResend} disabled={resending}
                className="text-[13px] font-semibold border-none bg-transparent cursor-pointer underline"
                style={{ color: 'var(--primary)' }}>
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>
        </div>

        {/* Back to login */}
        <p className="text-center mt-6 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Wrong email?{' '}
          <Link href="/dashboard/register" className="font-semibold no-underline hover:underline"
            style={{ color: 'var(--primary)' }}>
            Go back
          </Link>
          {' · '}
          <Link href="/dashboard/login" className="font-semibold no-underline hover:underline"
            style={{ color: 'var(--primary)' }}>
            Sign in instead
          </Link>
        </p>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}