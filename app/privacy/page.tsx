// app/privacy/page.tsx
import Nav from '@/components/landing/Nav'
import { Footer } from '@/components/landing'

export const metadata = {
  title: 'Privacy Policy — NotaryDesk',
  description: 'How NotaryDesk collects, uses, and protects your personal information.',
}

/**
 * MI Component: Renders Material Symbols Rounded
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

export default function PrivacyPage() {
  const updated = 'March 25, 2026'

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
        
        {/* ── Header Section ────────────────────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-16 mb-12">
          <div className="max-w-4xl mx-auto px-6">
            <p className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-xs mb-3">
              <MI name="verified_user" size={16} />
              Legal & Safety
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
              Last updated: {updated}
            </p>
          </div>
        </div>

        {/* ── Body Content ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            
            <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 italic border-l-4 border-indigo-500 pl-6 py-2">
              NotaryDesk (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our mobile application and website.
            </p>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">1. Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <MI name="person_edit" size={20} className="text-indigo-500" />
                    Information you provide directly
                  </h3>
                  <ul className="list-disc ml-6 text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                    <li><strong>Account:</strong> Name, email address, and password.</li>
                    <li><strong>Profile:</strong> Notary commission details, business name, and photo.</li>
                    <li><strong>Business Data:</strong> Journal entries, signer names, invoice details, and expense records.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <MI name="devices" size={20} className="text-indigo-500" />
                    Information collected automatically
                  </h3>
                  <ul className="list-disc ml-6 text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                    <li><strong>Location Data:</strong> GPS coordinates for active mileage tracking (foreground/background as permitted).</li>
                    <li><strong>Usage Data:</strong> Feature interactions and error logs.</li>
                    <li><strong>Device Info:</strong> Operating system, device type, and app version.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. How We Use Your Information</h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                <p>We use your data to maintain the service, generate tax reports, and facilitate your notary business. <strong>We do not sell your personal information or use journal data for advertising.</strong></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white text-flex items-center gap-2">
                <MI name="shield_lock" size={24} className="text-green-600" />
                3. Data Storage and Security
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your data is stored using Supabase (SOC 2 compliant). All data is encrypted in transit (TLS 1.2+) 
                and at rest (AES-256). Journal entries are logically isolated and accessible only by you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">4. Third-Party Services</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">We partner with reputable providers to operate NotaryDesk:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { n: 'Supabase', d: 'Auth, Database & Storage' },
                  { n: 'RevenueCat', d: 'Subscriptions' },
                  { n: 'Vercel', d: 'API Hosting' },
                  { n: 'Expo', d: 'App Framework' }
                ].map((item) => (
                  <div key={item.n} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="block font-bold text-slate-900 dark:text-white">{item.n}</span>
                    <span className="text-xs text-slate-500">{item.d}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">5. Your Rights</h2>
              <ul className="list-disc ml-6 text-slate-600 dark:text-slate-400 space-y-2">
                <li><strong>Access & Export:</strong> View and download your data anytime.</li>
                <li><strong>Deletion:</strong> Delete your account and data permanently via Settings (irreversible).</li>
                <li><strong>Correction:</strong> Modify any record directly within the app.</li>
              </ul>
            </section>

            {/* ── Contact Section ─────────────────────────────────────── */}
            <section className="mt-16 p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                <MI name="alternate_email" size={24} className="text-indigo-600" />
                Contact Us
              </h2>
              <p className="mb-8 text-slate-600 dark:text-slate-400 font-medium">
                If you have questions regarding this Privacy Policy or your data, reach out to us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <MI name="privacy_tip" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Privacy Officer</span>
                    <a href="mailto:privacy@notarydesk.app" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">privacy@notarydesk.app</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <MI name="support_agent" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Support</span>
                    <a href="mailto:engineermirzahassan@gmail.com" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors truncate">mirzahassan@gmail.com</a>
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