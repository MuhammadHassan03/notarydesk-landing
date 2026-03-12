import styles from './SocialProof.module.css'

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className="container">
        {/* We keep this as it defines the target audience */}
        <p className={styles.label}>Built for every type of mobile notary</p>
        
        <div className={styles.items}>
          {[
            { icon:'📝', label:'Loan Signing Agents' },
            { icon:'🏠', label:'Real Estate Notaries' },
            { icon:'💻', label:'RON Notaries' },
            { icon:'🏥', label:'Hospital Notaries' },
            { icon:'⚖️', label:'Estate Planning Notaries' },
            { icon:'🚗', label:'General Mobile Notaries' },
          ].map(type => (
            <div key={type.label} className={styles.item}>
              <span className={styles.itemIcon}>{type.icon}</span>
              {type.label}
            </div>
          ))}
        </div>

        {/* REMOVED: numbersRow 
           Industry-wide stats (4.4M notaries, etc.) are removed to keep the 
           focus entirely on the user's workflow and your app.
        */}
      </div>
    </section>
  )
}