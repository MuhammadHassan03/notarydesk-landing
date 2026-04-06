/**
 * middleware.ts — Route protection
 * =================================
 * 1. /nd-control-7x9q/* — Admin panel (cookie-based)
 * 2. /dashboard/* — Redirects to landing page (web app disabled, mobile-only)
 */

import { NextRequest, NextResponse } from 'next/server'

const ADMIN_BASE     = '/nd-control-7x9q'
const SESSION_COOKIE = 'nd_ctrl_sess'
const SESSION_VALUE  = 'ok'

const PUBLIC_PATHS = [
  `${ADMIN_BASE}/login`,
  `/api${ADMIN_BASE}/login`,
  `/api${ADMIN_BASE}/totp-setup`,
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Dashboard routes → redirect to landing page ─────────────────
  // Web dashboard is disabled — NotaryDesk is mobile-only.
  // Keep /book/* and /chat/* accessible (public booking + messaging).
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/#download', req.url))
  }

  // ── Admin panel auth ────────────────────────────────────────────
  if (
    pathname.startsWith(ADMIN_BASE) ||
    pathname.startsWith(`/api${ADMIN_BASE}`)
  ) {
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
      return NextResponse.next()
    }

    const session = req.cookies.get(SESSION_COOKIE)
    if (session?.value !== SESSION_VALUE) {
      return NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/nd-control-7x9q/:path*',
    '/api/nd-control-7x9q/:path*',
  ],
}
