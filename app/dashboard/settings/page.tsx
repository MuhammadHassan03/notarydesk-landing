'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/authcontext'
import { useUpdateProfile } from '@/hooks/use-profile'
import { initials } from '@/lib/formatters'

import { Button, FormInput, FormCard, FormRow, Toast } from '@/components/ui'
import { PageHeader, Card } from '@/components/shared'
import { SettingsRow } from '@/components/shared'

export default function SettingsPage() {
  const { profile, signOut } = useAuth()
  const { updateProfile, loading } = useUpdateProfile()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [commission, setCommission] = useState('')
  const [state, setState] = useState('')
  const [bizName, setBizName] = useState('')
  const [bizAddr, setBizAddr] = useState('')
  const [defaultFee, setDefaultFee] = useState('')
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!profile) return
    setFullName(profile.full_name || '')
    setPhone(profile.phone || '')
    setCommission(profile.commission_number || '')
    setState(profile.state || '')
    setBizName(profile.business_name || '')
    setBizAddr(profile.business_address || '')
    setDefaultFee(profile.default_fee ? String(profile.default_fee) : '')
  }, [profile])

  const set = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setDirty(true) }

  const handleSave = useCallback(async () => {
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        commission_number: commission.trim() || null,
        state: state.trim() || null,
        business_name: bizName.trim() || null,
        business_address: bizAddr.trim() || null,
        default_fee: defaultFee ? parseFloat(defaultFee) : null,
      } as any)
      setDirty(false)
      setToast({ msg: 'Profile updated!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [fullName, phone, commission, state, bizName, bizAddr, defaultFee, updateProfile])

  const planLabel = (profile?.plan || 'free').charAt(0).toUpperCase() + (profile?.plan || 'free').slice(1)

  return (
    <div className="max-w-[720px]">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" />

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-7">
        <div className="w-20 h-20 rounded-2xl bg-gold text-navy font-extrabold text-3xl flex items-center justify-center">
          {initials(profile?.full_name)}
        </div>
        <div>
          <div className="text-[22px] font-extrabold text-slate-900">{profile?.full_name || 'Notary'}</div>
          <div className="text-sm text-slate-500 mt-0.5">{profile?.email}</div>
          <span className="inline-block mt-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold"
            style={{
              background: profile?.plan === 'free' ? '#F1F5F9' : '#FFFBEB',
              color: profile?.plan === 'free' ? '#64748B' : '#D97706',
            }}>
            {planLabel} PLAN
          </span>
        </div>
      </div>

      {/* Edit profile */}
      <FormCard title="Profile information">
        <FormRow>
          <FormInput label="Full name" value={fullName} onChange={e => set(setFullName)(e.target.value)} />
          <FormInput label="Phone" value={phone} onChange={e => set(setPhone)(e.target.value)} placeholder="(555) 123-4567" />
        </FormRow>
        <FormRow>
          <FormInput label="Commission number" value={commission} onChange={e => set(setCommission)(e.target.value)} />
          <FormInput label="State" value={state} onChange={e => set(setState)(e.target.value)} placeholder="e.g. California" />
        </FormRow>
        <FormRow>
          <FormInput label="Business name" value={bizName} onChange={e => set(setBizName)(e.target.value)} placeholder="Your notary business" />
          <FormInput label="Default signing fee" type="number" value={defaultFee} onChange={e => set(setDefaultFee)(e.target.value)} placeholder="150.00" />
        </FormRow>
        <FormInput label="Business address" value={bizAddr} onChange={e => set(setBizAddr)(e.target.value)} placeholder="123 Main St, City, State ZIP" />

        {dirty && (
          <div className="flex gap-3 mt-3">
            <Button variant="gold" onClick={handleSave} loading={loading}>Save changes</Button>
            <Button variant="outline" onClick={() => setDirty(false)}>Cancel</Button>
          </div>
        )}
      </FormCard>

      <Card title="Account">
        <SettingsRow label="Email" value={profile?.email || '—'} />
        <SettingsRow label="Plan" value={planLabel}
          action={profile?.plan === 'free' ? <Button variant="gold" size="sm">Upgrade</Button> : undefined} />
        <SettingsRow label="Password" description="Change your account password"
          action={<Button variant="outline" size="sm">Change</Button>} />
      </Card>

      <Card title="Danger zone">
        <SettingsRow label="Sign out" description="Sign out of this device"
          action={<Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>} />
        <SettingsRow label="Delete account" description="Permanently delete your account and all data"
          action={<Button variant="danger" size="sm">Delete account</Button>} />
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}