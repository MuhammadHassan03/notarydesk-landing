'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/icons'

function useCounter(target: number, dur = 1600) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let n = 0; const s = target / (dur / 16)
    const id = setInterval(() => { n += s; if (n >= target) { setV(target); clearInterval(id) } else setV(Math.floor(n)) }, 16)
    return () => clearInterval(id)
  }, [target, dur])
  return v
}


const TRUST = [
  { icon: 'lock', text: 'Bank-grade encryption' },
  { icon: 'verified', text: 'IRS compliant mileage' },
  { icon: 'bolt', text: '60-second entries' },
  { icon: 'devices', text: 'Phone + Desktop' },
]

export default function Hero() {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t) }, [])
  const earn = useCounter(2840), signs = useCounter(18), mi = useCounter(312)

  return (
    <>
      <section className="relative" style={{ background: 'var(--bg-page)', overflowX: 'clip' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(ellipse, var(--accent), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20 relative z-10">

            {/* ── Left: Copy ──────────────────────────────────── */}
            <div className={`flex-1 max-w-[520px] transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[11px] font-bold tracking-wide mb-7" style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--primary)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--success)' }} /><span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--success)' }} /></span>
                BUILT FOR US MOBILE NOTARIES
              </div>

              <h1 className="text-[42px] md:text-[54px] font-extrabold leading-[1.08] -tracking-[0.03em] mb-5" style={{ color: 'var(--text)' }}>
                Your Notary<br />Business,{' '}
                <span className="relative inline-block">
                  <em className="not-italic" style={{ color: 'var(--accent)' }}>Finally</em>
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full opacity-40" style={{ background: `linear-gradient(90deg, var(--accent), transparent)` }} />
                </span>
                <br /><em className="not-italic" style={{ color: 'var(--accent)' }}>Organized.</em>
              </h1>

              <p className="text-[17px] leading-relaxed mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                Replace scattered spreadsheets and paper journals with one professional app.
                <span className="font-semibold" style={{ color: 'var(--text)' }}> Signing jobs · Journal · Mileage · Invoices · Expenses</span> synced across phone and desktop.
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                <Link href="/dashboard/register" className="group flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-[15px] text-white no-underline transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5" style={{ background: 'var(--primary)' }}>
                  Start Free No Credit Card
                  <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href="#features" className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-[15px] no-underline transition-all duration-200 hover:shadow-md" style={{ color: 'var(--primary)', background: 'var(--card)', border: '1.5px solid var(--border)' }}>
                  <Icon name="play_circle" size={20} />
                  See How It Works
                </a>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {TRUST.map(t => (
                  <div key={t.text} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    <Icon name={t.icon} size={14} style={{ color: 'var(--accent)' }} />{t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Mockups (1.5×) ───────────────────────── */}
            <div className={`relative transition-all duration-1000 delay-300 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

              {/* ═══ Browser (720px) ═══ */}
              <div className="w-[720px] max-lg:w-[560px] max-md:w-[400px] rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 px-5 py-3" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex gap-2"><span className="w-3 h-3 rounded-full bg-[#FF5F57]" /><span className="w-3 h-3 rounded-full bg-[#FEBC2E]" /><span className="w-3 h-3 rounded-full bg-[#28C840]" /></div>
                  <div className="flex-1 mx-6 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium truncate" style={{ background: 'var(--card)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
                    <Icon name="lock" size={12} style={{ opacity: 0.4 }} />
                    app.notarydesk.com/dashboard
                  </div>
                </div>
                <div className="flex" style={{ background: 'var(--bg-page)' }}>
                  {/* Sidebar */}
                  <div className="w-[72px] max-md:hidden shrink-0 py-5 flex flex-col items-center gap-4" style={{ background: 'var(--primary)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>N</div>
                    <div className="w-6 h-px mt-1 mb-1 rounded-full bg-white/10" />
                    {[
                      { icon: 'dashboard', active: true },
                      { icon: 'work', active: false },
                      { icon: 'menu_book', active: false },
                      { icon: 'receipt_long', active: false },
                      { icon: 'route', active: false },
                      { icon: 'account_balance_wallet', active: false },
                    ].map(n => (
                      <div key={n.icon} className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: n.active ? 'rgba(201,168,76,0.15)' : 'transparent' }}>
                        <Icon name={n.icon} size={18} style={{ color: n.active ? 'var(--accent)' : 'rgba(255,255,255,0.35)' }} />
                      </div>
                    ))}
                  </div>

                  {/* Main */}
                  <div className="flex-1 p-5 max-md:p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Good morning,</p><p className="text-base font-bold -tracking-wide" style={{ color: 'var(--text)' }}>Sarah Mitchell</p></div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
                        <Icon name="add" size={14} /> New Job
                      </div>
                    </div>

                    <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3 mb-4">
                      {[
                        { l: 'MONTHLY', v: `$${earn.toLocaleString()}`, icon: 'trending_up' },
                        { l: 'YTD INCOME', v: '$24,650', icon: 'payments' },
                        { l: 'ACTIVE JOBS', v: '3', icon: 'work' },
                        { l: 'UNPAID', v: '$420', c: 'var(--warning)', icon: 'pending' },
                      ].map(s => (
                        <div key={s.l} className="rounded-xl p-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[9px] font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{s.l}</p>
                            <Icon name={s.icon} size={14} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} />
                          </div>
                          <p className="text-[18px] font-extrabold -tracking-wider" style={{ color: s.c || 'var(--text)' }}>{s.v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{ background: 'var(--success-bg)', border: '1px solid rgba(39,174,96,0.15)' }}>
                      <Icon name="savings" size={20} style={{ color: 'var(--success)' }} />
                      <p className="text-xs font-bold flex-1" style={{ color: 'var(--success-text)' }}>Tax savings: <span className="text-base">$1,847</span></p>
                      {[{ v: '$982', l: 'mileage' }, { v: '$765', l: 'expenses' }].map(c => (
                        <span key={c.l} className="text-[9px] font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(39,174,96,0.1)', color: 'var(--success-text)' }}>{c.v} {c.l}</span>
                      ))}
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      <div className="grid grid-cols-5 px-4 py-2" style={{ background: 'var(--surface)' }}>
                        {['#', 'Signer', 'Document', 'Amount', 'Status'].map(h => (
                          <span key={h} className="text-[9px] font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{h}</span>
                        ))}
                      </div>
                      {[
                        { n: '042', s: 'James Patterson', d: 'Deed of Trust', a: '$150', st: 'Confirmed', sc: 'var(--success)' },
                        { n: '041', s: 'Maria Gonzalez', d: 'Power of Attorney', a: '$120', st: 'New', sc: 'var(--accent)' },
                        { n: '040', s: 'Robert Chen', d: 'Loan Package', a: '$200', st: 'Paid', sc: 'var(--success)' },
                      ].map(r => (
                        <div key={r.n} className="grid grid-cols-5 items-center px-4 py-2.5" style={{ background: 'var(--card)', borderTop: '1px solid var(--divider)' }}>
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>#{r.n}</span>
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--text)' }}>{r.s}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{r.d}</span>
                          <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>{r.a}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md w-fit" style={{ background: `color-mix(in srgb, ${r.sc} 12%, transparent)`, color: r.sc }}>{r.st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ iPhone (285px) ═══ */}
              <div className={`absolute -bottom-14 -right-6 lg:-right-14 z-20 transition-all duration-700 delay-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="relative w-[285px]">
                  {/* Hardware buttons */}
                  <div className="absolute -right-[4px] top-[108px] w-[4px] h-[42px] rounded-r-sm bg-[#1a1f2e]" />
                  <div className="absolute -left-[4px] top-[87px] w-[4px] h-[27px] rounded-l-sm bg-[#1a1f2e]" />
                  <div className="absolute -left-[4px] top-[126px] w-[4px] h-[27px] rounded-l-sm bg-[#1a1f2e]" />

                  <div className="rounded-[48px] p-[8px] shadow-2xl" style={{ background: '#0F172A' }}>
                    <div className="rounded-[40px] overflow-hidden relative" style={{ background: 'var(--card)' }}>

                      {/* Dynamic Island */}
                      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-10 w-[100px] h-[30px] rounded-full flex items-center justify-center gap-3" style={{ background: '#000' }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: '#0a0a14', boxShadow: 'inset 0 0 3px rgba(40,60,120,0.5), 0 0 1px rgba(255,255,255,0.1)' }} />
                        <div className="w-[5px] h-[5px] rounded-full bg-[#0a0a14]" />
                      </div>

                      {/* Status bar CSS only, no SVGs */}
                      <div className="flex items-center justify-between px-7 pt-[44px] pb-1">
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>9:41</span>
                        <div className="flex items-center gap-[5px]">
                          {/* Signal bars */}
                          <div className="flex items-end gap-[1.5px]">
                            {[4, 6, 8, 10].map((h, i) => (
                              <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: 'var(--text)', opacity: 0.3 + i * 0.2 }} />
                            ))}
                          </div>
                          {/* WiFi */}
                          <Icon name="wifi" size={14} style={{ color: 'var(--text)', opacity: 0.6 }} />
                          {/* Battery */}
                          <div className="flex items-center gap-[1px]">
                            <div className="w-[20px] h-[10px] rounded-[2.5px] flex items-center p-[1.5px]" style={{ border: '1px solid var(--text)', opacity: 0.35 }}>
                              <div className="h-full rounded-[1.5px] w-[70%]" style={{ background: 'var(--success)' }} />
                            </div>
                            <div className="w-[2px] h-[5px] rounded-r-sm" style={{ background: 'var(--text)', opacity: 0.2 }} />
                          </div>
                        </div>
                      </div>

                      {/* App content */}
                      <div className="px-5 pt-1 pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <div><p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Good morning,</p><p className="text-[16px] font-bold -tracking-wide" style={{ color: 'var(--text)' }}>Sarah 👋</p></div>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>SM</div>
                        </div>

                        {/* Earnings */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'var(--primary)' }}>
                          <p className="text-[8px] font-bold tracking-[2px] text-white/40">THIS MONTH</p>
                          <p className="text-[30px] font-extrabold text-white -tracking-wider leading-none mt-1">${earn.toLocaleString()}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">Total earnings</p>
                          <div className="flex mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {[{ v: String(signs), l: 'SIGNINGS' }, { v: String(mi), l: 'MILES' }, { v: '$209', l: 'TAX SAVED', g: true }].map((s, i) => (
                              <div key={s.l} className="flex-1 text-center" style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.06)' } : {}}>
                                <p className="text-[12px] font-bold" style={{ color: s.g ? 'var(--accent)' : 'white' }}>{s.v}</p>
                                <p className="text-[7px] tracking-[1px] text-white/25 mt-px">{s.l}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick actions Material Icons */}
                        <div className="flex justify-between mb-3">
                          {[
                            { icon: 'add_circle', l: 'New Job', bg: 'rgba(27,58,92,0.06)', c: 'var(--primary)' },
                            { icon: 'menu_book', l: 'Journal', bg: '#EDE9FE', c: '#5B21B6' },
                            { icon: 'route', l: 'Trip', bg: '#DBEAFE', c: '#1D4ED8' },
                            { icon: 'receipt_long', l: 'Invoice', bg: '#FEF3C7', c: '#92400E' },
                          ].map(a => (
                            <div key={a.l} className="flex flex-col items-center gap-1">
                              <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center" style={{ background: a.bg }}>
                                <Icon name={a.icon} size={20} style={{ color: a.c }} />
                              </div>
                              <span className="text-[8px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>{a.l}</span>
                            </div>
                          ))}
                        </div>

                        {/* Schedule */}
                        <p className="text-[8px] font-bold tracking-[1.5px] mb-2" style={{ color: 'var(--text-tertiary)' }}>TODAY&apos;S SCHEDULE</p>
                        {[
                          { t: '10:30', n: 'James Patterson', d: 'Deed of Trust · $150', c: 'var(--success)' },
                          { t: '2:00', n: 'Maria Gonzalez', d: 'Power of Attorney · $120', c: 'var(--accent)' },
                        ].map((a, i) => (
                          <div key={a.n} className="flex items-center gap-2.5 py-[7px]" style={i === 0 ? { borderBottom: '1px solid var(--divider)' } : {}}>
                            <p className="text-[12px] font-bold w-10 shrink-0" style={{ color: 'var(--primary)' }}>{a.t}</p>
                            <div className="w-[3px] h-7 rounded-full shrink-0" style={{ background: a.c }} />
                            <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate" style={{ color: 'var(--text)' }}>{a.n}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{a.d}</p></div>
                          </div>
                        ))}

                        {/* GPS */}
                        <div className="flex items-center gap-2.5 mt-2.5 p-3 rounded-xl" style={{ background: 'rgba(39,174,96,0.06)', border: '1px solid rgba(39,174,96,0.1)' }}>
                          <div className="relative shrink-0">
                            <span className="w-3 h-3 rounded-full block" style={{ background: 'var(--success)' }} />
                            <span className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-40" style={{ background: 'var(--success)' }} />
                          </div>
                          <div className="flex-1"><p className="text-[10px] font-bold" style={{ color: 'var(--success-text)' }}>GPS Trip Active</p><p className="text-[8px]" style={{ color: 'var(--success)' }}>4.2 mi · IRS tracking</p></div>
                          <p className="text-[13px] font-extrabold" style={{ color: 'var(--success)' }}>+$2.94</p>
                        </div>

                        {/* Tab bar Material Icons */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 px-2" style={{ borderTop: '1px solid var(--divider)' }}>
                          {[
                            { icon: 'home', label: 'Home', active: true },
                            { icon: 'work', label: 'Jobs', active: false },
                            { icon: 'menu_book', label: 'Journal', active: false },
                            { icon: 'route', label: 'Miles', active: false },
                            { icon: 'more_horiz', label: 'More', active: false },
                          ].map(tab => (
                            <div key={tab.label} className="flex flex-col items-center gap-0.5" style={{ opacity: tab.active ? 1 : 0.3 }}>
                              <Icon name={tab.icon} size={18} style={{ color: tab.active ? 'var(--accent)' : 'var(--text-secondary)' }} />
                              <span className="text-[7px] font-semibold" style={{ color: tab.active ? 'var(--accent)' : 'var(--text-secondary)' }}>{tab.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="flex justify-center pb-2"><div className="w-[72px] h-[4px] rounded-full" style={{ background: 'var(--text)', opacity: 0.15 }} /></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synced badge */}
              <div className={`absolute -bottom-6 right-[260px] lg:right-[280px] z-30 transition-all duration-500 delay-1000 ${vis ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-[11px] font-bold" style={{ background: 'var(--primary)', color: 'white' }}>
                  <Icon name="sync" size={14} style={{ color: 'var(--accent)' }} />
                  Synced in real-time
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] -z-10 opacity-10 blur-3xl rounded-full" style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />
            </div>
          </div>

          {/* ── Stats strip ──────────────────────────────────── */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-500 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {[
              { v: '60s', l: 'Log any signing', icon: 'bolt' },
              { v: '$1,600+', l: 'Avg. annual tax savings', icon: 'savings' },
              { v: '50', l: 'States with compliance', icon: 'gavel' },
              { v: '100%', l: 'Data encrypted & private', icon: 'shield' },
            ].map(s => (
              <div key={s.l} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}>
                  <Icon name={s.icon} size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div><p className="text-lg font-extrabold -tracking-wider" style={{ color: 'var(--text)' }}>{s.v}</p><p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{s.l}</p></div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  )
}