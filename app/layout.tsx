import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NotaryDesk — Your Mobile Notary Business, Organized.',
  description:
    'The all-in-one app for mobile notaries. Log signings, track mileage for IRS deductions, send invoices, and manage appointments — all from your phone.',
  keywords: 'notary app, mobile notary, mileage tracker, notary journal, notary invoice',
  openGraph: {
    title: 'NotaryDesk — Run Your Notary Business From Your Phone',
    description: 'Journal. Mileage. Invoices. Appointments. Everything a mobile notary needs.',
    url: 'https://notarydesk.app',
    siteName: 'NotaryDesk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotaryDesk — Your Mobile Notary Business, Organized.',
    description: 'Journal. Mileage. Invoices. Appointments. Everything a mobile notary needs.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
