import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { tier?: string; subject?: string; body?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { tier, subject, body: emailBody } = body
  if (!tier || !subject || !emailBody) {
    return NextResponse.json({ error: 'tier, subject, and body are required' }, { status: 400 })
  }

  const apiKey  = process.env.RESEND_API_KEY
  const fromAddr = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'NotaryDesk'

  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })

  // Fetch recipient emails
  let q = adminSupabase.from('profiles').select('email').not('email', 'is', null)
  if (tier === 'paid') q = q.in('plan', ['pro','plus'])
  else if (tier !== 'all') q = q.eq('plan', tier)

  const { data: users, error: dbError } = await q
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  if (!users?.length) return NextResponse.json({ error: 'No recipients found for this tier' }, { status: 400 })

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.7;color:#1e293b;max-width:560px">
    ${emailBody.split('\n').map((l: string) => `<p style="margin:0 0 12px">${l || '&nbsp;'}</p>`).join('')}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
    <p style="color:#94a3b8;font-size:11px">You received this because you have a NotaryDesk account.</p>
  </div>`

  const emails = users.map((u: any) => u.email).filter(Boolean) as string[]
  const BATCH  = 50
  let sent = 0

  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH)
    await Promise.all(
      batch.map(to =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ from: `${fromName} <${fromAddr}>`, to: [to], subject, html }),
        })
      )
    )
    sent += batch.length
  }

  return NextResponse.json({ ok: true, count: sent })
}