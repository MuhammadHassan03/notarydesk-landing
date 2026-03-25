import { cookies } from 'next/headers'
import { SESSION_COOKIE, SESSION_VALUE } from './constants'

// v13 mein direct functions export hote hain
import { verify, generateURI } from "otplib";

export async function checkTotp(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_TOTP_SECRET
  if (!secret) {
    console.error('[Admin] ADMIN_TOTP_SECRET not set')
    return false
  }

  try {
    // v13 mein result aik object hota hai { isValid: boolean, ... }
    const result = await verify({ 
      token, 
      secret 
    });

    // Sirf isValid property return karein taake boolean ban jaye
    return result.valid; 
  } catch (e) {
    console.error('[Admin] TOTP verify error:', e)
    return false
  }
}

export function getTotpUri(): string {
  const secret = process.env.ADMIN_TOTP_SECRET ?? 'NOTSET'
  
  // v13 mein generateURI use hota hai (Google Authenticator compatible)
  return generateURI({
    issuer: "NotaryDesk Admin",
    label: "admin",
    secret,
  });
}

// ── Session helpers ───────────────────────────────────────────────────────────

export function setAdminSession(): void {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 8,   // 8 hours
    path:     '/',
  })
}

export function clearAdminSession(): void {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   0,
    path:     '/',
  })
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return false
  return input === pw
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE
}