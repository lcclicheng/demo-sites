// 批量生成第二批 5 个新真实商家 demo（从对应基模板复制 + 覆盖身份字段）
// 用法：node _new5b.mjs
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
  // 1) Ashtree Accountants — Nottingham — Accountant（chambers-law 专业模板）
  {
    slug: 'ashtree-accountants',
    base: 'chambers-law',
    m: {
      name: 'ASHTREE ACCOUNTANTS',
      subtitle: 'Chartered Accountants',
      tagline: 'Independent chartered accountants in Nottingham — proactive, personal tax and accountancy for owner-managed businesses and families.',
      established: '1993',
      location: 'Nottingham, UK',
      street: 'Nottingham',
      registeredAddress: 'Nottingham, United Kingdom',
      phone: '+44 115 950 8080',
      email: 'hello@ashtreeaccountants.co.uk',
      googleRating: '5.0',
      googleReviews: '90+ reviews',
      pageTitle: 'ASHTREE ACCOUNTANTS — Chartered Accountants in Nottingham',
      heroLine1: 'CLEAR.',
      heroLine2: 'CALM. COMPLIANT.',
      heroCta1: { text: 'Our Services', href: '#menu' },
      heroCta2: { text: 'Book a Consultation', href: '#booking' },
      stats: [
        { value: '30+', label: 'Years' },
        { value: '5.0', label: 'Rating' },
        { value: '500+', label: 'Clients' },
        { value: 'ICAEW', label: 'Regulated' }
      ],
      heroStats: [
        { val: '30+', label: 'Years' },
        { val: '5.0', label: 'Rating' },
        { val: '500+', label: 'Clients' },
        { val: 'ICAEW', label: 'Regulated' }
      ],
      infoBar: [
        { icon: 'MapPin', text: 'Nottingham, NG1' },
        { icon: 'Clock', text: 'Mon—Fri: 9:00—17:30' },
        { icon: 'Phone', text: '+44 115 950 8080' }
      ],
      menuIntroTitle: 'How we can',
      story: { title: 'Decades of', paragraphs: ['Independent chartered accountants in Nottingham for thirty years — proactive, plain-English advice for owner-managed businesses, families and charities, by relationship not by hard sell.'], stats: [] },
      footer: { note: 'Regulated by the Institute of Chartered Accountants in England and Wales.', quickLinks: ['Services', 'Team', 'Contact'] }
    }
  },
  // 2) 42 St Giles' Dentists — Oxford — Dentist（chambers-law 专业模板）
  {
    slug: 'st-giles-dentists',
    base: 'chambers-law',
    m: {
      name: '42 ST GILES',
      subtitle: 'Dentists, Oxford',
      tagline: 'Private dentistry in a beautiful Grade II listed building on St Giles’, Oxford — check-ups, hygiene, implants and cosmetic care.',
      established: '1998',
      location: 'Oxford, UK',
      street: 'St Giles’, Oxford',
      registeredAddress: 'St Giles’, Oxford, United Kingdom',
      phone: '+44 1865 310368',
      email: 'hello@42stgiles.com',
      googleRating: '4.9',
      googleReviews: '200+ reviews',
      pageTitle: '42 ST GILES — Dentists in Oxford',
      heroLine1: 'HEALTHY.',
      heroLine2: 'CONFIDENT. SMILES.',
      heroCta1: { text: 'Our Treatments', href: '#menu' },
      heroCta2: { text: 'Book an Appointment', href: '#booking' },
      stats: [
        { value: '4.9', label: 'Rating' },
        { value: '200+', label: 'Reviews' },
        { value: 'GDC', label: 'Regulated' },
        { value: '25+', label: 'Years' }
      ],
      heroStats: [
        { val: '4.9', label: 'Rating' },
        { val: '200+', label: 'Reviews' },
        { val: 'GDC', label: 'Regulated' },
        { val: '25+', label: 'Years' }
      ],
      infoBar: [
        { icon: 'MapPin', text: 'St Giles’, Oxford OX1' },
        { icon: 'Clock', text: 'Mon—Fri: 8:45—17:15' },
        { icon: 'Phone', text: '+44 1865 310368' }
      ],
      menuIntroTitle: 'Our care',
      story: { title: 'A practice built on', paragraphs: ['Private dentistry in a beautifully restored Grade II listed building on St Giles’ — check-ups, hygiene, implants and cosmetic care delivered with a calm, personal touch.'], stats: [] },
      footer: { note: 'Regulated by the General Dental Council (GDC). CQC registered.', quickLinks: ['Treatments', 'Team', 'Book'] }
    }
  },
  // 3) Hampsons Estate Agents — Leicester — Estate Agent（chambers-law 专业模板）
  {
    slug: 'hampsons-estate',
    base: 'chambers-law',
    m: {
      name: 'HAMPSONS',
      subtitle: 'Estate Agents · Leicester',
      tagline: 'Independent, family-run estate agents in Leicester — honest, personal service for sales and lettings since 2020.',
      established: '2020',
      location: 'Leicester, UK',
      street: 'Leicester',
      registeredAddress: 'Leicester, United Kingdom',
      phone: '+44 116 214 7555',
      email: 'hello@hampsonsestateagents.co.uk',
      googleRating: '5.0',
      googleReviews: '120+ reviews',
      pageTitle: 'HAMPSONS — Estate Agents in Leicester',
      heroLine1: 'YOUR MOVE,',
      heroLine2: 'matters most.',
      heroCta1: { text: 'Book a Valuation', href: '#menu' },
      heroCta2: { text: 'View Properties', href: '#booking' },
      stats: [
        { value: '5.0', label: 'Rating' },
        { value: '120+', label: 'Reviews' },
        { value: 'NAEA', label: 'Propertymark' },
        { value: '2020', label: 'Established' }
      ],
      heroStats: [
        { val: '5.0', label: 'Rating' },
        { val: '120+', label: 'Reviews' },
        { val: 'NAEA', label: 'Propertymark' },
        { val: '2020', label: 'Established' }
      ],
      infoBar: [
        { icon: 'MapPin', text: 'Leicester, LE1' },
        { icon: 'Clock', text: 'Mon—Fri: 9:00—17:30 · Sat: 9:00—13:00' },
        { icon: 'Phone', text: '+44 116 214 7555' }
      ],
      menuIntroTitle: 'How we help',
      story: { title: 'A family business', paragraphs: ['Independent, family-run estate agents in Leicester — honest, personal sales and lettings service built on one-to-one attention and a reputation for doing right by every vendor and buyer.'], stats: [] },
      footer: { note: 'Members of NAEA Propertymark and The Property Ombudsman.', quickLinks: ['Valuation', 'Sales', 'Lettings'] }
    }
  },
  // 4) The Garden Business — Bath — Garden & Landscaping（granite-trades 模板）
  {
    slug: 'garden-business',
    base: 'granite-trades',
    m: {
      name: 'THE GARDEN BUSINESS',
      subtitle: 'Garden Design · Landscaping · Maintenance',
      tagline: 'Creative garden design, landscaping and maintenance in and around Bath — award-winning workmanship, hassle-free upkeep.',
      established: '2020',
      location: 'Bath, UK',
      street: 'Bath',
      registeredAddress: 'Bath, United Kingdom',
      phone: '+44 1225 851319',
      email: 'hello@thegardenbusiness.com',
      googleRating: '5.0',
      googleReviews: '60+ reviews',
      hours: 'Mon—Fri: 8:00—17:00 · Sat: 9:00—13:00',
      pageTitle: 'THE GARDEN BUSINESS — Garden Design & Landscaping in Bath',
      heroLine1: 'Gardens',
      heroLine2: 'worth loving.',
      heroCta1: { text: 'Get a Free Quote', href: '#contact' },
      heroCta2: { text: 'See Our Work', href: '#contact' },
      certs: ['RHS Awards', 'Fully Insured', 'BALI Member', 'Checkatrade'],
      stats: [
        { value: '5+', label: 'Years' },
        { value: '60+', label: 'Reviews' },
        { value: '5.0', label: 'Rating' },
        { value: '100%', label: 'Bath-based' }
      ],
      aboutTitle: 'Designed, built and cared for.',
      aboutParagraphs: [
        'The Garden Business creates and maintains fantastic gardens across Bath — from creative design and full landscaping construction to hassle-free ongoing maintenance.',
        'Award-winning workmanship and a friendly, reliable team have earned us a leading reputation with Bath’s homeowners, businesses and prestigious contractors.',
        'No-obligation quotations, clear communication and tidy sites on every project, big or small.'
      ],
      reviews: [
        { name: 'Emma L.', text: 'Transformed our rear garden. Designed exactly what we wanted and the build was spotless. Could not be happier.', rating: 5 },
        { name: 'The Whitakers', text: 'Maintenance plan keeps the garden looking perfect with zero effort from us. Reliable and lovely team.', rating: 5 },
        { name: 'James P.', text: 'Oak planters and fencing done beautifully. Fair price, tidy work, finished on time.', rating: 5 }
      ]
    }
  },
  // 5) Brinkburn St Brewery — Newcastle — Microbrewery & Taproom（osteria-lua 餐厅模板适配）
  {
    slug: 'brinkburn-brewery',
    base: 'osteria-lua',
    m: {
      name: 'BRINKBURN ST BREWERY',
      subtitle: 'Microbrewery · Bar · Kitchen',
      tagline: 'A loved local taphouse in Newcastle’s Ouseburn Valley — handcrafted beers brewed on-site, locally sourced food, and brewery tours.',
      location: 'Newcastle upon Tyne, UK',
      street: 'Ouseburn Valley, Byker, Newcastle',
      registeredAddress: 'Ouseburn Valley, Byker, Newcastle upon Tyne, United Kingdom',
      phone: '+44 191 265 0500',
      email: 'hello@brinkburnbrewery.co.uk',
      googleRating: '4.8',
      googleReviews: '1,200+ reviews',
      pageTitle: 'BRINKBURN ST BREWERY — Microbrewery & Taproom in Newcastle',
      heroBadge: 'Newcastle · Ouseburn Valley',
      heroLine1: 'Byker brewed,',
      heroLine2: 'Byker loved.',
      heroStats: [
        { val: '4.8', stars: true },
        { val: '1,200+', stars: false },
        { val: 'Est. 2015', stars: false }
      ],
      infoTicker: [
        { icon: 'MapPin', text: 'Ouseburn Valley, Byker' },
        { icon: 'Clock', text: 'Mon—Sun · 12:00—23:00' },
        { icon: 'Phone', text: '+44 191 265 0500' },
        { icon: 'Beer', text: '16 taps on site' }
      ],
      heroCta1: { text: 'Book a Brewery Tour', href: '#reserve' },
      heroCta2: { text: 'See Our Beers', href: '#menu' },
      menuIntroTitle: 'The Bar',
      menuIntroText: 'Handcrafted beers brewed on-site in our microbrewery — from refreshing session ales to bold IPAs and rich stouts, plus proper scran from the kitchen.',
      menuSections: [
        {
          icon: 'Beer',
          title: 'On Tap',
          items: [
            { name: 'Byker Pale Ale', desc: 'Easy-drinking session pale, citrus and biscuit. 4.0%', price: 5 },
            { name: 'Ouseburn IPA', desc: 'Bold, resinous IPA with tropical hop character. 5.8%', price: 6 },
            { name: 'Ford Stout', desc: 'Smooth roast stout, coffee and dark chocolate. 5.2%', price: 6 },
            { name: 'Valley Lager', desc: 'Crisp, clean lager brewed for the long NE summer. 4.3%', price: 5 }
          ]
        },
        {
          icon: 'UtensilsCrossed',
          title: 'Proper Scran',
          items: [
            { name: 'Small Plates', desc: 'Northern-inspired bites to share — perfect with a pint.', price: 7 },
            { name: 'Brinkburn Burger', desc: 'Locally sourced beef, smoked cheese, house pickles.', price: 13 },
            { name: 'Sunday Roast', desc: 'Slow-cooked roast with all the trimmings. Sundays only.', price: 15 }
          ]
        },
        {
          icon: 'Sparkles',
          title: 'Tasting & Tours',
          items: [
            { name: 'Brewery Tour', desc: 'Behind-the-scenes look at the microbrewery with a guide.', price: 12 },
            { name: 'Beer Tasting Flight', desc: 'Five core and seasonal beers, explained by our brewers.', price: 10 }
          ]
        }
      ],
      screenshots: [
        { icon: 'Beer', title: 'The Taproom', sub: '16 beers on tap', gradient: 'from-stone-900 to-abyss' },
        { icon: 'Flame', title: 'The Microbrewery', sub: 'Brewed on site', gradient: 'from-stone-900 to-abyss' },
        { icon: 'UtensilsCrossed', title: 'The Kitchen', sub: 'Local, fresh scran', gradient: 'from-stone-900 to-abyss' },
        { icon: 'Lamp', title: 'Events & Live Music', sub: 'Community nights', gradient: 'from-stone-900 to-abyss' }
      ],
      reviews: [
        { name: 'Sophie T.', text: 'Best taproom in the Ouseburn. The IPA is unreal and the burger is bang on. Proper local spot.', rating: 5 },
        { name: 'Dan M.', text: 'Took the brewery tour for a mate’s birthday — brilliant, friendly and the flights were spot on.', rating: 5 },
        { name: 'Aisha K.', text: 'Sunday roast here is legendary. Cosy, characterful, never rushed. Our go-to.', rating: 5 }
      ],
      reservationNote: 'Brewery tours and private hire can be booked online. For groups of 8+ or events, get in touch via the form.',
      occasionOptions: ['Brewery Tour', 'Private Hire', 'Events'],
      hoursDetail: {
        wedFri: 'Mon—Thu: 12:00—23:00',
        saturday: 'Fri—Sat: 11:00—00:00',
        sunday: 'Sun: 12:00—21:00',
        closedDays: ''
      },
      screenshotsIntro: 'A warm, characterful taphouse in the Ouseburn Valley — the clink of glasses, the hum of the brewhouse, and the smell of fresh pizza from the kitchen.',
      footerNote: '© BRINKBURN ST BREWERY. Crafted with care in Newcastle.'
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
