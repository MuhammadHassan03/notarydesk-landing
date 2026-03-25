'use client'

import { useState, useEffect, useCallback } from 'react'
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

// ── Tab config ────────────────────────────────────────────────────────────

type TabId = 'profile' | 'business' | 'account' | 'legal' | 'danger'

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'profile',  label: 'Profile',     icon: 'person' },
  { id: 'business', label: 'Business',    icon: 'work' },
  { id: 'account',  label: 'Account',     icon: 'settings' },
  { id: 'legal',    label: 'Legal',       icon: 'gavel' },
  { id: 'danger',   label: 'Danger Zone', icon: 'error' },
]

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

  // Business fields
  const [bizName, setBizName] = useState(''); const [bizAddr, setBizAddr] = useState('')
  const [defaultFee, setDefaultFee] = useState(''); const [bizDirty, setBizDirty] = useState(false)

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
  }, [profile])

  const mark = <T,>(fn: (v: T) => void, biz = false) => (v: T) => { fn(v); biz ? setBizDirty(true) : setDirty(true) }

  const saveProfile = useCallback(async () => {
    try {
      await updateProfile({ full_name: fullName.trim(), phone: phone.trim() || null, commission_number: commission.trim() || null, state: state.trim() || null, years_experience: yearsExp.trim() || null } as any)
      setDirty(false); await refreshProfile(); setToast({ msg: 'Profile updated!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [fullName, phone, commission, state, yearsExp, updateProfile, refreshProfile])

  const saveBiz = useCallback(async () => {
    try {
      await updateProfile({ business_name: bizName.trim() || null, business_address: bizAddr.trim() || null, default_fee: defaultFee ? parseFloat(defaultFee) : null } as any)
      setBizDirty(false); await refreshProfile(); setToast({ msg: 'Business settings saved!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [bizName, bizAddr, defaultFee, updateProfile, refreshProfile])

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
        <div className="w-14 h-14 rounded-2xl font-bold text-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
          {initials(profile?.full_name)}
        </div>
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
            <FormSection title="Personal information" icon="person">
              <FormField label="Full legal name" icon="person">
                <IconInput icon="person" value={fullName} onChange={e => mark(setFullName)(e.target.value)} placeholder="Sarah Johnson" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormField label="Phone number" icon="phone_iphone">
                  <IconInput icon="phone_iphone" type="tel" value={phone} onChange={e => mark(setPhone)(e.target.value)} placeholder="(555) 123-4567" />
                </FormField>
                <FormField label="Years as a notary" icon="schedule">
                  <IconSelect icon="schedule" value={yearsExp} onChange={e => mark(setYearsExp)(e.target.value)}
                    options={['Less than 1','1-3','3-5','5-10','10+'].map(v => ({ value: v, label: v + ' years' }))} />
                </FormField>
              </div>
            </FormSection>
            <FormSection title="Notary commission" icon="verified">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormField label="Commission number" icon="verified" hint="Found on your notary certificate">
                  <IconInput icon="verified" value={commission} onChange={e => mark(setCommission)(e.target.value)} placeholder="e.g. 2345678" />
                </FormField>
                <FormField label="State of commission" icon="location_on">
                  <IconSelect icon="location_on" value={state} onChange={e => mark(setState)(e.target.value)}
                    options={US_STATES.map(s => ({ value: s, label: s }))} />
                </FormField>
              </div>
            </FormSection>
            {dirty && <div className="flex gap-3 mb-5">
              <Button variant="gold" onClick={saveProfile} loading={saving}><Icon name="check" size={16} style={{ color: 'inherit' }} /> Save profile</Button>
              <Button variant="outline" onClick={() => setDirty(false)}>Cancel</Button>
            </div>}
          </>)}

          {/* BUSINESS */}
          {activeTab === 'business' && (<>
            <FormSection title="Business details" icon="work">
              <FormField label="Business / DBA name" icon="work" hint="Leave blank to use your full name on invoices">
                <IconInput icon="work" value={bizName} onChange={e => mark(setBizName, true)(e.target.value)} placeholder="Sarah Johnson Notary Services" />
              </FormField>
              <FormField label="Business address" icon="location_on">
                <IconInput icon="location_on" value={bizAddr} onChange={e => mark(setBizAddr, true)(e.target.value)} placeholder="123 Main St, Miami, FL 33101" />
              </FormField>
            </FormSection>
            <FormSection title="Fees & rates" icon="payments">
              <FormField label="Default signing fee" icon="attach_money" hint="Auto-fills when creating new jobs and invoices">
                <IconInput icon="attach_money" type="number" step="0.01" value={defaultFee} onChange={e => mark(setDefaultFee, true)(e.target.value)} placeholder="150.00" />
              </FormField>
              <SettingsRow icon="route" iconBg="var(--accent-pale)" iconColor="var(--accent)" label="IRS mileage rate" description="Used for all deduction calculations" value="$0.70/mi" />
            </FormSection>
            <FormSection title="Compliance" icon="gavel">
              <SettingsRow icon="gavel" iconBg={state ? 'var(--success-bg)' : 'var(--warning-bg)'} iconColor={state ? 'var(--success)' : 'var(--warning)'}
                label={`${state || 'State'} compliance`} description={state ? 'Journal requirements for your state' : 'Set your state in Profile'} value={state ? state.slice(0, 2).toUpperCase() : '—'} />
            </FormSection>
            {bizDirty && <div className="flex gap-3 mb-5">
              <Button variant="gold" onClick={saveBiz} loading={saving}><Icon name="check" size={16} style={{ color: 'inherit' }} /> Save business</Button>
              <Button variant="outline" onClick={() => setBizDirty(false)}>Cancel</Button>
            </div>}
          </>)}

          {/* ACCOUNT */}
          {activeTab === 'account' && (<>
            <FormSection title="Account details" icon="person">
              <SettingsRow icon="mail" label="Email" value={profile?.email || '—'} />
              <SettingsRow icon="star" iconBg="var(--accent-pale)" iconColor="var(--accent)" label="Current plan" description="Manage your subscription" value={planLabel} />
            </FormSection>
            <FormSection title="Change password" icon="lock">
              <FormField label="New password" icon="lock">
                <IconInput icon="lock" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
              </FormField>
              <FormField label="Confirm password" icon="lock">
                <IconInput icon="lock" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter" />
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
            <FormSection title="Legal documents" icon="gavel">
              <SettingsRow icon="shield" label="Privacy Policy" description="How we collect, use, and protect your data" onClick={() => window.open('/privacy', '_blank')} />
              <SettingsRow icon="description" label="Terms of Service" description="Rules and conditions" onClick={() => window.open('/terms', '_blank')} />
              <SettingsRow icon="mail" label="Contact Support" description="engineermirzahassan@gmail.com" onClick={() => window.open('mailto:engineermirzahassan@gmail.com')} />
            </FormSection>
            <FormSection title="App information" icon="info">
              <SettingsRow icon="language" label="Version" value="1.0.0" />
              <SettingsRow icon="devices" label="Platform" value="Web Dashboard" />
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