/**
 * lib/supabase-browser.ts — Supabase Client for Web Dashboard
 * ==============================================================
 * Uses the same Supabase project as the mobile app.
 * Environment variables must be set in your Next.js .env.local:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : (null as any) // SSG/prerender: env vars unavailable — client pages guard with 'use client'