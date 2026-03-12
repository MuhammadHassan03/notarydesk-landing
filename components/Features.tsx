import styles from './Features.module.css'

const FEATURES = [
  {
    icon: '📓',
    color: '#EDE9FE',
    iconBg: '#5B21B6',
    title: 'Digital Notary Journal',
    desc: 'The essential legal requirement for every signing. Log signer details, document types, and ID verifications instantly. Entries are locked after 24 hours to ensure state-compliant record keeping.',
    bullets: [
      'Pre-filled templates for Deeds, POAs, and Loan Packages',
      'Verify Driver’s Licenses, Passports, and State IDs',
      'Tamper-evident logs that meet digital journal requirements',
      'Export state-compliant PDF journals in a single tap',
    ],
    stat: { value: '100%', label: 'Secure & compliant with state digital journal laws' },
  },
  {
    icon: '🗺️',
    color: '#DBEAFE',
    iconBg: '#1D4ED8',
    title: 'GPS Mileage Tracker',
    desc: 'Built specifically for the high-mileage notary. One tap starts a high-accuracy tracking session that automatically calculates your IRS deductions as you drive.',
    bullets: [
      'Live tracking with signal quality and accuracy indicators',
      'Smart filters designed for highway and neighborhood driving',
      'Manual log support for forgotten trips or back-dated entries',
      'IRS-compliant logs ready for tax filing or reimbursements',
    ],
    stat: { value: '$20K+', label: 'Estimated annual tax deductions for active notaries' },
  },
  {
    icon: '🧾',
    color: '#FEF3C7',
    iconBg: '#92400E',
    title: 'Professional Invoicing',
    desc: 'Get paid faster with branded invoices created in seconds. Pull data directly from your journal entries to ensure accuracy and professionalism every time.',
    bullets: [
      'Deliver invoices instantly via professional Email or SMS',
      'Support for Zelle, Venmo, Cash, Check, and Credit Card',
      'Real-time status tracking: Sent, Paid, and Overdue',
      'Centralized archive of all past earnings and billing history',
    ],
    stat: { value: '30 sec', label: 'Average time to create and send a branded invoice' },
  },
  {
    icon: '📅',
    color: '#DCFCE7',
    iconBg: '#15803D',
    title: 'Appointment Manager',
    desc: 'Consolidate jobs from every platform into one central dashboard. Manage your schedule, set reminders, and convert appointments into journal entries effortlessly.',
    bullets: [
      'Unified calendar view for your full signing schedule',
      'Automatic client reminders to reduce no-shows',
      'Seamless workflow: Appointment → Journal → Invoice',
      'Track signing status and history across all your agencies',
    ],
    stat: { value: '0', label: 'Missed appointments or double-bookings' },
  },
]

export default function Features() {
  return (
    <section className={styles.section} id="features">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>The Toolkit</span>
          <h2 className={styles.title}>
            Everything a notary needs.<br />
            <em className={styles.accent}>Nothing they don&apos;t.</em>
          </h2>
          <p className={styles.sub}>
            Not a generic business app. NotaryDesk was designed from the ground up for one person: the modern mobile signing agent.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`${styles.card} ${i % 2 === 1 ? styles.cardAlt : ''}`}>
              <div className={styles.cardLeft}>
                <div className={styles.iconWrap} style={{ background: f.color }}>
                  <span className={styles.icon}>{f.icon}</span>
                </div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
                <ul className={styles.bullets}>
                  {f.bullets.map(b => (
                    <li key={b} className={styles.bullet}>
                      <span className={styles.check}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.statBox} style={{ background: f.color }}>
                <div className={styles.statValue}>{f.stat.value}</div>
                <div className={styles.statLabel}>{f.stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}