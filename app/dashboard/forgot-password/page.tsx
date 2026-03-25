'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email: email.trim() })
      setSent(true)
    } catch (err: any) {
      setToast({ msg: err.message || 'Failed to send reset email.', type: 'error' })
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

          {!sent ? (
            <>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'var(--primary-light)' }}>
                <Icon name="lock" size={32} style={{ color: 'var(--primary)' }} />
              </div>

              <h1 className="text-[22px] font-extrabold text-center mb-2" style={{ color: 'var(--text)' }}>
                Forgot password?
              </h1>
              <p className="text-[14px] text-center mb-7 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                No worries. Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSend}>
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                    <Icon name="mail" size={14} style={{ color: 'var(--text-tertiary)' }} /> Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                      <Icon name="mail" size={17} />
                    </span>
                    <input className="input-base pl-9" type="email" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                  </div>
                </div>

                <Button type="submit" variant="gold" fullWidth loading={loading} size="lg">
                  <Icon name="send" size={16} style={{ color: 'inherit' }} />
                  Send reset link
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
                Check your email
              </h1>
              <p className="text-[14px] text-center mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                We sent a password reset link to
              </p>
              <p className="text-[14px] font-bold text-center mb-6" style={{ color: 'var(--primary)' }}>
                {email}
              </p>

              <div className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Icon name="info" size={15} style={{ color: 'var(--text-tertiary)', marginTop: 2 }} />
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  Click the link in the email to create a new password. If you don't see it, check your spam folder.
                </p>
              </div>

              <Button variant="outline" fullWidth onClick={() => setSent(false)}>
                <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} />
                Try a different email
              </Button>
            </>
          )}

          {/* Back to login */}
          <p className="text-center mt-5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Remember your password?{' '}
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