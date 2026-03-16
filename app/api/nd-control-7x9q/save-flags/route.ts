import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { flags?: Record<string, boolean> }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.flags || typeof body.flags !== 'object') {
    return NextResponse.json({ error: 'flags object required' }, { status: 400 })
  }

  const { error } = await adminSupabase
    .from('app_config')
    .upsert({
      key: 'feature_flags',
      value: body.flags,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}