'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/icons'

interface ChecklistState {
  commission: boolean
  fee: boolean
  first_client: boolean
  first_job: boolean
  first_mileage: boolean
  first_journal: boolean
}

const ITEMS: { key: keyof ChecklistState; label: string; href: string; icon: string }[] = [
  { key: 'commission',    label: 'Add your commission number', href: '/dashboard/settings', icon: 'verified' },
  { key: 'fee',           label: 'Set your default fee',      href: '/dashboard/settings', icon: 'attach_money' },
  { key: 'first_client',  label: 'Add your first client',     href: '/dashboard/clients/new', icon: 'person_add' },
  { key: 'first_job',     label: 'Create your first job',     href: '/dashboard/jobs/new', icon: 'work' },
  { key: 'first_mileage', label: 'Log your first mileage',    href: '/dashboard/mileage/new', icon: 'route' },
  { key: 'first_journal', label: 'Record a journal entry',    href: '/dashboard/journal/new', icon: 'menu_book' },
]

const DISMISS_KEY = 'notarydesk:onboarding_dismissed'

export default function OnboardingChecklist({ checklist }: { checklist?: ChecklistState | null }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    localStorage.setItem(DISMISS_KEY, 'true')
  }, [])

  const state: ChecklistState = checklist ?? {
    commission: false, fee: false, first_client: false,
    first_job: false, first_mileage: false, first_journal: false,
  }

  const completed = Object.values(state).filter(Boolean).length
  const total = ITEMS.length

  if (dismissed || completed === total) return null

  const pct = (completed / total) * 100

  return (
    <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="rocket_launch" size={18} style={{ color: 'var(--primary)' }} />
          <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>Get Started</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            {completed}/{total}
          </span>
          <button onClick={handleDismiss}
            className="p-1 rounded-md bg-transparent border-none cursor-pointer transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-tertiary)' }}>
            <Icon name="close" size={16} style={{ color: 'inherit' }} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'var(--surface)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {ITEMS.map(item => {
          const done = state[item.key]
          return (
            <Link key={item.key} href={done ? '#' : item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl no-underline transition-colors"
              style={{ background: done ? 'var(--success-bg)' : 'transparent' }}
              onClick={e => { if (done) e.preventDefault() }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
                style={{
                  background: done ? 'var(--success)' : 'var(--surface)',
                  border: `2px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                }}>
                {done && <Icon name="check" size={13} style={{ color: '#fff' }} />}
              </div>
              <Icon name={item.icon as any} size={15} style={{ color: done ? 'var(--text-tertiary)' : 'var(--primary)' }} />
              <span className="text-[13px] font-medium flex-1"
                style={{
                  color: done ? 'var(--text-tertiary)' : 'var(--text)',
                  textDecoration: done ? 'line-through' : 'none',
                }}>
                {item.label}
              </span>
              {!done && <Icon name="chevron_right" size={14} style={{ color: 'var(--text-tertiary)' }} />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
