'use client'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>N</div>
            <span className={styles.logoText}>NotaryDesk</span>
          </div>
          <p className={styles.tagline}>Your Mobile Notary Business, Organized.</p>
          <p className={styles.pitch}>
            The only modern, mobile-first platform built exclusively for professional mobile notaries.
            Available for Android now — iOS coming soon.
          </p>

          {/* APK download in footer */}
          <a href="https://drive.google.com/file/d/1HdR7q6-ppbDK01ddmsKPWi4ALaTimnfu/view?usp=sharing" download className={styles.apkBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2v13M8 11l4 4 4-4"/><path d="M20 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"/>
            </svg>
            Download Android APK
          </a>

          <div className={styles.contactInfo}>
            <a href="mailto:engineermirzahassan@gmail.com" className={styles.email}>
              engineermirzahassan@gmail.com
            </a>
          </div>
        </div>

        {/* Links columns */}
        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className={styles.col}>
            <h4>Key Features</h4>
            <a href="#features">Digital Journal</a>
            <a href="#features">Mileage Tracking</a>
            <a href="#features">Invoicing</a>
            <a href="#features">Appointments</a>
          </div>
          <div className={styles.col}>
            <h4>Coming Soon</h4>
            <span className={styles.upcoming}>ID Scanning</span>
            <span className={styles.upcoming}>Digital Payments</span>
            <span className={styles.upcoming}>Offline Access</span>
            <span className={styles.upcoming}>Team Mode</span>
          </div>
          {/* Legal — links to real pages */}
          <div className={styles.col}>
            <h4>Legal</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="mailto:engineermirzahassan@gmail.com">Contact Support</a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} NotaryDesk. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <a href="/privacy">Privacy</a>
          <span>·</span>
          <a href="/terms">Terms</a>
          <span>·</span>
          <span className={styles.platformNote}>Android available · iOS coming soon</span>
        </div>
      </div>
    </footer>
  )
}