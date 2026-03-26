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
// Detects when DevTools are opened and shows a security warning overlay.
// NOT bulletproof — but deters casual inspection.

let devtoolsOpen = false
let detectionInterval: ReturnType<typeof setInterval> | null = null
let warningOverlay: HTMLElement | null = null

function showDevToolsWarning() {
  if (warningOverlay) return

  warningOverlay = document.createElement('div')
  warningOverlay.id = '__nd_security_warning'
  warningOverlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:2147483647',
    'display:flex', 'align-items:center', 'justify-content:center',
    'flex-direction:column', 'gap:16px',
    'background:rgba(15,23,42,0.97)',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    'backdrop-filter:blur(8px)',
  ].join(';')

  warningOverlay.innerHTML = `
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="#C9A84C" stroke-width="1.5"/>
      <path d="M12 7v6" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="16.5" r="1" fill="#C9A84C"/>
    </svg>
    <div style="text-align:center;max-width:380px;padding:0 24px;">
      <div style="color:#E8ECF0;font-size:18px;font-weight:700;margin-bottom:8px;">
        Developer Tools Detected
      </div>
      <div style="color:#8B95A5;font-size:13px;line-height:1.6;">
        For the security of our users and their data, this application
        does not support browser developer tools.<br><br>
        If you believe this is an error, please contact
        <strong style="color:#C9A84C;">support@notarydesk.com</strong>
      </div>
    </div>
    <button onclick="this.parentElement.style.display='none'"
      style="margin-top:8px;padding:10px 28px;border-radius:10px;border:1px solid #2D5A8E;background:transparent;color:#E8ECF0;font-size:13px;font-weight:600;cursor:pointer;">
      I understand — dismiss
    </button>
  `

  document.body.appendChild(warningOverlay)
}

function detectDevTools(onDetected?: () => void) {
  if (!IS_PROD || typeof window === 'undefined') return

  const el = new Image()
  Object.defineProperty(el, 'id', {
    get: () => {
      if (!devtoolsOpen) {
        devtoolsOpen = true
        showDevToolsWarning()
        onDetected?.()
      }
    },
  })

  // Check periodically (every 2s)
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