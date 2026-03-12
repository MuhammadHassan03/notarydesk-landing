import styles from './ProblemSection.module.css'

const PROBLEMS = [
  {
    emoji: '📋',
    before: 'Paper Notary Journal',
    pain: 'Handwritten notebooks that can be lost, damaged, or ruled illegible in court.',
    after: 'Digital journal — encrypted, auto-timestamped, and exportable. Locked after 24 hours to meet legal standards.',
  },
  {
    emoji: '🚗',
    before: 'Manual Mileage Tracking',
    pain: 'Driving 100+ miles a day without a proper log leaves thousands in IRS deductions on the table every year.',
    after: 'One tap starts GPS tracking. IRS deductions are calculated automatically and export-ready at tax time.',
  },
  {
    emoji: '💸',
    before: 'Unprofessional Invoicing',
    pain: 'Chasing payments via casual apps looks unprofessional. It’s easy to forget follow-ups or miss a payment.',
    after: 'Professional invoices sent via email or SMS in seconds. Clients receive a branded link to pay you instantly.',
  },
  {
    emoji: '📱',
    before: 'Scattered Scheduling',
    pain: 'Bookings come from different platforms, emails, and texts. Without a central hub, it’s easy to double-book.',
    after: 'A unified appointment board. One tap converts a booking into a journal entry and starts your mileage tracker.',
  },
  {
    emoji: '😰',
    before: 'Tax Season Chaos',
    pain: 'A year of crumpled receipts and partial logs usually leads to a panic-filled week of bookkeeping.',
    after: 'Year-round organized records. Export your IRS mileage log and income summary as one clean PDF packet.',
  },
]

export default function ProblemSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>The Solution</span>
          <h2 className={styles.title}>
            You run a real business.<br />
            <em className={styles.accent}>Use professional tools.</em>
          </h2>
          <p className={styles.sub}>
            Mobile notaries handle high-stakes legal documents every day. 
            It’s time to move past paper notebooks and scattered phone notes.
          </p>
        </div>

        <div className={styles.grid}>
          {PROBLEMS.map(p => (
            <div key={p.before} className={styles.card}>
              <div className={styles.topRow}>
                <span className={styles.emoji}>{p.emoji}</span>
                <div className={styles.beforeBadge}>The Old Way</div>
              </div>
              <h3 className={styles.cardTitle}>{p.before}</h3>
              <p className={styles.painText}>{p.pain}</p>
              <div className={styles.divider}>
                <span className={styles.dividerLabel}>NotaryDesk Way</span>
              </div>
              <p className={styles.afterText}>{p.after}</p>
            </div>
          ))}

          {/* REMOVED: The Big Stat Card. 
            Public users don't need to know the 4.4M market size; 
            they only care that you solved their specific pain points.
          */}
        </div>
      </div>
    </section>
  )
}