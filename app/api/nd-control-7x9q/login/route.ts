import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, checkTotp, setAdminSession } from '@/lib/auth'

// In-memory rate limiter — resets on cold start.
// Good enough for a personal admin panel. For production: use Upstash Redis.
const attempts: Record<string, { count: number; lockedUntil: number }> = {}
const MAX_ATTEMPTS = 5
const LOCKOUT_MS   = 15 * 60 * 1000   // 15 min

function getRateLimitInfo(ip: string) {
  return attempts[ip] ?? { count: 0, lockedUntil: 0 }
}

function isLocked(ip: string): boolean {
  const info = getRateLimitInfo(ip)
  return info.lockedUntil > Date.now()
}

function recordFailure(ip: string): void {
  const info = getRateLimitInfo(ip)
  info.count++
  if (info.count >= MAX_ATTEMPTS) {
    info.lockedUntil = Date.now() + LOCKOUT_MS
  }
  attempts[ip] = info
}

function resetAttempts(ip: string): void {
  delete attempts[ip]
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isLocked(ip)) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  let body: { step?: string; password?: string; totp?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { step, password, totp } = body

  // ── Step 1: Password ───────────────────────────────────────────────────────
  if (step === 'password') {
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
    if (!checkPassword(password)) {
      recordFailure(ip)
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
    // Password correct — client proceeds to TOTP step
    return NextResponse.json({ ok: true, next: 'totp' })
  }

  // ── Step 2: TOTP ───────────────────────────────────────────────────────────
  if (step === 'totp') {
    if (!totp) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 })
    }
    if (!checkTotp(totp)) {
      recordFailure(ip)
      return NextResponse.json({ error: 'Invalid code. Check your authenticator app.' }, { status: 401 })
    }
    // Both factors passed — create session
    setAdminSession()
    resetAttempts(ip)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
}