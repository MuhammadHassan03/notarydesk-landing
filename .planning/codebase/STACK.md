# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 5.x - All application code (`tsconfig.json` targets ES5, uses `strict: true`)

**Secondary:**
- JavaScript - Config files only (`next.config.js`, `postcss.config.js`)

## Runtime

**Environment:**
- Node.js (version not pinned; no `.nvmrc` present)
- Next.js 14.2.5 (App Router)

**Package Manager:**
- npm (no `yarn.lock` or `pnpm-lock.yaml` detected)
- Lockfile: `package-lock.json` expected

## Frameworks

**Core:**
- Next.js 14.2.5 - Full-stack React framework (App Router pattern)
  - Config: `next.config.js`
  - Uses App Router (`app/` directory)
  - No API routes detected in `app/` - API calls go to external backend

- React 18.x - UI library
- React DOM 18.x - DOM rendering

**Testing:**
- None detected (no test runner, no test files, no test scripts in `package.json`)

**Build/Dev:**
- Next.js built-in bundler (Turbopack/Webpack)
- PostCSS 8.x with Tailwind CSS plugin (`postcss.config.js`)
- Autoprefixer 10.x

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.2.5 | App framework, routing, SSR |
| `react` / `react-dom` | ^18 | UI rendering |
| `@supabase/supabase-js` | ^2.99.2 | Supabase client (Realtime, auth session persistence) |
| `axios` | ^1.13.6 | HTTP client for external API calls |
| `tailwindcss` | ^3.4.19 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4.2.1 | PostCSS integration for Tailwind |
| `lucide-react` | ^1.6.0 | Icon library |
| `otplib` | ^13.3.0 | TOTP generation/verification (admin auth) |
| `@next/env` | ^16.2.0 | Environment variable loading |

**Dev Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | Type checking |
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` | ^18 | React type definitions |
| `@types/react-dom` | ^18 | React DOM type definitions |

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES5
- Module: ESNext with bundler resolution
- Strict mode enabled
- Path alias: `@/*` maps to `./*`

**Tailwind CSS:**
- Config: `tailwind.config.ts`
- Content paths: `app/`, `components/`, `lib/`
- Custom colors: `navy`, `gold`, `cream`, `surface`
- Custom font: Manrope (sans-serif)
- Custom border-radius: `xl` (14px), `2xl` (20px)

**PostCSS:**
- Config: `postcss.config.js`
- Plugins: `tailwindcss`, `autoprefixer`

**Next.js:**
- Config: `next.config.js`
- Source maps disabled in production (`productionBrowserSourceMaps: false`)
- Remote image patterns: `**.supabase.co`
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP
- CSP allows connections to: `*.supabase.co`, `wss://*.supabase.co`, `notarydesk-api.vercel.app`, `api.resend.com`

**ESLint:**
- Config: `eslint.config.mjs` (present but not analyzed in detail)

**Environment:**
- `.env` and `.env.local` files present (contents not read)
- Key public env vars referenced in code:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_API_URL`
- Server-side env vars:
  - `ADMIN_TOTP_SECRET`
  - `ADMIN_PASSWORD`

## Platform Requirements

**Development:**
- Node.js with npm
- Environment variables configured in `.env.local`
- External API backend running (default: `http://localhost:8000/api/v1`)

**Production:**
- Vercel (inferred from CSP header allowing `notarydesk-api.vercel.app`, and `realtime.ts` comment about Vercel serverless)
- Supabase project for Realtime and image storage

## Architecture Notes

This is a **frontend-heavy Next.js app** that communicates with:
1. An **external REST API** at `NEXT_PUBLIC_API_URL` (default `localhost:8000/api/v1`) for all CRUD operations
2. **Supabase** directly for Realtime features (chat, typing indicators) via `@supabase/supabase-js`

There are no Next.js API routes in the `app/` directory. The backend is a separate service.

---

*Stack analysis: 2026-03-28*
