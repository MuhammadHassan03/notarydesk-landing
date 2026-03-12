import styles from './CompetitorSection.module.css'

const COMPETITORS = [
  { name:'Legacy Software', what:'Basic digital journals', why:'Often lacks mobile support and modern features. Many haven’t seen a major update in years.', status:'limited' },
  { name:'General Tools', what:'Accounting or Note apps', why:'Not built for notaries. No legal compliance, no journal, and often too complex for use on the road.', status:'wrong' },
  { name:'Spreadsheets', what:'Manual data entry', why:'Time-consuming and prone to errors. No automation for mileage or professional PDF exports.', status:'manual' },
  { name:'Paper Journals', what:'Handwritten notebooks', why:'High risk of loss or damage. Can be difficult to search and creates a massive storage burden over time.', status:'risky' },
]

const FEATURES = [
  'Mobile-first experience',
  'Digital notary journal',
  'GPS mileage tracker',
  'IRS-compliant reporting',
  'Professional invoicing',
  'Instant client delivery',
  'Unified appointment board',
  'One-tap data exports',
  'Built for mobile notaries',
  'Secure & Modern (2025)',
]

const MATRIX: Record<string, boolean[]> = {
  'NotaryDesk':    [true,true,true,true,true,true,true,true,true,true],
  'LegacyTools':   [false,true,false,false,false,false,false,false,true,false],
  'GeneralApps':   [false,false,false,false,true,false,false,false,false,true],
  'Spreadsheets':  [false,false,false,false,false,false,false,false,false,true],
}

export default function CompetitorSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>The Comparison</span>
          <h2 className={styles.title}>
            The first modern tool<br />
            <em className={styles.accent}>built for your workflow.</em>
          </h2>
          <p className={styles.sub}>
            Most notary tools were built for desktops a decade ago. 
            NotaryDesk is a ground-up rebuild designed specifically for the mobile notary who runs their business from their phone.
          </p>
        </div>

        {/* Competitor cards - Simplified categories */}
        <div className={styles.compGrid}>
          {COMPETITORS.map(c => (
            <div key={c.name} className={styles.compCard}>
              <div className={styles.compTop}>
                <span className={styles.compName}>{c.name}</span>
                <span className={`${styles.statusBadge} ${styles[c.status]}`}>
                  {c.status === 'limited' ? 'Incomplete' : c.status === 'wrong' ? 'Too Complex' : c.status === 'manual' ? 'Time Consuming' : 'Risky'}
                </span>
              </div>
              <p className={styles.compWhat}>{c.what}</p>
              <p className={styles.compWhy}>{c.why}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className={styles.tableWrap}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.featureCol}>Feature</th>
                  {['NotaryDesk','Legacy Tools','General Apps','Spreadsheets'].map(n => (
                    <th key={n} className={`${styles.colHead} ${n==='NotaryDesk'?styles.ourCol:''}`}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f,i) => (
                  <tr key={f} className={i%2===0?styles.rowEven:''}>
                    <td className={styles.featureCell}>{f}</td>
                    {['NotaryDesk','LegacyTools','GeneralApps','Spreadsheets'].map(n => (
                      <td key={n} className={`${styles.checkCell} ${n==='NotaryDesk'?styles.ourCell:''}`}>
                        {MATRIX[n] && MATRIX[n][i]
                          ? <span className={styles.check}>✓</span>
                          : <span className={styles.cross}>✗</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Removed "Blue Ocean" section as it is internal strategy/investor speak */}
        <div className={styles.finalNote}>
          <p>Stop settling for tools that weren&apos;t made for you. Upgrade to a professional standard.</p>
        </div>
      </div>
    </section>
  )
}