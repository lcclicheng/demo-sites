// 批量生成 5 个新真实商家 demo（从对应基模板复制 + 覆盖身份字段）
// 用法：node _new5.mjs
import fs from 'fs';
import path from 'path';

function deepMerge(base, over) {
  const out = Array.isArray(base) ? base.slice() : { ...base };
  for (const k of Object.keys(over)) {
    const b = base ? base[k] : undefined;
    const o = over[k];
    if (b && typeof b === 'object' && !Array.isArray(b) && o && typeof o === 'object' && !Array.isArray(o)) {
      out[k] = deepMerge(b, o);
    } else {
      out[k] = o;
    }
  }
  return out;
}

const specs = [
  {
    slug: 'capstone-law',
    base: 'chambers-law',
    m: {
      name: 'CAPSTONE',
      subtitle: 'Solicitors',
      tagline: 'Independent solicitors in Bristol since 1973 — honest, approachable legal advice for families and businesses.',
      established: '1973',
      location: 'Bristol, UK',
      street: 'Gloucester Road, Bishopston, Bristol BS7 8AS',
      registeredAddress: 'Gloucester Road, Bishopston, Bristol, United Kingdom',
      phone: '+44 117 946 1100',
      email: 'hello@capstonelaw.co.uk',
      googleRating: '4.9',
      googleReviews: '120+ reviews',
      pageTitle: 'CAPSTONE — Solicitors in Bristol',
      heroLines: ['INDEPENDENT.', 'APPROACHABLE.', 'TRUSTED.'],
      heroLine1: 'INDEPENDENT.',
      heroLine2: 'APPROACHABLE. TRUSTED.',
      heroCta1: { text: 'Our Services', href: '#menu' },
      heroCta2: { text: 'Book a Consultation', href: '#booking' },
      stats: [
        { value: '50+', label: 'Years' },
        { value: '4.9', label: 'Rating' },
        { value: '500+', label: 'Clients' },
        { value: 'SRA', label: 'Regulated' }
      ],
      heroStats: [
        { val: '50+', label: 'Years' },
        { val: '4.9', label: 'Rating' },
        { val: '500+', label: 'Clients' },
        { val: 'SRA', label: 'Regulated' }
      ],
      infoBar: [
        { icon: 'MapPin', text: 'Gloucester Road, Bishopston, Bristol BS7' },
        { icon: 'Clock', text: 'Mon—Fri: 9:00—17:30' },
        { icon: 'Phone', text: '+44 117 946 1100' }
      ],
      menuIntroTitle: 'How we can',
      story: { title: 'Decades of', paragraphs: ['Independent solicitors in Bristol since 1973 — honest, approachable legal advice for families and businesses, by referral and reputation rather than paid referral fees.'], stats: [] },
      footer: { note: 'Regulated by the Solicitors Regulation Authority.', quickLinks: ['Services', 'Team', 'Contact'] }
    }
  },
  {
    slug: 'love-yoga',
    base: 'breath-yoga',
    m: {
      name: 'LOVE YOGA',
      subtitle: 'Yoga & Wellness',
      tagline: 'A light-filled yoga studio in North Leeds — yoga for every body, every level, every journey.',
      established: '2018',
      location: 'Leeds, UK',
      street: 'Meanwood, Leeds LS6',
      registeredAddress: 'Meanwood, Leeds, United Kingdom',
      phone: '+44 113 345 6789',
      email: 'hello@loveyogaleeds.com',
      googleRating: '4.9',
      googleReviews: '300+ reviews',
      pageTitle: 'LOVE YOGA — Yoga in Leeds',
      heroLine1: 'Breathe.',
      heroLine2: 'Move.',
      heroLine3: 'Be.',
      heroSubtitle: 'Yoga for every body, every level.',
      heroCta1: { text: 'View Classes', href: '#menu' },
      heroCta2: { text: 'Book a Session', href: '#booking' },
      phoneDisplay: '+44 113 345 6789',
      hoursCompact: 'Mon—Fri 6:30—20:30 · Sat—Sun 8:00—18:00',
      hours: 'Mon—Fri 6:30—20:30 · Sat—Sun 8:00—18:00',
      hoursItems: [
        { days: 'Mon—Fri', hours: '6:30—20:30' },
        { days: 'Sat—Sun', hours: '8:00—18:00' }
      ],
      heroStats: [
        { val: '4.9', label: 'Google Rating', stars: true },
        { val: '300+', label: 'Reviews' },
        { val: '2018', label: 'Established' }
      ],
      infoBar: [
        { icon: 'MapPin', text: 'Meanwood, Leeds LS6' },
        { icon: 'Clock', text: 'Mon—Fri 6:30—20:30 · Sat—Sun 8:00—18:00' },
        { icon: 'Phone', text: '+44 113 345 6789' }
      ],
      story: { title: 'Our Practice', paragraphs: ['From gentle restoration to athletic flow — a light-filled studio in North Leeds for every body and every level.'], stats: [] },
      footer: { note: 'A sanctuary for movement and mindfulness in Leeds.', quickLinks: ['Classes', 'Teachers', 'Book'] },
      footerDescription: 'A light-filled studio in North Leeds.',
      footerTagline: 'Yoga for every body, every level.',
      footerAddress: 'Meanwood, Leeds LS6'
    }
  },
  {
    slug: 'sycamore-hotel',
    base: 'cornish-cove-hotel',
    m: {
      name: 'THE SYCAMORE',
      tagline: 'A family-run Edwardian guest house in the heart of York — cosy rooms, a hearty Full English, and a 10-minute walk to the Minster.',
      established: '1904',
      location: 'York, UK',
      street: 'York',
      registeredAddress: 'York, United Kingdom',
      phone: '+44 1904 654321',
      email: 'hello@thesycamore.co.uk',
      googleRating: '4.8',
      googleReviews: '280+ reviews',
      pageTitle: 'THE SYCAMORE — Guest House in York',
      heroLine1: 'Edwardian.',
      heroLine2: 'Family-run.',
      heroLine3: 'York.',
      heroTagline: 'Cosy rooms in a 1904 Edwardian house, a hearty breakfast, and a 10-minute walk to the Minster.',
      heroStars: 4,
      heroRatingText: '4.8 · 280+ reviews',
      heroCta1: { text: 'View Our Rooms', href: '#rooms' },
      heroCta2: { text: 'Check Availability', href: '#book' },
      navLinks: ['Rooms', 'Book'],
      navCtaText: 'Book Now',
      roomsSectionLabel: 'OUR ROOMS',
      roomsSectionTitle: 'Six quiet rooms, one short walk from the Minster.',
      rooms: [
        { name: 'The Garden Double', desc: 'Period-style double with en-suite shower, overlooking the leafy cul-de-sac. Super-comfy bed.', price: 95, gradient: 'from-emerald/20 to-gold/20' },
        { name: 'The Bay Twin', desc: 'Twin room with a bay window and original cornicing. En-suite shower.', price: 95, gradient: 'from-emerald/30 to-warm/20' },
        { name: 'The Attic Double', desc: 'Snug double under the eaves, quiet and cosy. Shared bathroom just outside.', price: 75, gradient: 'from-warm/30 to-gold/10' },
        { name: 'The Ground-Floor Single', desc: 'A bright single opening onto the garden — for the solo traveller exploring York.', price: 65, gradient: 'from-sky-200/30 to-emerald/10' }
      ],
      bookingSectionLabel: 'BOOK YOUR STAY',
      bookingTitleBefore: 'Your room',
      bookingTitleHighlight: 'awaits.',
      bookingFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'checkin', label: 'Check-in', type: 'date', required: true },
        { name: 'checkout', label: 'Check-out', type: 'date', required: true },
        { name: 'guests', label: 'Guests', type: 'select', options: ['1 Guest', '2 Guests', '3 Guests', '4 Guests'] }
      ],
      infoBar: [
        { icon: 'MapPin', label: 'Location', lines: ['York', 'YO1 1AD'], text: 'York, UK' },
        { icon: 'Clock', label: 'Check-in / out', lines: ['Check-in: 14:00', 'Check-out: 10:30'] },
        { icon: 'Phone', label: 'Contact', lines: ['+44 1904 654321', 'hello@thesycamore.co.uk'] }
      ],
      footerDescription: 'A family-run Edwardian guest house in the heart of York. Six individual rooms, a 10-minute walk from the Minster.',
      footerInfo: [
        { label: 'Rooms', items: ['The Garden Double', 'The Bay Twin', 'The Attic Double', 'The Ground-Floor Single'] },
        { label: 'Info', items: ['Check-in: 14:00', 'Check-out: 10:30', 'Breakfast: 8:00–9:30'] },
        { label: 'Find Us', items: ['York', 'United Kingdom'] }
      ],
      footerAddressLines: ['York', 'United Kingdom'],
      footerSocial: [{ icon: 'Instagram', url: '#' }, { icon: 'Facebook', url: '#' }],
      footerCopyright: 'All rights reserved.'
    }
  },
  {
    slug: 'now-plumbing',
    base: 'granite-trades',
    m: {
      name: 'NOW PLUMBING',
      subtitle: 'Plumbing · Heating · Gas',
      tagline: 'Family-run plumbing & heating in Liverpool for 17+ years — Gas Safe engineers, fixed-price quotes, no call-out surprises.',
      established: '2008',
      location: 'Liverpool, UK',
      street: 'Liverpool',
      registeredAddress: 'Liverpool, United Kingdom',
      phone: '+44 151 808 0800',
      emergency: true,
      emergencyPhone: '+44 151 808 0999',
      email: 'hello@nowplumb.co.uk',
      googleRating: '5.0',
      googleReviews: '140+ reviews',
      hours: 'Mon—Fri: 8:00—18:00 · Sat: 9:00—13:00 · 24/7 Emergency',
      pageTitle: 'NOW PLUMBING — Plumbing · Heating in Liverpool',
      heroLine1: 'Fixed right,',
      heroLine2: 'first time.',
      heroCta1: { text: 'Get a Free Quote', href: '#contact' },
      heroCta2: { text: '24/7 Emergency', href: '#contact' },
      certs: ['Gas Safe Registered', 'Fully Insured', 'City & Guilds', 'Checkatrade'],
      stats: [
        { value: '17+', label: 'Years' },
        { value: '140+', label: 'Reviews' },
        { value: '5.0', label: 'Rating' },
        { value: '60min', label: 'Response' }
      ],
      aboutTitle: 'Seventeen years of getting it right.',
      aboutParagraphs: [
        'Now Plumbing has kept Liverpool’s homes warm, dry and working for over seventeen years — fixed-price quotes, Gas Safe engineers, and no call-out surprises.',
        'Boilers, bathrooms, emergencies and landlord certificates, all under one roof. Clear quotes, tidy work, and a guarantee on every job.',
        'Every engineer is qualified, insured and background-checked. No jargon, no upsells, no surprises.'
      ],
      reviews: [
        { name: 'Sarah M.', text: 'New boiler fitted last month. Tidy, polite, explained everything. Best of four quotes.', rating: 5 },
        { name: 'Paul R.', text: 'Burst pipe at 8pm — they were here in under an hour. Lifesavers.', rating: 5 },
        { name: 'The Okafor Family', text: 'Used them for a full bathroom. Plumbing, tiling, heating — one team, zero stress.', rating: 5 }
      ]
    }
  },
  {
    slug: 'riverhill-coffee',
    base: 'morris-coffee',
    m: {
      name: 'RIVERHILL',
      subtitle: 'Specialty Coffee · Brunch',
      tagline: 'Glasgow’s heartbeat of specialty coffee — Dear Green beans, flat whites, and a warm community hub on Gordon Street.',
      established: '2014',
      location: 'Glasgow, UK',
      street: 'Gordon Street, Glasgow',
      registeredAddress: 'Gordon Street, Glasgow, United Kingdom',
      phone: '+44 141 248 0800',
      email: 'hello@riverhillcoffee.co.uk',
      googleRating: '4.6',
      googleReviews: '782+ reviews',
      hours: 'Mon—Fri · 7:30—18:00 · Sat—Sun · 9:00—17:00',
      pageTitle: 'RIVERHILL — Specialty Coffee in Glasgow',
      heroLine1: 'COFFEE,',
      heroLine2: 'COMMUNITY.',
      menuTitle: 'The Bar',
      menuSubtitle: 'Single origins & house blends',
      heroCta1: { text: 'Explore Our Menu', href: '#menu' },
      heroCta2: { text: 'Order Ahead', href: '#booking' },
      roasteryTitle: 'DEAR GREEN COFFEE',
      roasteryDescription: 'Beans from Dear Green Coffee Roasters — traceable, ethically sourced, roasted for freshness. No shortcuts.',
      heroBadge: 'Est. 2014 · Glasgow',
      heroStats: [
        { val: '4.6', label: 'Google Rating', stars: true },
        { val: '782+', label: 'Reviews' },
        { val: '2014', label: 'Established' }
      ],
      infoBar: [
        { icon: 'MapPin', text: '24 Gordon Street, Glasgow G1 3PU' },
        { icon: 'Clock', text: 'Mon—Fri · 7:30—18:00 · Sat—Sun · 9:00—17:00' },
        { icon: 'Phone', text: '+44 141 248 0800' }
      ],
      story: { title: 'DEAR GREEN COFFEE', paragraphs: ['Beans from Dear Green Coffee Roasters — traceable, ethically sourced, roasted for freshness. No shortcuts, just good coffee.'], stats: [{ value: '15kg', label: 'Batch' }, { value: '12', label: 'Profiles' }, { value: '72h', label: 'Rest' }] },
      footer: { note: 'Specialty coffee in the heart of Glasgow. A community hub on Gordon Street.', quickLinks: ['Menu', 'Roastery', 'Order'] },
      footerTagline: 'Specialty coffee in the heart of Glasgow. A community hub on Gordon Street.',
      footerBottomText: 'Crafted on Gordon Street, Glasgow.',
      navLinks: ['Menu', 'Roastery', 'Order'],
      navCtaText: 'Order Now',
      menuIntroTitle: 'Single origins & house blends',
      menuIntroText: 'Beans from Dear Green Coffee Roasters — traceable, ethically sourced, roasted for freshness.',
      hoursDetail: { wedFri: 'Mon—Fri · 7:30—18:00 · Sat—Sun · 9:00—17:00', saturday: 'Mon—Fri · 7:30—18:00 · Sat—Sun · 9:00—17:00', sunday: 'Mon—Fri · 7:30—18:00 · Sat—Sun · 9:00—17:00', closedDays: '' },
      booking: { intro: 'Order ahead and skip the queue.', note: 'Ready in 8–10 minutes.', occasionOptions: [] }
    }
  }
];

for (const { slug, base, m } of specs) {
  const basePath = path.join('examples', `${base}.json`);
  const o = deepMerge(JSON.parse(fs.readFileSync(basePath, 'utf8')), m);
  o.slug = slug;
  o._source = 'real-merchant';
  fs.writeFileSync(path.join('examples', `${slug}.json`), JSON.stringify(o, null, 2) + '\n');
  console.log('wrote examples/' + slug + '.json');
}
console.log('done: ' + specs.length + ' files');
