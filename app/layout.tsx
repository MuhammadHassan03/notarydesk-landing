import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/themecontext'
import './globals.css'

export const metadata: Metadata = {
  title: 'NotaryDesk, Your Mobile Notary Business, Organized',
  description: 'Signing jobs, journal, mileage, invoicing, and tax savings for mobile notaries.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const fontUrl = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_balance_wallet,chevron_left,chevron_right,dark_mode,dashboard,diamond,explore,light_mode,logout,menu_book,receipt_long,route,settings,star,work"
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={fontUrl} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}