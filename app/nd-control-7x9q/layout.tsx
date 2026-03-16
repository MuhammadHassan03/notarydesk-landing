// This layout wraps every /nd-control-7x9q/* page.
// Auth is handled by middleware.ts — no need to check here.
// AdminShell hides the sidebar on the login page.
import AdminShell from './AdminShell'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}