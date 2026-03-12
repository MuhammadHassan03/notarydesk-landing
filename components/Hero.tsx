'use client'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background Decorative Elements */}
      <div className={styles.grid} aria-hidden />
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <div className={`container ${styles.inner}`}>
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
            Journal · Mileage · Invoices · Appointments — all in your pocket.
          </p>

          <div className={styles.downloadRow}>
            {/* Android State: Coming Soon Placeholder */}
            <div className={styles.btnAndroid} style={{ opacity: 0.8, cursor: 'default' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 3L3 7h18l-2-4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 12h8M8 16h4"/>
              </svg>
              <div>
                <div className={styles.btnLabel}>Android App</div>
                <div className={styles.btnSub}>Coming to Play Store</div>
              </div>
            </div>

            {/* iOS State: Coming Soon Placeholder */}
            <div className={styles.btnIos}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span>Want early access? <a href="#notify" className={styles.notifyLink}>Get notified when we launch →</a></span>
          </div>
        </div>

        {/* Visual App Mockup */}
        <div className={styles.mockupWrap}>
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <div className={styles.notch} />
              <div className={styles.appHeader}>
                <span className={styles.appGreeting}>Good Morning,</span>
                <span className={styles.appName}>Sarah 👋</span>
              </div>
              
              <div className={styles.dashStats}>
                <div className={styles.dashCard} style={{borderTopColor:'#1B3A5C'}}>
                  <span className={styles.dashLabel}>This Month</span>
                  <span className={styles.dashValue} style={{color:'#1B3A5C'}}>$2,840</span>
                </div>
                <div className={styles.dashCard} style={{borderTopColor:'#27AE60'}}>
                  <span className={styles.dashLabel}>Tax Savings</span>
                  <span className={styles.dashValue} style={{color:'#27AE60'}}>$209</span>
                </div>
              </div>

              <div className={styles.trackCard}>
                <div className={styles.trackDot} />
                <div style={{flex:1}}>
                  <span className={styles.trackTitle}>Trip Active · GPS</span>
                  <span className={styles.trackSub}>4.2 mi · 18 min</span>
                </div>
                <span className={styles.trackDeduct}>+$2.81</span>
              </div>

              <div className={styles.recentLabel}>Recent Signings</div>
              {[
                { name: 'James Patterson', doc: 'Deed of Trust', fee: '$150' },
                { name: 'Maria Gonzalez', doc: 'Power of Attorney', fee: '$120' },
                { name: 'Robert Chen', doc: 'Loan Package', fee: '$175' },
              ].map(e => (
                <div key={e.name} className={styles.entryRow}>
                  <div className={styles.entryDot} />
                  <div className={styles.entryInfo}>
                    <span className={styles.entryName}>{e.name}</span>
                    <span className={styles.entryDoc}>{e.doc}</span>
                  </div>
                  <span className={styles.entryFee}>{e.fee}</span>
                </div>
              ))}

              <div className={styles.tabBar}>
                {['📓', '🗺️', '🧾', '📅', '⚙️'].map((icon, i) => (
                  <div key={i} className={`${styles.tab} ${i === 0 ? styles.tabActive : ''}`}>
                    <span className={styles.tabIcon}>{icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Badges for Visual Flair */}
          <div className={`${styles.floatBadge} ${styles.badge1}`}>
            <span className={styles.badgeEmoji}>✅</span>
            <div>
              <div className={styles.badgeTitle}>IRS Compliant</div>
              <div className={styles.badgeSub}>Log auto-tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Waitlist Section */}
      <div className={styles.notifyStrip} id="notify">
        <div className="container">
          <div className={styles.notifyInner}>
            <div className={styles.notifyText}>
              <span className={styles.notifyTitle}>🚀 Join the Waitlist</span>
              <span className={styles.notifySub}>We are currently in private beta. Drop your email to be the first to know when we launch on the App Store and Play Store.</span>
            </div>
            <form className={styles.notifyForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className={styles.notifyInput} required />
              <button type="submit" className={styles.notifyBtn}>Notify Me</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}