# External Integrations

**Analysis Date:** 2026-03-28

## APIs & Services

### External REST API (Primary Backend)

- **Purpose:** All CRUD operations for the application (auth, jobs, clients, invoices, expenses, mileage, journal, messages, notifications, profile)
- **Base URL:** Configured via `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api/v1`, production: `https://notarydesk-api.vercel.app`)
- **Client:** Axios via custom wrapper at `lib/api/client.ts`
- **Auth:** Bearer token (JWT access + refresh tokens)

**API Endpoints Used (from hooks):**

| Endpoint | Hook | Purpose |
|----------|------|---------|
| `POST /auth/login` | `lib/api/auth.ts` | User login |
| `POST /auth/register` | `lib/api/auth.ts` | User registration |
| `POST /auth/forgot-password` | `lib/api/auth.ts` | Password reset |
| `POST /auth/refresh` | `lib/api/client.ts` | Token refresh |
| `GET /auth/me` | `context/auth/AuthProvider.tsx` | Current user profile |
| `GET /signing-jobs/` | `hooks/use-jobs.ts` | List signing jobs |
| `GET /messages/conversations` | `hooks/use-messages.ts` | List chat conversations |

### Supabase (Realtime & Storage)

- **Purpose:** Real-time messaging (WebSocket channels), image hosting
- **SDK:** `@supabase/supabase-js` ^2.99.2
- **Client:** Singleton at `lib/supabase.ts`
- **Auth config:** `persistSession: true`, `autoRefreshToken: true`

**Realtime Channels (defined in `lib/realtime.ts`):**

| Channel Pattern | Event | Purpose |
|-----------------|-------|---------|
| `msgs:{conversationId}` | `new_message` (broadcast) | Real-time message delivery |
| `typing:{conversationId}` | `typing` (broadcast) | Typing indicator |

**Key implementation details:**
- Multi-callback channel registry prevents duplicate Supabase connections across React re-mounts
- Ephemeral channels created for one-off broadcasts, auto-cleaned after 2 seconds
- Backend broadcasts via Supabase Realtime HTTP API (service role key) to bypass RLS

### Resend (Email)

- **Purpose:** Email delivery (inferred from CSP `connect-src` allowing `api.resend.com`)
- **Integration:** Likely server-side only (no client SDK in `package.json`)
- **Note:** No direct Resend code found in frontend; probably used by the external backend API

## Data Storage

**Databases:**
- No direct database access from this frontend
- External API backend handles all data persistence
- Supabase used only for Realtime channels (not as primary database from frontend)

**File Storage:**
- Supabase Storage for images (inferred from `next.config.js` remote image pattern `**.supabase.co` and `profile.logo_url` in `lib/utils/pdf.ts`)

**Caching:**
- In-memory profile cache in `context/auth/AuthProvider.tsx` (`_cachedProfile` export)
- No external caching service

## Authentication & Identity

### User Auth (Dashboard)

- **Approach:** JWT-based via external API
- **Implementation:** `context/auth/AuthProvider.tsx` + `lib/api/auth.ts`
- **Token storage:** Session storage with obfuscated keys via `lib/security.ts` (`secureStorage`)
- **Token refresh:** Automatic via Axios 401 interceptor in `lib/api/client.ts` (single-flight pattern)
- **Route protection:** Client-side via `AuthProvider` useEffect (redirects unauthenticated users to `/dashboard/login`)

**Auth flow:**
1. User logs in via `/auth/login` endpoint
2. Access + refresh tokens stored in sessionStorage (obfuscated keys, base64-encoded values)
3. Axios interceptor attaches Bearer token to every request
4. On 401, interceptor attempts single-flight token refresh via `/auth/refresh`
5. On refresh failure, tokens cleared and user redirected to login

**Public paths (no auth required):**
- `/dashboard/login`, `/dashboard/register`, `/dashboard/otp`
- `/dashboard/forgot-password`, `/dashboard/new-password`, `/dashboard/onboarding`

### Admin Auth (Control Panel)

- **Approach:** Password + TOTP (cookie-based session)
- **Implementation:** `lib/admin-auth.ts` + `lib/middleware.ts`
- **TOTP library:** `otplib` ^13.3.0
- **Session:** HttpOnly cookie (`nd_ctrl_sess`) with 8-hour max-age
- **Route protection:** Next.js middleware at `lib/middleware.ts` protects `/nd-control-7x9q/*` paths
- **Admin env vars:** `ADMIN_TOTP_SECRET`, `ADMIN_PASSWORD`

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Datadog, etc.)

**Logs:**
- `console.*` methods stripped in production via `lib/security.ts` (`stripConsole()`)
- `console.error` and `console.warn` preserved in production
- No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from CSP headers and code comments)

**CI Pipeline:**
- None detected (no `.github/workflows`, no CI config files)

**Build:**
- `npm run build` (Next.js build)
- No lint script in `package.json`

## Environment Configuration

**Required Environment Variables:**

| Variable | Service | Required | Location |
|----------|---------|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Yes | `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Yes | `.env.local` |
| `NEXT_PUBLIC_API_URL` | Backend API | Yes (prod) | `.env.local` |
| `ADMIN_TOTP_SECRET` | TOTP auth | Yes (admin) | `.env` |
| `ADMIN_PASSWORD` | Admin login | Yes (admin) | `.env` |

**Secrets location:**
- `.env` and `.env.local` files (gitignored status should be verified)

## Security Hardening

**Client-side measures (defined in `lib/security.ts`):**
- Console stripping in production
- DevTools detection with warning overlay
- Right-click and keyboard shortcut blocking (F12, Ctrl+Shift+I, etc.)
- Token storage obfuscation (hashed keys, base64 values in sessionStorage)

**Server-side measures (defined in `next.config.js`):**
- Content Security Policy header
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Production source maps disabled

## Integration Patterns

### API Call Pattern

All API calls flow through the centralized Axios client at `lib/api/client.ts`:

```typescript
// Usage in hooks (e.g., hooks/use-jobs.ts):
import { api } from '@/lib/api/client'
const data = await api.get<ResponseType>('/endpoint')
```

The `api` wrapper:
1. Attaches Bearer token from sessionStorage
2. Unwraps `{ ok, data }` envelope responses automatically
3. Extracts error messages from `detail` or `error.message` response fields
4. Handles 401 with automatic token refresh (single retry)

### Realtime Pattern

Realtime features use Supabase channels via `lib/realtime.ts`:

```typescript
// Subscribe (returns cleanup function):
import { subscribeToMessages } from '@/lib/realtime'
const unsub = subscribeToMessages(conversationId, (msg) => { /* handle */ })

// Broadcast:
import { broadcastMessage } from '@/lib/realtime'
broadcastMessage(conversationId, messageObject)
```

### Error Handling

- API errors: Axios interceptor extracts message, throws standard `Error`
- Auth errors: 401 triggers token refresh; on failure, redirect to login
- Realtime errors: Channel errors logged to console with `[Realtime]` prefix
- No global error boundary detected

### State Management

- React Context for auth state (`context/auth/AuthProvider.tsx`)
- React Context for theme (`context/themecontext.tsx`)
- Custom hooks with `useState`/`useEffect` for data fetching (`hooks/use-*.ts`)
- No external state management library (no Redux, Zustand, etc.)

## Webhooks & Callbacks

**Incoming:**
- None detected in frontend code

**Outgoing:**
- None detected in frontend code (likely handled by backend API)

---

*Integration audit: 2026-03-28*
