'use client'
import { useState } from 'react'
import styles from './Pricing.module.css'

const PLANS = [
  {
    name: 'Free', price: { monthly: 0, yearly: 0 },
    desc: 'Try the core features',
    features: ['10 journal entries/month','Basic mileage tracking','Appointment manager','Standard app access'],
    missing: ['Unlimited journal entries','Invoice generator','PDF exports','Tax summaries','SMS delivery'],
    cta: 'Start Free', highlight: false,
  },
  {
    name: 'Pro', price: { monthly: 19, yearly: 15 },
    desc: 'Everything a full-time notary needs',
    features: ['Unlimited journal entries','Full GPS mileage tracker','IRS mileage log PDF export','Invoice generator + email delivery','PDF exports for all records','Appointment manager','Priority email support'],
    missing: ['SMS invoice delivery','Advanced tax summaries'],
    cta: 'Start 14-Day Free Trial', highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Plus', price: { monthly: 39, yearly: 32 },
    desc: 'For high-volume notary businesses',
    features: ['Everything in Pro','SMS invoice delivery','Full tax summary + IRS export PDF','Intelligent ID Scanning','Business expense tracker','Priority support (24h response)'],
    missing: [],
    cta: 'Start 14-Day Free Trial', highlight: false,
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  
  return (
    <section className={styles.section} id="pricing">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Simple pricing</span>
          <h2 className={styles.title}>Start free.<br /><em className={styles.accent}>Upgrade when ready.</em></h2>
          <p className={styles.sub}>The app pays for itself in your first week of tracked mileage. No contracts, no surprises.</p>
          
          <div className={styles.toggle}>
            <span className={!yearly ? styles.on : styles.off}>Monthly</span>
            <button className={styles.toggleBtn} onClick={() => setYearly(y => !y)} aria-label="Toggle billing">
              <div className={`${styles.thumb} ${yearly ? styles.thumbRight : ''}`} />
            </button>
            <span className={yearly ? styles.on : styles.off}>Yearly <span className={styles.saveBadge}>Save 20%</span></span>
          </div>
        </div>

        <div className={styles.grid}>
          {PLANS.map(plan => (
            <div key={plan.name} className={`${styles.card} ${plan.highlight ? styles.featured : ''}`}>
              {plan.badge && <div className={styles.popularBadge}>{plan.badge}</div>}
              <div className={styles.planTop}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.dollar}>$</span>
                  <span className={styles.price}>{yearly ? plan.price.yearly : plan.price.monthly}</span>
                  {plan.price.monthly > 0 && <span className={styles.period}>/mo</span>}
                </div>
                {yearly && plan.price.monthly > 0 && (
                  <p className={styles.billedAs}>Billed ${(plan.price.yearly * 12)} annually</p>
                )}
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>
              
              {/* Pointing to waitlist/notify for the public launch phase */}
              <a href="#notify" className={plan.highlight ? styles.ctaFeatured : styles.ctaDefault}>
                {plan.cta}
              </a>
              
              <div className={styles.divider} />
              <ul className={styles.featureList}>
                {plan.features.map(f => (
                  <li key={f} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>{f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className={`${styles.featureItem} ${styles.missingItem}`}>
                    <span className={styles.crossIcon}>✗</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.valueNote}>
          <span className={styles.valueIcon}>💡</span>
          <div>
            <strong>Maximize your returns:</strong> Active mobile notaries often track thousands of dollars in IRS mileage deductions every year. NotaryDesk ensures you never leave money on the table.
          </div>
        </div>

        <p className={styles.bottomNote}>14-day free trial on all paid plans · No credit card required · Cancel any time</p>
      </div>
    </section>
  )
}