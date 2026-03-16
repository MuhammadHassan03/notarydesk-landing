import { NextRequest, NextResponse } from 'next/server'

// Inlined from lib/constants.ts — middleware cannot use @/ alias
const ADMIN_BASE     = '/nd-control-7x9q'
const SESSION_COOKIE = 'nd_ctrl_sess'
const SESSION_VALUE  = 'ok'

// These paths are always public — no session required
const PUBLIC_PATHS = [
  `${ADMIN_BASE}/login`,
  `/api${ADMIN_BASE}/login`,
  `/api${ADMIN_BASE}/totp-setup`,
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only run on admin routes
  if (
    !pathname.startsWith(ADMIN_BASE) &&
    !pathname.startsWith(`/api${ADMIN_BASE}`)
  ) {
    return NextResponse.next()
  }

  // Always allow public paths through
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Require valid session cookie for everything else
  const session = req.cookies.get(SESSION_COOKIE)
  if (session?.value !== SESSION_VALUE) {
    return NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/nd-control-7x9q/:path*',
    '/api/nd-control-7x9q/:path*',
  ],
}