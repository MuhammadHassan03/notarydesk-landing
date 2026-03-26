/**
 * csv.ts — Download CSV from API endpoint.
 */

import { api } from '@/lib/api'

export async function downloadCsv(endpoint: string, filename: string) {
  const response = await api.get(endpoint, { responseType: 'blob' })
  const blob = new Blob([response.data as BlobPart], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
