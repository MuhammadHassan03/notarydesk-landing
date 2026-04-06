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
  { icon: 'bolt', text: 'AI-powered job creation' },
  { icon: 'smartphone', text: 'Android app' },
]

export default function Hero() {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t) }, [])
  const earn = useCounter(2840)

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
                <span className="font-semibold" style={{ color: 'var(--text)' }}> AI job creation · Mileage · Invoicing · Income tracking</span> — all from your phone.
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                <Link href="#download" className="group flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-[15px] text-white no-underline transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5" style={{ background: 'var(--primary)' }}>
                  Download Free
                  <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href="#how" className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-[15px] no-underline transition-all duration-200 hover:shadow-md" style={{ color: 'var(--primary)', background: 'var(--card)', border: '1.5px solid var(--border)' }}>
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

            {/* ── Right: Android Phone Mockup ─────────────────── */}
            <div className={`relative transition-all duration-1000 delay-300 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative w-[320px] max-sm:w-[280px] mx-auto">
                {/* Phone shell — Android style (no notch, rounded corners) */}
                <div className="rounded-[36px] p-[6px] shadow-2xl" style={{ background: 'var(--phone-shell)', border: 'var(--phone-border)' }}>
                  <div className="rounded-[30px] overflow-hidden relative" style={{ background: '#0F2237' }}>

                    {/* Android status bar */}
                    <div className="flex items-center justify-between px-6 pt-3 pb-1">
                      <span className="text-[12px] font-semibold text-white/60">9:41</span>
                      <div className="flex items-center gap-[5px]">
                        <div className="flex items-end gap-[1.5px]">
                          {[4, 6, 8, 10].map((h, i) => (
                            <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: 'white', opacity: 0.2 + i * 0.2 }} />
                          ))}
                        </div>
                        <Icon name="wifi" size={14} style={{ color: 'white', opacity: 0.5 }} />
                        <div className="flex items-center gap-[1px]">
                          <div className="w-[20px] h-[10px] rounded-[2.5px] flex items-center p-[1.5px]" style={{ border: '1px solid white', opacity: 0.3 }}>
                            <div className="h-full rounded-[1.5px] w-[70%] bg-green-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Dashboard Content (matches actual mobile app) ── */}
                    <div className="px-4 pt-2 pb-3">

                      {/* Header: greeting + avatar + new job */}
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <p className="text-[10px] text-white/40">Good morning,</p>
                          <p className="text-[18px] font-extrabold text-white -tracking-wide leading-tight">Sarah</p>
                          <p className="text-[9px] text-white/30 mt-0.5">Sunday, April 6</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                            <Icon name="add" size={18} style={{ color: '#0F2237' }} />
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2" style={{ background: '#1B3A5C', borderColor: 'var(--accent)', color: 'white' }}>SM</div>
                        </div>
                      </div>

                      {/* Smart Action Card — "NEXT UP" */}
                      <div className="rounded-xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex">
                          <div className="w-[3px]" style={{ background: '#1B3A5C' }} />
                          <div className="flex-1 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded mb-1.5" style={{ background: 'rgba(27,58,92,0.15)' }}>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1B3A5C' }} />
                              <span className="text-[8px] font-extrabold tracking-wider" style={{ color: '#1B3A5C' }}>NEXT UP</span>
                            </div>
                            <p className="text-[14px] font-bold text-white">James Patterson</p>
                            <p className="text-[10px] text-white/40">Deed of Trust · 2:30 PM</p>
                            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg" style={{ background: '#1B3A5C' }}>
                              <Icon name="directions_car" size={14} style={{ color: 'var(--accent)' }} />
                              <span className="text-[11px] font-bold text-white flex-1">Start Job + Track Miles</span>
                              <Icon name="arrow_forward" size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Trigger Bar */}
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: 'rgba(27,58,92,0.05)', border: '1px solid rgba(27,58,92,0.12)' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.12)' }}>
                          <Icon name="auto_awesome" size={14} style={{ color: 'var(--accent)' }} />
                        </div>
                        <span className="text-[10px] text-white/30 flex-1">Describe a job or ask anything...</span>
                        <div className="px-2 py-1 rounded-md flex items-center gap-1" style={{ background: '#1B3A5C' }}>
                          <Icon name="auto_awesome" size={9} style={{ color: 'var(--accent)' }} />
                          <span className="text-[8px] font-bold" style={{ color: 'var(--accent)' }}>AI</span>
                        </div>
                      </div>

                      {/* Hero Card — Monthly Income */}
                      <div className="rounded-xl p-3 mb-3" style={{ background: '#1B3A5C' }}>
                        <div className="h-[3px] w-full rounded-full mb-3" style={{ background: 'var(--accent)' }} />
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon name="account_balance_wallet" size={11} style={{ color: 'var(--accent)' }} />
                          <span className="text-[9px] text-white/40">This Month</span>
                        </div>
                        <p className="text-[32px] font-extrabold text-white -tracking-wider leading-none">${earn.toLocaleString()}</p>
                        <div className="flex mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="flex-1 text-center">
                            <p className="text-[8px] font-extrabold tracking-wider text-white/30">YTD</p>
                            <p className="text-[13px] font-bold text-white mt-0.5">$24,650</p>
                          </div>
                          <div className="w-px h-6 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />
                          <div className="flex-1 text-center">
                            <p className="text-[8px] font-extrabold tracking-wider text-white/30">ACTIVE</p>
                            <p className="text-[13px] font-bold text-white mt-0.5">3</p>
                          </div>
                        </div>
                      </div>

                      {/* Today's Jobs */}
                      <p className="text-[8px] font-bold tracking-[1.5px] text-white/25 mb-2">TODAY&apos;S JOBS (2)</p>
                      {[
                        { n: 'James Patterson', d: 'Deed of Trust · 2:30 PM', a: '$150', c: '#2563EB', s: 'Scheduled' },
                        { n: 'Maria Gonzalez', d: 'Power of Attorney · 4:00 PM', a: '$120', c: '#D97706', s: 'New' },
                      ].map((j) => (
                        <div key={j.n} className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="w-[3px] h-8 rounded-full shrink-0" style={{ background: j.c }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <span className="text-[11px] font-bold text-white truncate">{j.n}</span>
                              <span className="text-[11px] font-bold" style={{ color: '#1B3A5C' }}>{j.a}</span>
                            </div>
                            <span className="text-[9px] text-white/30">{j.d}</span>
                          </div>
                        </div>
                      ))}

                      {/* Tab bar — matches actual mobile (5 tabs) */}
                      <div className="flex items-center justify-between mt-3 pt-2 px-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {[
                          { icon: 'home', label: 'Home', active: true },
                          { icon: 'work', label: 'Jobs', active: false },
                          { icon: 'route', label: 'Mileage', active: false },
                          { icon: 'receipt_long', label: 'Invoices', active: false },
                          { icon: 'settings', label: 'Settings', active: false },
                        ].map(tab => (
                          <div key={tab.label} className="flex flex-col items-center gap-0.5" style={{ opacity: tab.active ? 1 : 0.25 }}>
                            <Icon name={tab.icon} size={16} style={{ color: tab.active ? 'var(--accent)' : 'white' }} />
                            <span className="text-[7px] font-semibold" style={{ color: tab.active ? 'var(--accent)' : 'white' }}>{tab.label}</span>
                            {tab.active && <div className="w-5 h-[2px] rounded-full" style={{ background: 'var(--accent)' }} />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Android nav bar */}
                    <div className="flex justify-center pb-1.5"><div className="w-[60px] h-[3px] rounded-full bg-white/10" /></div>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 delay-1000 ${vis ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-[11px] font-bold whitespace-nowrap" style={{ background: 'var(--primary)', color: 'white' }}>
                  <Icon name="auto_awesome" size={14} style={{ color: 'var(--accent)' }} />
                  AI-Powered
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] -z-10 opacity-10 blur-3xl rounded-full" style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />
            </div>
          </div>

          {/* ── Stats strip ──────────────────────────────────── */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-500 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {[
              { v: '<10s', l: 'AI job creation', icon: 'bolt' },
              { v: '$1,600+', l: 'Avg. annual tax savings', icon: 'savings' },
              { v: '1 tap', l: 'Payment reminders', icon: 'payments' },
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
