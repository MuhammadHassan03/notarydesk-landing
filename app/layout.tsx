import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NotaryDesk — Notary Business Management',
  description: 'Track signings, mileage, invoices, expenses and stay compliant — all in one dashboard.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'NotaryDesk — Notary Business Management',
    description: 'Track signings, mileage, invoices, expenses and stay compliant.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  themeColor: '#1B3A5C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}