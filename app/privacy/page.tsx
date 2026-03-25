'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/icons'

const EFFECTIVE_DATE = 'January 1, 2025'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="w-8 h-8 rounded-lg font-extrabold text-sm flex items-center justify-center"
            style={{ background: 'var(--accent)', color: 'var(--primary)' }}>N</span>
          <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </Link>
        <Link href="/" className="text-[13px] font-medium no-underline hover:underline flex items-center gap-1"
          style={{ color: 'var(--text-secondary)' }}>
          <Icon name="arrow_back" size={16} /> Back to home
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-[720px] mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="shield" size={28} style={{ color: 'var(--primary)' }} />
          <h1 className="text-[28px] font-extrabold" style={{ color: 'var(--text)' }}>Privacy Policy</h1>
        </div>
        <p className="text-[13px] mb-10" style={{ color: 'var(--text-tertiary)' }}>
          Effective date: {EFFECTIVE_DATE}
        </p>

        <div className="space-y-8" style={{ color: 'var(--text-secondary)' }}>
          <Section title="1. Information we collect">
            <p>When you create an account, we collect your name, email address, phone number, state of commission, and notary commission number. This information is necessary to provide our notary business management services.</p>
            <p>When you use our services, we collect data you enter including journal entries, mileage logs, invoices, appointments, expenses, and signing job details. If you enable GPS mileage tracking, we collect location data only while tracking is active.</p>
            <p>We automatically collect device information, app version, and usage analytics to improve our services. We do not collect data from third-party sources.</p>
          </Section>

          <Section title="2. How we use your information">
            <p>We use your information to provide and maintain the NotaryDesk service, including syncing data between your devices, generating invoices and reports, calculating tax deductions, and ensuring state compliance for notary journal entries.</p>
            <p>We may use aggregated, anonymized data to improve our product. We do not sell your personal information to third parties. We do not use your data for advertising purposes.</p>
          </Section>

          <Section title="3. Data storage and security">
            <p>Your data is stored securely in Supabase (PostgreSQL) with row-level security enabled. Data is encrypted in transit (TLS 1.2+) and at rest. Authentication tokens are stored securely on your device.</p>
            <p>The mobile app stores data locally using WatermelonDB (SQLite) for offline access. Local data syncs to the cloud when connectivity is available. You can use the app fully offline.</p>
          </Section>

          <Section title="4. Data sharing">
            <p>We do not share your personal data with third parties except in the following limited circumstances: when required by law or legal process, to protect our rights or safety, or with service providers who assist in operating our service (Supabase for database hosting, Vercel for API hosting, RevenueCat for subscription management).</p>
            <p>These service providers are contractually bound to protect your data and use it only for providing their services to us.</p>
          </Section>

          <Section title="5. Your rights">
            <p>You have the right to access, correct, or delete your personal data at any time. You can export your data as PDF reports from within the app. You can delete your account from the Settings screen, which permanently removes all your data from our servers.</p>
            <p>If you are a California resident, you have additional rights under the CCPA. Contact us to exercise these rights.</p>
          </Section>

          <Section title="6. Location data">
            <p>GPS mileage tracking is optional and only active when you explicitly start a trip. We do not track your location in the background unless you have enabled background location for active trip recording. Location data is used solely to calculate mileage and IRS deductions.</p>
          </Section>

          <Section title="7. Children's privacy">
            <p>NotaryDesk is designed for professional notaries and is not intended for children under 13. We do not knowingly collect information from children under 13.</p>
          </Section>

          <Section title="8. Changes to this policy">
            <p>We may update this privacy policy from time to time. We will notify you of material changes via email or in-app notification. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="9. Contact us">
            <p>If you have questions about this privacy policy or your data, contact us at:</p>
            <p className="font-medium" style={{ color: 'var(--text)' }}>support@notarydesk.app</p>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/terms" className="text-[13px] font-medium no-underline hover:underline flex items-center gap-1"
            style={{ color: 'var(--primary)' }}>
            <Icon name="gavel" size={14} /> Terms of Service
          </Link>
          <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} NotaryDesk. All rights reserved.
          </span>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[17px] font-bold mb-3" style={{ color: 'var(--text)' }}>{title}</h2>
      <div className="space-y-3 text-[14px] leading-relaxed">{children}</div>
    </section>
  )
}