import type { IconName } from '@/components/ui/icons'

export interface ExpenseCategory {
  key: string
  label: string
  icon: IconName
  color: string
  taxLine?: string
  description: string
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { key: 'notary_supplies',    label: 'Notary Supplies',      icon: 'description',     color: '#1B3A5C', taxLine: 'Line 22 — Supplies',         description: 'Stamps, seal, embosser, journal books' },
  { key: 'eo_insurance',       label: 'E&O Insurance',        icon: 'shield',          color: '#7C3AED', taxLine: 'Line 15 — Insurance',         description: 'Errors & Omissions insurance premium' },
  { key: 'bond_renewal',       label: 'Bond Renewal',         icon: 'verified',        color: '#0891B2', taxLine: 'Line 27a — Other expenses',   description: 'Notary bond renewal fee' },
  { key: 'commission_renewal', label: 'Commission Renewal',   icon: 'verified',        color: '#0D9488', taxLine: 'Line 27a — Other expenses',   description: 'State commission renewal fee' },
  { key: 'education',          label: 'Education & Training', icon: 'menu_book',       color: '#2563EB', taxLine: 'Line 27a — Other expenses',   description: 'Courses, certifications, NNA membership' },
  { key: 'printing',           label: 'Printing',             icon: 'description',     color: '#DC2626', taxLine: 'Line 22 — Supplies',          description: 'Paper, ink, toner, printer maintenance' },
  { key: 'office_supplies',    label: 'Office Supplies',      icon: 'work',            color: '#EA580C', taxLine: 'Line 22 — Supplies',          description: 'Pens, folders, envelopes, labels' },
  { key: 'phone_internet',     label: 'Phone & Internet',     icon: 'phone_iphone',    color: '#16A34A', taxLine: 'Line 25 — Utilities',         description: 'Phone bill, mobile hotspot (business %)' },
  { key: 'software',           label: 'Software & Apps',      icon: 'devices',         color: '#9333EA', taxLine: 'Line 27a — Other expenses',   description: 'NotaryDesk, cloud storage, tools' },
  { key: 'marketing',          label: 'Marketing',            icon: 'trending_up',     color: '#E11D48', taxLine: 'Line 8 — Advertising',        description: 'Business cards, website, advertising' },
  { key: 'travel',             label: 'Travel & Parking',     icon: 'directions_car',  color: '#CA8A04', taxLine: 'Line 24a — Travel',           description: 'Parking, tolls, public transit' },
  { key: 'meals',              label: 'Business Meals',       icon: 'savings',         color: '#D97706', taxLine: 'Line 24b — Meals (50%)',      description: 'Client meals (50% deductible)' },
  { key: 'professional_fees',  label: 'Professional Fees',    icon: 'account_balance', color: '#4338CA', taxLine: 'Line 17 — Legal/professional', description: 'Accountant, lawyer, tax prep' },
  { key: 'background_check',   label: 'Background Check',     icon: 'person',          color: '#475569', taxLine: 'Line 27a — Other expenses',   description: 'Required by signing services' },
  { key: 'other',              label: 'Other',                icon: 'more_horiz',      color: '#64748B', taxLine: 'Line 27a — Other expenses',   description: 'Miscellaneous business expenses' },
]

export function getCategoryByKey(key: string): ExpenseCategory {
  return EXPENSE_CATEGORIES.find(c => c.key === key) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}

export const PAYMENT_METHODS = [
  { value: 'card',   label: 'Credit/Debit Card' },
  { value: 'cash',   label: 'Cash' },
  { value: 'check',  label: 'Check' },
  { value: 'venmo',  label: 'Venmo' },
  { value: 'zelle',  label: 'Zelle' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other',  label: 'Other' },
]