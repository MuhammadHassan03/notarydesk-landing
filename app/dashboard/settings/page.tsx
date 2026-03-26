'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth, useProfile } from '@/context/auth'
import { useUpdateProfile } from '@/hooks/use-profile'
import { api, auth } from '@/lib/api'
import { initials } from '@/lib/utils'
import { Icon, type IconName } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { IconSelect } from '@/components/forms/IconSelect'
import { PhoneInput } from '@/components/forms/PhoneInput'

// ── Tab config ────────────────────────────────────────────────────────────

type TabId = 'profile' | 'business' | 'compliance' | 'account' | 'legal' | 'danger'

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'profile',    label: 'Profile',     icon: 'person' },
  { id: 'business',   label: 'Business',    icon: 'work' },
  { id: 'compliance', label: 'Compliance',  icon: 'verified_user' },
  { id: 'account',    label: 'Account',     icon: 'settings' },
  { id: 'legal',      label: 'Legal',       icon: 'gavel' },
  { id: 'danger',     label: 'Danger Zone', icon: 'error' },
]

// ── Compliance helpers ─────────────────────────────────────────────────────

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return Math.ceil((d.getTime() - Date.now()) / 86400000)
}

function expiryStatus(days: number | null): { color: string; bg: string; label: string } {
  if (days === null) return { color: 'var(--text-tertiary)', bg: 'var(--surface)', label: 'Not set' }
  if (days < 0)   return { color: 'var(--danger)',  bg: 'var(--danger-bg)',  label: 'Expired' }
  if (days <= 30) return { color: 'var(--danger)',  bg: 'var(--danger-bg)',  label: `${days}d left` }
  if (days <= 90) return { color: 'var(--warning)', bg: 'var(--warning-bg)', label: `${days}d left` }
  return { color: 'var(--success)', bg: 'var(--success-bg)', label: `${days}d left` }
}

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','District of Columbia',
]

// ── Settings row (specific to this page) ──────────────────────────────────

function SettingsRow({ icon, iconBg, iconColor, label, description, value, onClick }: {
  icon: IconName; iconBg?: string; iconColor?: string
  label: string; description?: string; value?: string; onClick?: () => void
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick}
      className={`flex items-center gap-3 py-3.5 w-full text-left bg-transparent border-none ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      style={{ borderBottom: '1px solid var(--divider)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg || 'var(--primary-light)' }}>
        <Icon name={icon} size={17} style={{ color: iconColor || 'var(--primary)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{label}</div>
        {description && <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{description}</div>}
      </div>
      {value && <span className="text-[13px] font-medium shrink-0" style={{ color: 'var(--text-secondary)' }}>{value}</span>}
      {onClick && <Icon name="chevron_right" size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
    </Tag>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function SettingsPage() {
  const { plan, signOut, refreshProfile } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { updateProfile, loading: saving } = useUpdateProfile()

  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Profile fields
  const [fullName, setFullName] = useState(''); const [phone, setPhone] = useState('')
  const [commission, setCommission] = useState(''); const [state, setState] = useState('')
  const [yearsExp, setYearsExp] = useState(''); const [dirty, setDirty] = useState(false)

  // Booking username
  const [username, setUsername] = useState(''); const [usernameSaving, setUsernameSaving] = useState(false)
  const [usernameError, setUsernameError] = useState('')

  // Business fields
  const [bizName, setBizName] = useState(''); const [bizAddr, setBizAddr] = useState('')
  const [defaultFee, setDefaultFee] = useState(''); const [bizDirty, setBizDirty] = useState(false)

  // Compliance expiry dates
  const [eoExpiry, setEoExpiry]       = useState('')
  const [nnaCert, setNnaCert]         = useState('')
  const [bgCheck, setBgCheck]         = useState('')
  const [commExpiry, setCommExpiry]   = useState('')
  const [compDirty, setCompDirty]     = useState(false)

  // Logo upload
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setToast({ msg: 'Image must be under 2 MB.', type: 'error' }); return }
    setAvatarUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      await api.post('/auth/upload-avatar', form)
      await refreshProfile()
      setToast({ msg: 'Avatar updated!', type: 'success' })
    } catch (err: any) {
      setToast({ msg: err.message || 'Upload failed.', type: 'error' })
    }
    setAvatarUploading(false)
    e.target.value = ''
  }, [refreshProfile])

  // Password
  const [newPw, setNewPw] = useState(''); const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  // Danger
  const [showLogout, setShowLogout] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load profile → form
  useEffect(() => {
    if (!profile) return
    setFullName(profile.full_name || ''); setPhone(profile.phone || '')
    setCommission(profile.commission_number || ''); setState(profile.state || '')
    setYearsExp(profile.years_experience || '')
    setBizName(profile.business_name || ''); setBizAddr(profile.business_address || '')
    setDefaultFee(profile.default_fee ? String(profile.default_fee) : '')
    setUsername(profile.username || '')
    setEoExpiry(profile.eo_expiry_date || '')
    setNnaCert(profile.nna_cert_expiry || '')
    setBgCheck(profile.background_check_expiry || '')
    setCommExpiry(profile.commission_expiry || '')
  }, [profile])

  const mark = <T,>(fn: (v: T) => void, biz = false) => (v: T) => { fn(v); biz ? setBizDirty(true) : setDirty(true) }

  const saveProfile = useCallback(async () => {
    try {
      await updateProfile({ full_name: fullName.trim(), phone: phone.trim() || null, commission_number: commission.trim() || null, state: state.trim() || null, years_experience: yearsExp.trim() || null } as any)
      setDirty(false); await refreshProfile(); setToast({ msg: 'Profile updated!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [fullName, phone, commission, state, yearsExp, updateProfile, refreshProfile])

  const saveUsername = useCallback(async () => {
    const slug = username.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    if (slug.length < 3) { setUsernameError('Must be at least 3 characters.'); return }
    setUsernameError(''); setUsernameSaving(true)
    try {
      await api.post('/booking/claim-username', { username: slug })
      setUsername(slug); await refreshProfile()
      setToast({ msg: 'Booking link saved!', type: 'success' })
    } catch (e: any) { setUsernameError(e.message || 'Failed.') }
    setUsernameSaving(false)
  }, [username, refreshProfile])

  const saveBiz = useCallback(async () => {
    try {
      await updateProfile({ business_name: bizName.trim() || null, business_address: bizAddr.trim() || null, default_fee: defaultFee ? parseFloat(defaultFee) : null } as any)
      setBizDirty(false); await refreshProfile(); setToast({ msg: 'Business settings saved!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [bizName, bizAddr, defaultFee, updateProfile, refreshProfile])

  const saveCompliance = useCallback(async () => {
    try {
      await updateProfile({
        eo_expiry_date: eoExpiry || null,
        nna_cert_expiry: nnaCert || null,
        background_check_expiry: bgCheck || null,
        commission_expiry: commExpiry || null,
      } as any)
      setCompDirty(false); await refreshProfile()
      setToast({ msg: 'Compliance dates saved!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [eoExpiry, nnaCert, bgCheck, commExpiry, updateProfile, refreshProfile])

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setToast({ msg: 'Image must be under 2 MB.', type: 'error' }); return }
    setLogoUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      await api.post('/auth/upload-logo', form)
      await refreshProfile()
      setToast({ msg: 'Logo uploaded!', type: 'success' })
    } catch (err: any) {
      setToast({ msg: err.message || 'Upload failed.', type: 'error' })
    }
    setLogoUploading(false)
    e.target.value = ''
  }, [refreshProfile])

  const changePw = useCallback(async () => {
    if (newPw.length < 8) { setToast({ msg: 'Min 8 characters.', type: 'error' }); return }
    if (newPw !== confirmPw) { setToast({ msg: 'Passwords don\'t match.', type: 'error' }); return }
    setPwLoading(true)
    try {
      await api.post('/auth/reset-password', { new_password: newPw, access_token: '' })
      setNewPw(''); setConfirmPw(''); setToast({ msg: 'Password changed!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message || 'Failed.', type: 'error' }) }
    setPwLoading(false)
  }, [newPw, confirmPw])

  const deleteAccount = useCallback(async () => {
    setDeleting(true)
    try { await api.delete('/auth/me'); signOut() }
    catch (e: any) { setToast({ msg: e.message, type: 'error' }); setDeleting(false) }
  }, [signOut])

  const planLabel = (plan || 'free').charAt(0).toUpperCase() + (plan || 'free').slice(1)

  if (profileLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold" style={{ color: 'var(--text)' }}>Settings</h1>
        <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Manage your profile and preferences</p>
      </div>

      {/* Profile banner */}
      <div className="flex items-center gap-4 rounded-2xl p-5 mb-6" style={{ background: 'var(--primary)', color: '#fff' }}>
        {/* Clickable avatar */}
        <button
          onClick={() => avatarInputRef.current?.click()}
          disabled={avatarUploading}
          className="relative w-14 h-14 rounded-2xl shrink-0 border-none cursor-pointer group"
          title="Click to change photo"
          style={{ background: 'var(--accent)' }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
            : <span className="w-full h-full flex items-center justify-center font-bold text-xl" style={{ color: 'var(--primary)' }}>{initials(profile?.full_name)}</span>
          }
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            <Icon name={avatarUploading ? 'hourglass_empty' : 'photo_camera'} size={18} style={{ color: '#fff' }} />
          </div>
        </button>
        <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp"
          className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
        <div className="flex-1 min-w-0">
          <div className="text-[17px] font-bold truncate">{profile?.full_name || 'Notary'}</div>
          <div className="text-[13px] opacity-60 truncate">{profile?.email}</div>
        </div>
        <span className="px-3 py-1 rounded-lg text-[11px] font-bold shrink-0" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--accent)' }}>{planLabel} plan</span>
      </div>

      {/* Sidebar + Content */}
      <div className="flex gap-6 max-md:flex-col">
        <nav className="w-[200px] shrink-0 max-md:w-full">
          <div className="flex flex-col gap-1 max-md:flex-row max-md:overflow-x-auto max-md:gap-2 max-md:pb-2">
            {TABS.map(tab => {
              const active = activeTab === tab.id
              const isDanger = tab.id === 'danger'
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all text-left max-md:whitespace-nowrap max-md:shrink-0"
                  style={{ background: active ? (isDanger ? 'var(--danger-bg)' : 'var(--primary-light)') : 'transparent', color: active ? (isDanger ? 'var(--danger)' : 'var(--primary)') : 'var(--text-secondary)' }}>
                  <Icon name={tab.icon} size={17} /> {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          {/* PROFILE */}
          {activeTab === 'profile' && (<>
            <FormSection title="Personal information">
              <FormField label="Full legal name">
                <IconInput value={fullName} onChange={e => mark(setFullName)(e.target.value)} placeholder="Sarah Johnson" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormField label="Phone number">
                  <PhoneInput value={phone} onChange={v => mark(setPhone)(v)} />
                </FormField>
                <FormField label="Years as a notary">
                  <IconSelect value={yearsExp} onChange={e => mark(setYearsExp)(e.target.value)}
                    options={['Less than 1','1-3','3-5','5-10','10+'].map(v => ({ value: v, label: v + ' years' }))} />
                </FormField>
              </div>
            </FormSection>
            <FormSection title="Notary commission">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormField label="Commission number" hint="Found on your notary certificate">
                  <IconInput value={commission} onChange={e => mark(setCommission)(e.target.value)} placeholder="e.g. 2345678" />
                </FormField>
                <FormField label="State of commission">
                  <IconSelect value={state} onChange={e => mark(setState)(e.target.value)}
                    options={US_STATES.map(s => ({ value: s, label: s }))} />
                </FormField>
              </div>
            </FormSection>
            {dirty && <div className="flex gap-3 mb-5">
              <Button variant="gold" onClick={saveProfile} loading={saving}><Icon name="check" size={16} style={{ color: 'inherit' }} /> Save profile</Button>
              <Button variant="outline" onClick={() => setDirty(false)}>Cancel</Button>
            </div>}

            <FormSection title="Your booking link">
              <div className="text-[12px] mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Share this link so clients can request a signing — no phone tag needed.
              </div>
              <FormField label="Your username" error={usernameError}
                hint="Lowercase letters, numbers, hyphens only">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <IconInput value={username}
                      onChange={e => { setUsername(e.target.value.toLowerCase()); setUsernameError('') }}
                      placeholder="sarah-johnson-notary" />
                  </div>
                  <Button variant="primary" size="sm" loading={usernameSaving}
                    disabled={!username.trim() || username === (profile?.username || '')}
                    onClick={saveUsername}>
                    Save
                  </Button>
                </div>
              </FormField>
              {profile?.username && (
                <div className="flex items-center justify-between gap-3 mt-2 px-4 py-3 rounded-xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>
                    notarydesk.com/book/{profile.username}
                  </span>
                  <Button variant="outline" size="sm"
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/book/${profile.username}`); setToast({ msg: 'Link copied!', type: 'success' }) }}>
                    <Icon name="content_copy" size={14} style={{ color: 'inherit' }} /> Copy
                  </Button>
                </div>
              )}
            </FormSection>
          </>)}

          {/* BUSINESS */}
          {activeTab === 'business' && (<>
            <FormSection title="Business details">
              <FormField label="Business / DBA name" hint="Leave blank to use your full name on invoices">
                <IconInput value={bizName} onChange={e => mark(setBizName, true)(e.target.value)} placeholder="Sarah Johnson Notary Services" />
              </FormField>
              <FormField label="Business address">
                <IconInput value={bizAddr} onChange={e => mark(setBizAddr, true)(e.target.value)} placeholder="123 Main St, Miami, FL 33101" />
              </FormField>
            </FormSection>
            <FormSection title="Fees & rates">
              <FormField label="Default signing fee" hint="Auto-fills when creating new jobs and invoices">
                <IconInput type="number" step="0.01" value={defaultFee} onChange={e => mark(setDefaultFee, true)(e.target.value)} placeholder="150.00" />
              </FormField>
              <SettingsRow iconBg="var(--accent-pale)" iconColor="var(--accent)" label="IRS mileage rate" description="Used for all deduction calculations" value="$0.70/mi" />
            </FormSection>
            <FormSection title="Invoice logo">
              <div className="flex items-center gap-4 py-2">
                {profile?.logo_url ? (
                  <img src={profile.logo_url} alt="Business logo"
                    className="w-20 h-20 rounded-xl object-contain"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: 4 }} />
                ) : (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
                    style={{ border: '2px dashed var(--border)', background: 'var(--surface)' }}>
                    <Icon name="image" size={28} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {profile?.logo_url ? 'Change logo' : 'Upload logo'}
                  </div>
                  <div className="text-[12px] mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Appears on invoices. PNG, JPG, or WebP — max 2 MB.
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp"
                    className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
                  <Button variant="outline" size="sm" loading={logoUploading}
                    onClick={() => logoInputRef.current?.click()}>
                    <Icon name="upload" size={15} style={{ color: 'inherit' }} />
                    {logoUploading ? 'Uploading…' : profile?.logo_url ? 'Replace' : 'Upload'}
                  </Button>
                </div>
              </div>
            </FormSection>

            <FormSection title="Compliance">
              <SettingsRow iconBg={state ? 'var(--success-bg)' : 'var(--warning-bg)'} iconColor={state ? 'var(--success)' : 'var(--warning)'}
                label={`${state || 'State'} compliance`} description={state ? 'Journal requirements for your state' : 'Set your state in Profile'} value={state ? state.slice(0, 2).toUpperCase() : '—'} />
            </FormSection>
            {bizDirty && <div className="flex gap-3 mb-5">
              <Button variant="gold" onClick={saveBiz} loading={saving}><Icon name="check" size={16} style={{ color: 'inherit' }} /> Save business</Button>
              <Button variant="outline" onClick={() => setBizDirty(false)}>Cancel</Button>
            </div>}
          </>)}

          {/* COMPLIANCE */}
          {activeTab === 'compliance' && (<>
            <div className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
              style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)30' }}>
              <Icon name="info" size={15} style={{ color: 'var(--primary)', marginTop: 2 }} />
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--primary)' }}>
                NotaryDesk tracks your certification and insurance expiry dates and warns you 90 days before renewal.
                <strong> Green = valid, Yellow = expires in 90 days, Red = expires in 30 days or expired.</strong>
              </p>
            </div>

            {/* Status summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'E&O Insurance', days: daysUntil(eoExpiry || null) },
                { label: 'NNA Cert', days: daysUntil(nnaCert || null) },
                { label: 'Background Check', days: daysUntil(bgCheck || null) },
                { label: 'Commission', days: daysUntil(commExpiry || null) },
              ].map(item => {
                const s = expiryStatus(item.days)
                return (
                  <div key={item.label} className="rounded-xl p-3 text-center"
                    style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
                    <div className="text-[13px] font-bold mb-0.5" style={{ color: s.color }}>{s.label}</div>
                    <div className="text-[11px] font-medium" style={{ color: s.color }}>{item.label}</div>
                  </div>
                )
              })}
            </div>

            <FormSection title="E&O Insurance">
              <FormField label="Expiry date" hint="Errors & Omissions insurance renewal date">
                <IconInput type="date" value={eoExpiry} onChange={e => { setEoExpiry(e.target.value); setCompDirty(true) }} />
              </FormField>
            </FormSection>

            <FormSection title="NNA Certification">
              <FormField label="NNA cert expiry" hint="National Notary Association certification">
                <IconInput type="date" value={nnaCert} onChange={e => { setNnaCert(e.target.value); setCompDirty(true) }} />
              </FormField>
            </FormSection>

            <FormSection title="Background Check">
              <FormField label="Background check expiry" hint="Most signing services require annual renewal">
                <IconInput type="date" value={bgCheck} onChange={e => { setBgCheck(e.target.value); setCompDirty(true) }} />
              </FormField>
            </FormSection>

            <FormSection title="Notary Commission">
              <FormField label="Commission expiry" hint="Your state notary commission end date">
                <IconInput type="date" value={commExpiry} onChange={e => { setCommExpiry(e.target.value); setCompDirty(true) }} />
              </FormField>
            </FormSection>

            {compDirty && (
              <div className="flex gap-3 mb-5">
                <Button variant="gold" onClick={saveCompliance} loading={saving}>
                  <Icon name="check" size={16} style={{ color: 'inherit' }} /> Save compliance dates
                </Button>
                <Button variant="outline" onClick={() => setCompDirty(false)}>Cancel</Button>
              </div>
            )}
          </>)}

          {/* ACCOUNT */}
          {activeTab === 'account' && (<>
            <FormSection title="Account details">
              <SettingsRow label="Email" value={profile?.email || '—'} />
              <SettingsRow iconBg="var(--accent-pale)" iconColor="var(--accent)" label="Current plan" description="Manage your subscription" value={planLabel} />
              {(plan === 'free' || !plan) && (
                <div className="pt-3 pb-1">
                  <Button variant="gold" fullWidth href="/dashboard/upgrade">
                    <Icon name="rocket_launch" size={16} style={{ color: 'inherit' }} /> Upgrade to Pro — $9.99/mo
                  </Button>
                </div>
              )}
            </FormSection>
            <FormSection title="Change password">
              <FormField label="New password">
                <IconInput type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
              </FormField>
              <FormField label="Confirm password">
                <IconInput type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter" />
              </FormField>
              {newPw && confirmPw && newPw === confirmPw && (
                <div className="flex items-center gap-1.5 mb-3 text-[12px] font-medium" style={{ color: 'var(--success)' }}>
                  <Icon name="check_circle" size={14} /> Passwords match
                </div>
              )}
              <Button variant="primary" onClick={changePw} loading={pwLoading} disabled={!newPw || newPw.length < 8 || newPw !== confirmPw}>
                <Icon name="lock" size={16} style={{ color: 'inherit' }} /> Update password
              </Button>
            </FormSection>
          </>)}

          {/* LEGAL */}
          {activeTab === 'legal' && (<>
            <FormSection title="Legal documents">
              <SettingsRow label="Privacy Policy" description="How we collect, use, and protect your data" onClick={() => window.open('/privacy', '_blank')} />
              <SettingsRow label="Terms of Service" description="Rules and conditions" onClick={() => window.open('/terms', '_blank')} />
              <SettingsRow label="Contact Support" description="engineermirzahassan@gmail.com" onClick={() => window.open('mailto:engineermirzahassan@gmail.com')} />
            </FormSection>
            <FormSection title="App information">
              <SettingsRow label="Version" value="1.0.0" />
              <SettingsRow label="Platform" value="Web Dashboard" />
            </FormSection>
          </>)}

          {/* DANGER */}
          {activeTab === 'danger' && (
            <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Icon name="error" size={18} style={{ color: 'var(--danger)' }} />
                <span className="text-[13px] font-bold" style={{ color: 'var(--danger)' }}>These actions are irreversible</span>
              </div>
              {/* Sign out */}
              <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(220,38,38,0.15)' }}>
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Sign out</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>You'll need to sign in again</div>
                </div>
                {!showLogout
                  ? <Button variant="outline" size="sm" onClick={() => setShowLogout(true)}><Icon name="logout" size={15} style={{ color: 'inherit' }} /> Sign out</Button>
                  : <div className="flex items-center gap-2">
                      <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>Sure?</span>
                      <Button variant="danger" size="sm" onClick={signOut}>Yes</Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowLogout(false)}>No</Button>
                    </div>
                }
              </div>
              {/* Delete */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: 'var(--danger)' }}>Delete account</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Permanently remove all data</div>
                </div>
                {!showDelete
                  ? <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><Icon name="error" size={15} style={{ color: 'inherit' }} /> Delete</Button>
                  : <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium" style={{ color: 'var(--danger)' }}>Cannot undo!</span>
                      <Button variant="danger" size="sm" onClick={deleteAccount} loading={deleting}>Yes, delete</Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>No</Button>
                    </div>
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}