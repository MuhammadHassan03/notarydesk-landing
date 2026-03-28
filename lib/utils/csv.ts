/**
 * csv.ts — Download CSV from API endpoint.
 * Uses raw axios to bypass JSON unwrap interceptor for blob responses.
 */

import axios from 'axios'
import { API_URL } from '@/lib/api/client'
import { getStoredTokens } from '@/lib/api/tokens'

export async function downloadCsv(endpoint: string, filename: string) {
  const { access } = getStoredTokens()
  const res = await axios.get(`${API_URL}${endpoint}`, {
    responseType: 'blob',
    headers: {
      Authorization: access ? `Bearer ${access}` : '',
    },
  })
  const blob = new Blob([res.data], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
