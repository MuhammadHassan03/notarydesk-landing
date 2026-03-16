import { adminSupabase } from '@/lib/supabase'
import AnnouncementEditor from './AnnouncementEditor'

export default async function AnnouncementsPage() {
  const { data } = await adminSupabase
    .from('app_config')
    .select('value')
    .eq('key', 'announcement')
    .single()

  const current = data?.value ?? { active: false, message: '', type: 'info' }

  return (
    <div>
      <h1 style={{ color: '#e6edf3', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>App Announcement</h1>
      <p style={{ color: '#484f58', fontSize: 13, margin: '0 0 28px' }}>
        Push a banner to all app users. Shown at the top of the home screen until dismissed or turned off.
      </p>
      <AnnouncementEditor current={current} />
    </div>
  )
}