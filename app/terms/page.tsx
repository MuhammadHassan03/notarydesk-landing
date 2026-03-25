'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/icons'

const EFFECTIVE_DATE = 'January 1, 2025'

export default function TermsOfServicePage() {
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
          <Icon name="gavel" size={28} style={{ color: 'var(--primary)' }} />
          <h1 className="text-[28px] font-extrabold" style={{ color: 'var(--text)' }}>Terms of Service</h1>
        </div>
        <p className="text-[13px] mb-10" style={{ color: 'var(--text-tertiary)' }}>
          Effective date: {EFFECTIVE_DATE}
        </p>

        <div className="space-y-8" style={{ color: 'var(--text-secondary)' }}>
          <Section title="1. Acceptance of terms">
            <p>By creating an account or using NotaryDesk ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to both the mobile app and the web dashboard.</p>
          </Section>

          <Section title="2. Description of service">
            <p>NotaryDesk is a business management tool for mobile notary signing agents. It provides digital notary journal recording, GPS mileage tracking with IRS deduction calculations, invoice generation, appointment management, expense tracking, signing job pipeline management, and tax savings reporting.</p>
            <p>The Service is a tool to assist your notary business operations. It does not provide legal, tax, or financial advice. You are responsible for ensuring your use of the Service complies with your state's notary laws and regulations.</p>
          </Section>

          <Section title="3. Account registration">
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials. You must be a legal adult to use the Service. You must not create accounts for others without their consent.</p>
          </Section>

          <Section title="4. Subscription plans">
            <p>NotaryDesk offers Free, Pro, and Business subscription tiers. The Free plan includes limited signing jobs with full feature access. Paid plans unlock unlimited jobs, invoice email/SMS delivery, PDF exports, and additional features as described on our pricing page.</p>
            <p>Paid subscriptions are billed monthly or annually through Apple App Store, Google Play Store, or our web payment system. Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current billing period. Prices may change with reasonable notice.</p>
          </Section>

          <Section title="5. Acceptable use">
            <p>You agree not to use the Service to violate any laws or regulations, to store false or fraudulent notary records, to attempt to access other users' data, to reverse engineer or decompile the app, or to use automated tools to scrape or extract data from the Service.</p>
          </Section>

          <Section title="6. Data ownership">
            <p>You retain ownership of all data you enter into NotaryDesk, including journal entries, invoices, mileage logs, and business records. We do not claim any intellectual property rights over your content.</p>
            <p>You grant us a limited license to store, process, and display your data as necessary to provide the Service, including syncing between devices and generating reports.</p>
          </Section>

          <Section title="7. State compliance">
            <p>NotaryDesk includes a state compliance engine that enforces certain fields and rules based on your state's notary laws. While we strive for accuracy, the compliance engine is provided as a convenience and may not reflect the most current laws in every jurisdiction.</p>
            <p>You are ultimately responsible for ensuring your notary practices comply with your state's requirements. NotaryDesk is not a substitute for legal counsel.</p>
          </Section>

          <Section title="8. Service availability">
            <p>We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. The mobile app works offline; data syncs when connectivity is restored. We may perform scheduled maintenance with advance notice.</p>
          </Section>

          <Section title="9. Limitation of liability">
            <p>NotaryDesk is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid for the Service in the 12 months preceding the claim.</p>
          </Section>

          <Section title="10. Account termination">
            <p>You may delete your account at any time from the Settings screen. We may suspend or terminate accounts that violate these terms. Upon deletion, all your data is permanently removed from our servers within 30 days.</p>
          </Section>

          <Section title="11. Changes to terms">
            <p>We may update these terms from time to time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Continued use after changes constitutes acceptance.</p>
          </Section>

          <Section title="12. Governing law">
            <p>These terms are governed by the laws of the United States. Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
          </Section>

          <Section title="13. Contact">
            <p>For questions about these terms, contact us at:</p>
            <p className="font-medium" style={{ color: 'var(--text)' }}>support@notarydesk.app</p>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/privacy" className="text-[13px] font-medium no-underline hover:underline flex items-center gap-1"
            style={{ color: 'var(--primary)' }}>
            <Icon name="shield" size={14} /> Privacy Policy
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