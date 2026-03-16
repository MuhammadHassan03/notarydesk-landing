import { NextRequest, NextResponse } from 'next/server'
import { getTotpUri } from '@/lib/auth'

// Returns an HTML page with a scannable QR code.
// Only works when ALLOW_TOTP_SETUP=true in env vars.
// Visit this URL once, scan the QR, then remove ALLOW_TOTP_SETUP.
export async function GET(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const isLocal = host.startsWith('localhost') || host.startsWith('127.')
  const allowed = process.env.ALLOW_TOTP_SETUP === 'true' || isLocal

  if (!allowed) {
    return new NextResponse('Forbidden — set ALLOW_TOTP_SETUP=true to enable', { status: 403 })
  }

  const uri = getTotpUri()
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(uri)}`

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>TOTP Setup — NotaryDesk Admin</title>
<style>
  body { font-family: system-ui, sans-serif; background: #010409; color: #e6edf3;
         display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: #0d1117; border: 1px solid #21262d; border-radius: 12px;
          padding: 36px; max-width: 400px; text-align: center; }
  h1 { font-size: 20px; margin: 0 0 6px; }
  p  { color: #8b949e; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
  img { border-radius: 8px; background: white; padding: 8px; margin: 0 0 20px; }
  code { display: block; background: #161b22; border: 1px solid #30363d;
         border-radius: 6px; padding: 10px; font-size: 12px; color: #58a6ff;
         word-break: break-all; margin: 0 0 20px; }
  .warn { background: #3b1818; border: 1px solid #b91c1c44;
          border-radius: 6px; padding: 10px 14px;
          color: #f87171; font-size: 12px; line-height: 1.5; }
</style>
</head>
<body>
<div class="card">
  <h1>🔐 TOTP Setup</h1>
  <p>Scan this QR code with <strong>Google Authenticator</strong></p>
  <img src="${qrUrl}" width="220" height="220" alt="QR Code" />
  <p style="font-size:12px;margin-bottom:8px">Or enter this secret manually:</p>
  <code>${uri}</code>
  <div class="warn">
    ⚠️ After scanning, remove <strong>ALLOW_TOTP_SETUP</strong> from your env vars
    and redeploy. This page will return 403.
  </div>
</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}