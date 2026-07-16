// migrate-presets.mjs — 将 8 套（实为 9 个）旧模板 demo 预设从行业模板迁移到
// Section Engine 统一架构（template: "sectioned" + SectionedData 契约）。
//
// 策略（data-flip，零回归）：
//   1. 读取原 JSON，按其 ORIGINAL template 调用对应 mapper；
//   2. mapper 把行业特定字段重塑为 SectionedData（hero/infoBar/menu/story/reviews/team/booking/hoursDetail/footer）；
//   3. 结果 = { ...orig, template:'sectioned', ...mapped } —— 保留 slug/name/contacts/seo/_source/screenshots 等 generate.mjs 消费字段；
//   4. 写回 examples/<file>.json。
// 视觉识别由 generate.mjs 的 THEMES_SECTIONED（针对 sectioned 三色基底）单独保留，不在此处理。
//
// 注意：mono 已手动迁移并验证，不在此列表内。

import fs from 'fs'
import path from 'path'

const root = path.resolve(import.meta.dirname)
const gbp = (p) =>
  p == null || p === '' ? '' : String(p).startsWith('£') ? String(p) : '£' + String(p)
const num = (s) => (s ? (String(s).replace(/[^0-9+]/g, '') || '—') : '—')

const S = {
  hero: { type: 'hero' },
  infoBar: { type: 'infoBar' },
  menu: { type: 'menu' },
  story: { type: 'story' },
  gallery: { type: 'gallery' },
  reviews: { type: 'reviews' },
  faq: { type: 'faq' },
  team: { type: 'team' },
  booking: { type: 'booking' },
  location: { type: 'location' },
  instagram: { type: 'instagram' },
  footer: { type: 'footer' },
}

const mappers = {
  // ── coffee ──
  coffee: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroBadge: `Est. ${d.established} · ${String(d.location || '').split(',')[0].trim()}`,
    heroStats: [
      { val: d.googleRating, label: 'Google Rating', stars: true },
      { val: num(d.googleReviews), label: 'Reviews' },
      { val: d.established, label: 'Established' },
    ],
    heroCta1: { text: 'Explore Our Menu', href: '#menu' },
    heroCta2: { text: 'Order Ahead', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.booking, S.location, S.footer],
    infoBar: [
      { icon: 'MapPin', text: d.street },
      { icon: 'Clock', text: d.hours },
      { icon: 'Phone', text: d.phone },
    ],
    menu: [
      {
        title: d.menuTitle || 'Pour Over',
        icon: 'Coffee',
        items: (d.menuItems || []).map((m) => ({
          name: m.name,
          desc: [m.origin, m.notes, m.process].filter(Boolean).join(' · '),
          price: gbp(m.price),
        })),
      },
    ],
    menuIntroTitle: d.menuSubtitle || d.menuTitle,
    menuIntroText: d.roasteryDescription || d.tagline,
    story: {
      title: d.roasteryTitle || 'Our Roastery',
      paragraphs: d.roasteryDescription ? [d.roasteryDescription] : [d.tagline],
      stats: [
        { value: '15kg', label: 'Batch' },
        { value: '12', label: 'Profiles' },
        { value: '72h', label: 'Rest' },
      ],
    },
    booking: { intro: 'Order ahead and skip the queue.', note: d.orderConfirmationMessage || '', occasionOptions: [] },
    hoursDetail: { wedFri: d.hours, saturday: d.hours, sunday: d.hours, closedDays: '' },
    footer: { note: d.footerTagline, quickLinks: ['Menu', 'Roastery', 'Order'] },
  }),

  // ── salon ──
  salon: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroBadge: d.heroBadge,
    heroStats: [
      { val: d.googleRating, label: 'Google Rating', stars: true },
      { val: num(d.googleReviews), label: 'Reviews' },
      { val: d.established, label: 'Established' },
    ],
    heroCta1: { text: 'Book Consultation', href: '#booking' },
    heroCta2: { text: 'View Services', href: '#menu' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.team, S.booking, S.location, S.footer],
    infoBar: [
      { icon: 'MapPin', text: d.street },
      { icon: 'Clock', text: d.hours },
      { icon: 'Phone', text: d.phone },
    ],
    menu: (d.serviceCategories || []).map((c) => ({
      title: c.category,
      icon: 'Scissors',
      items: (c.items || []).map((i) => ({
        name: i.name,
        desc: [i.desc, i.time].filter(Boolean).join(' · '),
        price: gbp(i.price),
      })),
    })),
    menuIntroTitle: (d.serviceCategories && d.serviceCategories[0] && d.serviceCategories[0].category) || 'Services',
    story: { title: 'Architecture for hair.', paragraphs: [d.brandDescription || d.tagline], stats: [] },
    team: (d.stylists || []).map((s) => ({
      name: s.name,
      role: s.role,
      initials: s.initials,
      bio: s.specialty,
    })),
    booking: { intro: d.bookingDescription || 'Book your visit.', note: d.bookingTitle || '', occasionOptions: [] },
    hoursDetail: (() => {
      const t = (d.hours || '').split('·').pop().trim()
      return { wedFri: t, saturday: t, sunday: 'Closed', closedDays: 'Sun' }
    })(),
    footer: { note: d.brandDescription || d.tagline, quickLinks: ['Services', 'Team', 'Book'] },
  }),

  // ── dessert（creme + patisserie 共用）──
  dessert: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroStats: [{ val: d.googleRating, label: 'Google Rating', stars: true }],
    heroCta1: { text: 'Explore Pastries', href: '#menu' },
    heroCta2: { text: 'Custom Cake Order', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.booking, S.location, S.footer],
    infoBar: [
      { icon: 'MapPin', text: d.street },
      { icon: 'Clock', text: d.hours },
      { icon: 'Phone', text: d.phone },
    ],
    menu: [
      {
        title: d.pastriesTitle || 'Pastries',
        icon: 'Croissant',
        items: (d.menuItems || []).map((i) => ({ name: i.name, desc: i.desc, price: gbp(i.price) })),
      },
      {
        title: d.cakesTitle || 'Cakes',
        icon: 'Cake',
        items: (d.cakeItems || []).map((i) => ({
          name: i.name,
          desc: [i.desc, i.serves ? 'Serves ' + i.serves : ''].filter(Boolean).join(' · '),
          price: gbp(i.price),
        })),
      },
      {
        title: d.chocolateTitle || 'Chocolates',
        icon: 'Candy',
        items: (d.chocolateItems || []).map((i) => ({ name: i.name, desc: i.desc, price: gbp(i.price) })),
      },
    ].filter((c) => c.items.length),
    menuIntroTitle: d.pastriesSubtitle || d.chocolateSubtitle,
    story: {
      title: d.taglineFull || d.tagline || 'French craft',
      paragraphs: [d.taglineFull || d.tagline],
      stats: [],
    },
    booking: { intro: d.orderSubtitle || 'Pre-order for collection.', note: d.orderSuccessMessage || '', occasionOptions: [] },
    hoursDetail: { wedFri: d.hours, saturday: d.hours, sunday: d.hours, closedDays: '' },
    footer: { note: d.footerNote || d.name, quickLinks: d.footerMenuLinks || ['Pastries', 'Cakes', 'Order'] },
  }),

  // ── yoga ──
  yoga: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroStats: [
      { val: d.googleRating, label: 'Google Rating', stars: true },
      { val: num(d.googleReviews), label: 'Reviews' },
      { val: d.established, label: 'Established' },
    ],
    heroCta1: { text: 'View Classes', href: '#menu' },
    heroCta2: { text: 'Book a Session', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.team, S.booking, S.location, S.footer],
    infoBar: [
      { icon: 'MapPin', text: d.street },
      { icon: 'Clock', text: d.hoursCompact || d.hours },
      { icon: 'Phone', text: d.phone },
    ],
    menu: [
      {
        title: d.classTitle || 'Classes',
        icon: 'Activity',
        items: (d.classes || []).map((c) => ({
          name: c.name,
          desc: [c.desc, c.level, c.time].filter(Boolean).join(' · '),
          price: gbp(c.price),
        })),
      },
    ],
    menuIntroTitle: d.classSubtitle,
    story: { title: 'Our Practice', paragraphs: [d.classDescription || d.tagline], stats: [] },
    team: (d.teachers || []).map((t) => ({
      name: t.name,
      role: t.role,
      initials: t.initials,
      bio: t.specialty,
    })),
    booking: { intro: d.bookDescription || 'Book your class.', note: d.bookSubmittedLabel || '', occasionOptions: [] },
    hoursDetail: {
      wedFri: (d.hoursItems && d.hoursItems[0] && d.hoursItems[0].hours) || d.hours,
      saturday: (d.hoursItems && d.hoursItems[1] && d.hoursItems[1].hours) || d.hours,
      sunday: (d.hoursItems && d.hoursItems[1] && d.hoursItems[1].hours) || d.hours,
      closedDays: '',
    },
    footer: { note: d.footerTagline || d.tagline, quickLinks: ['Classes', 'Teachers', 'Book'] },
  }),

  // ── law ──
  law: (d) => ({
    heroLine1: Array.isArray(d.heroLines) ? d.heroLines[0] : d.heroLine1,
    heroLine2: Array.isArray(d.heroLines) ? d.heroLines.slice(1).join(' ') : d.heroLine2,
    heroStats: (d.stats || []).map((s) => ({ val: s.value, label: s.label })),
    heroCta1: { text: 'Our Services', href: '#menu' },
    heroCta2: { text: 'Book a Consultation', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.team, S.booking, S.location, S.footer],
    infoBar: [
      { icon: 'MapPin', text: d.street },
      { icon: 'Clock', text: d.hours },
      { icon: 'Phone', text: d.phone },
    ],
    menu: [
      {
        title: 'Practice Areas',
        icon: 'Scale',
        items: (d.services || []).map((s) => ({ name: s.name, desc: s.desc })),
      },
    ],
    menuIntroTitle: (d.sections && d.sections.services && d.sections.services.title) || 'How we can help',
    story: {
      title: (d.sections && d.sections.team && d.sections.team.title) || 'Decades of experience.',
      paragraphs: [d.tagline],
      stats: [],
    },
    team: (d.lawyers || []).map((l) => ({
      name: l.name,
      role: l.role,
      initials: l.initials,
      bio: l.specialty,
    })),
    booking: {
      intro: (d.sections && d.sections.contact && d.sections.contact.description) || 'Free initial consultation.',
      note: (d.form && d.form.success) || '',
      occasionOptions: [],
    },
    hoursDetail: { wedFri: d.hours, saturday: 'Closed', sunday: 'Closed', closedDays: 'Weekends' },
    footer: { note: (d.footer && d.footer.sra) || d.tagline, quickLinks: ['Services', 'Team', 'Contact'] },
  }),

  // ── hotel ──
  hotel: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroStats: [
      { val: d.googleRating, label: 'Google Rating', stars: true },
      { val: num(d.googleReviews), label: 'Reviews' },
      { val: d.established, label: 'Established' },
    ],
    heroCta1: { text: 'View Our Rooms', href: '#menu' },
    heroCta2: { text: 'Check Availability', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.booking, S.location, S.footer],
    infoBar: (d.infoBar || []).map((i) => ({ icon: i.icon, text: (i.lines || [i.text]).join(' · ') })),
    menu: [
      {
        title: d.roomsSectionTitle || 'Our Rooms',
        icon: 'Bed',
        items: (d.rooms || []).map((r) => ({ name: r.name, desc: r.desc, price: gbp(r.price) })),
      },
    ],
    menuIntroTitle: d.roomsSectionLabel,
    story: { title: d.roomsSectionTitle || 'Six unique spaces', paragraphs: [d.tagline], stats: [] },
    booking: { intro: 'Your room awaits.', note: '', occasionOptions: [] },
    hoursDetail: { wedFri: d.hours, saturday: d.hours, sunday: d.hours, closedDays: '' },
    footer: { note: d.footerDescription || d.tagline, quickLinks: ['Rooms', 'Book', 'Find Us'] },
  }),

  // ── trades ──
  trades: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroBadge: d.heroBadge,
    heroStats: (d.heroStats || []).map((s) => ({ val: s.value, label: s.label })),
    heroCta1: { text: 'Get a Free Quote', href: '#booking' },
    heroCta2: { text: '24/7 Emergency', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.reviews, S.booking, S.location, S.footer],
    infoBar: [
      { icon: 'MapPin', text: d.street },
      { icon: 'Clock', text: d.hours },
      { icon: 'Phone', text: d.phone },
    ],
    menu: [
      {
        title: 'Our Services',
        icon: 'Wrench',
        items: (d.services || []).map((s) => ({
          name: s.name,
          desc: s.desc,
          price: s.priceFrom ? 'From ' + s.priceFrom : '',
        })),
      },
    ],
    menuIntroTitle: 'Plumbing · Heating · Electrical',
    story: {
      title: (d.about && d.about.title) || 'About FORGE',
      paragraphs: (d.about && d.about.paragraphs) || d.aboutParagraphs || [d.tagline],
      stats: [],
    },
    reviews: (d.reviews || []).map((r) => ({ name: r.name, text: r.text, rating: r.rating })),
    booking: {
      intro: (d.contact && d.contact.submit) || 'Request a free quote.',
      note: (d.contact && d.contact.success) || '',
      occasionOptions: (d.urgencyOptions || []).map((u) => u.label),
    },
    hoursDetail: { wedFri: d.hours, saturday: d.hours, sunday: d.hours, closedDays: '' },
    footer: { note: (d.footer && d.footer.tagline) || d.tagline, quickLinks: ['Services', 'About', 'Reviews', 'Contact'] },
  }),

  // ── restaurant（mario + sotto-sotto 共用）──
  restaurant: (d) => ({
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroBadge: d.heroBadge,
    heroStats: (d.heroStats || []).map((s) => ({ val: s.val, label: s.label, stars: s.stars })),
    heroCta1: { text: 'View Menu', href: '#menu' },
    heroCta2: { text: 'Book a Table', href: '#booking' },
    sections: [S.hero, S.infoBar, S.menu, S.story, S.reviews, S.booking, S.location, S.footer],
    infoBar: (d.infoTicker || []).map((i) => ({ icon: i.icon, text: i.text })),
    menu: (d.menuSections || []).map((s) => ({
      title: s.title,
      icon: s.icon,
      items: (s.items || []).map((i) => ({
        name: i.name,
        desc: i.desc,
        price: gbp(i.price),
        pair: i.pair,
      })),
    })),
    menuIntroTitle: d.menuIntroTitle,
    menuIntroText: d.menuIntroText,
    story: {
      title: d.aboutTitle || 'Our Story',
      paragraphs: d.aboutParagraphs || [d.tagline],
      stats: (d.aboutStats || []).map((s) => ({ value: s.value, label: s.label })),
    },
    reviews: (d.reviews || []).map((r) => ({ name: r.name, text: r.text, rating: r.rating })),
    booking: { intro: '', note: d.reservationNote || '', occasionOptions: d.occasionOptions || [] },
    hoursDetail: {
      wedFri: (d.hoursDetail && (d.hoursDetail.wedFri || d.hoursDetail.wedThu)) || d.hours,
      saturday: (d.hoursDetail && (d.hoursDetail.saturday || d.hoursDetail.friSat)) || d.hours,
      sunday: (d.hoursDetail && d.hoursDetail.sunday) || d.hours,
      closedDays: (d.hoursDetail && d.hoursDetail.closedDays) || '',
    },
    footer: { note: d.footerNote || d.tagline, quickLinks: ['Menu', 'Story', 'Book'] },
  }),
}

const targets = [
  'atelier-salon',
  'creme-dessert',
  'breath-yoga',
  'chambers-law',
  'vault-hotel',
  'forge-trades',
  'mario-pizza',
  'patisserie-v2',
  'sotto-sotto',
]

let ok = 0
for (const f of targets) {
  const p = path.join(root, 'examples', f + '.json')
  if (!fs.existsSync(p)) {
    console.warn('⚠️ 跳过（不存在）:', f)
    continue
  }
  const orig = JSON.parse(fs.readFileSync(p, 'utf-8'))
  const t = orig.template
  const mapper = mappers[t]
  if (!mapper) {
    console.warn('⚠️ 无 mapper，跳过:', f, '(template=' + t + ')')
    continue
  }
  const mapped = mapper(orig)
  const result = { ...orig, template: 'sectioned', ...mapped }
  fs.writeFileSync(p, JSON.stringify(result, null, 2) + '\n', 'utf-8')
  console.log('✅ 迁移:', f, '→', result.name, '(slug=' + result.slug + ')')
  ok++
}
console.log(`\n完成：${ok}/${targets.length} 个预设已迁移到 sectioned。`)
