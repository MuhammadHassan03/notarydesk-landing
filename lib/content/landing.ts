export const SOCIAL_PROOF_TYPES = [
  { icon: '📝', label: 'Loan Signing Agents' },
  { icon: '🏠', label: 'Real Estate Notaries' },
  { icon: '🏥', label: 'Hospital Notaries' },
  { icon: '⚖️', label: 'Estate Planning Notaries' },
  { icon: '🚗', label: 'General Mobile Notaries' },
  { icon: '���', label: 'Full-Time Notary Businesses' },
]

export const PROBLEMS = [
  { emoji: '📋', before: 'Paper Notary Journal', pain: 'Handwritten notebooks that can be lost, damaged, or hard to search when you need a record.', after: 'Digital journal — encrypted, auto-timestamped, and exportable as a PDF for compliance.' },
  { emoji: '🚗', before: 'Manual Mileage Tracking', pain: 'Driving 100+ miles/day without a proper log leaves thousands in IRS deductions on the table.', after: 'GPS tracks every trip in the background. IRS deductions calculated automatically. Export-ready PDF.' },
  { emoji: '💸', before: 'Chasing Payments', pain: 'Completing jobs but waiting weeks to get paid. No system to follow up or track who owes you.', after: 'See all unpaid jobs in one place. Send payment reminders with one tap. Mark paid instantly.' },
  { emoji: '🐌', before: 'Slow Job Creation', pain: 'Filling out forms with 15 fields for every new signing. Wastes time you could spend earning.', after: 'Just say "John Smith POA $150 tomorrow 3pm" and AI creates the job in seconds. One tap to confirm.' },
  { emoji: '😰', before: 'Tax Season Chaos', pain: 'A year of crumpled receipts and partial logs leads to panic. Missing deductions costs real money.', after: 'Year-round organized records. Export mileage, journal, and tax summary as clean PDFs in one tap.' },
  { emoji: '🔓', before: 'No Data Security', pain: 'Client info stored in unsecured phone notes, texts, and paper files anyone could access.', after: 'Bank-grade encryption protects every record. Your data is isolated, private, and accessible only to you.' },
]

export const FEATURES = [
  {
    icon: '🤖', color: '#FEF3C7', title: 'AI Quick Add',
    desc: 'Create jobs in seconds with natural language. No forms, no thinking — just describe the job and AI handles the rest.',
    bullets: ['Say "John Smith POA $150 tomorrow 3pm Dallas"', 'AI extracts signer, fee, date, time, location', 'Preview card shows parsed fields instantly', 'One tap to confirm and create the job'],
    stat: { value: '<10s', label: 'Average job creation time' },
  },
  {
    icon: '📊', color: '#EDE9FE', title: 'Smart Dashboard',
    desc: 'Opens to one clear action — start your next job, collect a payment, or create a new signing. No guessing what to do next.',
    bullets: ['Smart action card adapts to your day', 'Monthly income + YTD earnings at a glance', 'Income intelligence shows pricing insights', 'Today\'s jobs with inline Start/Complete/Paid actions'],
    stat: { value: '#1', label: 'Thing you see when you open the app' },
  },
  {
    icon: '🗺️', color: '#DBEAFE', title: 'GPS Mileage Tracker',
    desc: 'Background GPS tracking that survives even when Android kills background apps. Every mile = IRS tax deduction.',
    bullets: ['Real-time speed, distance, and signal display', 'Background tracking with Android foreground service', 'Manual trip entry for forgotten drives', 'Export IRS-ready mileage PDF from the app'],
    stat: { value: '$20K+', label: 'Potential annual deductions for active notaries' },
  },
  {
    icon: '💰', color: '#FEF3C7', title: 'Payment Collection',
    desc: 'Stop chasing payments. See every unpaid job, send reminders in bulk, and mark paid in 2 taps — right from your phone.',
    bullets: ['Outstanding balance dashboard with urgency indicators', 'Bulk "Remind All" sends emails to every unpaid client', '2-tap mark paid: tap Paid → select method → done', 'Auto-invoice created when you complete a job'],
    stat: { value: '2 taps', label: 'To mark any job as paid' },
  },
]

export const STEPS = [
  { num: '01', title: 'Download & set up', desc: 'Create your account, enter your name and commission details. Takes under 2 minutes.', tip: 'No credit card required. Free plan includes 15 jobs.' },
  { num: '02', title: 'Add jobs with AI', desc: 'Type or speak "John Smith POA $150 tomorrow 3pm" — AI creates the job instantly. Review and confirm.', tip: 'AI extracts signer, fee, date, location, and document type automatically.' },
  { num: '03', title: 'Start job + track miles', desc: 'Tap "Start Job" on your dashboard. GPS tracks your drive automatically. Mileage and IRS deduction logged in real time.', tip: 'Background tracking works even when you switch apps or lock your phone.' },
  { num: '04', title: 'Complete & get paid', desc: 'Mark the job complete — invoice auto-created. Send payment reminders with one tap. Mark paid when you collect.', tip: 'All payment methods supported: Check, Zelle, Venmo, Cash, Credit Card.' },
  { num: '05', title: 'Export at tax time', desc: 'Download your mileage log, notary journal, and tax summary as clean PDFs. Ready for your accountant.', tip: 'All exports available in Settings → Exports. Pro plan required.' },
]

export const COMPETITORS = [
  { name: 'Legacy Software', what: 'Basic digital journals', why: 'No AI, no mileage tracking, no payment collection. Stuck in 2015.', status: 'limited' as const },
  { name: 'General Tools', what: 'Accounting or note apps', why: 'Not built for notaries. No job pipeline, no journal, no IRS mileage.', status: 'wrong' as const },
  { name: 'Spreadsheets', what: 'Manual data entry', why: 'Time-consuming and error-prone. No automation, no AI, no mobile GPS.', status: 'manual' as const },
  { name: 'Paper Journals', what: 'Handwritten notebooks', why: 'Risk of loss. Can\'t search, can\'t export, can\'t track payments.', status: 'risky' as const },
]

export const COMPARISON_FEATURES = [
  'AI job creation', 'Smart action dashboard', 'GPS mileage tracker',
  'IRS-compliant PDF exports', 'Professional invoicing', 'One-tap payment reminders',
  'Income intelligence', 'Client risk insights', 'Background GPS tracking', 'Secure & encrypted',
]

export const COMPARISON_MATRIX: Record<string, boolean[]> = {
  NotaryDesk:  [true,true,true,true,true,true,true,true,true,true],
  Legacy:      [false,false,false,false,false,false,false,false,false,false],
  General:     [false,false,false,false,true,false,false,false,false,true],
  Spreadsheet: [false,false,false,false,false,false,false,false,false,false],
}

export const ROADMAP = {
  now: [
    { icon: '🤖', title: 'AI Quick Add', desc: 'Create jobs in seconds with natural language. Just say "John Smith POA $150 tomorrow 3pm."' },
    { icon: '📓', title: 'Digital Notary Journal', desc: 'Log signer details, document types, and ID verifications. Export as PDF.' },
    { icon: '🗺️', title: 'GPS Mileage Tracker', desc: 'Background tracking with IRS deduction calculation and PDF export.' },
    { icon: '🧾', title: 'Professional Invoicing', desc: 'Email invoices with one-tap payment reminders.' },
    { icon: '📊', title: 'Income Intelligence', desc: 'See which clients pay fastest and where to raise your fees.' },
    { icon: '🔐', title: 'Secure Data Privacy', desc: 'Bank-grade encryption — your records are 100% private.' },
  ],
  soon: [
    { icon: '💳', title: 'Integrated Payments', desc: 'Clients pay invoices via card or digital wallet instantly.' },
    { icon: '🎥', title: 'RON Support', desc: 'Remote Online Notarization sessions and digital seals.' },
    { icon: '🏛️', title: 'State-Specific Compliance', desc: 'Dynamic fields tailored to your state\'s notary laws.' },
  ],
  future: [
    { icon: '🤖', title: 'AI ID Scanning', desc: 'Auto-fill journal fields by scanning driver\'s licenses.' },
    { icon: '📡', title: 'Advanced Offline Mode', desc: 'Work in rural areas with automatic cloud syncing.' },
    { icon: '🏢', title: 'Agency Plan', desc: 'Centralized billing and reporting for notary businesses.' },
  ],
}

export const PLANS = [
  {
    name: 'Free', price: { monthly: 0, yearly: 0 },
    desc: 'Start for free — no credit card required',
    features: ['15 signing jobs', 'Digital notary journal (10 entries)', 'GPS mileage tracking (20 trips)', 'Basic invoicing (10 invoices)', 'Expense tracker', 'Tax savings dashboard', 'AI Quick Add (3/day)'],
    missing: ['Unlimited everything', 'PDF exports', 'Income intelligence', 'Payment reminders'],
    cta: 'Download Free', highlight: false,
  },
  {
    name: 'Pro', price: { monthly: 19, yearly: 16, yearlyTotal: 189 },
    desc: 'Everything a full-time notary needs',
    features: ['Unlimited signing jobs', 'Unlimited journal entries', 'Unlimited AI Quick Add', 'GPS mileage + IRS PDF export', 'Invoice email + payment reminders', 'PDF exports (journal, mileage, tax)', 'Income intelligence + pricing insights', 'Client insights + risk badges', 'Expense tracker with receipts', 'Auto-invoice on job completion', 'Priority email support'],
    missing: ['Route optimization', 'Public booking page', 'Client messaging'],
    cta: 'Start Free — Upgrade Anytime', highlight: true, badge: 'Most Popular',
  },
  {
    name: 'Plus', price: { monthly: 29, yearly: 24, yearlyTotal: 279 },
    desc: 'For high-volume notary businesses',
    features: ['Everything in Pro', 'Smart route optimization', 'Public booking page', 'Client messaging', '24-hour priority support'],
    missing: [],
    cta: 'Start Free — Upgrade Anytime', highlight: false,
  },
]

export const TESTIMONIALS = [
  { quote: "I used to spend an hour every Sunday doing mileage in a spreadsheet. Now NotaryDesk tracks it while I drive. Found hundreds in deductions I was missing.", name: 'Sandra M.', role: 'Loan Signing Agent · Florida', initials: 'SM', color: '#DBEAFE', textColor: '#1E40AF' },
  { quote: "The AI job creation is a game changer. I type the details while on the phone with the title company and the job is created before I hang up.", name: 'Robert T.', role: 'Notary Public · California', initials: 'RT', color: '#EDE9FE', textColor: '#5B21B6' },
  { quote: "I had $600 in unpaid invoices I forgot about. NotaryDesk showed them all and I collected everything in one afternoon with the reminder feature.", name: 'Michelle K.', role: 'Mobile Notary · Texas', initials: 'MK', color: '#DCFCE7', textColor: '#15803D' },
]

export const FAQS = [
  { q: 'How does AI Quick Add work?', a: 'Type or speak a natural language description like "John Smith POA $150 tomorrow 3pm Dallas." The AI extracts all fields — signer name, fee, date, time, address, document type — and shows you a preview card. One tap to confirm and the job is created. No forms needed.' },
  { q: 'Is the mileage tracking IRS-compliant?', a: 'Yes. The IRS requires a contemporaneous log including date, locations, and business purpose. NotaryDesk records these automatically via GPS — even in the background when your phone is locked. Export as a PDF for your accountant.' },
  { q: 'How does the payment collection work?', a: 'Every unpaid job is tracked automatically. You can see your total outstanding balance, tap "Remind All" to email every unpaid client, or mark individual jobs as paid in 2 taps. Supports Check, Zelle, Venmo, Cash, and Credit Card.' },
  { q: 'Is NotaryDesk available on iPhone?', a: 'NotaryDesk is currently available on Android. iOS is coming soon — join our waitlist to be first to know.' },
  { q: 'What happens to my data? Is it private?', a: 'Your data is encrypted and isolated — only you have access. We use bank-grade security protocols. Your journal, client info, and financial records are 100% private.' },
  { q: 'What do I get for free vs Pro?', a: 'Free includes 15 signing jobs, 10 journal entries, 20 mileage trips, basic invoicing, and 3 AI Quick Add uses per day. Pro ($19/mo) unlocks unlimited everything plus PDF exports, income intelligence, payment reminders, and client insights.' },
]
