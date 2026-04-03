/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://notarydesk-api.vercel.app'

const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]

    // Only enforce CSP in production — localhost ports can't be wildcarded in CSP
    if (!isDev) {
      securityHeaders.push({
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' https://*.supabase.co data: blob:",
          `connect-src 'self' https://*.supabase.co wss://*.supabase.co ${apiUrl} https://api.resend.com`,
        ].join('; ') + ';',
      })
    }

    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig