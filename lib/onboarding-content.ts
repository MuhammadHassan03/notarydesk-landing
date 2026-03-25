import type { IconName } from '@/components/ui/icons'

export interface OnboardingFeature {
  icon: IconName
  title: string
  description: string
  color: string
  highlights: string[]
}

export const ONBOARDING_FEATURES: OnboardingFeature[] = [
  {
    icon: 'menu_book',
    title: 'Digital Journal',
    description: 'State-compliant notary journal that meets legal requirements in all 50 states.',
    color: '#1B3A5C',
    highlights: ['Auto-locked entries after finalization', '50-state compliance built in', 'Document type & ID verification tracking'],
  },
  {
    icon: 'route',
    title: 'Mileage Tracker',
    description: 'Log every business trip and automatically calculate your IRS mileage deductions.',
    color: '#16A34A',
    highlights: ['GPS tracking on mobile, manual on web', 'IRS rate auto-applied ($0.70/mi)', 'Deduction totals updated in real-time'],
  },
  {
    icon: 'receipt_long',
    title: 'Invoicing',
    description: 'Create and send professional invoices in seconds. Get paid faster.',
    color: '#2563EB',
    highlights: ['Email delivery with one click', 'Status tracking: Draft → Sent → Paid', 'Multiple payment methods supported'],
  },
  {
    icon: 'account_balance_wallet',
    title: 'Expense Tracking',
    description: 'Track every business expense with 15 notary-specific categories for tax time.',
    color: '#D97706',
    highlights: ['IRS Schedule C line auto-mapped', 'Tax deductible flagging', 'Monthly breakdowns & category totals'],
  },
  {
    icon: 'work',
    title: 'Signing Jobs',
    description: 'Full pipeline from new job to payment — track every signing assignment.',
    color: '#7C3AED',
    highlights: ['8-step status pipeline', 'Auto-create appointments from jobs', 'Payment tracking per job'],
  },
  {
    icon: 'savings',
    title: 'Tax Dashboard',
    description: 'See your total deductions, estimated tax savings, and year-to-date income at a glance.',
    color: '#059669',
    highlights: ['Mileage + expenses + bond deductions', 'Estimated savings at 30% rate', 'Exportable for your accountant'],
  },
]