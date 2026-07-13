export interface ClassItem {
  name: string;
  desc: string;
  price: string;
  time: string;
  level: string;
}

export interface Teacher {
  name: string;
  role: string;
  specialty: string;
  initials: string;
}

export interface HoursItem {
  days: string;
  time: string;
}

export const yogaData = {
  // ── Brand ──────────────────────────────────────────────
  name: 'SANTOSHA',
  subtitle: 'Yoga & Wellness Studio',
  tagline:
    'Find stillness in movement. Classes for every body, every level, every journey.',

  // ── Location / Contact ─────────────────────────────────
  street: '15 Walcot Street, Bath BA1 5BG',
  postcode: 'BA1 5BG',
  phone: '+44 1225 345678',
  phoneDisplay: '01225 345678',
  email: 'breathe@santoshayoga.co.uk',
  location: 'Bath, UK',
  established: '2017',
  googleRating: '4.9',
  googleReviews: '230+ reviews',

  // ── Hours ──────────────────────────────────────────────
  hoursCompact: 'Mon—Fri: 6:30—20:30 · Sat—Sun: 8:00—18:00',
  hoursItems: [
    { days: 'Mon - Fri', time: '6:30 - 20:30' },
    { days: 'Saturday', time: '8:00 - 18:00' },
    { days: 'Sunday', time: '8:00 - 18:00' },
  ] as HoursItem[],

  // ── Hero ───────────────────────────────────────────────
  heroLine1: 'Breathe.',
  heroLine2: 'Move.',
  heroLine3: 'Be.',
  heroSubtitle:
    'Find stillness in movement. Classes for every body, every level, every journey.',
  heroCta1: { text: 'View Classes', href: '#classes' },
  heroCta2: { text: 'Book a Session', href: '#book' },

  // ── Classes Section ────────────────────────────────────
  classTitle: 'Our Practice',
  classSubtitle: 'Something for everyone.',
  classDescription:
    'Six distinct practices. One sanctuary. Find the class that speaks to where you are today.',
  classes: [
    {
      name: 'Vinyasa Flow',
      desc: 'Dynamic sequence linking breath with movement. Builds strength, flexibility, and focus.',
      price: '£14',
      time: '60 min',
      level: 'All Levels',
    },
    {
      name: 'Yin & Restore',
      desc: 'Deep, passive stretches held for 3-5 minutes. Release tension and calm the nervous system.',
      price: '£12',
      time: '75 min',
      level: 'Beginner',
    },
    {
      name: 'Hatha Foundations',
      desc: 'Classic postures with detailed alignment cues. Perfect for building a strong practice.',
      price: '£12',
      time: '60 min',
      level: 'Beginner',
    },
    {
      name: 'Power Yoga',
      desc: 'Athletic, challenging flow designed to build heat and endurance. Come ready to sweat.',
      price: '£14',
      time: '60 min',
      level: 'Intermediate',
    },
    {
      name: 'Sunrise Meditation',
      desc: 'Guided meditation and gentle movement to start your day with clarity and intention.',
      price: '£8',
      time: '30 min',
      level: 'All Levels',
    },
    {
      name: 'Prenatal Yoga',
      desc: 'Safe, nurturing practice for expectant mothers. Focus on breath, pelvic floor, and relaxation.',
      price: '£14',
      time: '75 min',
      level: 'Pregnancy',
    },
  ] as ClassItem[],

  classLevelColors: {
    'All Levels': 'bg-emerald/10 text-emerald',
    Beginner: 'bg-sage-100 text-sage-700',
    Intermediate: 'bg-sage-100 text-sage-700',
    Pregnancy: 'bg-sage-100 text-sage-700',
  } as Record<string, string>,

  // ── Teachers Section ───────────────────────────────────
  teachersTitle: 'Our Teachers',
  teachersSubtitle: ['Guides on ', 'your', ' journey.'] as [
    string,
    string,
    string,
  ],
  teachersDescription:
    'Experienced practitioners dedicated to holding space for your growth.',
  teachers: [
    {
      name: 'Priya Sharma',
      role: 'Founder & Lead Teacher',
      specialty: 'Vinyasa, Meditation, Teacher Training',
      initials: 'PS',
    },
    {
      name: 'Luna Johansson',
      role: 'Senior Teacher',
      specialty: 'Yin, Restorative, Sound Healing',
      initials: 'LJ',
    },
    {
      name: 'Marcus Webb',
      role: 'Teacher',
      specialty: 'Power Yoga, Mobility, Breathwork',
      initials: 'MW',
    },
    {
      name: 'Aiko Tanaka',
      role: 'Teacher',
      specialty: 'Hatha, Prenatal, Kids Yoga',
      initials: 'AT',
    },
  ] as Teacher[],

  // ── Booking Section ────────────────────────────────────
  bookTitle: 'Book a Class',
  bookSubtitle: 'Begin your practice.',
  bookDescription: "Reserve your spot. We'll confirm within the hour.",
  bookFields: {
    name: { label: 'Name', placeholder: 'Your full name' },
    email: { label: 'Email', placeholder: 'you@example.com' },
    class: { label: 'Class', placeholder: 'Select a class' },
    date: { label: 'Date' },
  },
  bookSubmitLabel: 'Reserve Spot',
  bookSubmittedLabel: 'Reserved!',

  // ── Footer ─────────────────────────────────────────────
  footerDescription:
    'A sanctuary for stillness and movement in the heart of Bath.',
  footerCopyright: 'SANTOSHA Yoga &amp; Wellness',
  footerTagline: 'Made with intention in Bath, UK',
  footerAddress: ['15 Walcot Street', 'Bath BA1 5BG', 'United Kingdom'],

  // ── UI Labels ─────────────────────────────────────────
  nav: {
    classes: 'Classes',
    teachers: 'Teachers',
    book: 'Book',
    bookNow: 'Book Now',
  },
  cardBookLabel: 'Book',
  footerHeadings: {
    classes: 'Classes',
    hours: 'Hours',
    findUs: 'Find Us',
  },

  // ── Page Meta ──────────────────────────────────────────
  pageTitle: 'SANTOSHA — Yoga & Wellness Studio in Bath',
} as const;
