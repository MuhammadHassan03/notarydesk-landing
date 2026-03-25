import { secureStorage } from '@/lib/security'

const TK_ACCESS = 'at_v1'
const TK_REFRESH = 'rt_v1'

export function getStoredTokens() {
  return {
    access: secureStorage.get(TK_ACCESS),
    refresh: secureStorage.get(TK_REFRESH),
  }
}

export function storeTokens(access: string, refresh: string) {
  secureStorage.set(TK_ACCESS, access)
  secureStorage.set(TK_REFRESH, refresh)
}

export function clearTokens() {
  secureStorage.remove(TK_ACCESS)
  secureStorage.remove(TK_REFRESH)
}
