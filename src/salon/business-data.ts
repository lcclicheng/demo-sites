export interface ServiceItem {
  name: string
  desc: string
  price: string
  time: string
  span?: number
}

export interface GalleryItem {
  gradient: string
  emoji: string
  title: string
}

export interface Stylist {
  name: string
  role: string
  specialty: string
  initials: string
}

export interface ServiceCategory {
  category: string
  items: ServiceItem[]
}

export interface BookingField {
  label: string
  placeholder: string
  type: 'text' | 'email' | 'select' | 'date' | 'time' | 'textarea'
}

export const salonData = {
  template: 'salon' as const,

  // ── Hero ──
  heroLine1: 'ATELIER',
  heroLine2: 'Hair as Art',
  heroBadge: 'The Craft',
  heroTagline:
    'A private studio in Bath for those who understand that great hair is architecture, not decoration.',
  heroRating: '4.9',
  heroReviews: '280+ reviews',
  heroCta1: { text: 'Book Consultation', href: '#booking' },
  heroCta2: { text: 'View Services', href: '#services' },

  // ── Section labels ──
  servicesTitle: 'Our Services',
  servicesBadge: 'The Craft',
  artistsTitle: 'Meet Our Team',
  artistsBadge: 'The Artists',
  galleryTitle: 'Our Work',
  galleryBadge: 'The Gallery',

  // ── Booking ──
  bookingTitle: 'Begin Your\nTransformation',
  bookingBadge: 'Reservations',
  bookingDescription:
    'Every appointment begins with a detailed consultation. We do not cut — we design.',
  bookingCta: 'Reserve Your Appointment',
  bookingFields: [
    { label: 'Name', placeholder: 'Your full name', type: 'text' as const },
    { label: 'Email', placeholder: 'Your email address', type: 'email' as const },
    { label: 'Service', placeholder: '', type: 'select' as const },
    { label: 'Stylist', placeholder: '', type: 'select' as const },
    { label: 'Date', placeholder: '', type: 'date' as const },
    { label: 'Time', placeholder: '', type: 'time' as const },
    { label: 'Notes', placeholder: 'Any special requests or allergies...', type: 'textarea' as const },
  ],

  // ── Service categories ──
  serviceCategories: [
    {
      category: 'Hair',
      items: [
        {
          name: 'Signature Cut',
          price: '£85',
          time: '60 min',
          desc: 'Precision cutting tailored to your bone structure and hair texture. A bespoke consultation precedes every cut.',
          span: 2,
        },
        {
          name: 'Balayage',
          price: '£140',
          time: '2–3 hrs',
          desc: 'Hand-painted colour for natural, sun-kissed dimension with seamless grow-out.',
          span: 1,
        },
        {
          name: 'Full Colour',
          price: '£110',
          time: '2 hrs',
          desc: 'Complete colour transformation using ammonia-free, conditioning formulas.',
          span: 1,
        },
        {
          name: 'Keratin Treatment',
          price: '£165',
          time: '90 min',
          desc: 'Advanced smoothing therapy eliminating frizz and restoring structural integrity.',
          span: 2,
        },
        {
          name: 'Event Styling',
          price: '£65',
          time: '45 min',
          desc: 'Red-carpet worthy styling with lasting hold and luminous finish.',
          span: 1,
        },
      ],
    },
    {
      category: 'Beauty',
      items: [
        {
          name: 'Brow Sculpt',
          price: '£45',
          time: '30 min',
          desc: 'Architectural brow shaping calibrated to your facial proportions.',
          span: 1,
        },
      ],
    },
  ],

  // ── Gallery ──
  galleryItems: [
    { gradient: 'from-blush via-pink-200 to-plum/20', emoji: '💇‍♀️', title: 'Precision Cut' },
    { gradient: 'from-plum/30 via-blush to-rose-200', emoji: '💆‍♀️', title: 'Colour Ritual' },
    { gradient: 'from-amber-100 via-blush to-plum/20', emoji: '✨', title: 'Finishing Art' },
    { gradient: 'from-rose-200 via-blush to-pink-100', emoji: '💄', title: 'Makeup Design' },
    { gradient: 'from-green-100 via-blush/40 to-plum/20', emoji: '🌿', title: 'Botanical Care' },
    { gradient: 'from-plum/20 via-blush to-amber-50', emoji: '🕯️', title: 'Atelier Ambiance' },
  ],

  // ── Stylists ──
  stylists: [
    {
      name: 'Isabelle Moreau',
      role: 'Creative Director',
      specialty: 'Architectural Cutting',
      initials: 'IM',
    },
    {
      name: 'Clara Jensen',
      role: 'Senior Colourist',
      specialty: 'Bespoke Colour Theory',
      initials: 'CJ',
    },
    {
      name: 'Maya Okonkwo',
      role: 'Master Stylist',
      specialty: 'Texture & Updos',
      initials: 'MO',
    },
  ],

  // ── Footer ──
  brand: 'ATELIER',
  brandDescription:
    'A private hair design studio in the heart of Bath. Architecture for hair, crafted with precision.',
  footerServicesTitle: 'Services',
  footerHoursTitle: 'Hours',
  footerFindUsTitle: 'Find Us',
  hours: 'Tue—Sat · 9:00—18:00',
  hoursNote: 'Sun—Mon · Closed',
  address: '24 Milsom Street',
  address2: 'Bath BA1 1DG',
  phone: '+44 1225 789012',
  email: 'hello@atelierbath.com',
  established: '2024',
  establishedText: 'Hair as Art — Since 2024',

  // ── Page ──
  pageTitle: 'ATELIER — Hair Design Studio',
}
