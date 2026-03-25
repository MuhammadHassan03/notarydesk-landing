'use client'
import { useState, useRef, useCallback } from 'react'
import { Icon } from '@/components/ui/icons'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function WaitlistStrip() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await fetch(`${API_URL}/api/v1/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.error?.message || 'Something went wrong')
      }

      setStatus('success')
      setEmail('')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to join waitlist. Try again.')
      setStatus('error')
      // Auto-reset error after 4s so they can retry
      setTimeout(() => setStatus('idle'), 4000)
    }
  }, [email, status])

  const handleReset = useCallback(() => {
    setStatus('idle')
    setEmail('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  return (
    <div id="notify" className="py-12" style={{ background: 'var(--primary)' }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon name={status === 'success' ? 'celebration' : 'rocket_launch'} size={20} style={{ color: 'var(--accent)' }} />
            <p className="text-xl font-bold text-white">
              {status === 'success' ? "You're on the list!" : 'Get Early Access'}
            </p>
          </div>
          <p className="text-sm text-white/50 max-w-md">
            {status === 'success'
              ? "We'll notify you as soon as NotaryDesk launches in your area. Check your inbox for a confirmation."
              : 'Join the private beta. Be the first notary in your area using professional tools that actually work.'}
          </p>
        </div>

        <div className="w-full md:w-auto">
          {status === 'success' ? (
            /* ── Success state ─────────────────────────────────── */
            <div className="flex items-center gap-3 px-6 py-4 rounded-xl" style={{ background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.25)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--success)' }}>
                <Icon name="check" size={22} style={{ color: 'white' }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Email confirmed</p>
                <p className="text-xs text-white/50">We&apos;ll reach out soon</p>
              </div>
              <button onClick={handleReset} className="ml-4 text-xs font-medium text-white/40 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none">
                Add another
              </button>
            </div>
          ) : (
            /* ── Form state ────────────────────────────────────── */
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-72">
                  <Icon name="mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === 'loading'}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm bg-white/10 text-white placeholder-white/30 border outline-none transition-colors disabled:opacity-60"
                    style={{ borderColor: status === 'error' ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.15)' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)' }}
                    onBlur={e => { e.target.style.borderColor = status === 'error' ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.15)' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none border-none cursor-pointer"
                  style={{ background: 'var(--accent)', color: 'var(--primary)' }}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Icon name="notifications_active" size={16} />
                      Notify Me
                    </>
                  )}
                </button>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.15)' }}>
                  <Icon name="error" size={14} style={{ color: '#FCA5A5' }} />
                  <p className="text-xs font-medium" style={{ color: '#FCA5A5' }}>{errorMsg}</p>
                </div>
              )}

              {/* Privacy note */}
              <p className="text-[10px] text-white/25 flex items-center gap-1">
                <Icon name="lock" size={10} style={{ opacity: 0.5 }} />
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}