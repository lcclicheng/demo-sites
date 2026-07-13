// MONO — Brutalist coffee template business data

export interface MenuItem {
  name: string;
  origin: string;
  notes: string;
  roast: string;
  price: string;
  desc: string;
  roastLevel: number;
  process: string;
}

export const coffeeData = {
  template: 'coffee',

  /* ---- Brand ---- */
  name: 'MONO',
  subtitle: 'Specialty Coffee · Single Origin',
  tagline:
    'We source directly from independent farms, roast in 15kg batches, and serve with radical precision. No syrups. No compromises. Just coffee.',
  pageTitle: 'MONO — Specialty Coffee',
  established: '2019',
  location: 'Shoreditch, London',

  /* ---- Contact ---- */
  street: '47 Redchurch Street, Shoreditch, London E2 7DJ',
  postcode: 'E2 7DJ',
  phone: '+44 20 7123 4567',
  email: 'hello@monocoffee.co.uk',
  hours: 'Every day · 7:00—19:00',
  instagram: '#',
  facebook: '#',

  /* ---- Navigation ---- */
  navLinks: [
    { text: 'Menu', href: '#menu' },
    { text: 'Roastery', href: '#roastery' },
    { text: 'Order', href: '#order' },
  ],

  /* ---- Hero ---- */
  heroLine1: 'COFFEE',
  heroLine2: 'IS A',
  heroLine3: 'RITUAL',
  heroBadge: 'Specialty Coffee · Single Origin',
  heroCta1: { text: 'View Menu', href: '#menu' },
  heroCta2: { text: 'Pre-order', href: '#order' },

  /* ---- Menu ---- */
  menuTitle: 'THE\nMENU',
  menuSubtitle: 'Rotating selection of single-origin lots',
  menuItems: [
    {
      name: 'Ethiopia Yirgacheffe',
      origin: 'Gedeb, Yirgacheffe',
      notes: 'Jasmine · Bergamot · Honey',
      roast: 'Light',
      price: '£4.50',
      desc: 'Washed process from the Gedeb district. Floral, tea-like body.',
      roastLevel: 1,
      process: 'Washed',
    },
    {
      name: 'Colombia El Paraiso',
      origin: 'Cauca',
      notes: 'Apple · Caramel · Cacao',
      roast: 'Medium',
      price: '£4.20',
      desc: 'Double anaerobic fermentation from Cauca. Juicy and complex.',
      roastLevel: 3,
      process: 'Anaerobic Natural',
    },
    {
      name: 'Sumatra Mandheling',
      origin: 'Lintong, Sumatra',
      notes: 'Chocolate · Cedar · Spice',
      roast: 'Dark',
      price: '£4.00',
      desc: 'Wet-hulled from Northern Sumatra. Earthy, full-bodied.',
      roastLevel: 5,
      process: 'Wet-Hulled',
    },
    {
      name: 'Guatemala Antigua',
      origin: 'Antigua Valley',
      notes: 'Toffee · Orange · Walnut',
      roast: 'Medium',
      price: '£4.30',
      desc: 'Volcanic soil grown. Balanced with a buttery finish.',
      roastLevel: 3,
      process: 'Washed',
    },
  ],

  /* ---- Roastery ---- */
  roasteryTitle: 'THE\nROASTERY',
  roasteryDescription:
    'Every bean is profiled on our 15kg drum roaster. We develop each curve individually — no factory presets, no guesswork. After roasting, coffee rests for 72 hours to degas before we pull the first shot.',
  heroStats: [
    {
      value: '15kg',
      label: 'Batch size — small enough to control every variable',
    },
    { value: '12', label: 'Roast profiles dialled per origin' },
    { value: '72h', label: 'Minimum rest before first extraction' },
  ],

  /* ---- Order ---- */
  orderTitle: 'PRE-ORDER',
  orderSubtitle: "We'll have it ready when you arrive. No queue, no wait.",
  orderConfirmationTitle: 'Order confirmed.',
  orderConfirmationMessage: 'See you soon at the bar.',
  orderFormLabels: {
    coffee: 'Coffee',
    name: 'Name',
    phone: 'Phone',
    notes: 'Notes',
    submit: 'Place Order',
  },
  orderFormPlaceholders: {
    coffee: 'Select origin',
    name: 'Your name',
    phone: '+44',
    notes: 'Any preferences?',
  },

  /* ---- Footer ---- */
  footerTagline:
    'Single-origin coffee, roasted with intention. Shoreditch, London.',
  footerBottomText: 'Designed with precision. Served with intention.',
  footerHoursLabel: 'Hours',
  footerContactLabel: 'Contact',
} as const;
