// 一次性迁移 morris-coffee（coffee 行业模板 → sectioned），复用 migrate-presets.mjs 的 coffee mapper
import fs from 'fs'
import path from 'path'

const root = path.resolve(import.meta.dirname)
const file = path.join(root, 'examples/morris-coffee.json')
const d = JSON.parse(fs.readFileSync(file, 'utf8'))

const gbp = (p) =>
  p == null || p === '' ? '' : String(p).startsWith('£') ? String(p) : '£' + String(p)
const num = (s) => (s ? (String(s).replace(/[^0-9+]/g, '') || '—') : '—')
const S = {
  hero: { type: 'hero' }, infoBar: { type: 'infoBar' }, menu: { type: 'menu' },
  story: { type: 'story' }, gallery: { type: 'gallery' }, reviews: { type: 'reviews' },
  faq: { type: 'faq' }, team: { type: 'team' }, booking: { type: 'booking' },
  location: { type: 'location' }, instagram: { type: 'instagram' }, footer: { type: 'footer' },
}

const coffee = (d) => ({
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
})

const mapped = coffee(d)
const out = { ...d, template: 'sectioned', ...mapped }
fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n', 'utf8')
console.log('morris-coffee migrated → sectioned; keys=' + Object.keys(out).length + ' slug=' + out.slug)
