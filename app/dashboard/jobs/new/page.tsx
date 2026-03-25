'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateJob } from '@/hooks/use-jobs'
import { JOB_TYPES, DOC_TYPES } from '@/lib/constants'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/shared'
import { FormSection } from '@/components/shared/FormSection'
import { FormField } from '@/components/shared/FormField'
import { IconInput } from '@/components/shared/IconInput'
import { IconSelect } from '@/components/shared/IconSelect'
import { Toggle } from '@/components/ui/Toggle'

const JOB_TYPE_ICONS: Record<string, string> = {
  loan_signing: 'home', general_notary: 'verified', field_inspection: 'description',
  apostille: 'language', other: 'more_horiz',
}

function ActsCounter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <button type="button" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))}
        className="w-11 h-11 flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-30"
        style={{ background: 'var(--surface)', color: 'var(--primary)' }}>
        <Icon name="remove" size={20} />
      </button>
      <div className="min-w-[60px] text-center px-2">
        <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>{value}</div>
        <div className="text-[10px] -mt-0.5" style={{ color: 'var(--text-tertiary)' }}>acts</div>
      </div>
      <button type="button" disabled={value >= 50} onClick={() => onChange(Math.min(50, value + 1))}
        className="w-11 h-11 flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-30"
        style={{ background: 'var(--surface)', color: 'var(--primary)' }}>
        <Icon name="add" size={20} />
      </button>
    </div>
  )
}

export default function NewJobPage() {
  const router = useRouter()
  const { create, loading } = useCreateJob()

  const [jobType, setJobType]         = useState('loan_signing')
  const [signerName, setSignerName]   = useState('')
  const [signerAddr, setSignerAddr]   = useState('')
  const [clientName, setClientName]   = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [docType, setDocType]         = useState('')
  const [acts, setActs]               = useState(1)
  const [fee, setFee]                 = useState('')
  const [travelFee, setTravelFee]     = useState('')
  const [hasSchedule, setHasSchedule] = useState(false)
  const [schedDate, setSchedDate]     = useState('')
  const [schedTime, setSchedTime]     = useState('')
  const [notes, setNotes]             = useState('')
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [toast, setToast]             = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const parsedFee = parseFloat(fee) || 0
  const parsedTravel = parseFloat(travelFee) || 0
  const total = parsedFee + parsedTravel

  const isValid = useMemo(() => (signerName.trim() || clientName.trim()) && parsedFee > 0, [signerName, clientName, parsedFee])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!signerName.trim() && !clientName.trim()) errs.signerName = 'Signer or client name is required'
    if (parsedFee <= 0) errs.fee = 'Fee must be greater than $0'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      await create({
        job_type: jobType as any,
        signer_name: signerName.trim() || clientName.trim(),
        signer_address: signerAddr.trim() || undefined,
        client_name: clientName.trim() || signerName.trim(),
        client_email: clientEmail.trim() || undefined,
        client_phone: clientPhone.trim() || undefined,
        document_type: docType || 'Other',
        notarial_acts_count: acts,
        fee: parsedFee,
        travel_fee: parsedTravel || undefined,
        scheduled_date: hasSchedule && schedDate ? schedDate : undefined,
        scheduled_time: hasSchedule && schedTime ? schedTime : undefined,
        notes: notes.trim() || undefined,
        source: 'web',
      })
      setToast({ msg: 'Signing job created!', type: 'success' })
      setTimeout(() => router.push('/dashboard/jobs'), 600)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to create job', type: 'error' })
    }
  }

  return (
    <div className="max-w-[720px]">
      <PageHeader title="New signing job" subtitle="Create a job to track your signing workflow"
        action={<Button variant="outline" href="/dashboard/jobs"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to jobs</Button>} />

      <form onSubmit={handleSubmit}>
        {/* Job Type */}
        <FormSection title="Job type" icon="work">
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map(jt => {
              const active = jobType === jt.value
              const ic = JOB_TYPE_ICONS[jt.value] || 'work'
              return (
                <button key={jt.value} type="button" onClick={() => setJobType(jt.value)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all"
                  style={{ background: active ? 'var(--primary)' : 'var(--surface)', color: active ? '#fff' : 'var(--text-secondary)', border: active ? 'none' : '1px solid var(--border)' }}>
                  <Icon name={ic as any} size={16} style={{ color: active ? 'var(--accent)' : 'var(--text-tertiary)' }} />
                  {jt.label}
                </button>
              )
            })}
          </div>
        </FormSection>

        {/* Signer */}
        <FormSection title="Signer information" icon="person">
          <FormField label="Signer name" icon="person" required error={errors.signerName}>
            <IconInput icon="person" placeholder="Person being notarized"
              value={signerName} onChange={e => { setSignerName(e.target.value); setErrors(p => ({ ...p, signerName: '' })) }} />
          </FormField>
          <FormField label="Signing address" icon="location_on">
            <IconInput icon="location_on" placeholder="Where the signing will take place" value={signerAddr} onChange={e => setSignerAddr(e.target.value)} />
          </FormField>
        </FormSection>

        {/* Client */}
        <FormSection title="Client / company" icon="work">
          <FormField label="Client name" icon="work">
            <IconInput icon="work" placeholder="Title co, signing service, or direct client" value={clientName} onChange={e => setClientName(e.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Email" icon="mail">
              <IconInput icon="mail" type="email" placeholder="client@example.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
            </FormField>
            <FormField label="Phone" icon="phone_iphone">
              <IconInput icon="phone_iphone" type="tel" placeholder="(555) 123-4567" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        {/* Signing Details */}
        <FormSection title="Signing details" icon="description">
          <FormField label="Document type" icon="description">
            <IconSelect icon="description" value={docType} onChange={e => setDocType(e.target.value)} placeholder="Select document type"
              options={DOC_TYPES.map(d => ({ value: d, label: d }))} />
          </FormField>
          <FormField label="Number of notarial acts" icon="edit_note" hint="Each notarized document = 1 act.">
            <ActsCounter value={acts} onChange={setActs} />
          </FormField>
        </FormSection>

        {/* Fee */}
        <FormSection title="Fee" icon="payments">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Signing fee" icon="attach_money" required error={errors.fee}>
              <IconInput icon="attach_money" type="number" step="0.01" placeholder="0.00"
                value={fee} onChange={e => { setFee(e.target.value); setErrors(p => ({ ...p, fee: '' })) }} />
            </FormField>
            <FormField label="Travel fee" icon="directions_car" hint="Optional">
              <IconInput icon="directions_car" type="number" step="0.01" placeholder="0.00" value={travelFee} onChange={e => setTravelFee(e.target.value)} />
            </FormField>
          </div>
          {total > 0 && (
            <div className="flex justify-between items-center px-4 py-3 rounded-xl mt-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <Icon name="account_balance" size={16} /> Total
              </span>
              <span className="text-xl font-extrabold" style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
          )}
        </FormSection>

        {/* Schedule */}
        <FormSection title="Schedule" icon="schedule">
          <div className="mb-4">
            <Toggle value={hasSchedule} onChange={setHasSchedule} label="Set a date & time" description="An appointment will be auto-created" />
          </div>
          {hasSchedule && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 animate-slide-up">
              <FormField label="Date" icon="calendar_month">
                <IconInput icon="calendar_month" type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} />
              </FormField>
              <FormField label="Time" icon="schedule">
                <IconInput icon="schedule" type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} />
              </FormField>
            </div>
          )}
          {hasSchedule && schedDate && (
            <div className="flex items-center gap-1.5 mt-1 text-[12px] font-medium" style={{ color: 'var(--success)' }}>
              <Icon name="check_circle" size={14} /> Appointment will be auto-created
            </div>
          )}
        </FormSection>

        {/* Notes */}
        <FormSection title="Notes" icon="edit_note">
          <textarea rows={3} placeholder="Confirmation #, special instructions, gate codes..." value={notes} onChange={e => setNotes(e.target.value)} className="input-base resize-y min-h-[80px]" />
        </FormSection>

        {/* Actions */}
        <div className="flex gap-3 mt-2 mb-8">
          <Button type="submit" variant="gold" fullWidth loading={loading} size="lg" disabled={!isValid && !loading}>
            <Icon name="add_circle" size={18} style={{ color: 'inherit' }} /> Create signing job
          </Button>
          <Button variant="outline" href="/dashboard/jobs" size="lg">Cancel</Button>
        </div>
      </form>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}