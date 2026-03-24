'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateJob } from '@/hooks/use-jobs'
import { JOB_TYPES, DOC_TYPES } from '@/lib/constants'

import { Button, FormInput, FormSelect, FormCard, FormRow, FormTextarea, PillSelector, Counter, Toast } from '@/components/ui'
import { PageHeader } from '@/components/shared'

export default function NewJobPage() {
  const router = useRouter()
  const { create, loading } = useCreateJob()

  const [jobType, setJobType] = useState('loan_signing')
  const [signerName, setSignerName] = useState('')
  const [signerAddr, setSignerAddr] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [docType, setDocType] = useState('')
  const [acts, setActs] = useState(1)
  const [fee, setFee] = useState('')
  const [travelFee, setTravelFee] = useState('')
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const parsedFee = parseFloat(fee) || 0
  const parsedTravel = parseFloat(travelFee) || 0
  const total = parsedFee + parsedTravel

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!signerName.trim() && !clientName.trim()) { setError('Signer or client name required'); return }
    if (parsedFee <= 0) { setError('Fee must be greater than 0'); return }
    setError('')
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
        scheduled_date: schedDate || undefined,
        scheduled_time: schedTime || undefined,
        notes: notes.trim() || undefined,
        source: 'web',
      })
      router.push('/dashboard/jobs')
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to create job', type: 'error' })
    }
  }

  return (
    <div className="max-w-[720px]">
      <PageHeader title="New signing job" subtitle="Create a job to track your signing workflow"
        action={<Button variant="outline" href="/dashboard/jobs">← Back</Button>} />

      {error && <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg text-[13px] mb-5">{error}</div>}

      <form onSubmit={handleSubmit}>
        <FormCard title="Job type">
          <PillSelector options={JOB_TYPES} value={jobType} onChange={setJobType} />
        </FormCard>

        <FormCard title="Signer information">
          <FormInput label="Signer name *" value={signerName} onChange={e => setSignerName(e.target.value)} placeholder="Person being notarized" required />
          <FormInput label="Signing address" value={signerAddr} onChange={e => setSignerAddr(e.target.value)} placeholder="Where the signing will take place" />
        </FormCard>

        <FormCard title="Client / company">
          <FormInput label="Client name" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Title co, signing service, or direct client" />
          <FormRow>
            <FormInput label="Email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" />
            <FormInput label="Phone" type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="(555) 123-4567" />
          </FormRow>
        </FormCard>

        <FormCard title="Signing details">
          <FormSelect label="Document type" value={docType} onChange={e => setDocType(e.target.value)}
            options={DOC_TYPES.map(d => ({ value: d, label: d }))} />
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">Number of notarial acts</label>
            <Counter value={acts} onChange={setActs} unit="acts" />
            <p className="text-xs text-slate-400 mt-1.5">Each notarized document = 1 act. Track this for IRS deductions.</p>
          </div>
        </FormCard>

        <FormCard title="Fee">
          <FormRow>
            <FormInput label="Signing fee *" type="number" step="0.01" value={fee} onChange={e => setFee(e.target.value)} placeholder="0.00" required />
            <FormInput label="Travel fee" type="number" step="0.01" value={travelFee} onChange={e => setTravelFee(e.target.value)} placeholder="0.00" />
          </FormRow>
          {total > 0 && (
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-[10px] mt-2">
              <span className="font-semibold text-slate-500 text-sm">Total</span>
              <span className="font-extrabold text-xl text-navy">${total.toFixed(2)}</span>
            </div>
          )}
        </FormCard>

        <FormCard title="Schedule (optional)">
          <FormRow>
            <FormInput label="Date" type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} />
            <FormInput label="Time" type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} />
          </FormRow>
          {schedDate && <p className="text-xs text-emerald-600 mt-1">✓ An appointment will be auto-created</p>}
        </FormCard>

        <FormCard title="Notes">
          <FormTextarea label="Notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Confirmation #, special instructions..." />
        </FormCard>

        <div className="flex gap-3 mt-2">
          <Button type="submit" variant="gold" fullWidth loading={loading} size="lg">+ Create signing job</Button>
          <Button variant="outline" href="/dashboard/jobs" size="lg">Cancel</Button>
        </div>
      </form>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}