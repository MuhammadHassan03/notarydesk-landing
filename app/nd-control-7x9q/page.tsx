// app/nd-control-7x9q/page.tsx
// Root of the admin panel — just redirects to dashboard
import { redirect } from 'next/navigation'

export default function AdminRoot() {
  redirect('/nd-control-7x9q/dashboard')
}