'use client'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.grid} aria-hidden />
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <div className={`container ${styles.inner}`}>

        {/* ── Copy ────────────────────────────────────────────────── */}
        <div className={styles.copy}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Built exclusively for US Mobile Notaries
          </div>

          <h1 className={styles.headline}>
            Your Notary Business,<br />
            <em className={styles.accent}>Finally Organized.</em>
          </h1>

          <p className={styles.sub}>
            Replace the paper journal and scattered spreadsheets with one clean app.
            Journal · Mileage · Invoices · Appointments — all in your pocket or on your phone.
          </p>

          {/* Download buttons */}
          <div className={styles.downloadRow}>

            {/* APK direct download — live now */}
            <a
              href="https://drive.google.com/file/d/1HdR7q6-ppbDK01ddmsKPWi4ALaTimnfu/view?usp=sharing"
              download
              className={styles.btnApk}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 2v13M8 11l4 4 4-4" />
                <path d="M20 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" />
              </svg>
              <div>
                <div className={styles.btnLabel}>Download APK</div>
                <div className={styles.btnSub}>Android · Direct install · Free</div>
              </div>
            </a>

            {/* Google Play — coming soon */}
            <div className={styles.btnAndroid} style={{ opacity: 0.7, cursor: 'default' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                <path d="M3 3.884v16.232c0 .862.97 1.367 1.678.877l14.832-8.116a1 1 0 000-1.754L4.678 3.007C3.97 2.517 3 3.022 3 3.884z"/>
              </svg>
              <div>
                <div className={styles.btnLabel}>Google Play</div>
                <div className={styles.btnSub}>Coming to Play Store</div>
              </div>
            </div>

            {/* iOS — coming soon */}
            <div className={styles.btnIos}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div className={styles.btnLabel}>iPhone App</div>
                <div className={styles.btnSub}>iOS · Coming Soon</div>
              </div>
              <span className={styles.comingSoonChip}>Soon</span>
            </div>
          </div>

          <div className={styles.notifyRow}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span>Want iOS early access? <a href="#notify" className={styles.notifyLink}>Join the waitlist →</a></span>
          </div>
        </div>

        {/* ── App mockup — mirrors exact dashboard layout ──────────── */}
        <div className={styles.mockupWrap}>
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <div className={styles.notch} />

              {/* Header */}
              <div className={styles.appHeader}>
                <span className={styles.appGreeting}>Good Morning,</span>
                <span className={styles.appName}>Sarah 👋</span>
              </div>

              {/* Hero earnings card */}
              <div className={styles.heroCard}>
                <div className={styles.heroCardLabel}>THIS MONTH</div>
                <div className={styles.heroCardEarnings}>$2,840</div>
                <div className={styles.heroCardSub}>Total earnings</div>
                <div className={styles.heroCardStats}>
                  <div className={styles.heroStat}>
                    <span className={styles.heroStatVal}>18</span>
                    <span className={styles.heroStatLbl}>SIGNINGS</span>
                  </div>
                  <div className={styles.heroStatDivider} />
                  <div className={styles.heroStat}>
                    <span className={styles.heroStatVal}>312</span>
                    <span className={styles.heroStatLbl}>MILES</span>
                  </div>
                  <div className={styles.heroStatDivider} />
                  <div className={`${styles.heroStat}`}>
                    <span className={styles.heroStatValGold}>$209</span>
                    <span className={styles.heroStatLbl}>TAX SAVED</span>
                  </div>
                </div>
              </div>

              {/* Quick actions row */}
              <div className={styles.quickRow}>
                {[
                  { icon: '📓', label: 'Signing' },
                  { icon: '🗺️', label: 'Trip' },
                  { icon: '🧾', label: 'Invoice' },
                  { icon: '📅', label: 'Appt' },
                  { icon: '💼', label: 'Expenses' },
                ].map(a => (
                  <div key={a.label} className={styles.qaItem}>
                    <div className={styles.qaIcon}>{a.icon}</div>
                    <span className={styles.qaLabel}>{a.label}</span>
                  </div>
                ))}
              </div>

              {/* Today's schedule */}
              <div className={styles.scheduleLabel}>TODAY'S SCHEDULE</div>
              <div className={styles.apptCard}>
                <div className={styles.apptTime}>
                  <span className={styles.apptTimeVal}>10:30</span>
                  <span className={styles.apptTimeAmpm}>AM</span>
                </div>
                <div className={styles.apptInfo}>
                  <span className={styles.apptName}>James Patterson</span>
                  <span className={styles.apptDoc}>Deed of Trust · $150</span>
                </div>
              </div>
              <div className={styles.apptCard}>
                <div className={styles.apptTime}>
                  <span className={styles.apptTimeVal}>2:00</span>
                  <span className={styles.apptTimeAmpm}>PM</span>
                </div>
                <div className={styles.apptInfo}>
                  <span className={styles.apptName}>Maria Gonzalez</span>
                  <span className={styles.apptDoc}>Power of Attorney · $120</span>
                </div>
              </div>

              {/* GPS trip active */}
              <div className={styles.trackCard}>
                <div className={styles.trackDot} />
                <div style={{ flex: 1 }}>
                  <span className={styles.trackTitle}>Trip Active · GPS</span>
                  <span className={styles.trackSub}>4.2 mi · 18 min</span>
                </div>
                <span className={styles.trackDeduct}>+$2.81</span>
              </div>

              <div className={styles.tabBar}>
                {[
                  { icon: '🏠', active: true },
                  { icon: '📓', active: false },
                  { icon: '🗺️', active: false },
                  { icon: '🧾', active: false },
                  { icon: '⚙️', active: false },
                ].map((t, i) => (
                  <div key={i} className={`${styles.tab} ${t.active ? styles.tabActive : ''}`}>
                    <span className={styles.tabIcon}>{t.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className={`${styles.floatBadge} ${styles.badge1}`}>
            <span className={styles.badgeEmoji}>✅</span>
            <div>
              <div className={styles.badgeTitle}>IRS Compliant</div>
              <div className={styles.badgeSub}>Mileage auto-tracked</div>
            </div>
          </div>
          <div className={`${styles.floatBadge} ${styles.badge2}`}>
            <span className={styles.badgeEmoji}>📋</span>
            <div>
              <div className={styles.badgeTitle}>13 States</div>
              <div className={styles.badgeSub}>Compliance built-in</div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist strip */}
      <div className={styles.notifyStrip} id="notify">
        <div className="container">
          <div className={styles.notifyInner}>
            <div className={styles.notifyText}>
              <span className={styles.notifyTitle}>🚀 Get Early Access</span>
              <span className={styles.notifySub}>
                Currently in private beta. Drop your email and be first when we launch on the App Store and Google Play.
              </span>
            </div>
            <form className={styles.notifyForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className={styles.notifyInput} required />
              <button type="submit" className={styles.notifyBtn}>Notify Me Free</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}