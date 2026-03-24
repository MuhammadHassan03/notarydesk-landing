// app/terms/page.tsx
import Nav from '@/components/landing/Nav'
import { Footer } from '@/components/landing'

export const metadata = {
  title: 'Terms of Service — NotaryDesk',
  description: 'Terms and conditions for using NotaryDesk.',
}

/**
 * MI Component: Renders Material Symbols Rounded
 * Note: Requires the Google Font link in your layout.tsx to display.
 */
const MI = ({ name, size = 20, className = '', style }: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties
}) => (
  <span
    className={`material-symbols-rounded ${className}`}
    style={{
      fontSize: size,
      lineHeight: 1,
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style
    }}
  >
    {name}
  </span>
)

export default function TermsPage() {
  const updated = 'June 1, 2025'

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">

        {/* ── Header Section ────────────────────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-16 mb-12">
          <div className="max-w-4xl mx-auto px-6">
            <p className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-3">
              <MI name="gavel" size={16} />
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
              Last updated: {updated}
            </p>
          </div>
        </div>

        {/* ── Body Content ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">

            <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-6 py-2">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the NotaryDesk
              mobile application and website (collectively, the &ldquo;Service&rdquo;) operated by NotaryDesk
              (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By creating an account or using the Service,
              you agree to be bound by these Terms.
            </p>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                By accessing or using NotaryDesk, you confirm that you are at least 18 years old,
                have the legal authority to enter into these Terms, and agree to comply with them.
                If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. Description of Service</h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                <p>
                  NotaryDesk is a business management application designed for US mobile notaries. The Service
                  includes tools for maintaining a digital notary journal, tracking mileage, creating and sending
                  invoices, managing appointments, and tracking business expenses.
                </p>
                <p>
                  NotaryDesk is a productivity tool. It is your responsibility to ensure that your use of the
                  app complies with the notary laws and regulations of your specific state. NotaryDesk does not
                  provide legal advice and is not a substitute for consulting a licensed attorney.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">3. Account Registration</h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                <p>
                  You must create an account to use NotaryDesk. You agree to provide accurate, complete,
                  and current information. You are responsible for maintaining the confidentiality of your
                  password and for all activity that occurs under your account.
                </p>
                <p>
                  You must notify us immediately at <a href="mailto:engineermirzahassan@gmail.com" className="text-blue-600 hover:underline">engineermirzahassan@gmail.com</a> if
                  you suspect unauthorized access to your account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">4. Subscriptions and Payments</h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Free Plan</h3>
                  <p>NotaryDesk offers a free plan with limited features. No payment information is required.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Paid Plans (Pro and Plus)</h3>
                  <p>Paid subscriptions are billed through Apple App Store (iOS) or Google Play (Android). Subscriptions automatically renew unless cancelled 24 hours before the end of the period.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Cancellations and Refunds</h3>
                  <p>Cancel anytime via app store settings. Refunds are handled by Apple or Google per their respective policies.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">5. Acceptable Use</h2>
              <ul className="list-disc ml-6 text-slate-600 dark:text-slate-400 space-y-2">
                <li>Use the Service for any unlawful purpose or in violation of any regulation.</li>
                <li>Enter false, misleading, or fraudulent information into your journal.</li>
                <li>Attempt to reverse-engineer, decompile, or extract source code.</li>
                <li>Use automated tools, scrapers, or bots to access the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">6. Your Content and Data</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You retain ownership of Your Content. By using the Service, you grant us a limited license
                to process and store Your Content solely to provide the Service. You are responsible for
                the legal sufficiency of records created using the app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">7. Disclaimers</h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                <p className="font-bold uppercase text-xs tracking-widest text-slate-500">The Service is provided &ldquo;As Is&rdquo;.</p>
                <p>
                  <strong>IRS and Tax Disclaimer:</strong> Mileage logs and expense summaries are for convenience
                  only. We make no representation that records will be accepted by the IRS or any tax authority.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">8. Limitation of Liability</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed uppercase text-sm">
                To the maximum extent permitted by law, NotaryDesk shall not be liable for any indirect,
                incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            {/* ── Contact Section ─────────────────────────────────────── */}
            <section className="mt-16 p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 transition-colors">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                <MI name="contact_support" size={24} className="text-blue-600" />
                13. Contact
              </h2>
              <p className="mb-8 text-slate-600 dark:text-slate-400 font-medium">For questions regarding these Terms, please reach out:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MI name="mail" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Legal Dept</span>
                    <a href="mailto:legal@notarydesk.app" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600">legal@notarydesk.app</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <MI name="support_agent" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tech Support</span>
                    <a href="mailto:engineermirzahassan@gmail.com" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors truncate">
                      mirzahassan@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}