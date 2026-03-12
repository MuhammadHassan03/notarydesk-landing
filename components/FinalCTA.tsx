import styles from './FinalCTA.module.css'

export default function FinalCTA() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>
          Ready to run your notary business<br />
          <em className={styles.accent}>like a pro?</em>
        </h2>
        <p className={styles.sub}>
          Join a growing community of mobile notaries using NotaryDesk to track miles, 
          secure their journals, and get paid faster. Start free today.
        </p>

        <div className={styles.buttons}>
          {/* Main CTA - Focused on the notification/waitlist funnel */}
          <a href="#notify" className={styles.btnPrimary}>
            Get Early Access
          </a>

          {/* Secondary Info - Platform Status */}
          <div className={styles.platformStatus}>
            <div className={styles.statusItem}>
              <span className={styles.statusDot} /> Android: Final Testing
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusDotMuted} /> iOS: Coming Soon
            </div>
          </div>
        </div>

        <div className={styles.trustRow}>
          {['✓ 14-day free trial','✓ No credit card required','✓ Secure & Encrypted','✓ Cancel any time'].map(t => (
            <span key={t} className={styles.trustItem}>{t}</span>
          ))}
        </div>

        <div className={styles.bigNumbers}>
          {[
            { value: '60s', label: 'To log any signing' },
            { value: '100%', label: 'Digital Compliance' },
            { value: 'Thousands', label: 'Potential Tax Deductions' },
            { value: '24/7', label: 'Priority Support Access' },
          ].map(s => (
            <div key={s.label} className={styles.bigNum}>
              <span className={styles.bigNumVal}>{s.value}</span>
              <span className={styles.bigNumLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}