export interface ServiceItem { name: string; desc: string; price?: string; emergency?: boolean }
export interface ReviewItem { name: string; text: string; rating: number }

export const tradesData = {
  name: 'ProFix',
  subtitle: 'Plumbing · Heating · Gas',
  tagline: 'Same-day response. No call-out fee. 20 years of trusted service across West Yorkshire.',
  established: '2005',
  location: 'Leeds, UK',
  street: 'Unit 12, Wellington Industrial Estate, Leeds LS12 2UA',
  postcode: 'LS12 2UA',
  phone: '+44 113 234 5678',
  email: 'hello@profixservices.co.uk',
  googleRating: '4.9',
  googleReviews: '480+ reviews',
  hours: 'Mon—Fri: 7:00—19:00 · Sat: 8:00—16:00 · 24/7 Emergency',
  emergency: true,
  emergencyPhone: '+44 113 234 9999',

  heroLine1: 'Fixed right,',
  heroLine2: 'first time.',
  heroCta1: { text: 'Get a Free Quote', href: '#contact' },
  heroCta2: { text: '24/7 Emergency', href: '#emergency' },

  // Stats for hero area
  stats: [
    { value: '20+', label: 'Years' },
    { value: '480+', label: 'Reviews' },
    { value: '4.9', label: 'Rating' },
  ],

  // Certifications / trust badges
  certs: ['Gas Safe Registered', 'Fully Insured', 'NICEIC Approved', 'Which? Trusted Trader'],

  // Services
  servicesTitle: 'Our Services',
  servicesSubtitle: 'Everything from a dripping tap to a full heating system.',
  services: [
    { name: 'Emergency Repairs', desc: 'Burst pipes, gas leaks, no heating — we arrive within 60 minutes. Available 24/7, 365 days a year.', price: 'From £85', emergency: true },
    { name: 'Boiler Installation & Service', desc: 'Full boiler replacement, annual servicing, and landlord safety certificates. All work Gas Safe certified.', price: 'From £1,950' },
    { name: 'Bathroom Fitting', desc: 'Complete bathroom renovations — plumbing, tiling, installation. Free design consultation included.', price: 'From £3,500' },
    { name: 'Central Heating', desc: 'Radiator installation, power flushing, underfloor heating, and smart thermostat upgrades.', price: 'From £450' },
    { name: 'Drainage & Blockages', desc: 'High-pressure jetting, CCTV drain surveys, and root removal. No-dig solutions where possible.', price: 'From £95' },
    { name: 'Landlord Services', desc: 'Gas safety certificates (CP12), EICR electrical reports, and planned maintenance for rental properties.', price: 'From £75' },
  ],

  // About
  aboutTitle: 'Three generations of getting it right.',
  aboutParagraphs: [
    'ProFix started in 2005 when Dave Thompson left the corporate plumbing world to serve his local community. What began as a single van and a reputation for showing up on time has grown into West Yorkshire\'s most trusted trades team.',
    'We don\'t do call-out fees. We don\'t do hidden charges. We do clear quotes, clean work, and a 12-month guarantee on every job — no exceptions.',
    'Every engineer on our team is fully qualified, background-checked, and trained to explain the work in plain English. No jargon, no upsells, no surprises.',
  ],

  // Reviews
  reviews: [
    { name: 'Sarah Mitchell', text: 'Had a burst pipe at 2am on a Sunday. ProFix arrived in 40 minutes and had it sorted by 3:30. Absolute lifesavers.', rating: 5 },
    { name: 'Tom Bradley', text: 'New boiler installed last month. The engineer was clean, professional, and explained everything. Best price out of 4 quotes too.', rating: 5 },
    { name: 'The Nguyens', text: 'Used ProFix for our bathroom renovation. They handled everything — plumbing, tiling, electrics. One point of contact, zero stress.', rating: 5 },
  ],

  pageTitle: 'ProFix — Trusted Plumbers & Heating Engineers in Leeds',
} as const
