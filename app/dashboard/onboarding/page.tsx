'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { useUpdateProfile } from '@/hooks/use-profile'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { IconSelect } from '@/components/forms/IconSelect'
import { PhoneInput } from '@/components/forms/PhoneInput'
import { ONBOARDING_FEATURES, type OnboardingFeature } from '@/lib/content/onboarding'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY',
]

const STEPS = ['Welcome', 'Profile', 'Business', 'Explore']

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all"
            style={{
              background: i <= current ? 'var(--primary)' : 'var(--surface)',
              color: i <= current ? '#fff' : 'var(--text-tertiary)',
              border: i <= current ? 'none' : '1px solid var(--border)',
            }}>
            {i < current ? <Icon name="check" size={14} style={{ color: 'inherit' }} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className="w-8 h-0.5 rounded" style={{ background: i < current ? 'var(--primary)' : 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function FeatureCard({ feature, index }: { feature: OnboardingFeature; index: number }) {
  return (
    <div className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', animationDelay: `${index * 80}ms` }}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: feature.color + '12' }}>
          <Icon name={feature.icon} size={22} style={{ color: feature.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>{feature.title}</h3>
          <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
          <div className="flex flex-col gap-1.5">
            {feature.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon name="check_circle" size={13} style={{ color: feature.color, flexShrink: 0 }} />
                <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { refreshProfile } = useAuth()
  const { updateProfile, loading: saving } = useUpdateProfile()
  const [step, setStep] = useState(0)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Profile fields
  const [fullName, setFullName]       = useState('')
  const [phone, setPhone]             = useState('')
  const [state, setState]             = useState('')
  const [commission, setCommission]   = useState('')

  // Business fields
  const [bizName, setBizName]         = useState('')
  const [bizAddress, setBizAddress]   = useState('')
  const [defaultFee, setDefaultFee]   = useState('')
  const [experience, setExperience]   = useState('')

  async function handleSaveProfile() {
    if (!fullName.trim()) {
      setToast({ msg: 'Please enter your name.', type: 'error' }); return
    }
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        state: state || null,
        commission_number: commission.trim() || null,
      } as any)
      setStep(2)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to save.', type: 'error' })
    }
  }

  async function handleSaveBusiness() {
    try {
      await updateProfile({
        business_name: bizName.trim() || null,
        business_address: bizAddress.trim() || null,
        default_fee: defaultFee ? parseFloat(defaultFee) : null,
        years_experience: experience || null,
      } as any)
      await refreshProfile()
      setStep(3)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to save.', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 max-w-[1100px] mx-auto">
        <div className="flex items-center gap-2.5">
          <Image src="/icon-192.png" alt="NotaryDesk" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-[15px]" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </div>
        <Link href="/dashboard" className="text-[13px] font-semibold no-underline hover:underline"
          style={{ color: 'var(--text-secondary)' }}>
          Skip to dashboard →
        </Link>
      </header>

      <div className="max-w-[600px] mx-auto px-6 pb-16">

        <StepIndicator current={step} total={STEPS.length} />

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 0: Welcome                                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 0 && (
          <div className="text-center">
            <div className="rounded-2xl p-8 sm:p-12 mb-6 relative overflow-hidden"
              style={{ background: 'var(--primary)' }}>
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.04]"
                style={{ background: 'var(--accent)', transform: 'translate(30%, -40%)' }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.15)' }}>
                  <Icon name="rocket_launch" size={32} style={{ color: 'var(--accent)' }} />
                </div>
                <h1 className="text-[28px] sm:text-[36px] font-extrabold text-white leading-tight mb-3">
                  Welcome to NotaryDesk
                </h1>
                <p className="text-[15px] leading-relaxed max-w-[420px] mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Let's set up your profile so your invoices, journal entries, and documents look professional from day one.
                </p>
              </div>
            </div>
            <Button variant="gold" size="lg" onClick={() => setStep(1)}>
              <Icon name="arrow_forward" size={16} style={{ color: 'inherit' }} /> Get started
            </Button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 1: Profile                                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-[22px] font-bold" style={{ color: 'var(--text)' }}>Your notary profile</h2>
              <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>This info appears on your invoices and journal entries.</p>
            </div>

            <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <FormField label="Full name" required>
                <IconInput placeholder="Your full legal name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </FormField>
              <FormField label="Phone">
                <PhoneInput value={phone} onChange={setPhone} />
              </FormField>
              <FormField label="Commission state" required>
                <IconSelect value={state} onChange={e => setState(e.target.value)} placeholder="Select your state"
                  options={US_STATES.map(s => ({ value: s, label: s }))} />
              </FormField>
              <FormField label="Commission number">
                <IconInput placeholder="Your notary commission #" value={commission} onChange={e => setCommission(e.target.value)} />
              </FormField>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button variant="gold" fullWidth size="lg" onClick={handleSaveProfile} loading={saving}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 2: Business                                       */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-[22px] font-bold" style={{ color: 'var(--text)' }}>Business details</h2>
              <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>Optional — you can update these anytime in Settings.</p>
            </div>

            <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <FormField label="Business name">
                <IconInput placeholder="Your business or DBA name" value={bizName} onChange={e => setBizName(e.target.value)} />
              </FormField>
              <FormField label="Business address">
                <IconInput placeholder="Street, City, State ZIP" value={bizAddress} onChange={e => setBizAddress(e.target.value)} />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormField label="Default signing fee">
                  <IconInput type="number" step="0.01" placeholder="150.00" value={defaultFee} onChange={e => setDefaultFee(e.target.value)} />
                </FormField>
                <FormField label="Years of experience">
                  <IconSelect value={experience} onChange={e => setExperience(e.target.value)} placeholder="Select"
                    options={[
                      { value: 'less_than_1', label: 'Less than 1 year' },
                      { value: '1_3', label: '1-3 years' },
                      { value: '3_5', label: '3-5 years' },
                      { value: '5_10', label: '5-10 years' },
                      { value: '10_plus', label: '10+ years' },
                    ]} />
                </FormField>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button variant="gold" fullWidth size="lg" onClick={handleSaveBusiness} loading={saving}>
                Continue
              </Button>
              <Button variant="ghost" onClick={() => { setStep(3); refreshProfile() }}>Skip</Button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 3: Explore features                               */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'var(--success-bg)' }}>
                <Icon name="check_circle" size={28} style={{ color: 'var(--success)' }} />
              </div>
              <h2 className="text-[22px] font-bold" style={{ color: 'var(--text)' }}>You're all set!</h2>
              <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                Here's what you can do with NotaryDesk.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {ONBOARDING_FEATURES.map((f, i) => (
                <FeatureCard key={f.title} feature={f} index={i} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button variant="gold" size="lg" onClick={() => router.push('/dashboard')}>
                <Icon name="dashboard" size={18} style={{ color: 'inherit' }} /> Go to your dashboard
              </Button>
              <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                You can always update your profile in Settings
              </p>
            </div>
          </div>
        )}

      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}
