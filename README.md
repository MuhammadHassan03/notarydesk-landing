# NotaryDesk — Marketing Landing Page

Next.js 14 landing page for NotaryDesk. Deploy to Vercel in one click.

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

### Option 1 — Vercel CLI (Fastest)
```bash
npm i -g vercel
vercel
# Follow prompts — it auto-detects Next.js
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to https://vercel.com/new
3. Import the repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Done! Your site is live.

### Option 3 — Drag & Drop
1. Run `npm run build` locally
2. Go to https://vercel.com/new
3. Drag the entire project folder into the Vercel dashboard

## Customization

- **App Store link**: Search for `https://apps.apple.com` and replace with your real link
- **Colors**: Edit `app/globals.css` CSS variables
- **Copy**: Edit text directly in each component file
- **Pricing**: Edit the `PLANS` array in `components/Pricing.tsx`

## Structure

```
app/
  layout.tsx      — fonts + metadata
  page.tsx        — assembles all sections
  globals.css     — design tokens
components/
  Nav.tsx         — sticky navigation
  Hero.tsx        — headline + phone mockup
  SocialProof.tsx — notary type tags
  Features.tsx    — 4 feature cards
  HowItWorks.tsx  — 3 steps
  Pricing.tsx     — 3 plans with monthly/yearly toggle
  Testimonials.tsx— 3 reviews
  FinalCTA.tsx    — download CTA
  Footer.tsx      — links + copyright
```