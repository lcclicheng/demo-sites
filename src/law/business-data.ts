export interface ServiceItem { name: string; desc: string }
export interface Lawyer { name: string; role: string; specialty: string; initials: string }

export const lawData = {
  name: 'Whitfield & Co.', subtitle: 'Solicitors',
  tagline: 'Trusted legal counsel for individuals, families, and businesses across the South West.',
  established: '1985', location: 'Bath, UK',
  street: '31 Queen Square, Bath BA1 2HN', postcode: 'BA1 2HN',
  phone: '+44 1225 789456', email: 'enquiries@whitfieldlaw.co.uk',
  googleRating: '4.8', googleReviews: '95+ reviews',
  hours: 'Mon—Fri: 9:00—17:30',
  heroLine1: 'Clarity.', heroLine2: 'Confidence.', heroLine3: 'Results.',
  heroCta1: { text: 'Our Services', href: '#services' },
  heroCta2: { text: 'Book a Consultation', href: '#contact' },

  services: [
    { name: 'Residential Conveyancing', desc: 'Buying or selling property? We handle the entire process from offer to completion with transparent fixed fees.' },
    { name: 'Family Law', desc: 'Divorce, financial settlements, child arrangements. Sensitive, practical advice when you need it most.' },
    { name: 'Wills & Probate', desc: 'Protect your legacy with a professionally drafted will. Estate administration handled with care and efficiency.' },
    { name: 'Employment Law', desc: 'Settlement agreements, unfair dismissal, redundancy. Clear advice for employees and employers.' },
    { name: 'Commercial Property', desc: 'Leases, acquisitions, and development. Strategic advice for business owners and investors.' },
    { name: 'Dispute Resolution', desc: 'Contract disputes, debt recovery, professional negligence. We pursue resolution before litigation.' },
  ],

  lawyers: [
    { name: 'James Whitfield', role: 'Senior Partner', specialty: 'Commercial Property & Dispute Resolution', initials: 'JW' },
    { name: 'Eleanor Cross', role: 'Partner', specialty: 'Family Law & Mediation', initials: 'EC' },
    { name: 'Robert Palmer', role: 'Associate', specialty: 'Conveyancing & Property Law', initials: 'RP' },
  ],

  pageTitle: 'Whitfield & Co. — Solicitors in Bath',
} as const
