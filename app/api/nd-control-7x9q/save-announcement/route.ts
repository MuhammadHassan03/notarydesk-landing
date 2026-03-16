import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { active?: boolean; message?: string; type?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { active, message, type } = body

  const { error } = await adminSupabase
    .from('app_config')
    .upsert({
      key: 'announcement',
      value: { active: Boolean(active), message: message ?? '', type: type ?? 'info' },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}