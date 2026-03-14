'use client'
import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>

        <a href="#" className={styles.logo}>
          <div className={styles.logoMark}>N</div>
          <span className={styles.logoText}>NotaryDesk</span>
        </a>

        {/* Desktop nav */}
        <nav className={styles.links}>
          <a href="#features">Features</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className={styles.ctas}>
          <div className={styles.platformPill}>
            <span className={styles.dot} /> Android Available
          </div>
          {/* APK direct download */}
          <a
            href="/downloads/notarydesk-latest.apk"
            download
            className={styles.ctaApk}
          >
            ↓ Download APK
          </a>
          <a href="#notify" className={styles.ctaPrimary}>
            Get Early Access
          </a>
        </div>

        {/* Mobile burger */}
        <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={open ? styles.lineOpen1 : styles.line} />
          <span className={open ? styles.lineOpen2 : styles.line} />
          <span className={open ? styles.lineOpen3 : styles.line} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileLinks}>
            <a href="#features"  onClick={() => setOpen(false)}>Features</a>
            <a href="#roadmap"   onClick={() => setOpen(false)}>Roadmap</a>
            <a href="#pricing"   onClick={() => setOpen(false)}>Pricing</a>
            <a href="#faq"       onClick={() => setOpen(false)}>FAQ</a>
          </div>
          <div className={styles.mobileActions}>
            <a
              href="/downloads/notarydesk-latest.apk"
              download
              onClick={() => setOpen(false)}
              className={styles.mobileCtaApk}
            >
              ↓ Download APK (Android)
            </a>
            <a href="#notify" onClick={() => setOpen(false)} className={styles.mobileCtaPrimary}>
              Join Early Access — iOS Waitlist
            </a>
            <p className={styles.mobileStatus}>
              APK: Ready to install · iOS: Coming Soon
            </p>
          </div>
        </div>
      )}
    </header>
  )
}