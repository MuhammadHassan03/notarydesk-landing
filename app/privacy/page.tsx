// app/privacy/page.tsx
import styles from '@/components/legal.module.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy — NotaryDesk',
  description: 'How NotaryDesk collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  const updated = 'June 1, 2025'

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <div className={styles.header}>
          <div className="container">
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.meta}>Last updated: {updated}</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.body}>

            <p className={styles.intro}>
              NotaryDesk (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our mobile application and website. Please read this policy carefully.
            </p>

            <section>
              <h2>1. Information We Collect</h2>

              <h3>Information you provide directly</h3>
              <ul>
                <li><strong>Account information:</strong> Name, email address, and password when you register.</li>
                <li><strong>Profile information:</strong> Notary commission number, state, business name, phone number, and profile photo (optional).</li>
                <li><strong>Journal entries:</strong> Signer names, document types, identification details, and fees you log in the app.</li>
                <li><strong>Invoice and appointment data:</strong> Client names, contact information, services rendered, and payment details you enter.</li>
                <li><strong>Expense records:</strong> Business expense descriptions, amounts, dates, and receipt images you upload.</li>
              </ul>

              <h3>Information collected automatically</h3>
              <ul>
                <li><strong>Location data:</strong> GPS coordinates when you use the mileage tracking feature. We only collect location data while a trip is actively recording and only when you grant permission. We do not collect location data in the background beyond active tracking sessions.</li>
                <li><strong>Usage data:</strong> App interactions, feature usage frequency, and error logs to improve the service.</li>
                <li><strong>Device information:</strong> Device type, operating system version, and app version for support and compatibility purposes.</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve the NotaryDesk application.</li>
                <li>Process your journal entries, invoices, mileage logs, and appointments.</li>
                <li>Generate PDF exports and tax reports from your data on request.</li>
                <li>Send transactional emails (invoice delivery, password resets, account notifications).</li>
                <li>Respond to your support requests.</li>
                <li>Detect and prevent fraud or misuse of the service.</li>
                <li>Comply with applicable laws and legal obligations.</li>
              </ul>
              <p><strong>We do not sell your personal information to third parties. We do not use your notary journal data for advertising purposes.</strong></p>
            </section>

            <section>
              <h2>3. Data Storage and Security</h2>
              <p>
                Your data is stored securely using Supabase, a SOC 2 compliant cloud infrastructure provider.
                All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Your notary journal entries
                are logically isolated and accessible only by your authenticated account.
              </p>
              <p>
                We implement industry-standard security measures including authentication tokens,
                rate limiting, and audit logging. However, no method of transmission over the internet
                is 100% secure. We encourage you to use a strong, unique password for your account.
              </p>
            </section>

            <section>
              <h2>4. Location Data</h2>
              <p>
                The mileage tracking feature requires access to your device&rsquo;s location. We request
                &ldquo;When In Use&rdquo; location permission for foreground trip tracking, and optionally
                &ldquo;Always&rdquo; permission if you want background tracking while the app is minimized.
              </p>
              <p>
                Location data is used solely to calculate trip distance and generate IRS-compliant mileage logs.
                Precise GPS coordinates are not shared with third parties and are not stored longer than
                necessary to complete the trip record.
              </p>
            </section>

            <section>
              <h2>5. Receipt Images and File Uploads</h2>
              <p>
                Receipt images uploaded through the expense tracker are stored in a private, access-controlled
                storage bucket linked to your account. Images are not publicly accessible and are not used
                for any purpose other than displaying them within your expense records.
              </p>
              <p>
                When you delete an expense record, the associated receipt image is also permanently deleted
                from our storage.
              </p>
            </section>

            <section>
              <h2>6. Third-Party Services</h2>
              <p>We use the following third-party service providers to operate NotaryDesk:</p>
              <ul>
                <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
                <li><strong>RevenueCat</strong> — subscription and in-app purchase management. RevenueCat may collect purchase history and device identifiers as described in their privacy policy.</li>
                <li><strong>Vercel</strong> — API hosting and web deployment.</li>
                <li><strong>Expo / React Native</strong> — mobile app framework. Expo collects limited crash and usage analytics.</li>
              </ul>
              <p>
                We do not integrate advertising networks, social media trackers, or data brokers into the app.
              </p>
            </section>

            <section>
              <h2>7. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access your data:</strong> View all information stored in your account at any time through the app.</li>
                <li><strong>Export your data:</strong> Generate PDF exports of your journal, mileage logs, and invoices from within the app.</li>
                <li><strong>Correct your data:</strong> Update any profile or record information directly in the app.</li>
                <li><strong>Delete your account:</strong> Permanently delete your account and all associated data using the &ldquo;Delete Account&rdquo; option in Settings. This action is irreversible.</li>
                <li><strong>Opt out of marketing:</strong> We do not send marketing emails by default. If we do in the future, every email will include an unsubscribe link.</li>
              </ul>
            </section>

            <section>
              <h2>8. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. If you delete your account,
                we will permanently delete your personal data within 30 days, except where we are required
                to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section>
              <h2>9. Children&rsquo;s Privacy</h2>
              <p>
                NotaryDesk is not directed to children under 18 years of age. We do not knowingly collect
                personal information from minors. If you believe we have inadvertently collected such
                information, please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes
                by posting the new policy in the app and updating the &ldquo;last updated&rdquo; date at the top.
                Your continued use of the app after changes take effect constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2>11. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal
                data, please contact us:
              </p>
              <div className={styles.contactBlock}>
                <p><strong>NotaryDesk</strong></p>
                <p>Email: <a href="mailto:privacy@notarydesk.app">privacy@notarydesk.app</a></p>
                <p>Support: <a href="mailto:engineermirzahassan@gmail.com">engineermirzahassan@gmail.com</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}