import styles from './Roadmap.module.css'

const NOW = [
  { icon: '📓', title: 'Digital Notary Journal', desc: 'State-compliant logging. Secure entries and easy PDF exports.' },
  { icon: '🗺️', title: 'GPS Mileage Tracker', desc: 'Automatic tracking and calculation of IRS mileage deductions.' },
  { icon: '🧾', title: 'Professional Invoices', desc: 'Generate and send invoices via Email or SMS in seconds.' },
  { icon: '📅', title: 'Appointment Manager', desc: 'Unified calendar view to manage all your signings in one place.' },
  { icon: '🔐', title: 'Secure Data Privacy', desc: 'Bank-grade encryption—your records are 100% private.' },
]

const SOON = [
  { icon: '💳', title: 'Integrated Payments', desc: 'Enable clients to pay invoices via card or digital wallet instantly.' },
  { icon: '👥', title: 'Smart Signer Directory', desc: 'Save client profiles to auto-fill journal fields for returning signers.' },
  { icon: '📊', title: 'Comprehensive Tax Reports', desc: 'Annual income and expense summaries ready for your accountant.' },
]

const FUTURE = [
  { icon: '🤖', title: 'Intelligent ID Scanning', desc: 'Auto-fill journal fields by safely scanning driver’s licenses.' },
  { icon: '📡', title: 'Advanced Offline Mode', desc: 'Work in rural areas or hospitals with automatic cloud syncing.' },
  { icon: '🏛️', title: 'State-Specific Logic', desc: 'Dynamic fields tailored to your specific state’s notary laws.' },
  { icon: '🎥', title: 'Integrated RON Support', desc: 'Tools for Remote Online Notarization sessions and digital seals.' },
]

export default function Roadmap() {
  return (
    <section className={styles.section} id="roadmap">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Product Roadmap</span>
          <h2 className={styles.title}>
            Built for today.<br />
            <em className={styles.accent}>Ready for tomorrow.</em>
          </h2>
          <p className={styles.sub}>
            We are constantly improving NotaryDesk. Here is a look at the 
            features we are currently building to help your business grow.
          </p>
        </div>

        {/* Available Now */}
        <div className={styles.phase}>
          <div className={styles.phaseHead}>
            <div className={`${styles.phaseBadge} ${styles.live}`}>
              <span className={styles.liveDot} />
              Available Now
            </div>
            <h3 className={styles.phaseTitle}>Core Platform</h3>
            <p className={styles.phaseDesc}>The essential toolkit for every mobile notary, live and ready to use.</p>
          </div>
          <div className={styles.featureGrid}>
            {NOW.map(f => (
              <div key={f.title} className={`${styles.featureCard} ${styles.liveCard}`}>
                <span className={styles.fIcon}>{f.icon}</span>
                <div>
                  <div className={styles.fTitle}>{f.title}</div>
                  <div className={styles.fDesc}>{f.desc}</div>
                </div>
                <span className={styles.checkMark}>✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className={styles.connector}>
          <div className={styles.connLine}/><span className={styles.connLabel}>Coming Next</span><div className={styles.connLine}/>
        </div>
        
        <div className={styles.phase}>
          <div className={styles.phaseHead}>
            <div className={`${styles.phaseBadge} ${styles.soon}`}>Next Release</div>
            <h3 className={styles.phaseTitle}>Seamless Payments & Growth</h3>
            <p className={styles.phaseDesc}>Upcoming tools to help you get paid faster and manage repeat business.</p>
          </div>
          <div className={styles.featureGrid}>
            {SOON.map(f => (
              <div key={f.title} className={`${styles.featureCard} ${styles.soonCard}`}>
                <span className={styles.fIcon}>{f.icon}</span>
                <div>
                  <div className={styles.fTitle}>{f.title}</div>
                  <div className={styles.fDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Vision */}
        <div className={styles.connector}>
          <div className={styles.connLine}/><span className={styles.connLabel}>Future Vision</span><div className={styles.connLine}/>
        </div>

        <div className={styles.phase}>
          <div className={styles.phaseHead}>
            <div className={`${styles.phaseBadge} ${styles.future}`}>In Development</div>
            <h3 className={styles.phaseTitle}>Advanced Notary Intelligence</h3>
            <p className={styles.phaseDesc}>High-tech features including AI scanning and expanded compliance support.</p>
          </div>
          <div className={styles.featureGrid}>
            {FUTURE.map(f => (
              <div key={f.title} className={`${styles.featureCard} ${styles.futureCard}`}>
                <span className={styles.fIcon}>{f.icon}</span>
                <div>
                  <div className={styles.fTitle}>{f.title}</div>
                  <div className={styles.fDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Vision Quote - Cleaned up */}
        <div className={styles.visionBlock}>
          <div className={styles.visionQuote}>
            "Our mission is to make NotaryDesk the standard for professional mobile notaries—providing the tools you need to stay organized, compliant, and profitable."
          </div>
        </div>
      </div>
    </section>
  )
}