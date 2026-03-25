'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateClient } from '@/hooks/use-clients'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'

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
      <PageHeader title="New client" subtitle="Add a client to your directory"
        action={<Button variant="outline" href="/dashboard/clients"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to clients</Button>} />

      <form onSubmit={handleSubmit}>
        <FormSection title="Client information" icon="person">
          <FormField label="Client / company name" icon="person" required error={errors.name}>
            <IconInput icon="person" placeholder="Title company, law firm, or individual"
              value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }} />
          </FormField>
          <FormField label="Company" icon="work">
            <IconInput icon="work" placeholder="Company or organization" value={company} onChange={e => setCompany(e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Contact details" icon="mail">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Email" icon="mail">
              <IconInput icon="mail" type="email" placeholder="client@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Phone" icon="phone_iphone">
              <IconInput icon="phone_iphone" type="tel" placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Notes" icon="edit_note">
          <textarea rows={3} placeholder="Special instructions, preferences, gate codes..." value={notes} onChange={e => setNotes(e.target.value)} className="input-base resize-y min-h-[80px]" />
        </FormSection>

        <div className="flex gap-3 mt-2 mb-8">
          <Button type="submit" variant="gold" fullWidth loading={loading} size="lg" disabled={!isValid && !loading}>
            <Icon name="person_add" size={18} style={{ color: 'inherit' }} /> Add client
          </Button>
          <Button variant="outline" href="/dashboard/clients" size="lg">Cancel</Button>
        </div>
      </form>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}
