'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCreateClient } from '@/hooks/use-clients'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { PhoneInput } from '@/components/forms/PhoneInput'
import { FormActions } from '@/components/forms/FormActions'

export default function NewClientPage() {
  const router = useRouter()
  const { create, loading } = useCreateClient()

  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [company, setCompany] = useState('')
  const [notes, setNotes]     = useState('')
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [toast, setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const isValid = useMemo(() => name.trim().length > 0, [name])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Client name is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      await create({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      setToast({ msg: 'Client created!', type: 'success' })
      setTimeout(() => router.push('/dashboard/clients'), 600)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to create client', type: 'error' })
    }
  }

  return (
    <div className="max-w-[720px]">
      <Link href="/dashboard/clients" className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-4 no-underline transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
        <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to clients
      </Link>
      <PageHeader title="New client" subtitle="Add a client to your directory" />

      <form onSubmit={handleSubmit}>
        <FormSection title="Client information">
          <FormField label="Client / company name" required error={errors.name}>
            <IconInput placeholder="Title company, law firm, or individual"
              value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }} />
          </FormField>
          <FormField label="Company">
            <IconInput placeholder="Company or organization" value={company} onChange={e => setCompany(e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Contact details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Email">
              <IconInput type="email" placeholder="client@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Phone">
              <PhoneInput value={phone} onChange={setPhone} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Notes">
          <textarea rows={3} placeholder="Special instructions, preferences, gate codes..." value={notes} onChange={e => setNotes(e.target.value)} className="input-base resize-y min-h-[80px]" />
        </FormSection>

        <FormActions>
          <Button type="submit" variant="gold" fullWidth loading={loading} size="lg" disabled={!isValid && !loading}>
            <Icon name="person_add" size={18} style={{ color: 'inherit' }} /> Add client
          </Button>
          <Button variant="outline" href="/dashboard/clients" size="lg">Cancel</Button>
        </FormActions>
      </form>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}
