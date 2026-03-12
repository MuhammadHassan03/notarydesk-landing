'use client'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Set Up in Minutes',
    desc: 'Create your account and enter your notary commission details. Your profile and branding will automatically appear on every invoice and report you generate.',
    tip: 'The setup process is intuitive and requires no technical training.',
  },
  {
    num: '02',
    title: 'Tap Once — Trip Starts',
    desc: 'Before heading to an appointment, tap "Start Trip." The high-accuracy GPS tracks your route in real-time. When you arrive, tap stop. Your mileage and tax deduction are logged instantly.',
    tip: 'Every mile tracked is a direct reduction of your taxable income.',
  },
  {
    num: '03',
    title: 'Log Signings in Under 60 Seconds',
    desc: 'After the signing, open your digital journal. Quickly log the document type and signer identification. Every entry is timestamped, encrypted, and locked for legal compliance.',
    tip: 'Your data is encrypted and stored securely following industry standards.',
  },
  {
    num: '04',
    title: 'Send Invoices on the Spot',
    desc: 'Generate a professional invoice pre-filled from your journal entry. Confirm your fee and send it via email or SMS before you even leave the driveway.',
    tip: 'Accept professional payments via Zelle, Venmo, Cash, or Credit Card.',
  },
  {
    num: '05',
    title: 'Export for Tax Time in One Tap',
    desc: 'When it’s time to file, export your full mileage and income reports. You’ll receive a clean PDF that is ready for your accountant or tax software.',
    tip: 'Organized records save hours of stress and maximize your returns.',
  },
]

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how">
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>Simple Workflow</span>
          <h2 className={styles.title}>
            One workday.<br />
            <em className={styles.accent}>Five taps.</em>
          </h2>
          <p className={styles.sub}>
            NotaryDesk was designed to be used on the road, between signings,
            with one hand. Every interaction is designed to take under 60 seconds.
          </p>
          
          {/* Changed CTA to point to the waitlist since the public APK isn't live */}
          <a href="#notify" className={styles.cta}>Join the Waitlist</a>
          
          <div className={styles.iosNote}>
            Coming soon to both <strong>iOS and Android</strong>
          </div>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={step.num} className={styles.step}>
              <div className={styles.numCol}>
                <div className={styles.num}>{step.num}</div>
                {i < STEPS.length - 1 && <div className={styles.line} />}
              </div>
              <div className={styles.content}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>💡</span>
                  {step.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}