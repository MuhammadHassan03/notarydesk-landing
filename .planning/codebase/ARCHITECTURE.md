# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Client-side SPA with external REST API backend

**Key Characteristics:**
- Next.js App Router used purely as a client-side framework (all pages are `'use client'`)
- No server components, no API routes, no SSR data fetching -- the backend is a separate service at `NEXT_PUBLIC_API_URL` (default: `https://notarydesk-api.vercel.app`)
- Authentication uses JWT access/refresh tokens stored in obfuscated localStorage via `secureStorage`
- Supabase used only for Realtime (broadcast channels for chat/typing), not as the primary database layer
- Deployed on Vercel as a static Next.js frontend

## Layers

**Routing / Pages (`app/`):**
- Purpose: Define URL routes, render page-level components
- Location: `app/`
- Contains: Page components (`page.tsx`), layout wrappers (`layout.tsx`)
- Depends on: `hooks/`, `components/`, `lib/`, `context/`
- Used by: Next.js router

**Context Providers (`context/`):**
- Purpose: Global client-side state (auth, theme)
- Location: `context/auth/`, `context/themecontext.tsx`
- Contains: React Context providers, consumer hooks
- Depends on: `lib/api/`, `lib/types/`
- Used by: All dashboard pages and layout

**Custom Hooks (`hooks/`):**
- Purpose: Data-fetching and mutation logic for each domain entity
- Location: `hooks/`
- Contains: One hook file per domain (jobs, clients, invoices, expenses, mileage, journal, messages, calendar, dashboard stats, notifications, profile)
- Depends on: `lib/api/client`, `lib/types/`
- Used by: Page components

**API Client (`lib/api/`):**
- Purpose: HTTP client layer wrapping Axios with auth interceptors and token refresh
- Location: `lib/api/client.ts`, `lib/api/auth.ts`, `lib/api/tokens.ts`
- Contains: Axios instance with JWT interceptors, envelope unwrapping (`{ ok, data }` -> `data`), auth methods (login/register/logout)
- Depends on: `lib/security` (for token storage)
- Used by: `hooks/`, `context/auth/`

**Components (`components/`):**
- Purpose: Reusable UI elements, organized by domain
- Location: `components/ui/`, `components/layout/`, `components/forms/`, `components/landing/`, `components/chat/`, `components/notifications/`
- Contains: Presentational and interactive components
- Depends on: `lib/utils/`, `lib/constants/`
- Used by: Page components

**Types & Constants (`lib/types/`, `lib/constants/`):**
- Purpose: TypeScript interfaces, status configs, navigation items
- Location: `lib/types/`, `lib/constants/`
- Contains: Domain type definitions, status/config objects
- Depends on: Nothing
- Used by: Everything

**Utilities (`lib/utils/`):**
- Purpose: Formatting, class merging, PDF download, CSV export, calendar helpers
- Location: `lib/utils/`
- Contains: Pure functions
- Depends on: Nothing
- Used by: Components, pages

## Data Flow

**Authenticated API Request:**

1. Page component calls a custom hook (e.g., `useJobs()` from `hooks/use-jobs.ts`)
2. Hook calls `api.get()` / `api.post()` from `lib/api/client.ts`
3. Axios request interceptor attaches `Bearer {access_token}` from `secureStorage`
4. Backend returns JSON envelope `{ ok: true, data: [...], meta: { pagination, request_id } }`
5. `client.ts` unwraps envelope, returns `data` to hook
6. Hook sets React state, component re-renders
7. On 401: interceptor attempts single-flight token refresh via `/auth/refresh`, retries original request once, or redirects to `/dashboard/login`

**Real-time Chat (Supabase Realtime):**

1. Dashboard messages page uses `lib/realtime.ts` helpers
2. `subscribeToMessages(conversationId)` opens a Supabase broadcast channel
3. Backend broadcasts `new_message` events after REST INSERT
4. Client chat page (`app/chat/[token]/page.tsx`) subscribes directly to Supabase channels
5. Typing indicators use separate broadcast channels (no DB writes)

**State Management:**
- **Auth state**: React Context in `context/auth/AuthProvider.tsx` -- holds `isAuthenticated`, `displayName`, `plan`, `loading`
- **Profile cache**: Module-level variable `_cachedProfile` in `AuthProvider.tsx`, shared with `useProfile` hook to avoid redundant `/auth/me` calls
- **Theme state**: React Context in `context/themecontext.tsx` -- persists to `localStorage` key `nd-theme`, applies `data-theme` attribute to `<html>`
- **Domain data**: Each hook manages its own `useState` (no global store like Redux/Zustand). Hooks fetch on mount and expose a `refresh()` callback.
- **Dashboard polling**: `useDashboardStats` polls `/dashboard/stats` every 30 seconds silently; `useUnreadCount` polls `/notifications/unread-count` every 30 seconds

## Key Abstractions

**API Client (`lib/api/client.ts`):**
- Purpose: Centralized HTTP layer with auth, refresh, and envelope unwrapping
- Pattern: Axios instance with interceptors, exported as `api` object with `get/post/patch/delete` methods
- All hooks and auth flows go through this single client

**Custom Hooks (one per domain):**
- Purpose: Encapsulate fetch/mutate logic, expose `{ data, loading, error, refresh }` tuples
- Examples: `hooks/use-jobs.ts`, `hooks/use-clients.ts`, `hooks/use-invoices.ts`, `hooks/use-expenses.ts`, `hooks/use-mileage.ts`, `hooks/use-journal.ts`, `hooks/use-messages.ts`, `hooks/use-calendar.ts`, `hooks/use-dashboard.ts`, `hooks/use-notifications.ts`, `hooks/use-profile.ts`
- Pattern: `useState` + `useEffect` + `useCallback`, fetch on mount, return refresh function

**Barrel Exports:**
- Purpose: Clean import paths
- Pattern: Each module directory has an `index.ts` or `index.tsx` that re-exports public API
- Examples: `components/ui/index.tsx`, `components/layout/index.tsx`, `components/forms/index.tsx`, `components/landing/index.tsx`, `lib/types/index.ts`, `lib/constants/index.ts`, `lib/utils/index.ts`, `lib/api/index.ts`

**Realtime Channel Registry (`lib/realtime.ts`):**
- Purpose: Manage Supabase Realtime subscriptions with multi-callback support
- Pattern: Module-level `Map<string, ChannelEntry>` tracks active channels; multiple subscribers share one Supabase channel; returns unsubscribe functions

## Entry Points

**Root Layout (`app/layout.tsx`):**
- Location: `app/layout.tsx`
- Triggers: Every page render
- Responsibilities: HTML shell, metadata, Google Fonts, ThemeProvider, dark mode anti-flicker script

**Dashboard Layout (`app/dashboard/layout.tsx`):**
- Location: `app/dashboard/layout.tsx`
- Triggers: All `/dashboard/*` routes
- Responsibilities: Wraps children in `ThemeProvider` > `SecurityLayer` > `AuthProvider` > `Shell` (sidebar + topbar + main content area + mobile nav + global search)

**Landing Page (`app/page.tsx`):**
- Location: `app/page.tsx`
- Triggers: Root URL `/`
- Responsibilities: Marketing landing page composed of landing section components

## Routing

**Route Structure:**
- `/` -- Landing page (public marketing site)
- `/privacy`, `/terms` -- Legal pages (public)
- `/book/[username]` -- Public booking page for a notary (no auth)
- `/chat/[token]` -- Public client chat page via token (no auth)
- `/dashboard` -- Main dashboard (authenticated)
- `/dashboard/login`, `/dashboard/register`, `/dashboard/otp`, `/dashboard/forgot-password`, `/dashboard/new-password` -- Auth flows (public paths within dashboard layout)
- `/dashboard/onboarding` -- Post-registration onboarding (public path, requires auth but no profile)
- `/dashboard/jobs`, `/dashboard/clients`, `/dashboard/invoices`, `/dashboard/expenses`, `/dashboard/mileage`, `/dashboard/journal`, `/dashboard/messages`, `/dashboard/calendar`, `/dashboard/analytics`, `/dashboard/settings`, `/dashboard/upgrade` -- CRUD modules (authenticated)
- `/dashboard/{module}/new` -- Create forms
- `/dashboard/{module}/[id]` -- Detail/edit views

**Protected vs Public Routes:**
- Route protection is handled client-side in `context/auth/AuthProvider.tsx`
- Public paths defined in `PUBLIC_PATHS` array: login, register, otp, forgot-password, new-password, onboarding
- Unauthenticated users on `/dashboard/*` (non-public) are redirected to `/dashboard/login`
- Authenticated users on public auth pages are redirected to `/dashboard`
- New users without `full_name` are redirected to `/dashboard/onboarding`

**Layout Nesting:**
- `app/layout.tsx` (root): ThemeProvider wraps entire app
- `app/dashboard/layout.tsx`: ThemeProvider > SecurityLayer > AuthProvider > Shell (sidebar/topbar)
- Auth pages (login, register, etc.) render inside the dashboard layout but `Shell` hides the sidebar when `!isAuthenticated`
- Non-dashboard routes (`/`, `/book/*`, `/chat/*`, `/privacy`, `/terms`) use only the root layout

## Error Handling

**Strategy:** Per-hook error state with component-level display

**Patterns:**
- Each hook exposes an `error: string | null` state, set from caught exceptions
- API client (`lib/api/client.ts`) extracts error messages from Axios responses: `body.detail || body.error.message || err.message`
- Pages display errors via `Toast` component or `ErrorBanner` component
- Auth errors (401) are handled globally by the Axios interceptor (refresh or redirect)
- Many catch blocks silently swallow errors (e.g., notifications, typing events) for non-critical features

## Cross-Cutting Concerns

**Logging:** Console methods stripped in production by `lib/security.ts`. No structured logging framework.

**Validation:** Form validation is inline in page components. No validation library (no Zod, Yup, etc.).

**Authentication:** JWT Bearer tokens via Axios interceptor. Tokens stored in obfuscated localStorage (`secureStorage` in `lib/security.ts`). Single-flight token refresh on 401.

**Security Hardening (`lib/security.ts`):**
- Production console stripping
- DevTools detection
- Right-click / keyboard shortcut blocking (optional)
- Source maps disabled in production (`next.config.js`: `productionBrowserSourceMaps: false`)
- Security headers via `next.config.js`: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP

**Theming:** CSS custom properties (`var(--primary)`, `var(--bg-page)`, etc.) controlled by `data-theme` attribute on `<html>`. Toggle via `context/themecontext.tsx`. Anti-flicker inline script in root layout.

---

*Architecture analysis: 2026-03-28*
