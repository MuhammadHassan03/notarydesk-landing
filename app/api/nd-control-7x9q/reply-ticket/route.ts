import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { ticketId?: string; reply?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { ticketId, reply } = body
  if (!ticketId) return NextResponse.json({ error: 'ticketId required' }, { status: 400 })
  if (!reply?.trim()) return NextResponse.json({ error: 'reply cannot be empty' }, { status: 400 })

  const { error } = await adminSupabase
    .from('support_tickets')
    .update({
      reply: reply.trim(),
      status: 'resolved',
      replied_at: new Date().toISOString(),
    })
    .eq('id', ticketId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}