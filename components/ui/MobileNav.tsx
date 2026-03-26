'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/icons'

const MOBILE_NAV = [
  { href: '/dashboard',          icon: 'dashboard',      label: 'Home' },
  { href: '/dashboard/jobs',     icon: 'work',           label: 'Jobs' },
  { href: '/dashboard/calendar', icon: 'calendar_month', label: 'Calendar' },
  { href: '/dashboard/invoices', icon: 'receipt_long',   label: 'Invoices' },
  { href: '/dashboard/settings', icon: 'settings',       label: 'More' },
]

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: 'var(--sidebar-bg)',
        borderTop: '1px solid var(--sidebar-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch">
        {MOBILE_NAV.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 no-underline transition-colors"
              style={{ color: active ? 'var(--accent)' : 'var(--sidebar-text)' }}
            >
              <Icon name={item.icon as any} size={22} />
              <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
