
import { cookies } from 'next/headers'
import { SESSION_COOKIE, SESSION_VALUE } from './constants'

// ── TOTP via otplib ───────────────────────────────────────────────────────────
// otplib v12 exports changed — import from the preset path to avoid TS errors
// Install: npm install otplib
import * as OTPLib from 'otplib'

// otplib v12 exports `authenticator` at the top level
const auth = (OTPLib as any).authenticator ?? (OTPLib as any).default?.authenticator

export function checkTotp(token: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET
  if (!secret) {
    console.error('[Admin] ADMIN_TOTP_SECRET not set')
    return false
  }
  if (!auth) {
    console.error('[Admin] otplib authenticator not found — check your otplib version')
    return false
  }
  try {
    return auth.verify({ token, secret })
  } catch (e) {
    console.error('[Admin] TOTP verify error:', e)
    return false
  }
}

export function getTotpUri(): string {
  const secret = process.env.ADMIN_TOTP_SECRET ?? 'NOTSET'
  if (!auth) return ''
  return auth.keyuri('admin', 'NotaryDesk Admin', secret)
}

// ── Session helpers ───────────────────────────────────────────────────────────

export function setAdminSession(): void {
  cookies().set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 8,   // 8 hours
    path:     '/',
  })
}

export function clearAdminSession(): void {
  cookies().set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   0,              // expire immediately
    path:     '/',
  })
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) { console.error('[Admin] ADMIN_PASSWORD not set'); return false }
  return input === pw
}

export function isAuthenticated(): boolean {
  return cookies().get(SESSION_COOKIE)?.value === SESSION_VALUE
}