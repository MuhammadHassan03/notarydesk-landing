// Server-only — never import in Client Components
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars')
}

export const adminSupabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})