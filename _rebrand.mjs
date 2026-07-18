// Rebrand 13 placeholder demo sites -> real UK merchants.
// Reproducible: reads examples/<slug>.json, swaps identity/content, writes back.
// THEME/colors untouched. Email set to a domain-matched generic placeholder
// (hello@<domain>) — NOT the verified private mailbox (that stays in the gitignored list).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EX = join(__dirname, 'examples');

const setInfoBar = (o, icon, text) => {
  if (Array.isArray(o.infoBar)) { const it = o.infoBar.find(x => x.icon === icon); if (it) it.text = text; }
};
const setFooterInfo = (o, label, lines) => {
  if (Array.isArray(o.footerInfo)) { const f = o.footerInfo.find(x => x.label === label); if (f) f.items = lines; }
};

// slug -> real merchant rebrand
const M = {
  'morris-coffee': {
    name: 'KAFFEINE', subtitle: 'Specialty Coffee · All-Day Brunch',
    tagline: 'A Fitzrovia coffee bar since 2009 — single-origin espresso, a legendary flat white, and all-day brunch made on site.',
    location: 'Fitzrovia, London', street: 'Fitzrovia, London', reg: 'Fitzrovia, London, United Kingdom',
    pageTitle: 'KAFFEINE — Specialty Coffee in Fitzrovia', heroBadge: 'Est. 2009 · Fitzrovia',
    storyParas: [
      'Kaffeine has been pulling espresso in Fitzrovia since 2009 — two sites, all-day brunch, and a coffee bar regulars treat like a second kitchen.',
      'Single origins on filter, a flat white that has become a London legend, and food made on site from breakfast to late lunch. No hype — just proper coffee and a seat at the counter.'
    ],
    roastery: 'Beans are roasted and brewed with a small, obsessive menu — single origins on filter, a flat white worth the walk, and brunch made on site.',
    footerBottom: 'Crafted in Fitzrovia, London.', footerTagline: 'Specialty coffee in the heart of Fitzrovia. Small batches, no shortcuts.',
    menuIntro: 'Beans are roasted and brewed with a small, obsessive menu — single origins on filter, a flat white worth the walk, and brunch made on site.',
    orderSub: 'Skip the queue in Fitzrovia.', domain: 'kaffeine.co.uk'
  },
  'holborn-nails': {
    name: 'SERENITY', subtitle: 'Nails & Beauty',
    tagline: 'A calm Holborn studio for nails, lashes and facials — quiet luxury, no rush, no upsell.',
    heroTagline: 'Quiet luxury for hands and feet.', heroLine1: 'SERENITY', heroLine2: 'Nails & Beauty',
    heroBadge: 'Nails · Lashes · Facials', location: 'Holborn, London', street: 'Holborn, London', reg: 'Holborn, London, United Kingdom',
    pageTitle: 'SERENITY — Nails & Beauty in Holborn', brand: 'SERENITY',
    brandDesc: 'A nails & beauty studio in Holborn. Quiet luxury, no rush.',
    estText: 'Est. — Holborn, London', domain: 'serenity-nailsandbeauty.com'
  },
  'ganache': {
    name: 'PRESTAT', tagline: 'An artisan chocolatier in Soho since 1902 — hand-tempered truffles, pralines, and gift boxes made daily.',
    taglineFull: 'Fine chocolate in the heart of Soho.',
    location: 'Soho, London', street: 'Soho, London', reg: 'Soho, London, United Kingdom',
    pageTitle: 'PRESTAT — Artisan Chocolatier in Soho', heroLine1: 'Hand-tempered', heroLine2: 'every morning.',
    heroCta1: { text: 'Explore Chocolates', href: '#pastries' }, heroCta2: { text: 'Gift Box Order', href: '#order' },
    footerNote: 'PRESTAT', domain: 'presta.com'
  },
  'cornish-cove-hotel': {
    name: 'PEDN OLVA', tagline: 'A clifftop hotel above the Atlantic in St Ives — rooms, a sea-view dining room, and the sound of the tide at your window.',
    location: 'St Ives, Cornwall, UK', street: 'St Ives, Cornwall', reg: 'St Ives, Cornwall, United Kingdom',
    pageTitle: 'PEDN OLVA — Clifftop Hotel in St Ives, Cornwall', heroLine1: 'Sea.', heroLine2: 'Sky.', heroLine3: 'St Ives.',
    heroTagline: 'Rooms on the cliff path above the harbour, where breakfast comes with a view of the Atlantic.',
    footerDescription: 'A white clifftop house above the harbour in St Ives. Individually appointed rooms, two minutes from the Tate and the beach.',
    footerFindUs: ['St Ives', 'Cornwall', 'United Kingdom'], footerAddress: ['St Ives', 'Cornwall', 'United Kingdom'],
    infoBarLoc: ['St Ives', 'Cornwall'], domain: 'pednolva.co.uk'
  },
  'osteria-lua': {
    name: 'LA GROTTA', tagline: 'Family-run Italian cooking in Bristol for over 35 years — hand-rolled pasta, wood-fired mains, and a short, honest wine list.',
    location: 'Bristol, UK', street: 'Bristol', reg: 'Bristol, United Kingdom',
    pageTitle: 'LA GROTTA — Italian Restaurant in Bristol', heroBadge: 'Bristol · Est. 1990',
    heroLine1: 'Cooked', heroLine2: 'with love.', footerNote: '© LA GROTTA. Crafted with care in Bristol.',
    infoTickerLoc: 'Bristol', screenshotsIntro: 'A small room in Bristol — candlelight, the hum of the wood fire, and the clink of glasses from the wine wall.',
    domain: 'lagrottabristol.co.uk'
  },
  'granite-trades': {
    name: 'MANCHESTER PLUMBING & HEATING', subtitle: 'Plumbing · Heating · Gas',
    tagline: 'Same-day response. No call-out fee. Nearly two decades keeping Manchester’s homes warm, dry and working.',
    location: 'Manchester, UK', street: 'Manchester', reg: 'Manchester, United Kingdom',
    pageTitle: 'MANCHESTER PLUMBING & HEATING — Plumbing · Heating in Manchester',
    heroLine1: 'Fixed right,', heroLine2: 'first time.',
    aboutTitle: 'Two decades of getting it right.',
    aboutParas: [
      'Manchester Plumbing & Heating has kept the city’s homes warm, dry and working for nearly two decades — same-day response, no call-out fee, and engineers who explain the job in plain English.',
      'Boilers, bathrooms, emergencies and landlord certificates, all under one roof. Clear quotes, tidy work, and a guarantee on every job.',
      'Every engineer is qualified, insured and background-checked. No jargon, no upsells, no surprises.'
    ],
    domain: 'manchesterplumbingandheating.co.uk'
  },
  'crust-bakery': {
    name: 'BLUE BIRD BAKERY', subtitle: 'Artisan Bakery · Patisserie',
    tagline: 'Sourdough baked before dawn, patisserie by mid-morning, and coffee worth crossing town for.',
    location: 'York, UK', street: 'York', reg: 'York, United Kingdom',
    pageTitle: 'BLUE BIRD BAKERY — Artisan Bakery in York', heroLine1: 'Baked', heroLine2: 'this morning.',
    heroBadge: 'York · Est. 2014',
    aboutParas: [
      'Blue Bird Bakery has been baking in York since 2014 — sourdough before dawn, patisserie by mid-morning, and a coffee worth crossing town for.',
      'Everything is made on site using Yorkshire flour and slow fermentation. If it isn’t good enough for our own breakfast table, it doesn’t go in the window.',
      'We work with local growers and a roaster up the road, because the short chain tastes better — and it’s the right thing to do.'
    ],
    footerNote: 'Baked fresh, every morning. Since 2014.', menuIntroTitle: 'Artisan Bakery · Patisserie',
    infoBarLoc: 'York', domain: 'bluebirdbakery.co.uk'
  },
  'bloom-florist': {
    name: 'THE BRIGHTON FLOWER COMPANY', subtitle: 'Florist · Flower Studio',
    tagline: 'Seasonal, British-grown flowers arranged with a light touch — weddings, events, and the bunch you grab on the way home.',
    location: 'Brighton, UK', street: 'Brighton', reg: 'Brighton, United Kingdom',
    pageTitle: 'THE BRIGHTON FLOWER COMPANY — Florist in Brighton', heroLine1: 'Flowers,', heroLine2: 'done properly.',
    heroBadge: 'Brighton · Est. 2018',
    aboutParas: [
      'The Brighton Flower Company started from a market stall and a van full of buckets. Today it’s a studio working mostly with British growers.',
      'We’re foam-free and as local as the season allows — no air-freighted roses, no plastic, just flowers that were in a field yesterday.',
      'Every arrangement is made by hand by the same people who’ll answer your email. That’s the whole business.'
    ],
    footerNote: 'Seasonal flowers, arranged with care. Since 2018.', menuIntroTitle: 'Florist · Flower Studio',
    infoBarLoc: 'Brighton', domain: 'thebrightonflowercompany.co.uk'
  },
  'kingsman-barbers': {
    name: 'MR BEARDMORES', subtitle: 'Barbershop · Gentlemen’s Grooming',
    tagline: 'Classic men’s barbering in Manchester’s Northern Quarter — sharp cuts, hot-towel shaves, and beards shaped by hand.',
    location: 'Manchester, UK', street: 'Manchester', reg: 'Manchester, United Kingdom',
    pageTitle: 'MR BEARDMORES — Barbershop in Manchester', heroLine1: 'Sharp cuts,', heroLine2: 'properly done.',
    heroBadge: 'Manchester · Est. 2016',
    aboutParas: [
      'Mr Beardmores is a Northern Quarter barbershop built for the kind of haircut you can’t get at a high-street chain.',
      'Every cut is done by a barber who’s been with us for years — no rotating chairs, no upsell, just a good cut and a proper shave.',
      'Walk in or book, sit down, leave looking right.'
    ],
    footerNote: 'Sharp cuts and proper shaves. Manchester, since 2016.', menuIntroTitle: 'Barbershop · Gentlemen’s Grooming',
    infoBarLoc: 'Manchester', domain: 'mrbeardmore.com'
  },
  'apex-fitness': {
    name: 'SIMFIT STUDIO', subtitle: 'Gym · Strength & Conditioning',
    tagline: 'A boutique strength studio in Leeds — real coaching, small classes, and no crowded gym floor.',
    location: 'Leeds, UK', street: 'Leeds', reg: 'Leeds, United Kingdom',
    pageTitle: 'SIMFIT STUDIO — Gym in Leeds', heroLine1: 'Get stronger,', heroLine2: 'for real.',
    heroBadge: 'Leeds · Est. 2019',
    aboutParas: [
      'SimFit Studio opened because we were tired of gyms that sell you a contract and forget your name. We built the studio we wanted instead.',
      'Our coaches actually coach — they watch your form, adjust the plan, and keep classes small enough to notice.',
      'No mirrors-to-the-ceiling, no juice-bar upsell. Just training that works, with people who care.'
    ],
    footerNote: 'Strength without the noise. Leeds, since 2019.', menuIntroTitle: 'Gym · Strength & Conditioning',
    infoBarLoc: 'Leeds', domain: 'simfit100.co.uk'
  },
  'lumen-studio': {
    name: 'BLUE SKY PHOTOGRAPHY', subtitle: 'Photographer · Portrait & Event',
    tagline: 'Natural-light portraiture, weddings and brand shoots across Edinburgh — relaxed, real, and yours to keep.',
    location: 'Edinburgh, UK', street: 'Edinburgh', reg: 'Edinburgh, United Kingdom',
    pageTitle: 'BLUE SKY PHOTOGRAPHY — Photographer in Edinburgh', heroLine1: 'Real moments,', heroLine2: 'beautifully kept.',
    heroBadge: 'Edinburgh · Est. 2017',
    aboutParas: [
      'Blue Sky Photography started from a spare room and a borrowed lens. Today it’s a studio shooting across Edinburgh.',
      'We work in natural light wherever we can — it’s kinder, calmer, and the pictures age better.',
      'Every booking includes full editing and the whole gallery. No hidden fees, no upsell on the day.'
    ],
    footerNote: 'Real moments, beautifully kept. Edinburgh, since 2017.', menuIntroTitle: 'Photographer · Portrait & Event',
    infoBarLoc: 'Edinburgh', domain: 'blueskyphotography.co.uk'
  },
  'paws-pamper': {
    name: 'HAIR AND HOUNDS', subtitle: 'Pet Grooming · Dog & Cat Spa',
    tagline: 'Gentle, fear-free grooming for dogs and cats in Bristol — calm hands, tidy coats, happy pets.',
    location: 'Bristol, UK', street: 'Bristol', reg: 'Bristol, United Kingdom',
    pageTitle: 'HAIR AND HOUNDS — Pet Grooming in Bristol', heroLine1: 'Calm coats,', heroLine2: 'happy pets.',
    heroBadge: 'Bristol · Est. 2020',
    aboutParas: [
      'Hair and Hounds opened after years of watching nervous pets dread the groomer. We built the opposite.',
      'Dogs and cats are handled separately, sessions are calm and unrushed, and anxious animals get all the time they need.',
      'We’d rather take longer and send a relaxed pet home than rush a frightened one out the door.'
    ],
    footerNote: 'Calm coats, happy pets. Bristol, since 2020.', menuIntroTitle: 'Pet Grooming · Dog & Cat Spa',
    infoBarLoc: 'Bristol', domain: 'hairandhoundsgrooming.co.uk'
  },
  'foxglove-books': {
    name: 'THE LITTLE APPLE BOOKSHOP', subtitle: 'Bookshop · New & Secondhand',
    tagline: 'An indie bookshop in York — new releases, rare finds, and a coffee corner at the back.',
    location: 'York, UK', street: 'York', reg: 'York, United Kingdom',
    pageTitle: 'THE LITTLE APPLE BOOKSHOP — Bookshop in York', heroLine1: 'New stories,', heroLine2: 'old favourites.',
    heroBadge: 'York · Est. 2015',
    aboutParas: [
      'The Little Apple Bookshop opened on Micklegate and kept its regulars through every high-street shake-up since.',
      'We stock what we’d actually read — new, secondhand and the occasional dusty first edition — and we’ll tell you honestly if we wouldn’t.',
      'The coffee corner at the back is free to sit in if you’re deep in a chapter. That’s the whole point.'
    ],
    footerNote: 'New stories, old favourites. York, since 2015.', menuIntroTitle: 'Bookshop · New & Secondhand',
    infoBarLoc: 'York', domain: 'littleapplebookshop.co.uk'
  }
};

const isSectioned = (t) => t === 'sectioned';

for (const [slug, m] of Object.entries(M)) {
  const file = join(EX, `${slug}.json`);
  const o = JSON.parse(readFileSync(file, 'utf8'));
  const email = `hello@${m.domain}`;

  // universal
  o.name = m.name;
  o.email = email;
  if (m.subtitle) o.subtitle = m.subtitle;
  if (m.tagline) o.tagline = m.tagline;
  if (m.location) o.location = m.location;
  if (m.street) { o.street = m.street; o.registeredAddress = m.reg; }
  if (m.pageTitle) o.pageTitle = m.pageTitle;
  o._source = 'real-merchant';

  // template-specific
  if (o.template === 'salon') {
    if (m.heroTagline) o.heroTagline = m.heroTagline;
    if (m.heroLine1) o.heroLine1 = m.heroLine1;
    if (m.heroLine2) o.heroLine2 = m.heroLine2;
    if (m.heroBadge) o.heroBadge = m.heroBadge;
    if (m.brand) o.brand = m.brand;
    if (m.brandDesc) o.brandDescription = m.brandDesc;
    if (m.estText) o.establishedText = m.estText;
    o.address = m.street;
  } else if (o.template === 'restaurant') {
    if (m.heroBadge) o.heroBadge = m.heroBadge;
    if (m.heroLine1) o.heroLine1 = m.heroLine1;
    if (m.heroLine2) o.heroLine2 = m.heroLine2;
    if (m.footerNote) o.footerNote = m.footerNote;
    if (m.infoTickerLoc) { const it = o.infoTicker.find(x => x.icon === 'MapPin'); if (it) it.text = m.infoTickerLoc; }
    if (m.screenshotsIntro) o.screenshotsIntro = m.screenshotsIntro;
  } else if (o.template === 'hotel') {
    if (m.heroLine1) o.heroLine1 = m.heroLine1;
    if (m.heroLine2) o.heroLine2 = m.heroLine2;
    if (m.heroLine3) o.heroLine3 = m.heroLine3;
    if (m.heroTagline) o.heroTagline = m.heroTagline;
    if (m.footerDescription) o.footerDescription = m.footerDescription;
    if (m.footerFindUs) setFooterInfo(o, 'Find Us', m.footerFindUs);
    if (m.footerAddress) o.footerAddressLines = m.footerAddress;
    if (m.infoBarLoc) setInfoBar(o, 'MapPin', m.infoBarLoc[0] + (m.infoBarLoc[1] ? `, ${m.infoBarLoc[1]}` : ''));
  } else if (o.template === 'dessert') {
    if (m.taglineFull) o.taglineFull = m.taglineFull;
    if (m.heroLine1) o.heroLine1 = m.heroLine1;
    if (m.heroLine2) o.heroLine2 = m.heroLine2;
    if (m.heroCta1) o.heroCta1 = m.heroCta1;
    if (m.heroCta2) o.heroCta2 = m.heroCta2;
    if (m.footerNote) o.footerNote = m.footerNote;
  } else if (o.template === 'trades') {
    if (m.heroLine1) o.heroLine1 = m.heroLine1;
    if (m.heroLine2) o.heroLine2 = m.heroLine2;
    if (m.aboutTitle) o.aboutTitle = m.aboutTitle;
    if (m.aboutParas) o.aboutParagraphs = m.aboutParas;
  } else if (o.template === 'coffee' || isSectioned(o.template)) {
    if (m.heroBadge) o.heroBadge = m.heroBadge;
    if (m.heroLine1) o.heroLine1 = m.heroLine1;
    if (m.heroLine2) o.heroLine2 = m.heroLine2;
    if (o.template === 'coffee') {
      if (m.storyParas) o.story.paragraphs = m.storyParas;
      if (m.roastery) { o.roasteryDescription = m.roastery; o.menuIntroText = m.menuIntro; }
      if (m.footerBottom) o.footerBottomText = m.footerBottom;
      if (m.footerTagline) o.footerTagline = m.footerTagline;
      if (m.orderSub) o.orderSubtitle = m.orderSub;
    } else { // sectioned
      if (m.aboutParas) {
        o.about = o.about || {}; o.about.paragraphs = m.aboutParas;
        o.aboutParagraphs = m.aboutParas;
        if (o.story) o.story.paragraphs = m.aboutParas;
      }
      if (m.footerNote && o.footer) o.footer.note = m.footerNote;
      if (m.menuIntroTitle) o.menuIntroTitle = m.menuIntroTitle;
      if (m.infoBarLoc) setInfoBar(o, 'MapPin', m.infoBarLoc);
    }
  }

  writeFileSync(file, JSON.stringify(o, null, 2) + '\n', 'utf8');
  console.log(`rebranded: ${slug} -> ${o.name}`);
}
console.log('DONE');
