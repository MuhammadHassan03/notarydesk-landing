import { NextResponse } from 'next/server'
import { clearAdminSession } from '@/lib/auth'

export async function POST() {
  clearAdminSession()
  // Redirect to login after clearing session
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/nd-control-7x9q/login`
    : '/nd-control-7x9q/login'
  return NextResponse.redirect(loginUrl, { status: 302 })
}