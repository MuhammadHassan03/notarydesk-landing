'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/context/authcontext'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<any>('/auth/login', { email, password })

      if (res.access_token) {
        signIn(res.access_token, res.refresh_token)
        router.replace('/dashboard')
      }
    } catch (err: any) {
      const msg = err.message || 'Login failed'
      // If email not verified, redirect to OTP
      if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('not confirmed')) {
        router.push(`/dashboard/otp?email=${encodeURIComponent(email)}`)
        return
      }
      setError(msg)
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

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h1 className="text-[22px] font-extrabold text-center mb-1" style={{ color: 'var(--text)' }}>Welcome back</h1>
          <p className="text-[14px] text-center mb-7" style={{ color: 'var(--text-secondary)' }}>
            Sign in to manage your notary business
          </p>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] mb-4"
              style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <Icon name="error" size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-3.5">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <Icon name="mail" size={14} style={{ color: 'var(--text-tertiary)' }} /> Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="mail" size={17} />
                </span>
                <input className="input-base pl-9" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="flex items-center justify-between text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
                <span className="flex items-center gap-1.5">
                  <Icon name="lock" size={14} style={{ color: 'var(--text-tertiary)' }} /> Password
                </span>
                <Link href="/dashboard/forgot-password" className="text-[12px] font-medium no-underline hover:underline"
                  style={{ color: 'var(--primary)' }}>
                  Forgot password?
                </Link>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name="lock" size={17} />
                </span>
                <input className="input-base pl-9 pr-10" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
                  style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name={showPw ? 'visibility_off' : 'visibility'} size={17} />
                </button>
              </div>
            </div>

            <Button type="submit" variant="gold" fullWidth loading={loading} size="lg">
              <Icon name="login" size={17} style={{ color: 'inherit' }} />
              Sign in
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center mt-5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link href="/dashboard/register" className="font-semibold no-underline hover:underline"
              style={{ color: 'var(--primary)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}