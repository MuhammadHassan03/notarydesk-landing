import type { IconName } from '@/components/ui/icons'

export const DOCUMENT_TYPES = [
  'Loan Documents',
  'Deed of Trust',
  'Power of Attorney',
  'Grant Deed',
  'Affidavit',
  'Living Trust',
  'Will / Testament',
  'Healthcare Directive',
  'Jurat',
  'Acknowledgment',
  'Other',
]

export const ID_TYPES = [
  "Driver's License",
  'State ID',
  'US Passport',
  'Foreign Passport',
  'Military ID',
  'Personally Known',
  'Credible Witness',
  'Other',
]

/** Icons for document types (used in list + detail) */
export const DOC_ICON_MAP: Record<string, { icon: IconName; color: string }> = {
  'Loan Documents':       { icon: 'home',        color: '#1B3A5C' },
  'Deed of Trust':        { icon: 'home',        color: '#2563EB' },
  'Power of Attorney':    { icon: 'gavel',       color: '#7C3AED' },
  'Grant Deed':           { icon: 'description', color: '#0891B2' },
  'Affidavit':            { icon: 'description', color: '#DC2626' },
  'Living Trust':         { icon: 'shield',      color: '#0D9488' },
  'Will / Testament':     { icon: 'gavel',       color: '#4338CA' },
  'Healthcare Directive': { icon: 'shield',      color: '#16A34A' },
  'Jurat':                { icon: 'verified',    color: '#D97706' },
  'Acknowledgment':       { icon: 'verified',    color: '#EA580C' },
  'Other':                { icon: 'description', color: '#64748B' },
}

export function getDocStyle(docType: string | null | undefined) {
  return DOC_ICON_MAP[docType || ''] || DOC_ICON_MAP['Other']
}