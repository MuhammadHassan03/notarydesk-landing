import { COMPETITORS, COMPARISON_FEATURES, COMPARISON_MATRIX, ROADMAP } from '@/lib/content/landing'
import { Icon } from '@/components/ui/icons'

// ── Icon maps ─────────────────────────────────────────────────────────────

const COMPETITOR_ICONS: Record<string, string> = {
  'Legacy Software': 'desktop_windows',
  'General Tools': 'apps',
  'Spreadsheets': 'table_chart',
  'Paper Journals': 'auto_stories',
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  limited: { label: 'Incomplete', icon: 'warning', bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  wrong:   { label: 'Too Complex', icon: 'block', bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
  manual:  { label: 'Time Sink', icon: 'hourglass_top', bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  risky:   { label: 'Risky', icon: 'gpp_maybe', bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

const ROADMAP_ICONS: Record<string, string> = {
  'Digital Notary Journal': 'menu_book',
  'GPS Mileage Tracker': 'route',
  'Professional Invoices': 'receipt_long',
  'Appointment Manager': 'calendar_month',
  'Secure Data Privacy': 'shield',
  'Integrated Payments': 'credit_card',
  'Smart Signer Directory': 'contacts',
  'Tax Reports': 'summarize',
  'AI ID Scanning': 'document_scanner',
  'Advanced Offline Mode': 'cloud_off',
  'State-Specific Logic': 'account_balance',
  'RON Support': 'videocam',
}

// ═══════════════════════════════════════════════════════════════════════════
// CompetitorSection
// ═══════════════════════════════════════════════════════════════════════════

export function CompetitorSection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>The Comparison</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider leading-tight" style={{ color: 'var(--text)' }}>
            The first modern tool<br />
            <em className="not-italic" style={{ color: 'var(--accent)' }}>built for your workflow.</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Most notary tools were built for desktops a decade ago. NotaryDesk is a ground-up rebuild for the mobile notary.
          </p>
        </div>

        {/* Competitor cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {COMPETITORS.map(c => {
            const s = STATUS_CONFIG[c.status]
            return (
              <div key={c.name} className="rounded-2xl p-5 border transition-all hover:shadow-md"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                    <Icon name={COMPETITOR_ICONS[c.name] || 'help'} size={20} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                    <Icon name={s.icon} size={11} />
                    {s.label}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{c.name}</h4>
                <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{c.what}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{c.why}</p>
              </div>
            )
          })}
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold tracking-[1.5px] uppercase" style={{ color: 'var(--text-tertiary)', background: 'var(--surface)' }}>
                  Feature
                </th>
                {[
                  { n: 'NotaryDesk', icon: 'verified', highlight: true },
                  { n: 'Legacy', icon: 'desktop_windows', highlight: false },
                  { n: 'General', icon: 'apps', highlight: false },
                  { n: 'Spreadsheet', icon: 'table_chart', highlight: false },
                ].map(col => (
                  <th key={col.n} className="px-4 py-3.5 text-center" style={{
                    background: col.highlight ? 'var(--primary-light)' : 'var(--surface)',
                  }}>
                    <div className="flex flex-col items-center gap-1">
                      <Icon name={col.icon} size={14} style={{ color: col.highlight ? 'var(--primary)' : 'var(--text-tertiary)', opacity: col.highlight ? 1 : 0.5 }} />
                      <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: col.highlight ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                        {col.n}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((f, i) => (
                <tr key={f} style={i % 2 === 0 ? { background: 'var(--surface)' } : { background: 'var(--card)' }}>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{f}</td>
                  {['NotaryDesk', 'Legacy', 'General', 'Spreadsheet'].map(n => (
                    <td key={n} className="px-4 py-3 text-center" style={n === 'NotaryDesk' ? { background: 'var(--primary-light)' } : {}}>
                      {COMPARISON_MATRIX[n]?.[i]
                        ? <Icon name="check_circle" size={18} style={{ color: 'var(--success)' }} />
                        : <Icon name="cancel" size={18} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom note */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Icon name="info" size={16} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} />
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Stop settling for tools that weren&apos;t made for you. Upgrade to a professional standard.
          </p>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Roadmap
// ═══════════════════════════════════════════════════════════════════════════

const PHASES = [
  {
    key: 'now' as const,
    badge: 'Available Now', badgeIcon: 'rocket_launch',
    badgeBg: 'var(--success-bg)', badgeColor: 'var(--success-text)',
    dot: true,
    title: 'Core Platform',
    desc: 'The essential toolkit for every mobile notary, live and ready to use.',
    cardBorder: 'var(--success)',
    checkIcon: true,
  },
  {
    key: 'soon' as const,
    badge: 'Next Release', badgeIcon: 'update',
    badgeBg: 'var(--info-bg)', badgeColor: 'var(--info-text)',
    dot: false,
    title: 'Seamless Payments & Growth',
    desc: 'Upcoming tools to help you get paid faster and manage repeat business.',
    cardBorder: 'var(--info)',
    checkIcon: false,
  },
  {
    key: 'future' as const,
    badge: 'In Development', badgeIcon: 'science',
    badgeBg: 'var(--warning-bg)', badgeColor: 'var(--warning-text)',
    dot: false,
    title: 'Advanced Notary Intelligence',
    desc: 'High-tech features including AI scanning and expanded compliance.',
    cardBorder: 'var(--warning)',
    checkIcon: false,
  },
]

const PHASE_DIVIDERS = ['Coming Next', 'Future Vision']

export function Roadmap() {
  return (
    <section className="py-24" id="roadmap" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>Product Roadmap</span>
          <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider leading-tight" style={{ color: 'var(--text)' }}>
            Built for today.<br />
            <em className="not-italic" style={{ color: 'var(--accent)' }}>Ready for tomorrow.</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We&apos;re constantly improving NotaryDesk. Here&apos;s what&apos;s coming.
          </p>
        </div>

        {PHASES.map((phase, pi) => (
          <div key={phase.key}>
            {/* Divider between phases */}
            {pi > 0 && (
              <div className="flex items-center gap-4 my-10">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  <Icon name={pi === 1 ? 'arrow_downward' : 'auto_awesome'} size={14} />
                  {PHASE_DIVIDERS[pi - 1]}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
            )}

            {/* Phase header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4"
                style={{ background: phase.badgeBg, color: phase.badgeColor }}>
                {phase.dot && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--success)' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--success)' }} />
                  </span>
                )}
                <Icon name={phase.badgeIcon} size={14} />
                {phase.badge}
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{phase.title}</h3>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{phase.desc}</p>
            </div>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROADMAP[phase.key].map(f => {
                const iconName = ROADMAP_ICONS[f.title] || 'star'
                return (
                  <div key={f.title}
                    className="flex items-start gap-3.5 rounded-xl p-4 border transition-all hover:shadow-sm hover:-translate-y-px"
                    style={{
                      background: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderLeftWidth: 3,
                      borderLeftColor: phase.cardBorder,
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: phase.badgeBg }}>
                      <Icon name={iconName} size={20} style={{ color: phase.badgeColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>{f.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                    </div>
                    {phase.checkIcon && (
                      <Icon name="check_circle" size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Vision quote */}
        <div className="mt-14 p-6 rounded-2xl text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Icon name="format_quote" size={28} style={{ color: 'var(--accent)', opacity: 0.6 }} />
          <p className="text-sm leading-relaxed mt-2 max-w-lg mx-auto italic" style={{ color: 'var(--text-secondary)' }}>
            &quot;Our mission is to make NotaryDesk the standard for professional mobile notaries — providing the tools you need to stay organized, compliant, and profitable.&quot;
          </p>
        </div>
      </div>
    </section>
  )
}