'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PLANS } from '@/lib/landing-content'

const MI = ({ name, size = 18, className = '', style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) => (
  <span className={`material-symbols-rounded ${className}`} style={{ fontSize: size, lineHeight: 1, ...style }}>{name}</span>
)

const PLAN_ICONS: Record<string, string> = {
  Free: 'explore',
  Pro: 'star',
  Business: 'diamond',
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section className="py-24" id="pricing" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>Simple Pricing</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider leading-tight" style={{ color: 'var(--text)' }}>
            Start free.<br />
            <em className="not-italic" style={{ color: 'var(--accent)' }}>Upgrade when ready.</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Average user saves $1,600+/year in tax deductions. The app pays for itself in your first week.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className="text-sm font-medium" style={{ color: yearly ? 'var(--text-tertiary)' : 'var(--text)' }}>Monthly</span>
            <button
              onClick={() => setYearly(y => !y)}
              className="relative w-14 h-7 rounded-full transition-colors cursor-pointer border-none"
              style={{ background: yearly ? 'var(--primary)' : 'var(--border)' }}
              aria-label="Toggle billing period"
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm flex items-center justify-center ${yearly ? 'left-8' : 'left-1'}`}>
                <MI name={yearly ? 'calendar_month' : 'today'} size={12} style={{ color: 'var(--primary)', opacity: 0.6 }} />
              </div>
            </button>
            <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: yearly ? 'var(--text)' : 'var(--text-tertiary)' }}>
              Yearly
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
                <MI name="savings" size={11} />
                Save 17%
              </span>
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {PLANS.map(plan => (
            <div key={plan.name}
              className={`relative rounded-2xl p-7 border transition-all hover:shadow-lg ${plan.highlight ? 'shadow-xl' : ''}`}
              style={{
                background: 'var(--card)',
                borderColor: plan.highlight ? 'var(--primary)' : 'var(--border)',
                borderWidth: plan.highlight ? 2 : 1,
              }}>

              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                  style={{ background: 'var(--primary)' }}>
                  <MI name="star" size={12} />
                  {plan.badge}
                </div>
              )}

              {/* Plan icon + name */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: plan.highlight ? 'var(--primary)' : 'var(--surface)' }}>
                  <MI name={PLAN_ICONS[plan.name] || 'star'} size={18}
                    style={{ color: plan.highlight ? 'white' : 'var(--primary)' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>$</span>
                <span className="text-[42px] font-extrabold -tracking-wider leading-none" style={{ color: 'var(--text)' }}>
                  {yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && <span className="text-sm ml-0.5" style={{ color: 'var(--text-tertiary)' }}>/mo</span>}
              </div>
              {yearly && plan.price.monthly > 0 && (
                <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                  <MI name="info" size={12} style={{ opacity: 0.5 }} />
                  Billed ${Math.round(plan.price.yearly * 12)} annually
                </p>
              )}
              <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>

              {/* CTA */}
              <Link href="/dashboard/register"
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm no-underline mb-6 transition-all hover:shadow-md hover:-translate-y-px ${plan.highlight ? 'text-white' : ''}`}
                style={plan.highlight
                  ? { background: 'var(--primary)' }
                  : { background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--primary)' }
                }>
                <MI name={plan.highlight ? 'rocket_launch' : 'arrow_forward'} size={16} />
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="h-px mb-5" style={{ background: 'var(--divider)' }} />

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <MI name="check_circle" size={15} className="shrink-0 mt-px" style={{ color: 'var(--success)' }} />
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                    <MI name="cancel" size={15} className="shrink-0 mt-px" style={{ opacity: 0.35 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Value note */}
        <div className="flex items-start gap-3 mt-12 p-5 rounded-2xl max-w-4xl mx-auto" style={{ background: 'var(--accent-pale, #FFF8E1)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
            <MI name="lightbulb" size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text)' }}>Track every notarial act for IRS savings:</strong> Most notaries miss $1,000–$3,000+ in deductions by not tracking acts performed.
          </p>
        </div>

        {/* Bottom note */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {[
            { icon: 'confirmation_number', text: '15 free signing jobs' },
            { icon: 'credit_card_off', text: 'No credit card required' },
            { icon: 'event_repeat', text: 'Cancel any time' },
          ].map(n => (
            <span key={n.text} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <MI name={n.icon} size={13} style={{ opacity: 0.5 }} />
              {n.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}