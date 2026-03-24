'use client'

import { Button } from '@/components/ui'
import { PageHeader, EmptyState } from '@/components/shared'

export default function InvoicesPage() {
  return (
    <div>
      <PageHeader title="Invoices" subtitle="Synced from your mobile app" />
      <EmptyState icon="⊡" title="Invoices coming to web"
        description="Your invoices sync from the mobile app. Full web management is coming soon."
        action={<Button variant="outline" href="/dashboard">Back to dashboard</Button>} />
    </div>
  )
}