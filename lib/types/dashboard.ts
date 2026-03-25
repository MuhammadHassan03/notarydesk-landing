export interface DashboardStats {
  mtd_income: number
  ytd_income: number
  active_jobs: number
  unpaid_count: number
  unpaid_total: number
  ytd_notarial_acts: number
  ytd_miles: number
  ytd_mileage_deduction: number
  ytd_expenses: number
  mtd_completed: number
}

export interface TaxSummary {
  year: number
  total_income: number
  total_jobs: number
  total_notarial_acts: number
  average_fee: number
  total_miles: number
  mileage_deduction: number
  total_expenses: number
  expense_categories: Record<string, number>
  bond_estimate: number
  total_deductions: number
  estimated_tax_savings: number
  tax_rate: number
}
