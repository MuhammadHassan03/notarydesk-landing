/**
 * lib/security.ts — Production Security Hardening
 * ==================================================
 * Import once in your root layout. Handles:
 *   1. Console stripping (no logs leak in production)
 *   2. DevTools detection + warning
 *   3. Right-click / keyboard shortcut blocking (optional)
 *   4. Source map stripping (via next.config.js — see notes below)
 *
 * USAGE:
 *   // In app/layout.tsx or app/dashboard/layout.tsx:
 *   import { initSecurity } from '@/lib/security'
 *   useEffect(() => { initSecurity() }, [])
 *
 * NOTE: You CANNOT truly block the Network tab from JS.
 * What you CAN do:
 *   - Never log tokens/responses to console
 *   - Obfuscate localStorage keys so they're not obvious
 *   - Strip console.* in production so nothing leaks
 *   - Detect devtools and optionally warn/redirect
 *   - Disable source maps in production (next.config.js)
 */

const IS_PROD = process.env.NODE_ENV === 'production'

// ── 1. Console Stripping ──────────────────────────────────────────────────
// Replaces all console methods with no-ops in production.
// In dev, everything works normally.

function stripConsole() {
  if (!IS_PROD || typeof window === 'undefined') return

  const noop = () => {}
  const methods: (keyof Console)[] = [
    'log', 'debug', 'info', 'warn', 'error',
    'table', 'trace', 'dir', 'dirxml',
    'group', 'groupCollapsed', 'groupEnd',
    'count', 'countReset', 'time', 'timeEnd', 'timeLog',
    'assert', 'clear', 'profile', 'profileEnd',
  ]

  methods.forEach(method => {
    try {
      (console as any)[method] = noop
    } catch {}
  })
}

// ── 2. DevTools Detection ─────────────────────────────────────────────────
// Detects when DevTools are opened and optionally takes action.
// NOT bulletproof — but deters casual inspection.

let devtoolsOpen = false
let detectionInterval: ReturnType<typeof setInterval> | null = null

function detectDevTools(onDetected?: () => void) {
  if (!IS_PROD || typeof window === 'undefined') return

  // Method 1: debugger timing
  function check() {
    const start = performance.now()
    // This debugger statement pauses execution if DevTools are open
    // eslint-disable-next-line no-debugger
    debugger
    const delta = performance.now() - start
    if (delta > 100 && !devtoolsOpen) {
      devtoolsOpen = true
      onDetected?.()
    }
  }

  // Method 2: console.log object trick
  const el = new Image()
  Object.defineProperty(el, 'id', {
    get: () => {
      if (!devtoolsOpen) {
        devtoolsOpen = true
        onDetected?.()
      }
    },
  })

  // Check periodically (every 2s, not aggressive)
  detectionInterval = setInterval(() => {
    devtoolsOpen = false
    console.log('%c', el as any)
  }, 2000)
}

// ── 3. Context Menu / Shortcuts Blocking ──────────────────────────────────
// Prevents casual right-click > Inspect and keyboard shortcuts.
// NOT security — just deterrence. Users can always bypass.

function blockInspectShortcuts() {
  if (!IS_PROD || typeof window === 'undefined') return

  // Block right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
      (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
      e.preventDefault()
    }
  })
}

// ── 4. Token Storage Obfuscation ──────────────────────────────────────────
// Instead of obvious key names like "access_token", use hashed keys
// and base64-encode the values. Not encryption — just obfuscation
// so casual localStorage inspection doesn't reveal tokens.

const STORAGE_PREFIX = '_nd_'

function obfuscateKey(key: string): string {
  // Simple hash to make keys non-obvious
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return `${STORAGE_PREFIX}${Math.abs(hash).toString(36)}`
}

function encodeValue(value: string): string {
  if (typeof window === 'undefined') return value
  try {
    return btoa(unescape(encodeURIComponent(value)))
  } catch {
    return value
  }
}

function decodeValue(encoded: string): string {
  if (typeof window === 'undefined') return encoded
  try {
    return decodeURIComponent(escape(atob(encoded)))
  } catch {
    return encoded
  }
}

export const secureStorage = {
  set(key: string, value: string) {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.setItem(obfuscateKey(key), encodeValue(value))
    } catch {}
  },

  get(key: string): string | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(obfuscateKey(key))
      return raw ? decodeValue(raw) : null
    } catch {
      return null
    }
  },

  remove(key: string) {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(obfuscateKey(key))
    } catch {}
  },

  clear() {
    if (typeof window === 'undefined') return
    try {
      // Only clear our keys
      const keys = Object.keys(sessionStorage).filter(k => k.startsWith(STORAGE_PREFIX))
      keys.forEach(k => sessionStorage.removeItem(k))
    } catch {}
  },
}

// ── 5. Init Everything ────────────────────────────────────────────────────

export function initSecurity(options?: {
  blockShortcuts?: boolean
  onDevToolsDetected?: () => void
}) {
  if (typeof window === 'undefined') return

  // Always strip console in production
  stripConsole()

  // Detect devtools (optional callback)
  detectDevTools(options?.onDevToolsDetected)

  // Block inspect shortcuts (default: true in prod)
  if (options?.blockShortcuts !== false) {
    blockInspectShortcuts()
  }
}

export function cleanupSecurity() {
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
}

// ── 6. next.config.js additions ───────────────────────────────────────────
// Add this to your next.config.js to strip source maps in production:
//
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   productionBrowserSourceMaps: false,  // ← no .map files served
//   // ...rest
// }