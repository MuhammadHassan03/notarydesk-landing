export const SOCIAL_PROOF_TYPES = [
  { icon: '📝', label: 'Loan Signing Agents' },
  { icon: '🏠', label: 'Real Estate Notaries' },
  { icon: '💻', label: 'RON Notaries' },
  { icon: '🏥', label: 'Hospital Notaries' },
  { icon: '⚖️', label: 'Estate Planning Notaries' },
  { icon: '🚗', label: 'General Mobile Notaries' },
]

export const PROBLEMS = [
  { emoji: '📋', before: 'Paper Notary Journal', pain: 'Handwritten notebooks that can be lost, damaged, or ruled illegible in court.', after: 'Digital journal — encrypted, auto-timestamped, and exportable. Locked after 24 hours to meet legal standards.' },
  { emoji: '🚗', before: 'Manual Mileage Tracking', pain: 'Driving 100+ miles/day without a proper log leaves thousands in IRS deductions on the table.', after: 'One tap starts GPS tracking. IRS deductions calculated automatically and export-ready at tax time.' },
  { emoji: '💸', before: 'Unprofessional Invoicing', pain: 'Chasing payments via casual apps looks unprofessional. Easy to forget follow-ups.', after: 'Professional invoices sent via email or SMS in seconds. Clients receive a branded link to pay instantly.' },
  { emoji: '📱', before: 'Scattered Scheduling', pain: 'Bookings from different platforms, emails, and texts. Easy to double-book.', after: 'Unified appointment board. One tap converts a booking into a journal entry and starts mileage.' },
  { emoji: '😰', before: 'Tax Season Chaos', pain: 'A year of crumpled receipts and partial logs leads to a panic-filled week of bookkeeping.', after: 'Year-round organized records. Export your IRS mileage log and income summary as one clean PDF.' },
]

export const FEATURES = [
  {
    icon: '📓', color: '#EDE9FE', title: 'Digital Notary Journal',
    desc: 'The essential legal requirement. Log signer details, document types, and ID verifications instantly. Entries locked after 24 hours for compliance.',
    bullets: ['Pre-filled templates for Deeds, POAs, Loan Packages', 'Verify Driver\'s Licenses, Passports, State IDs', 'Tamper-evident logs meeting digital journal requirements', 'Export state-compliant PDF journals in one tap'],
    stat: { value: '100%', label: 'Compliant with state digital journal laws' },
  },
  {
    icon: '🗺️', color: '#DBEAFE', title: 'GPS Mileage Tracker',
    desc: 'Built for the high-mileage notary. One tap starts high-accuracy tracking that automatically calculates IRS deductions.',
    bullets: ['Live tracking with signal quality indicators', 'Smart filters for highway and neighborhood driving', 'Manual log support for forgotten trips', 'IRS-compliant logs ready for tax filing'],
    stat: { value: '$20K+', label: 'Annual tax deductions for active notaries' },
  },
  {
    icon: '🧾', color: '#FEF3C7', title: 'Professional Invoicing',
    desc: 'Get paid faster with branded invoices created in seconds. Pull data directly from journal entries.',
    bullets: ['Deliver via Email or SMS instantly', 'Zelle, Venmo, Cash, Check, Credit Card', 'Real-time status: Sent, Paid, Overdue', 'Centralized archive of all past earnings'],
    stat: { value: '30 sec', label: 'Average time to create and send' },
  },
  {
    icon: '📅', color: '#DCFCE7', title: 'Appointment Manager',
    desc: 'Consolidate jobs from every platform into one dashboard. Manage schedule, set reminders, convert to journal entries.',
    bullets: ['Unified calendar for your full signing schedule', 'Automatic client reminders to reduce no-shows', 'Seamless: Appointment → Journal → Invoice', 'Track signing status across all agencies'],
    stat: { value: '0', label: 'Missed appointments or double-bookings' },
  },
]

export const STEPS = [
  { num: '01', title: 'Set up in minutes', desc: 'Create your account, enter commission details. Your branding auto-appears on every invoice and report.', tip: 'Intuitive setup — no technical training required.' },
  { num: '02', title: 'Tap once — trip starts', desc: 'Before heading out, tap "Start Trip." GPS tracks your route in real-time. Mileage and tax deduction logged instantly.', tip: 'Every mile tracked = direct reduction of taxable income.' },
  { num: '03', title: 'Log signings in 60 seconds', desc: 'After signing, open your journal. Log document type and signer ID. Timestamped, encrypted, locked for compliance.', tip: 'Data encrypted and stored following industry standards.' },
  { num: '04', title: 'Send invoices on the spot', desc: 'Generate a professional invoice pre-filled from your journal entry. Send via email or SMS before leaving the driveway.', tip: 'Accept payments via Zelle, Venmo, Cash, or Credit Card.' },
  { num: '05', title: 'Export for tax time in one tap', desc: 'When it\'s time to file, export your full mileage and income reports as a clean PDF ready for your accountant.', tip: 'Organized records save hours and maximize returns.' },
]

export const COMPETITORS = [
  { name: 'Legacy Software', what: 'Basic digital journals', why: 'Lacks mobile support and modern features. No major updates in years.', status: 'limited' as const },
  { name: 'General Tools', what: 'Accounting or note apps', why: 'Not built for notaries. No legal compliance, no journal, too complex on the road.', status: 'wrong' as const },
  { name: 'Spreadsheets', what: 'Manual data entry', why: 'Time-consuming and error-prone. No automation or professional exports.', status: 'manual' as const },
  { name: 'Paper Journals', what: 'Handwritten notebooks', why: 'High risk of loss or damage. Difficult to search, massive storage burden.', status: 'risky' as const },
]

export const COMPARISON_FEATURES = [
  'Mobile-first experience', 'Digital notary journal', 'GPS mileage tracker',
  'IRS-compliant reporting', 'Professional invoicing', 'Instant client delivery',
  'Unified appointment board', 'One-tap data exports', 'Built for mobile notaries', 'Secure & modern',
]

export const COMPARISON_MATRIX: Record<string, boolean[]> = {
  NotaryDesk:  [true,true,true,true,true,true,true,true,true,true],
  Legacy:      [false,true,false,false,false,false,false,false,true,false],
  General:     [false,false,false,false,true,false,false,false,false,true],
  Spreadsheet: [false,false,false,false,false,false,false,false,false,true],
}

export const ROADMAP = {
  now: [
    { icon: '📓', title: 'Digital Notary Journal', desc: 'State-compliant logging with secure entries and PDF exports.' },
    { icon: '🗺️', title: 'GPS Mileage Tracker', desc: 'Automatic tracking and IRS mileage deduction calculation.' },
    { icon: '🧾', title: 'Professional Invoices', desc: 'Generate and send invoices via Email or SMS in seconds.' },
    { icon: '📅', title: 'Appointment Manager', desc: 'Unified calendar to manage all your signings in one place.' },
    { icon: '🔐', title: 'Secure Data Privacy', desc: 'Bank-grade encryption — your records are 100% private.' },
  ],
  soon: [
    { icon: '💳', title: 'Integrated Payments', desc: 'Clients pay invoices via card or digital wallet instantly.' },
    { icon: '👥', title: 'Smart Signer Directory', desc: 'Save client profiles to auto-fill for returning signers.' },
    { icon: '📊', title: 'Tax Reports', desc: 'Annual income and expense summaries for your accountant.' },
  ],
  future: [
    { icon: '🤖', title: 'AI ID Scanning', desc: 'Auto-fill journal fields by scanning driver\'s licenses.' },
    { icon: '📡', title: 'Advanced Offline Mode', desc: 'Work in rural areas with automatic cloud syncing.' },
    { icon: '🏛️', title: 'State-Specific Logic', desc: 'Dynamic fields tailored to your state\'s notary laws.' },
    { icon: '🎥', title: 'RON Support', desc: 'Remote Online Notarization sessions and digital seals.' },
  ],
}

export const PLANS = [
  {
    name: 'Free', price: { monthly: 0, yearly: 0 },
    desc: '15 signing jobs — full access, no credit card',
    features: ['15 signing jobs (all features)', 'Job pipeline tracker', 'Notary journal with compliance', 'GPS mileage + IRS deduction', 'Basic invoicing', 'Expense tracker', 'Tax savings dashboard', 'Web + mobile access'],
    missing: ['Unlimited signing jobs', 'Invoice email delivery', 'PDF exports'],
    cta: 'Start Free', highlight: false,
  },
  {
    name: 'Pro', price: { monthly: 9.99, yearly: 8.25 },
    desc: 'Everything a full-time notary needs',
    features: ['Unlimited signing jobs', 'Full job pipeline with tracking', '50-state compliance engine', 'GPS mileage + IRS export', 'Invoice generator + email', 'PDF exports (journal, mileage, tax)', 'Tax savings calculator + report', 'Client directory (auto-saves)', 'Expense tracker with receipts', 'Appointment manager', 'Web dashboard + mobile app'],
    missing: ['SMS invoice delivery', 'Custom invoice branding'],
    cta: 'Start Free — Upgrade Anytime', highlight: true, badge: 'Most Popular',
  },
  {
    name: 'Business', price: { monthly: 19.99, yearly: 15.75 },
    desc: 'For high-volume notary businesses',
    features: ['Everything in Pro', 'SMS invoice delivery', 'Custom invoice branding', 'Annual tax summary PDF', 'Email template builder', 'Priority support (24hr)', 'AI ID Scanner (coming soon)'],
    missing: [],
    cta: 'Start Free — Upgrade Anytime', highlight: false,
  },
]

export const TESTIMONIALS = [
  { quote: "I used to spend an hour every Sunday doing mileage in a spreadsheet. Now NotaryDesk tracks it while I drive. Found hundreds in deductions I was missing.", name: 'Sandra M.', role: 'Loan Signing Agent · Florida', initials: 'SM', color: '#DBEAFE', textColor: '#1E40AF' },
  { quote: "The journal is exactly what I needed. My state requires specific fields and NotaryDesk has them all locked after 24 hours. Finally a compliant digital option.", name: 'Robert T.', role: 'Notary Public · California', initials: 'RT', color: '#EDE9FE', textColor: '#5B21B6' },
  { quote: "My clients used to get a Word doc invoice. Now I send a professional PDF from the app in 30 seconds. I look 10x more professional and get paid faster.", name: 'Michelle K.', role: 'Mobile Notary · Texas', initials: 'MK', color: '#DCFCE7', textColor: '#15803D' },
]

export const FAQS = [
  { q: 'Is the journal legally compliant in my state?', a: 'NotaryDesk includes essential fields like date, signer name, document type, and fee. Entries lock after 24 hours to meet tamper-evidence requirements. We constantly update our compliance engine for state-by-state mandates.' },
  { q: 'How does mileage tracking work — is it IRS-compliant?', a: 'Yes. The IRS requires a contemporaneous log including date, locations, and business purpose. NotaryDesk records these automatically via GPS. Exports are organized and ready for tax season.' },
  { q: 'When will the iPhone app be available?', a: 'We are in the final stages of iOS testing. Sign up for the waitlist and we\'ll notify you the moment it hits the App Store.' },
  { q: 'Does it work without internet?', a: 'Current version performs best with a data connection. We\'re developing a local-first sync mode for dead zones like hospitals or rural areas.' },
  { q: 'What happens to my data? Is it private?', a: 'Your data is encrypted and isolated — only you have access. We use bank-grade security protocols to ensure your journal remains confidential.' },
  { q: 'Can I use this for my notary agency?', a: 'Currently optimized for individual notaries. We\'re developing an Agency Plan with centralized billing and reporting. Contact us to beta test.' },
]