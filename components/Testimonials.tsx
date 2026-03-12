import styles from './Testimonials.module.css'

const TESTIMONIALS = [
  {
    quote: "I used to spend an hour every Sunday doing mileage in a spreadsheet. Now NotaryDesk tracks it while I drive. I found hundreds in deductions I was completely missing.",
    name: "Sandra M.", role: "Loan Signing Agent · Florida", initials: "SM", color: "#DBEAFE", textColor: "#1E40AF",
  },
  {
    quote: "The journal is exactly what I needed. My state requires specific fields and NotaryDesk has them all locked after 24 hours. Finally a digital option that's actually compliant.",
    name: "Robert T.", role: "Notary Public · California", initials: "RT", color: "#EDE9FE", textColor: "#5B21B6",
  },
  {
    quote: "My clients used to get a Word doc invoice. Now I send a professional PDF from the app in 30 seconds. I look 10x more professional and get paid faster.",
    name: "Michelle K.", role: "Mobile Notary · Texas", initials: "MK", color: "#DCFCE7", textColor: "#15803D",
  },
]

const FAQS = [
  {
    q: 'Is the journal legally compliant in my state?',
    a: 'NotaryDesk includes essential fields like date, signer name, document type, and fee. Entries lock after 24 hours to meet tamper-evidence requirements found in states like Florida, Texas, and California. We are constantly updating our compliance engine to support specific state-by-state mandates.',
  },
  {
    q: 'How does mileage tracking work — is it IRS-compliant?',
    a: 'Yes. The IRS requires a contemporaneous log including date, locations, and business purpose. NotaryDesk records these automatically via GPS. Your exports are organized and ready for tax season or your accountant.',
  },
  {
    q: 'When will the iPhone app be available?',
    a: 'We are in the final stages of testing for the iOS version. If you are an iPhone user, please sign up for the waitlist and we will notify you the moment it hits the App Store.',
  },
  {
    q: 'Does it work without internet?',
    a: 'The current version performs best with a data connection. We are actively developing a "Local-First" sync mode that will allow you to log entries in dead zones (like hospitals or rural areas) and sync them once you’re back online.',
  },
  {
    q: 'What happens to my data? Is it private?',
    a: 'Privacy is our priority. Your data is encrypted and isolated, meaning only you have access to your records. We use bank-grade security protocols to ensure your notary journal remains confidential and secure.',
  },
  {
    q: 'Can I use this for my whole notary agency?',
    a: 'Currently, NotaryDesk is optimized for individual mobile notaries. However, we are developing an Agency Plan that will offer centralized billing and reporting for teams. Contact us if you’d like to be a beta tester for agency features.',
  },
]

export default function Testimonials() {
  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.eyebrow}>Success Stories</span>
            <h2 className={styles.title}>Built for <em className={styles.accent}>modern notaries.</em></h2>
          </div>
          <div className={styles.grid}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className={styles.card}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.quote}>"{t.quote}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar} style={{ background: t.color, color: t.textColor }}>{t.initials}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection} id="faq">
        <div className="container">
          <div className={styles.header}>
            <span className={styles.eyebrow}>FAQ</span>
            <h2 className={styles.title}>Common <em className={styles.accent}>Questions.</em></h2>
          </div>
          <div className={styles.faqGrid}>
            {FAQS.map(f => (
              <div key={f.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}