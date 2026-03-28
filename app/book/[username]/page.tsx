'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'
import { API_URL } from '@/lib/api/client'

const SERVICE_TYPES = [
  'Loan Signing', 'General Notarization', 'Apostille', 'Field Inspection',
  'Power of Attorney', 'Affidavit', 'Trust Signing', 'Other',
]

interface NotaryProfile {
  name: string
  state: string | null
  default_fee: number | null
  logo_url: string | null
  avatar_url: string | null
  years_experience: string | null
  username: string
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function BookingPage() {
  const { username } = useParams<{ username: string }>()
  const router = useRouter()
  const [notary, setNotary] = useState<NotaryProfile | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Form
  const [clientName, setClientName]   = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [service, setService]         = useState('')
  const [date, setDate]               = useState('')
  const [address, setAddress]         = useState('')
  const [notes, setNotes]             = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [chatUrl, setChatUrl]         = useState('')
  const [error, setError]             = useState('')
  const [countdown, setCountdown]     = useState(5)

  useEffect(() => {
    if (!username) return
    fetch(`${API_URL}/booking/${username}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(setNotary)
      .catch(() => setNotFound(true))
      .finally(() => setLoadingProfile(false))
  }, [username])

  // Auto-redirect to chat after submission
  useEffect(() => {
    if (!submitted || !chatUrl) return
    if (countdown <= 0) { router.push(chatUrl); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [submitted, chatUrl, countdown, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim() || !clientEmail.trim()) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch(`${API_URL}/booking/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name:    clientName.trim(),
          client_email:   clientEmail.trim(),
          client_phone:   clientPhone.trim() || null,
          service_type:   service || null,
          preferred_date: date || null,
          address:        address.trim() || null,
          notes:          notes.trim() || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.detail || 'Failed') }
      const json = await res.json()
      if (json.chat_url) setChatUrl(json.chat_url)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  // ── Loading ──
  if (loadingProfile) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1f5f9' }}>
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin"
        style={{ borderColor: '#e2e8f0', borderTopColor: '#1B3A5C' }} />
    </div>
  )

  // ── 404 ──
  if (notFound || !notary) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: '#f1f5f9' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: '#1B3A5C' }}>
        <Icon name="search_off" size={28} style={{ color: '#C9A84C' }} />
      </div>
      <h1 className="text-2xl font-extrabold" style={{ color: '#1B3A5C' }}>Notary not found</h1>
      <p className="text-sm text-center" style={{ color: '#64748b' }}>
        This booking page doesn't exist or has been removed.
      </p>
      <a href="/" className="text-sm font-semibold no-underline" style={{ color: '#1B3A5C' }}>
        ← Back to NotaryDesk
      </a>
    </div>
  )

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#f1f5f9' }}>
      <div className="max-w-[540px] mx-auto">

        {/* Notary card */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-sm"
          style={{ background: '#1B3A5C' }}>
          {notary.logo_url && (
            <div className="px-8 pt-8">
              <img src={notary.logo_url} alt="Logo" loading="lazy" width={200} height={48}
                className="h-12 object-contain" style={{ maxWidth: 200 }} />
            </div>
          )}
          <div className="flex items-center gap-4 p-8">
            <div className="w-16 h-16 rounded-2xl font-bold text-xl flex items-center justify-center shrink-0"
              style={{ background: '#C9A84C', color: '#1B3A5C' }}>
              {initials(notary.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-extrabold text-white truncate">{notary.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {notary.state && (
                  <span className="flex items-center gap-1 text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <Icon name="location_on" size={13} style={{ color: '#C9A84C' }} />
                    {notary.state}
                  </span>
                )}
                {notary.years_experience && (
                  <span className="flex items-center gap-1 text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <Icon name="verified" size={13} style={{ color: '#C9A84C' }} />
                    {notary.years_experience} years exp.
                  </span>
                )}
                {notary.default_fee && (
                  <span className="flex items-center gap-1 text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <Icon name="attach_money" size={13} style={{ color: '#C9A84C' }} />
                    From ${notary.default_fee}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="px-8 pb-6">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.15)' }}>
              <Icon name="check_circle" size={14} style={{ color: '#C9A84C' }} />
              <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Licensed notary · Powered by NotaryDesk
              </span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8 shadow-sm" style={{ background: '#fff' }}>
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: '#ECFDF5' }}>
                <Icon name="check_circle" size={32} style={{ color: '#059669' }} />
              </div>
              <h2 className="text-xl font-extrabold" style={{ color: '#0F172A' }}>Request sent!</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                {notary.name} will reach out to confirm your signing appointment.
              </p>
              {chatUrl && (
                <div className="w-full mt-2 rounded-xl p-4 flex flex-col items-center gap-3"
                  style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <div className="flex items-center gap-2">
                    <Icon name="chat" size={16} style={{ color: '#1B3A5C' }} />
                    <span className="text-[13px] font-semibold" style={{ color: '#1B3A5C' }}>
                      Opening your chat with {notary.name}…
                    </span>
                  </div>
                  <p className="text-[12px]" style={{ color: '#64748b', margin: 0 }}>
                    Redirecting in {countdown}s — save this link for future messages.
                  </p>
                  <a href={chatUrl}
                    className="w-full py-3 rounded-xl font-bold text-[14px] text-center no-underline"
                    style={{ background: '#1B3A5C', color: '#C9A84C', display: 'block' }}>
                    Open Chat Now →
                  </a>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg w-full"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Icon name="link" size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <span className="text-[11px] truncate" style={{ color: '#94a3b8' }}>{chatUrl}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-[18px] font-extrabold mb-1" style={{ color: '#0F172A' }}>
                Request a signing
              </h2>
              <p className="text-[13px] mb-6" style={{ color: '#64748b' }}>
                Fill in your details and {notary.name} will contact you to confirm.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                    Your name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input value={clientName} onChange={e => setClientName(e.target.value)} required
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#0F172A' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#0F172A' }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                      Phone
                    </label>
                    <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#0F172A' }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                      Service needed
                    </label>
                    <select value={service} onChange={e => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: service ? '#0F172A' : '#94a3b8' }}>
                      <option value="">Select service</option>
                      {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                      Preferred date
                    </label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#0F172A' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                    Signing address
                  </label>
                  <input value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="123 Main St, City, State"
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#0F172A' }} />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#475569' }}>
                    Additional notes
                  </label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="Any special requirements or questions..."
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#0F172A' }} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium"
                    style={{ background: '#FEF2F2', color: '#DC2626' }}>
                    <Icon name="error" size={15} style={{ color: 'inherit' }} />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={submitting || !clientName.trim() || !clientEmail.trim()}
                  className="w-full py-4 rounded-xl font-bold text-[15px] cursor-pointer border-none transition-all"
                  style={{ background: '#1B3A5C', color: '#C9A84C', opacity: (submitting || !clientName.trim() || !clientEmail.trim()) ? 0.6 : 1 }}>
                  {submitting ? 'Sending…' : 'Send signing request'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a href="/" className="text-[12px] no-underline flex items-center justify-center gap-1"
            style={{ color: '#94a3b8' }}>
            <Icon name="verified" size={12} style={{ color: '#1B3A5C' }} />
            Powered by <span className="font-semibold ml-0.5" style={{ color: '#1B3A5C' }}>NotaryDesk</span>
          </a>
        </div>
      </div>
    </div>
  )
}
