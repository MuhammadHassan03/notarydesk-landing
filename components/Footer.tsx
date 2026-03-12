'use client'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>N</div>
            <span className={styles.logoText}>NotaryDesk</span>
          </div>
          <p className={styles.tagline}>Your Mobile Notary Business, Organized.</p>
          <p className={styles.pitch}>
            The only modern, mobile-first platform built exclusively for professional mobile notaries.
          </p>
          <div className={styles.contactInfo}>
            <a href="mailto:support@notarydesk.app" className={styles.email}>
              support@notarydesk.app
            </a>
          </div>
        </div>

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
            <a href="#features">PDF Invoicing</a>
            <a href="#features">Scheduling</a>
          </div>
          <div className={styles.col}>
            <h4>Future</h4>
            <span className={styles.upcoming}>ID Scanning</span>
            <span className={styles.upcoming}>Digital Payments</span>
            <span className={styles.upcoming}>Offline Access</span>
            <span className={styles.upcoming}>Team Management</span>
          </div>
          <div className={styles.col}>
            <h4>Compliance</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/security">Security Standards</a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} NotaryDesk. All rights reserved.</p>
        <p className={styles.platformNote}>Available for Android · Coming soon to the iOS App Store</p>
      </div>
    </footer>
  )
}