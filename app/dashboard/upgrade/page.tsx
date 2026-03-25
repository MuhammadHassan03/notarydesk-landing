'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { api } from '@/lib/api'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    yearlyPrice: 8.25,
    desc: 'Everything a full-time notary needs',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited signing jobs',
      '50-state compliance engine',
      'Invoice generator + email delivery',
      'PDF exports (journal, mileage, tax)',
      'Tax savings calculator + report',
      'Client directory',
      'Appointment manager + reminders',
      'Analytics dashboard',
      'GPS mileage tracker',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 19.99,
    yearlyPrice: 15.75,
    desc: 'For high-volume notary businesses',
    highlight: false,
    badge: null,
    features: [
      'Everything in Pro',
      'Custom invoice branding (logo)',
      'Annual tax summary PDF',
      'W-9 / 1099 client tracking',
      'Priority support (24hr)',
      'AI ID Scanner (coming soon)',
    ],
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const { plan } = useAuth()
  const [yearly, setYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  async function handleUpgrade(planId: string) {
    setLoading(planId)
    try {
      const { checkout_url } = await api.post<{ checkout_url: string }>('/billing/checkout', {
        plan: planId,
        period: yearly ? 'yearly' : 'monthly',
      })
      window.location.href = checkout_url
    } catch (err: any) {
      setToast({ msg: err.message || 'Could not start checkout. Try again.', type: 'error' })
      setLoading(null)
    }
  }

  const currentPlan = (plan || 'free').toLowerCase()

  return (
    <div className="max-w-[860px]">
      <PageHeader
        title="Upgrade NotaryDesk"
        subtitle="Unlock unlimited jobs and professional features"
        action={
          <Button variant="outline" href="/dashboard">
            <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back
          </Button>
        }
      />

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm font-medium" style={{ color: yearly ? 'var(--text-tertiary)' : 'var(--text)' }}>Monthly</span>
        <button
          onClick={() => setYearly(y => !y)}
          className="relative w-14 h-7 rounded-full transition-colors cursor-pointer border-none"
          style={{ background: yearly ? 'var(--primary)' : 'var(--border)' }}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${yearly ? 'left-8' : 'left-1'}`} />
        </button>
        <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: yearly ? 'var(--text)' : 'var(--text-tertiary)' }}>
          Yearly
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            Save 17%
          </span>
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {PLANS.map(p => {
          const isCurrent = currentPlan === p.id
          const price = yearly ? p.yearlyPrice : p.monthlyPrice
          return (
            <div key={p.id}
              className="relative rounded-2xl p-7"
              style={{
                background: 'var(--card)',
                border: `${p.highlight ? 2 : 1}px solid ${p.highlight ? 'var(--primary)' : 'var(--border)'}`,
                boxShadow: p.highlight ? '0 4px 24px rgba(0,0,0,0.08)' : undefined,
              }}>

              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: 'var(--primary)' }}>
                  <Icon name="star" size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                  {p.badge}
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: p.highlight ? 'var(--primary)' : 'var(--surface)' }}>
                  <Icon name={p.highlight ? 'star' : 'diamond'} size={18}
                    style={{ color: p.highlight ? '#fff' : 'var(--primary)' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{p.name}</h3>
              </div>

              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>$</span>
                <span className="text-[42px] font-extrabold -tracking-wider leading-none" style={{ color: 'var(--text)' }}>
                  {price}
                </span>
                <span className="text-sm ml-0.5" style={{ color: 'var(--text-tertiary)' }}>/mo</span>
              </div>
              {yearly && (
                <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Billed ${Math.round(price * 12)} annually
                </p>
              )}
              <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>

              {isCurrent ? (
                <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm mb-5"
                  style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  <Icon name="check_circle" size={16} style={{ color: 'inherit' }} />
                  Current plan
                </div>
              ) : (
                <Button
                  variant={p.highlight ? 'gold' : 'primary'}
                  fullWidth
                  loading={loading === p.id}
                  onClick={() => handleUpgrade(p.id)}
                  className="mb-5"
                >
                  <Icon name="rocket_launch" size={16} style={{ color: 'inherit' }} />
                  Upgrade to {p.name}
                </Button>
              )}

              <div className="h-px mb-4" style={{ background: 'var(--divider)' }} />

              <ul className="space-y-2.5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <Icon name="check_circle" size={14} className="shrink-0 mt-px" style={{ color: 'var(--success)' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 py-5"
        style={{ borderTop: '1px solid var(--divider)' }}>
        {[
          { icon: 'lock', text: 'Secure payment via Lemon Squeezy' },
          { icon: 'event_repeat', text: 'Cancel any time' },
          { icon: 'support_agent', text: 'Email support included' },
        ].map(t => (
          <span key={t.text} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <Icon name={t.icon} size={14} style={{ opacity: 0.5 }} />
            {t.text}
          </span>
        ))}
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}
