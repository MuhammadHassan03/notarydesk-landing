'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/api'
import { Button } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.login(email, password)
      router.replace('/dashboard')
    } catch (err: any) { setError(err.message || 'Login failed') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-5">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-10">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <span className="w-9 h-9 rounded-[10px] bg-gold text-navy font-extrabold text-lg flex items-center justify-center">N</span>
          <span className="font-bold text-xl text-navy">NotaryDesk</span>
        </div>
        <h1 className="text-[22px] font-extrabold text-center mb-1.5">Welcome back</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Sign in to manage your notary business</p>

        {error && <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg text-[13px] mb-3.5">{error}</div>}

        <form onSubmit={handleLogin}>
          <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-900 outline-none focus:border-navy mb-3.5 bg-white" />
          <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-sm text-slate-900 outline-none focus:border-navy mb-3.5 bg-white" />
          <Button type="submit" fullWidth loading={loading} className="mt-2 h-12 text-[15px]">Sign in</Button>
        </form>
        <p className="text-center mt-5 text-[13px] text-slate-500">
          Don't have an account? <Link href="/dashboard/register" className="text-navy font-semibold no-underline hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}