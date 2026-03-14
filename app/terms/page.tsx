// app/terms/page.tsx
import styles from '@/components/legal.module.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Terms of Service — NotaryDesk',
  description: 'Terms and conditions for using NotaryDesk.',
}

export default function TermsPage() {
  const updated = 'June 1, 2025'

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <div className={styles.header}>
          <div className="container">
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.meta}>Last updated: {updated}</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.body}>

            <p className={styles.intro}>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the NotaryDesk
              mobile application and website (collectively, the &ldquo;Service&rdquo;) operated by NotaryDesk
              (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By creating an account or using the Service,
              you agree to be bound by these Terms.
            </p>

            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using NotaryDesk, you confirm that you are at least 18 years old,
                have the legal authority to enter into these Terms, and agree to comply with them.
                If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                NotaryDesk is a business management application designed for US mobile notaries. The Service
                includes tools for maintaining a digital notary journal, tracking mileage, creating and sending
                invoices, managing appointments, and tracking business expenses.
              </p>
              <p>
                NotaryDesk is a productivity tool. It is your responsibility to ensure that your use of the
                app complies with the notary laws and regulations of your specific state. NotaryDesk does not
                provide legal advice and is not a substitute for consulting a licensed attorney or your state&rsquo;s
                notary regulating authority.
              </p>
            </section>

            <section>
              <h2>3. Account Registration</h2>
              <p>
                You must create an account to use NotaryDesk. You agree to provide accurate, complete,
                and current information. You are responsible for maintaining the confidentiality of your
                password and for all activity that occurs under your account.
              </p>
              <p>
                You must notify us immediately at <a href="mailto:engineermirzahassan@gmail.com">engineermirzahassan@gmail.com</a> if
                you suspect unauthorized access to your account. We are not liable for losses caused by
                unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2>4. Subscriptions and Payments</h2>

              <h3>Free Plan</h3>
              <p>
                NotaryDesk offers a free plan with limited features. No payment information is required
                to use the free plan.
              </p>

              <h3>Paid Plans (Pro and Plus)</h3>
              <p>
                Paid subscriptions are billed through Apple App Store (iOS) or Google Play (Android).
                Subscription fees are charged to your Apple ID or Google Play account upon confirmation
                of purchase. Subscriptions automatically renew at the end of each billing period unless
                cancelled at least 24 hours before the renewal date.
              </p>

              <h3>Free Trials</h3>
              <p>
                Where offered, a free trial period begins upon subscription confirmation. If you do not
                cancel before the trial ends, you will be charged the standard subscription rate.
              </p>

              <h3>Cancellations and Refunds</h3>
              <p>
                You may cancel your subscription at any time through your device&rsquo;s app store settings.
                Cancellation takes effect at the end of the current billing period — you retain access
                to paid features until then. Refunds are governed by Apple App Store and Google Play
                refund policies, not by NotaryDesk directly.
              </p>

              <h3>Price Changes</h3>
              <p>
                We may modify subscription pricing with at least 30 days&rsquo; notice. Continued use of
                the paid Service after the effective date of a price change constitutes acceptance.
              </p>
            </section>

            <section>
              <h2>5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose or in violation of any regulation.</li>
                <li>Enter false, misleading, or fraudulent information into your notary journal or invoices.</li>
                <li>Attempt to reverse-engineer, decompile, or extract source code from the app.</li>
                <li>Use automated tools, scrapers, or bots to access the Service.</li>
                <li>Share your account credentials with others or resell access to the Service.</li>
                <li>Use the Service to harass, spam, or harm any person.</li>
                <li>Attempt to gain unauthorized access to our systems or other users&rsquo; data.</li>
              </ul>
            </section>

            <section>
              <h2>6. Your Content and Data</h2>
              <p>
                You retain ownership of all content and data you enter into NotaryDesk, including journal
                entries, invoices, expense records, and uploaded files (&ldquo;Your Content&rdquo;). By using the Service,
                you grant us a limited license to process, store, and display Your Content solely for the
                purpose of providing the Service to you.
              </p>
              <p>
                You are solely responsible for the accuracy, legality, and appropriateness of Your Content.
                We do not review journal entries for compliance with state notary laws and make no
                representations about the legal sufficiency of records created using the app.
              </p>
            </section>

            <section>
              <h2>7. Intellectual Property</h2>
              <p>
                The NotaryDesk name, logo, app design, and all software are the property of NotaryDesk
                and protected by applicable intellectual property laws. You may not copy, modify, distribute,
                or create derivative works based on our Service without written permission.
              </p>
            </section>

            <section>
              <h2>8. Disclaimers</h2>
              <p>
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that the Service will be uninterrupted, error-free, or free of viruses
                or other harmful components. We do not guarantee that the mileage calculations or journal
                templates will satisfy the specific requirements of any particular state notary law.
              </p>
              <p>
                <strong>IRS and Tax Disclaimer:</strong> Mileage logs and expense summaries generated by
                NotaryDesk are for your record-keeping convenience. They are not a substitute for advice
                from a qualified tax professional. We make no representation that records generated by the
                app will be accepted by the IRS or any tax authority.
              </p>
            </section>

            <section>
              <h2>9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOTARYDESK SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA,
                OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF WE HAVE
                BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE
                SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100,
                WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2>10. Termination</h2>
              <p>
                You may delete your account at any time from the Settings screen in the app.
                Upon deletion, your data will be permanently removed within 30 days.
              </p>
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms,
                with or without notice. Upon termination, your right to use the Service ceases immediately.
              </p>
            </section>

            <section>
              <h2>11. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the United States,
                without regard to conflict of law principles. Any disputes shall be resolved through
                binding arbitration rather than in court, except that either party may seek injunctive
                relief in a court of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2>12. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of material changes
                within the app or by email. Your continued use of the Service after the effective date
                of changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2>13. Contact</h2>
              <p>For questions about these Terms, contact us:</p>
              <div className={styles.contactBlock}>
                <p><strong>NotaryDesk</strong></p>
                <p>Email: <a href="mailto:legal@notarydesk.app">legal@notarydesk.app</a></p>
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