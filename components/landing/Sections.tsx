import { SOCIAL_PROOF_TYPES, PROBLEMS, FEATURES, STEPS } from '@/lib/content/landing'
import { Icon } from '@/components/ui/icons'

// ── Icon maps (replace emojis in landing-content.ts data) ─────────────────

const PROOF_ICONS: Record<string, string> = {
  'Loan Signing Agents': 'description',
  'Real Estate Notaries': 'home_work',
  'RON Notaries': 'laptop_mac',
  'Hospital Notaries': 'local_hospital',
  'Estate Planning Notaries': 'gavel',
  'General Mobile Notaries': 'directions_car',
}

const PROBLEM_ICONS: Record<string, string> = {
  '📋': 'auto_stories',
  '🚗': 'directions_car',
  '💸': 'payments',
  '📱': 'event_busy',
  '😰': 'calculate',
}

const FEATURE_ICONS: Record<string, { icon: string; color: string; iconColor: string }> = {
  'Digital Notary Journal': { icon: 'menu_book', color: '#EDE9FE', iconColor: '#5B21B6' },
  'GPS Mileage Tracker': { icon: 'route', color: '#DBEAFE', iconColor: '#1D4ED8' },
  'Professional Invoicing': { icon: 'receipt_long', color: '#FEF3C7', iconColor: '#92400E' },
  'Appointment Manager': { icon: 'calendar_month', color: '#DCFCE7', iconColor: '#15803D' },
}

const STEP_ICONS: Record<string, string> = {
  '01': 'person_add',
  '02': 'near_me',
  '03': 'edit_note',
  '04': 'send',
  '05': 'download',
}

// ═══════════════════════════════════════════════════════════════════════════
// SocialProof
// ═══════════════════════════════════════════════════════════════════════════

export function SocialProof() {
  return (
    <section className="py-12" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[11px] font-bold tracking-[2px] uppercase mb-6" style={{ color: 'var(--text-tertiary)' }}>
          Built for every type of mobile notary
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SOCIAL_PROOF_TYPES.map(t => (
            <div key={t.label} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-sm hover:-translate-y-px"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <Icon name={PROOF_ICONS[t.label] || 'badge'} size={16} style={{ color: 'var(--primary)', opacity: 0.7 }} />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ProblemSection
// ═══════════════════════════════════════════════════════════════════════════

export function ProblemSection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>The Solution</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider leading-tight" style={{ color: 'var(--text)' }}>
            You run a real business.<br />
            <em className="not-italic" style={{ color: 'var(--accent)' }}>Use professional tools.</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Mobile notaries handle high-stakes legal documents every day. It&apos;s time to move past paper notebooks and scattered phone notes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map(p => (
            <div key={p.before} className="rounded-2xl p-6 border transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--danger-bg)' }}>
                  <Icon name={PROBLEM_ICONS[p.emoji] || 'warning'} size={20} style={{ color: 'var(--danger)' }} />
                </div>
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>The Old Way</span>
              </div>

              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>{p.before}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{p.pain}</p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'var(--divider)' }} />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
                  <Icon name="check_circle" size={12} />
                  <span className="text-[10px] font-bold tracking-wider">NotaryDesk</span>
                </div>
                <div className="flex-1 h-px" style={{ background: 'var(--divider)' }} />
              </div>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--success-text)' }}>{p.after}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Features
// ═══════════════════════════════════════════════════════════════════════════

export function Features() {
  return (
    <section className="py-24" id="features" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>The Toolkit</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider leading-tight" style={{ color: 'var(--text)' }}>
            Everything a notary needs.<br />
            <em className="not-italic" style={{ color: 'var(--accent)' }}>Nothing they don&apos;t.</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Not a generic business app. Designed from the ground up for the modern mobile signing agent.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {FEATURES.map((f, i) => {
            const fi = FEATURE_ICONS[f.title] || { icon: 'star', color: f.color, iconColor: 'var(--primary)' }
            return (
              <div key={f.title}
                className={`flex flex-col md:flex-row gap-8 rounded-2xl p-8 border transition-all hover:shadow-lg ${i % 2 ? 'md:flex-row-reverse' : ''}`}
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

                {/* Content */}
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: fi.color }}>
                    <Icon name={fi.icon} size={28} style={{ color: fi.iconColor }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                  <ul className="space-y-2.5">
                    {f.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Icon name="check_circle" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--success)' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stat box */}
                <div className="md:w-52 rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ background: fi.color }}>
                  <span className="text-4xl font-extrabold" style={{ color: fi.iconColor }}>{f.stat.value}</span>
                  <span className="text-xs mt-2 font-medium leading-snug" style={{ color: 'var(--text-secondary)' }}>{f.stat.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HowItWorks
// ═══════════════════════════════════════════════════════════════════════════

export function HowItWorks() {
  return (
    <section className="py-24" id="how" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-16">

        {/* Left sticky panel */}
        <div className="lg:w-[360px] shrink-0 lg:sticky lg:top-24 lg:self-start">
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>Simple Workflow</span>
          <h2 className="text-3xl md:text-[38px] font-extrabold mt-4 -tracking-wider leading-tight" style={{ color: 'var(--text)' }}>
            One workday.<br />
            <em className="not-italic" style={{ color: 'var(--accent)' }}>Five taps.</em>
          </h2>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Designed to be used on the road, between signings, with one hand. Every interaction under 60 seconds.
          </p>

          <a href="#notify" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl font-bold text-sm text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'var(--primary)' }}>
            <Icon name="notifications" size={16} />
            Join the Waitlist
          </a>

          <p className="mt-4 text-xs flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
            <Icon name="devices" size={14} style={{ opacity: 0.5 }} />
            Coming to both iOS and Android
          </p>
        </div>

        {/* Right: Steps */}
        <div className="flex-1">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex gap-5">
              {/* Number column */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: 'var(--primary)' }}>
                  <Icon name={STEP_ICONS[step.num] || 'star'} size={22} style={{ color: 'white' }} />
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 my-2" style={{ background: 'var(--border)' }} />
                )}
              </div>

              {/* Content */}
              <div className="pb-12">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--primary-light, #E8F0FE)', color: 'var(--primary)' }}>
                    STEP {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>

                {/* Tip card */}
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <Icon name="lightbulb" size={16} className="shrink-0 mt-px" style={{ color: 'var(--accent)' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}