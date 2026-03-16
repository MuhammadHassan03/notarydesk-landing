import { adminSupabase } from '@/lib/supabase'
import FlagsEditor from './FlagsEditor'

const DEFAULTS = {
  journal:         true,
  mileage:         true,
  invoices:        true,
  appointments:    true,
  aiIdScanner:     false,
  smsInvoices:     false,
  taxExport:       true,
  offlineMode:     false,
  googleOAuth:     true,
  maintenanceMode: false,
}

export default async function FlagsPage() {
  const { data } = await adminSupabase
    .from('app_config')
    .select('value')
    .eq('key', 'feature_flags')
    .single()

  const flags: Record<string, boolean> = data?.value ?? DEFAULTS

  return (
    <div>
      <h1 style={{ color: '#e6edf3', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Feature Flags</h1>
      <p style={{ color: '#484f58', fontSize: 13, margin: '0 0 28px' }}>
        Toggle features instantly — no redeploy needed. Mobile app reads these on launch.
      </p>
      <FlagsEditor initialFlags={flags} />
    </div>
  )
}