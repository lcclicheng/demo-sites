// Section Engine — 组合器模板（theme-agnostic）
// 读 businessData.sections（可选覆盖）或默认顺序，逐条渲染对应 section 组件。
// 配色完全由 twConfig 的 accent / surface / ink 决定；可通过 THEMES 逐站覆盖。
// 现有 8 套模板（src/<行业>/App.tsx）保持不动 —— 本文件是「新范式」入口。

import { useState, useEffect } from 'react'
import { Menu, X, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react'
import { businessData } from './business-data'
import { renderSections } from './components/sections'
import { SectionedData, SectionConfig } from './components/sections/types'

const d = businessData as unknown as SectionedData

// 默认 section 顺序（当 JSON 未提供 sections 时生效）。
// 各 section 组件自身会在数据缺失时 return null，所以「缺数据的 section」自动跳过。
const DEFAULT_ORDER: SectionConfig[] = [
  { type: 'hero' },
  { type: 'infoBar' },
  { type: 'menu' },
  { type: 'story' },
  { type: 'gallery' },
  { type: 'reviews' },
  { type: 'faq' },
  { type: 'team' },
  { type: 'booking' },
  { type: 'location' },
  { type: 'instagram' },
  { type: 'footer' },
]

const NAV_MAP: Record<string, { label: string; id: string }> = {
  hero: { label: 'Home', id: 'hero' },
  menu: { label: 'Menu', id: 'menu' },
  story: { label: 'Story', id: 'story' },
  gallery: { label: 'Gallery', id: 'gallery' },
  reviews: { label: 'Reviews', id: 'reviews' },
  team: { label: 'Team', id: 'team' },
  booking: { label: 'Book', id: 'booking' },
  location: { label: 'Contact', id: 'location' },
  faq: { label: 'FAQ', id: 'faq' },
  instagram: { label: 'Social', id: 'instagram' },
}

export default function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.hash : '')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const [mobileOpen, setMobileOpen] = useState(false)

  const sections: SectionConfig[] = d.sections && d.sections.length ? d.sections : DEFAULT_ORDER
  const navLinks = sections
    .map((s) => NAV_MAP[s.type])
    .filter((n): n is { label: string; id: string } => !!n && n.id !== 'hero')

  const privacyAddress =
    d.registeredAddress || [d.street, d.location].filter(Boolean).join(', ') || 'United Kingdom'

  // ── hash 路由页（隐私 / 合同 / 发票 / 注册地址）──
  if (route === '#privacy')
    return <PrivacyPolicy businessName={d.name} email={d.email || ''} phone={d.phone || ''} address={privacyAddress} />
  if (route === '#address-info')
    return <RegisteredAddressInfo businessName={d.name} email={d.email || ''} phone={d.phone || ''} address={privacyAddress} />
  if (route === '#contract')
    return <Contract businessName={d.name} email={d.email || ''} phone={d.phone || ''} address={privacyAddress} />
  if (route === '#invoice')
    return <Invoice businessName={d.name} email={d.email || ''} phone={d.phone || ''} address={privacyAddress} />

  return (
    <div className="bg-surface text-ink font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur border-b border-ink/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <a href="#hero" className="font-display text-xl font-bold tracking-tight">{d.name}</a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-ink/70">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="hover:text-accent transition-colors">{l.label}</a>
            ))}
          </div>
          <a
            href={d.heroCta2?.href || '#booking'}
            className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition"
          >
            {d.heroCta2?.text || 'Contact'}
          </a>
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-surface p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="font-display text-xl font-bold">{d.name}</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-4 text-lg font-medium">
              {navLinks.map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={() => setMobileOpen(false)} className="py-2 border-b border-ink/10 hover:text-accent transition-colors">{l.label}</a>
              ))}
            </div>
            <a href={d.heroCta2?.href || '#booking'} onClick={() => setMobileOpen(false)} className="mt-auto w-full py-3 rounded-full bg-accent text-white text-center font-medium">
              {d.heroCta2?.text || 'Contact'}
            </a>
          </div>
        </div>
      )}

      {/* SECTION COMPOSITION */}
      {renderSections(sections, d)}
    </div>
  )
}

/* ── 路由页（通用版，与主题无关，inline style 系统字体） ── */

function PrivacyPolicy({ businessName, email, phone, address }: { businessName: string; email: string; phone: string; address: string }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const s = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.5 },
    bar: { maxWidth: '820px', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ececec' },
    brand: { fontWeight: 700, fontSize: '15px', color: '#111' },
    back: { fontSize: '14px', color: '#2563eb', textDecoration: 'none', cursor: 'pointer' },
    wrap: { maxWidth: '760px', margin: '0 auto', padding: '36px 24px 80px' },
    h1: { fontSize: '30px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#0f172a' },
    sub: { fontSize: '13px', color: '#94a3b8', margin: '0 0 28px' },
    h2: { fontSize: '19px', fontWeight: 700, margin: '30px 0 8px', color: '#0f172a' },
    p: { fontSize: '15px', lineHeight: 1.75, color: '#475569', margin: '0 0 12px' },
    ul: { fontSize: '15px', lineHeight: 1.75, color: '#475569', margin: '0 0 12px', paddingLeft: '20px' },
    li: { margin: '0 0 6px' },
  }
  const fill = (str: string) => str.replace(/\{name\}/g, businessName).replace(/\{email\}/g, email).replace(/\{phone\}/g, phone).replace(/\{address\}/g, address)
  const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const sections: Array<{ h: string; p: string[] }> = [
    { h: '1. Who We Are', p: ['This Privacy Policy explains how {name} ("we", "us", "our") collects, uses and protects your personal data when you visit our website or contact us. {name} is the data controller and can be contacted at {address}, by email at {email}, or by telephone on {phone}.'] },
    { h: '2. Information We Collect', p: ['We collect information you provide directly to us, including your name, email address, telephone number, and any details you share when making a reservation, enquiry or appointment request through our website.', 'We also collect limited technical information automatically, such as your IP address, browser type and the pages you visit, to help us understand how the site is used and to keep it secure.'] },
    { h: '3. How We Use Your Information', p: ['We use your information to: respond to your enquiries and reservation requests; provide and improve our services; send you confirmations and service-related messages; and comply with our legal obligations.', 'We will only use your information for the purpose you provided it, and we will not sell your personal data to third parties.'] },
    { h: '4. Legal Bases for Processing', p: ['Under the UK GDPR we rely on the following legal bases: (a) your consent, where you have given it; (b) the performance of a contract, where you request a booking or service; (c) our legitimate interests in operating and promoting our business; and (d) compliance with a legal obligation.'] },
    { h: '5. Cookies and Similar Technologies', p: ['Our website uses cookies and similar technologies to remember your preferences, measure site performance and understand how visitors use the site. Under the Privacy and Electronic Communications Regulations (PECR) we ask for your consent before setting any non-essential cookies, and you can manage your choices through your browser settings at any time.'] },
    { h: '6. Sharing Your Information', p: ['We may share your information with trusted service providers who help us operate the site and deliver our services, such as booking, email and hosting providers. They are only permitted to use your data to provide services to us and are bound by confidentiality obligations.', 'We may also disclose your information where required by law or to protect our legal rights.'] },
    { h: '7. International Transfers', p: ['Where your information is transferred outside the United Kingdom, we ensure an adequate level of protection through recognised safeguards such as the UK adequacy regulations or standard contractual clauses.'] },
    { h: '8. How Long We Keep Your Information', p: ['We keep your personal data only for as long as necessary for the purposes set out in this policy, or as required by law. Enquiry and reservation records are typically retained for up to 24 months unless a longer period is needed.'] },
    { h: '9. Your Rights', p: ['Under the UK GDPR you have the right to: access the personal data we hold about you; request correction of inaccurate data; request erasure of your data; object to or restrict processing; and request portability of your data.', 'To exercise any of these rights, contact us using the details in section 1. We will respond within one month. You also have the right to lodge a complaint with the Information Commissioner’s Office (ICO) at ico.org.uk.'] },
    { h: '10. Changes to This Policy', p: ['We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.'] },
    { h: '11. Contact Us', p: ['If you have any questions about this policy or how we handle your data, please contact {name} at {email} or {phone}.'] },
  ]
  return (
    <div style={s.page}>
      <div style={s.bar}>
        <span style={s.brand}>{businessName}</span>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '' }} style={s.back}>← Back to site</a>
      </div>
      <div style={s.wrap}>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.sub}>Last updated: {updated}</p>
        {sections.map((sec, i) => (
          <div key={i}>
            <h2 style={s.h2}>{sec.h}</h2>
            {sec.p.map((para, j) => <p key={j} style={s.p}>{fill(para)}</p>)}
          </div>
        ))}
        <p style={{ ...s.p, marginTop: 28, fontSize: 13, color: '#94a3b8' }}>
          This policy is provided as a general template and is not legal advice. Seek professional guidance for your specific circumstances.
        </p>
      </div>
    </div>
  )
}

function Invoice({ businessName, email, phone, address }: { businessName: string; email: string; phone: string; address: string }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const s = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.5, padding: '32px 16px' },
    card: { maxWidth: '760px', margin: '0 auto', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
    bar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #ececec' },
    brand: { fontWeight: 800, fontSize: '18px', color: '#0f172a' },
    back: { fontSize: '14px', color: '#2563eb', textDecoration: 'none', cursor: 'pointer' },
    head: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16, padding: '24px 28px', background: '#f8fafc' },
    label: { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px' },
    val: { fontSize: '14px', color: '#0f172a', margin: 0 },
    table: { width: '100%', borderCollapse: 'collapse', margin: '0' },
    th: { textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#64748b', padding: '12px 28px', borderBottom: '1px solid #e2e8f0' },
    td: { fontSize: '14px', color: '#334155', padding: '14px 28px', borderBottom: '1px solid #f1f5f9' },
    totalRow: { display: 'flex', justifyContent: 'flex-end', gap: 24, padding: '18px 28px', background: '#f8fafc', fontSize: '15px', fontWeight: 700, color: '#0f172a' },
    note: { fontSize: '12px', color: '#94a3b8', padding: '16px 28px 28px', margin: 0, lineHeight: 1.6 },
  }
  const invNo = 'INV-' + new Date().getFullYear() + '-0042'
  const issued = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const rows = [
    { desc: 'Website design — Starter package', qty: 1, price: 850 },
    { desc: 'Copywriting & on-page SEO', qty: 1, price: 250 },
    { desc: 'Monthly care plan (first month)', qty: 1, price: 120 },
  ]
  const total = rows.reduce((a, r) => a + r.price, 0)
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.bar}>
          <span style={s.brand}>{businessName}</span>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '' }} style={s.back}>← Back to site</a>
        </div>
        <div style={s.head}>
          <div>
            <p style={s.label}>Invoice</p>
            <p style={{ ...s.val, fontSize: 16, fontWeight: 700 }}>{invNo}</p>
            <p style={{ ...s.val, fontSize: 13, color: '#64748b', marginTop: 4 }}>Issued: {issued}</p>
          </div>
          <div>
            <p style={s.label}>From</p>
            <p style={s.val}>{businessName}</p>
            <p style={{ ...s.val, fontSize: 13, color: '#64748b' }}>{address}</p>
            <p style={{ ...s.val, fontSize: 13, color: '#64748b' }}>{email} · {phone}</p>
          </div>
          <div>
            <p style={s.label}>Bill To</p>
            <p style={s.val}>Client Name</p>
            <p style={{ ...s.val, fontSize: 13, color: '#64748b' }}>Client Address</p>
            <p style={{ ...s.val, fontSize: 13, color: '#64748b' }}>client@example.com</p>
          </div>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Description</th>
              <th style={{ ...s.th, textAlign: 'right' }}>Qty</th>
              <th style={{ ...s.th, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={s.td}>{r.desc}</td>
                <td style={{ ...s.td, textAlign: 'right' }}>{r.qty}</td>
                <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>£{r.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={s.totalRow}>
          <span>Total due</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <p style={s.note}>
          This is a sample invoice generated by your site. Replace the line items, amounts and client details with your real billing information. The registered office address shown above is drawn from your business profile.
        </p>
      </div>
    </div>
  )
}

function Contract({ businessName, email, phone, address }: { businessName: string; email: string; phone: string; address: string }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const s = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.6, padding: '32px 16px' },
    card: { maxWidth: '760px', margin: '0 auto', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px 28px' },
    bar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    brand: { fontWeight: 800, fontSize: '18px', color: '#0f172a' },
    back: { fontSize: '14px', color: '#2563eb', textDecoration: 'none', cursor: 'pointer' },
    h1: { fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' },
    sub: { fontSize: '13px', color: '#94a3b8', margin: '0 0 24px' },
    h2: { fontSize: '17px', fontWeight: 700, margin: '24px 0 8px', color: '#0f172a' },
    p: { fontSize: '14px', lineHeight: 1.7, color: '#475569', margin: '0 0 10px' },
    sign: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 24, marginTop: 28, paddingTop: 20, borderTop: '1px solid #e2e8f0' },
    sigbox: { flex: '1 1 200px' },
    sigline: { borderBottom: '1px solid #cbd5e1', height: 28, marginBottom: 6 },
    siglabel: { fontSize: '12px', color: '#64748b' },
  }
  const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const sections = [
    { h: '1. Parties', p: ['This Agreement is between {name} (the "Provider"), registered at {address}, and the client named below (the "Client").'] },
    { h: '2. Services', p: ['The Provider will design, build and deliver a business website according to the package selected by the Client, including the agreed number of pages, revisions and handover assets.'] },
    { h: '3. Fees and Payment', p: ['The Client pays the agreed fixed fee in two instalments: 50% on commencement and 50% on completion. Monthly care plans are billed in advance. All prices are exclusive of VAT unless stated.'] },
    { h: '4. Timeline', p: ['The Provider will use reasonable efforts to deliver the completed site within the agreed number of weeks from the start date, subject to the Client providing content and feedback promptly.'] },
    { h: '5. Intellectual Property', p: ['On final payment, the Client owns the finished website and its content. The Provider retains ownership of reusable code, templates and tooling used to build it.'] },
    { h: '6. Liability', p: ['The Provider is not liable for indirect or consequential loss. The Client is responsible for the accuracy of content they supply and for compliance with applicable laws.'] },
    { h: '7. Termination', p: ['Either party may terminate on written notice. The Client pays for work completed up to the termination date.'] },
    { h: '8. Contact', p: ['Questions about this Agreement should be sent to {name} at {email} or {phone}.'] },
  ]
  const fill = (str: string) => str.replace(/\{name\}/g, businessName).replace(/\{address\}/g, address).replace(/\{email\}/g, email).replace(/\{phone\}/g, phone)
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.bar}>
          <span style={s.brand}>{businessName}</span>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '' }} style={s.back}>← Back to site</a>
        </div>
        <h1 style={s.h1}>Service Agreement</h1>
        <p style={s.sub}>Template · {updated}</p>
        {sections.map((sec, i) => (
          <div key={i}>
            <h2 style={s.h2}>{sec.h}</h2>
            {sec.p.map((para, j) => <p key={j} style={s.p}>{fill(para)}</p>)}
          </div>
        ))}
        <div style={s.sign}>
          <div style={s.sigbox}>
            <div style={s.sigline} />
            <div style={s.siglabel}>Signed for {businessName}</div>
          </div>
          <div style={s.sigbox}>
            <div style={s.sigline} />
            <div style={s.siglabel}>Signed for Client</div>
          </div>
        </div>
        <p style={{ ...s.p, marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
          This is a sample service agreement provided for demonstration. It is not legal advice — have it reviewed by a qualified solicitor before use.
        </p>
      </div>
    </div>
  )
}

function RegisteredAddressInfo({ businessName, email, phone, address }: { businessName: string; email: string; phone: string; address: string }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const s = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.5 },
    bar: { maxWidth: '820px', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ececec' },
    brand: { fontWeight: 700, fontSize: '15px', color: '#111' },
    back: { fontSize: '14px', color: '#2563eb', textDecoration: 'none', cursor: 'pointer' },
    wrap: { maxWidth: '760px', margin: '0 auto', padding: '36px 24px 80px' },
    h1: { fontSize: '30px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#0f172a' },
    sub: { fontSize: '13px', color: '#94a3b8', margin: '0 0 28px' },
    h2: { fontSize: '19px', fontWeight: 700, margin: '28px 0 8px', color: '#0f172a' },
    p: { fontSize: '15px', lineHeight: 1.75, color: '#475569', margin: '0 0 12px' },
    addr: { fontSize: '16px', fontWeight: 600, color: '#0f172a', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', margin: '0 0 12px' },
  }
  const fill = (str: string) => str.replace(/\{name\}/g, businessName).replace(/\{email\}/g, email).replace(/\{phone\}/g, phone).replace(/\{address\}/g, address)
  const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const sections: Array<{ h: string; p: string[] }> = [
    { h: 'Registered Office Address', p: ['This website belongs to {name}, a company registered in the United Kingdom. The address below is our registered office — the official legal address recorded on the public Companies House register, and the address where we receive official correspondence from Companies House and HMRC:', '{address}', 'Our registered office is not necessarily where our services are delivered. The location where customers visit or where we trade is shown elsewhere on this site.'] },
    { h: 'Sole Trader? No Registered Office Needed', p: ['If the business behind this site trades as a sole trader, there is no registered office requirement at all. Sole traders are not registered with Companies House and only need a business (trading) address for HMRC. In that case the address shown above does not apply, and no registered-office entry is expected on this page.'] },
    { h: 'Why This Address Is Public', p: ['Under UK company law, a registered office address appears on the public Companies House register and can be viewed by anyone. This transparency is a legal requirement and helps customers, suppliers and public authorities reach the company.'] },
    { h: 'If You Are Setting This Up For Your Own Business', p: ['If you are using this template for your own company, any of the following can serve as your registered office, as long as it meets the rules below:', '• Your own business premises', '• Your home address — free, but it will appear on the public register', '• Your accountant’s or solicitor’s address, with their permission', '• A virtual office or registered-agent service (typically £30–£150 per year) — keeps your home address private and looks professional'] },
    { h: 'Rules You Must Follow (ECCTA 2024)', p: ['Since 4 March 2024 the registered office must be an “appropriate address”: a real UK location where post is received and can be acknowledged. A standalone PO box no longer qualifies. The address must also be in the same UK jurisdiction as your company (England & Wales, Scotland, or Northern Ireland).', 'A company that does not keep a valid registered office can be struck off the Companies House register.'] },
    { h: 'Sole Trader Alternative', p: ['If you trade as a sole trader you do not register with Companies House and are not required to have a registered office address — you only need a business address for HMRC. This keeps setup simple, but you take on unlimited personal liability for the business.'] },
    { h: 'Keeping This Page Up To Date', p: ['If your registered office changes, update it at Companies House (free to file) and update the address shown here so the two match. This page is generated automatically from your business profile.'] },
  ]
  return (
    <div style={s.page}>
      <div style={s.bar}>
        <span style={s.brand}>{businessName}</span>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '' }} style={s.back}>← Back to site</a>
      </div>
      <div style={s.wrap}>
        <h1 style={s.h1}>Registered Office Address</h1>
        <p style={s.sub}>Information page · {updated}</p>
        {sections.map((sec, i) => (
          <div key={i}>
            <h2 style={s.h2}>{sec.h}</h2>
            {sec.p.map((para, j) => (
              <p key={j} style={sec.h === 'Registered Office Address' && j === 1 ? s.addr : s.p}>{fill(para)}</p>
            ))}
          </div>
        ))}
        <p style={{ ...s.p, marginTop: 28, fontSize: 13, color: '#94a3b8' }}>
          This page is provided as a general guide and is not legal advice. Seek professional guidance for your specific circumstances.
        </p>
      </div>
    </div>
  )
}
