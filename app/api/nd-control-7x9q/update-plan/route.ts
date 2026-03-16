import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { userId?: string; plan?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { userId, plan } = body

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  if (!plan || !['free','pro','plus'].includes(plan)) {
    return NextResponse.json({ error: 'plan must be free, pro, or plus' }, { status: 400 })
  }

  const { error } = await adminSupabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}