'use client'

import { Button } from '@/components/ui'
import { PageHeader, EmptyState } from '@/components/shared'

export default function MileagePage() {
  return (
    <div>
      <PageHeader title="Mileage" subtitle="Track miles for tax deductions" />
      <EmptyState icon="🚗" title="Mileage tracking coming soon"
        description="Track your business miles for tax deductions. Full web management is coming soon."
        action={<Button variant="outline" href="/dashboard">Back to dashboard</Button>} />
    </div>
  )
}