import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, MapPin, Clock, Star, ArrowRight, Send, Check, Instagram, Facebook, Twitter } from 'lucide-react'
import { businessData } from './business-data'

const d = businessData

const fadeView = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
})

export default function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? (window.location.hash || '') : '')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', guests: '2', message: '' })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = Object.entries(form).filter(([, v]) => v != null && String(v).trim() !== '').map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n');
    const who = form.name || form.email || 'your website';
    window.location.href = `mailto:${d.email}?subject=${encodeURIComponent('New enquiry from ' + who)}&body=${encodeURIComponent(lines)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const navLinks = ['Menu', 'About', 'Reviews', 'Reservations', 'Contact']
  const sectionIds: Record<string, string> = { Menu: 'menu', About: 'about', Reviews: 'reviews', Reservations: 'reservations', Contact: 'contact' }

  const privacyAddress = d.registeredAddress || [d.street, d.location].filter(Boolean).join(', ') || 'United Kingdom'


  if (route === '#privacy') {

    return (

      <PrivacyPolicy businessName={d.name} email={d.email} phone={d.phone} address={privacyAddress} />

    )

  }


  if (route === '#address-info') {


    return (


      <RegisteredAddressInfo businessName={d.name} email={d.email} phone={d.phone} address={privacyAddress} />


    )


  }


  if (route === '#contract') {


    return (


      <Contract businessName={d.name} email={d.email} phone={d.phone} address={privacyAddress} />


    )


  }


  if (route === '#invoice') {


    return (


      <Invoice businessName={d.name} email={d.email} phone={d.phone} address={privacyAddress} />


    )


  }


  return (
    <div className="bg-cream text-charcoal font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-charcoal/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
          <a href="#hero" className="font-display text-xl sm:text-2xl font-bold italic tracking-tight">{d.name}</a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal/70">
            {navLinks.map(l => <a key={l} href={`#${sectionIds[l]}`} className="hover:text-charcoal transition-colors">{l}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${d.phone}`} className="hidden sm:flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal"><Phone className="w-4 h-4" />{d.phone}</a>
            <a href="#reservations" className="px-5 py-2.5 rounded-full bg-charcoal text-white text-sm font-medium hover:bg-charcoal/90 transition-colors">Book Now</a>
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* Mobile */}
      <AnimatePresence>{mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ ease: [0.22, 1, 0.36, 1] }} className="absolute right-0 top-0 bottom-0 w-72 bg-cream p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8"><span className="font-display text-xl font-bold italic">Menu</span><button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button></div>
            <div className="flex flex-col gap-4 text-lg font-medium">{navLinks.map(l => <a key={l} href={`#${sectionIds[l]}`} onClick={() => setMobileOpen(false)} className="py-2 border-b border-charcoal/10">{l}</a>)}</div>
            <a href="#reservations" onClick={() => setMobileOpen(false)} className="mt-auto w-full py-3 rounded-full bg-charcoal text-white text-center font-medium">Book Now</a>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-cream to-orange-50">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_30%_40%,#d97706_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>
        <div className="absolute top-1/4 right-[10%] w-72 h-72 bg-amber-200/40 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-[5%] w-64 h-64 bg-terracotta/20 rounded-full blur-[80px]" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 text-center px-5 mt-16">
          <p className="text-amber text-sm tracking-[0.2em] uppercase font-medium mb-4">Est. {d.established} · {d.location}</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold italic leading-[0.95] mb-6">{d.name}</h1>
          <p className="text-lg sm:text-xl text-charcoal/60 max-w-lg mx-auto mb-10 leading-relaxed">{d.tagline}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={d.heroCta1.href} className="px-8 py-3.5 rounded-full bg-charcoal text-white text-sm font-medium hover:bg-charcoal/90 transition-colors flex items-center gap-2">{d.heroCta1.text} <ArrowRight className="w-4 h-4" /></a>
            <a href={d.heroCta2.href} className="px-8 py-3.5 rounded-full border-2 border-charcoal/20 text-charcoal text-sm font-medium hover:border-charcoal/40 transition-colors">{d.heroCta2.text}</a>
          </div>
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-charcoal/50">
            <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber text-amber" /> {d.googleRating}</div>
            <span>·</span><span>Google Reviews</span>
            <span>·</span><span>Top 10 UK Italian</span>
          </div>
        </motion.div>
      </section>

      {/* INFO BAR */}
      <div className="bg-charcoal text-cream py-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 text-center text-sm">
          <div className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4 text-amber" /> {d.street}</div>
          <div className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-amber" /> Tue—Sun · 12:00—22:00</div>
          <div className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-amber" /> {d.phone}</div>
        </div>
      </div>

      {/* MENU */}
      <section id="menu" className="py-20 sm:py-28 max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div {...fadeView(0)} className="text-center mb-16">
          <p className="text-amber text-sm tracking-[0.2em] uppercase font-medium mb-3">Our Menu</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold italic mb-4">Handcrafted Daily</h2>
          <p className="text-charcoal/50 max-w-md mx-auto">Every dish is prepared fresh using seasonal ingredients</p>
        </motion.div>
        {d.menuCategories.map(cat => (
          <motion.div key={cat.category} {...fadeView(0.1)} className="mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-display text-2xl sm:text-3xl italic font-bold">{cat.category}</h3>
              <div className="flex-1 h-px bg-charcoal/10" />
            </div>
            <div className="space-y-4">
              {cat.items.map(item => (
                <div key={item.name} className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-charcoal/[0.02] transition-colors">
                  <div><h4 className="font-semibold text-base sm:text-lg">{item.name}</h4><p className="text-sm text-charcoal/50 mt-1">{item.desc}</p></div>
                  <span className="text-base font-semibold text-amber whitespace-nowrap">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div {...fadeView(0)}>
            <p className="text-amber text-sm tracking-[0.2em] uppercase font-medium mb-3">Our Story</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold italic mb-6">{d.aboutTitle}</h2>
            <div className="space-y-4 text-charcoal/70 leading-relaxed">
              {d.aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="flex gap-8 mt-8 pt-8 border-t border-charcoal/10">
              {d.aboutStats.map(s => <div key={s.label}><div className="text-2xl font-bold text-amber">{s.value}</div><div className="text-xs text-charcoal/50 mt-1">{s.label}</div></div>)}
            </div>
          </motion.div>
          <motion.div {...fadeView(0.15)} className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100" />
            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100" />
              <div className="flex-1 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-28 bg-white">
        <motion.div {...fadeView(0)} className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-amber text-sm tracking-[0.2em] uppercase font-medium mb-3">Reviews</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold italic mb-12">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.reviews.map(r => (
              <div key={r.name} className="p-6 rounded-2xl border border-charcoal/10 text-left hover:border-amber/30 transition-colors">
                <div className="flex gap-0.5 mb-3">{Array(r.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber text-amber" />)}</div>
                <p className="text-sm text-charcoal/70 leading-relaxed mb-4 italic">"{r.text}"</p>
                <p className="text-sm font-semibold">{r.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RESERVATION */}
      <section id="reservations" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeView(0)} className="text-center mb-12">
            <p className="text-amber text-sm tracking-[0.2em] uppercase font-medium mb-3">Reservations</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold italic mb-4">Book Your Table</h2>
            <p className="text-charcoal/50">{d.reservationIntro}</p>
          </motion.div>
          <motion.form {...fadeView(0.1)} onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-charcoal/5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-12 rounded-xl border border-charcoal/15 px-4 text-sm bg-cream/50 focus:outline-none focus:border-amber/50" required /></div>
              <div><label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-12 rounded-xl border border-charcoal/15 px-4 text-sm bg-cream/50 focus:outline-none focus:border-amber/50" required /></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div><label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full h-12 rounded-xl border border-charcoal/15 px-4 text-sm bg-cream/50 focus:outline-none focus:border-amber/50" required /></div>
              <div><label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Time</label><select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full h-12 rounded-xl border border-charcoal/15 px-4 text-sm bg-cream/50 focus:outline-none focus:border-amber/50" required><option value="">Select</option>{['12:00','12:30','13:00','18:00','18:30','19:00','19:30','20:00'].map(t => <option key={t}>{t}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Guests</label><select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full h-12 rounded-xl border border-charcoal/15 px-4 text-sm bg-cream/50 focus:outline-none focus:border-amber/50"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option></select></div>
            </div>
            <div className="mb-6"><label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Special Requests</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-charcoal/15 p-4 text-sm bg-cream/50 focus:outline-none focus:border-amber/50 resize-none h-24" placeholder="Allergies, celebrations, seating preferences..." /></div>
            <button type="submit" className="w-full py-3.5 rounded-full bg-charcoal text-white font-semibold text-sm hover:bg-charcoal/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {submitted ? <><Check className="w-4 h-4" />Booking Confirmed!</> : <>Reserve Table <Send className="w-4 h-4" /></>}
            </button>
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-charcoal text-cream py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-cream/10">
            <div>
              <h3 className="font-display text-2xl font-bold italic mb-4">{d.name}</h3>
              <p className="text-sm text-cream/60 leading-relaxed mb-4">{d.tagline}</p>
              <div className="flex gap-3">
                {d.instagram && <a href={d.instagram} className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"><Instagram className="w-4 h-4" /></a>}
                {d.facebook && <a href={d.facebook} className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"><Facebook className="w-4 h-4" /></a>}
                {d.twitter && <a href={d.twitter} className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"><Twitter className="w-4 h-4" /></a>}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Hours</h4>
              <div className="space-y-2 text-sm text-cream/60">
                <p>Tuesday—Thursday <span className="text-cream">12:00—21:30</span></p>
                <p>Friday—Saturday <span className="text-cream">12:00—22:30</span></p>
                <p>Sunday <span className="text-cream">12:00—20:30</span></p>
                <p className="text-cream/40">Monday — Closed</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Find Us</h4>
              <div className="space-y-2 text-sm text-cream/60">
                {(d.street || '').split(',').map((s, i) => <p key={i}>{s.trim()}</p>)}
                <a href={`tel:${d.phone}`} className="block text-cream hover:text-amber transition-colors mt-3">{d.phone}</a>
                <a href={`mailto:${d.email}`} className="block text-cream hover:text-amber transition-colors">{d.email}</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">{['Our Menu', 'Private Dining', 'Gift Cards', 'Careers', 'Press'].map(l => <a key={l} href="#" className="block text-cream/60 hover:text-cream transition-colors">{l}</a>)}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-cream/40">
            <p>© {new Date().getFullYear()} {d.name}. All rights reserved.</p>
            <div className="flex gap-6"><a href="#privacy" className="hover:text-cream/60">Privacy Policy</a>
              <a href="#" className="hover:text-cream/60">Terms of Service</a>
              <a href="#" className="hover:text-cream/60">Cookie Policy</a></div>
          </div>
        </div>
      

    <div style={{  textAlign: 'center', paddingTop: '14px', marginTop: '6px'  }}><a href="#address-info" style={{  color: '#cbd5e1', textDecoration: 'underline', fontSize: '12px', letterSpacing: '0.04em'  }}>Registered Office Address</a></div>
  

    <div style={{ textAlign: 'center', paddingTop: 14, marginTop: 6 }}><a href="#invoice" style={{ color: '#cbd5e1', textDecoration: 'underline', fontSize: 12, letterSpacing: '0.04em' }}>Invoice Template</a><span style={{ color: '#475569', margin: '0 8px' }}>·</span><a href="#contract" style={{ color: '#cbd5e1', textDecoration: 'underline', fontSize: 12, letterSpacing: '0.04em' }}>Contract Template</a></div>
  </footer>
    </div>
  )
}



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
  const fill = (str: string) => str
    .replace(/\{name\}/g, businessName)
    .replace(/\{email\}/g, email)
    .replace(/\{phone\}/g, phone)
    .replace(/\{address\}/g, address)
  const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const sections: Array<{ h: string; p: string[] }> = [
    { h: '1. Who We Are', p: [
      'This Privacy Policy explains how {name} ("we", "us", "our") collects, uses and protects your personal data when you visit our website or contact us. {name} is the data controller and can be contacted at {address}, by email at {email}, or by telephone on {phone}.',
    ]},
    { h: '2. Information We Collect', p: [
      'We collect information you provide directly to us, including your name, email address, telephone number, and any details you share when making a reservation, enquiry or appointment request through our website.',
      'We also collect limited technical information automatically, such as your IP address, browser type and the pages you visit, to help us understand how the site is used and to keep it secure.',
    ]},
    { h: '3. How We Use Your Information', p: [
      'We use your information to: respond to your enquiries and reservation requests; provide and improve our services; send you confirmations and service-related messages; and comply with our legal obligations.',
      'We will only use your information for the purpose you provided it, and we will not sell your personal data to third parties.',
    ]},
    { h: '4. Legal Bases for Processing', p: [
      'Under the UK GDPR we rely on the following legal bases: (a) your consent, where you have given it; (b) the performance of a contract, where you request a booking or service; (c) our legitimate interests in operating and promoting our business; and (d) compliance with a legal obligation.',
    ]},
    { h: '5. Cookies and Similar Technologies', p: [
      'Our website uses cookies and similar technologies to remember your preferences, measure site performance and understand how visitors use the site. Under the Privacy and Electronic Communications Regulations (PECR) we ask for your consent before setting any non-essential cookies, and you can manage your choices through your browser settings at any time.',
    ]},
    { h: '6. Sharing Your Information', p: [
      'We may share your information with trusted service providers who help us operate the site and deliver our services, such as booking, email and hosting providers. They are only permitted to use your data to provide services to us and are bound by confidentiality obligations.',
      'We may also disclose your information where required by law or to protect our legal rights.',
    ]},
    { h: '7. International Transfers', p: [
      'Where your information is transferred outside the United Kingdom, we ensure an adequate level of protection through recognised safeguards such as the UK adequacy regulations or standard contractual clauses.',
    ]},
    { h: '8. How Long We Keep Your Information', p: [
      'We keep your personal data only for as long as necessary for the purposes set out in this policy, or as required by law. Enquiry and reservation records are typically retained for up to 24 months unless a longer period is needed.',
    ]},
    { h: '9. Your Rights', p: [
      'Under the UK GDPR you have the right to: access the personal data we hold about you; request correction of inaccurate data; request erasure of your data; object to or restrict processing; and request portability of your data.',
      'To exercise any of these rights, contact us using the details in section 1. We will respond within one month. You also have the right to lodge a complaint with the Information Commissioner’s Office (ICO) at ico.org.uk.',
    ]},
    { h: '10. Changes to This Policy', p: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.',
    ]},
    { h: '11. Contact Us', p: [
      'If you have any questions about this policy or how we handle your data, please contact {name} at {email} or {phone}.',
    ]},
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
            {sec.p.map((para, j) => (
              <p key={j} style={s.p}>{fill(para)}</p>
            ))}
          </div>
        ))}
        <p style={{ ...s.p, marginTop: 28, fontSize: 13, color: '#94a3b8' }}>
          This policy is provided as a general template and is not legal advice. Seek professional guidance for your specific circumstances.
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
  const fill = (str: string) => str
    .replace(/\{name\}/g, businessName)
    .replace(/\{email\}/g, email)
    .replace(/\{phone\}/g, phone)
    .replace(/\{address\}/g, address)
  const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const sections: Array<{ h: string; p: string[] }> = [
    { h: 'Registered Office Address', p: [
      'This website belongs to {name}, a company registered in the United Kingdom. The address below is our registered office — the official legal address recorded on the public Companies House register, and the address where we receive official correspondence from Companies House and HMRC:',
      '{address}',
      'Our registered office is not necessarily where our services are delivered. The location where customers visit or where we trade is shown elsewhere on this site.',
    ]},
    { h: 'Why This Address Is Public', p: [
      'Under UK company law, a registered office address appears on the public Companies House register and can be viewed by anyone. This transparency is a legal requirement and helps customers, suppliers and public authorities reach the company.',
    ]},
    { h: 'If You Are Setting This Up For Your Own Business', p: [
      'If you are using this template for your own company, any of the following can serve as your registered office, as long as it meets the rules below:',
      '• Your own business premises',
      '• Your home address — free, but it will appear on the public register',
      '• Your accountant’s or solicitor’s address, with their permission',
      '• A virtual office or registered-agent service (typically £30–£150 per year) — keeps your home address private and looks professional',
    ]},
    { h: 'Rules You Must Follow (ECCTA 2024)', p: [
      'Since 4 March 2024 the registered office must be an “appropriate address”: a real UK location where post is received and can be acknowledged. A standalone PO box no longer qualifies. The address must also be in the same UK jurisdiction as your company (England & Wales, Scotland, or Northern Ireland).',
      'A company that does not keep a valid registered office can be struck off the Companies House register.',
    ]},
    { h: 'Sole Trader Alternative', p: [
      'If you trade as a sole trader you do not register with Companies House and are not required to have a registered office address — you only need a business address for HMRC. This keeps setup simple, but you take on unlimited personal liability for the business.',
    ]},
    { h: 'Keeping This Page Up To Date', p: [
      'If your registered office changes, update it at Companies House (free to file) and update the address shown here so the two match. This page is generated automatically from your business profile.',
    ]},
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




function Invoice({ businessName, email, phone, address }: { businessName: string; email: string; phone: string; address: string }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const s = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.5, padding: '32px 16px' },
    card: { maxWidth: '760px', margin: '0 auto', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
    bar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #ececec' },
    brand: { fontWeight: 800, fontSize: '18px', color: '#0f172a' },
    back: { fontSize: '14px', color: '#2563eb', textDecoration: 'none', cursor: 'pointer' },
    head: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '24px 28px', background: '#f8fafc' },
    label: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 4px' },
    val: { fontSize: '14px', color: '#0f172a', margin: 0 },
    table: { width: '100%', borderCollapse: 'collapse', margin: '0' },
    th: { textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', padding: '12px 28px', borderBottom: '1px solid #e2e8f0' },
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
    sign: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginTop: 28, paddingTop: 20, borderTop: '1px solid #e2e8f0' },
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
  const fill = (str) => str.replace(/\{name\}/g, businessName).replace(/\{address\}/g, address).replace(/\{email\}/g, email).replace(/\{phone\}/g, phone)
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
            {sec.p.map((para, j) => (
              <p key={j} style={s.p}>{fill(para)}</p>
            ))}
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

