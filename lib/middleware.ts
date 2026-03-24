/**
 * middleware.ts — Updated with Dashboard Route Protection
 * ========================================================
 * Replaces your existing middleware.ts at the project root.
 *
 * Two protected zones:
 *   1. /nd-control-7x9q/* — Admin panel (cookie-based, existing)
 *   2. /dashboard/* — User web app (Supabase session, client-side via AuthProvider)
 *
 * The dashboard auth is handled CLIENT-SIDE by AuthProvider (redirect in useEffect).
 * This middleware just ensures the admin panel stays protected.
 * No server-side Supabase session check needed — the RLS on Supabase tables
 * protects the data, and AuthProvider handles the redirect UX.
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

  // ── Admin panel auth (existing) ──────────────────────────────────
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

  // ── Dashboard routes — no server-side auth needed ────────────────
  // AuthProvider handles client-side redirect to /dashboard/login
  // Supabase RLS protects the data layer

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/nd-control-7x9q/:path*',
    '/api/nd-control-7x9q/:path*',
  ],
}