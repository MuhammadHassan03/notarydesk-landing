import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/themecontext'

export const metadata: Metadata = {
  title: 'NotaryDesk — Notary Business Management',
  description: 'Track signings, mileage, invoices, expenses and stay compliant — all in one dashboard.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'NotaryDesk — Notary Business Management',
    description: 'Track signings, mileage, invoices, expenses and stay compliant.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotaryDesk — Notary Business Management',
    description: 'Track signings, mileage, invoices, expenses and stay compliant.',
  },
  themeColor: '#1B3A5C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode anti-flicker: set data-theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('nd-theme');if(s){document.documentElement.setAttribute('data-theme',s);return;}if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}