'use client'

import { Button } from '@/components/ui'
import { PageHeader, EmptyState } from '@/components/shared'

export default function JournalPage() {
  return (
    <div>
      <PageHeader title="Notary Journal" subtitle="Synced from your mobile app" />
      <EmptyState icon="☰" title="Journal coming to web"
        description="Your journal entries sync from the mobile app. Full web management is coming soon."
        action={<Button variant="outline" href="/dashboard">Back to dashboard</Button>} />
    </div>
  )
}