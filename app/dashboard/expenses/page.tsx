'use client'

import { Button } from '@/components/ui'
import { PageHeader, EmptyState } from '@/components/shared'

export default function ExpensesPage() {
  return (
    <div>
      <PageHeader title="Expenses" subtitle="Synced from your mobile app" />
      <EmptyState icon="◇" title="Expenses coming to web"
        description="Your expenses sync from the mobile app. Full web management is coming soon."
        action={<Button variant="outline" href="/dashboard">Back to dashboard</Button>} />
    </div>
  )
}