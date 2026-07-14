import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ArrowRight, Cake, Send, Check, MapPin, Clock, Phone, Menu, X, Sparkles } from 'lucide-react'
import { dessertData } from './business-data'
import { HeroBackdrop, GradientText } from './components/visual'

const d = dessertData



const fadeIn = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }

const Monogram = ({ text, className = '' }: { text: string; className?: string }) => (
  <div className={`rounded-full bg-gold/10 text-gold flex items-center justify-center font-display font-bold ${className}`}>
    {text?.charAt(0).toUpperCase()}
  </div>
)

export default function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? (window.location.hash || '') : '')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ item: '', name: '', email: '', date: '', message: '' })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = Object.entries(form).filter(([, v]) => v != null && String(v).trim() !== '').map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n');
    const who = form.name || form.email || 'your website';
    window.location.href = `mailto:${d.email}?subject=${encodeURIComponent('New order from ' + who)}&body=${encodeURIComponent(lines)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

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
    <div className="bg-ivory text-espresso font-body">
      <style dangerouslySetInnerHTML={{ __html: `
        body{background:#faf7f2;color:#1a1008;font-family:'Lora','Georgia',serif;-webkit-font-smoothing:antialiased}
        ::selection{background:rgba(184,147,90,0.25)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#faf7f2}
        ::-webkit-scrollbar-thumb{background:rgba(26,16,8,0.12);border-radius:2px}
        .thread-pattern{background-image:repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(184,147,90,0.04) 3px,rgba(184,147,90,0.04) 4px);background-size:8px 8px}
      `}}/>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-espresso/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="flex items-center gap-3">
            <div className="w-px h-6 bg-gold" />
            <span className="font-display text-lg sm:text-xl italic font-semibold tracking-tight">{d.name}</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm tracking-[0.12em] uppercase text-espresso/40 font-medium">
            {(d.navLinks || []).map(l => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-gold transition-colors duration-300">{l}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${d.phone}`} className="hidden sm:flex items-center gap-1.5 text-sm text-espresso/30 hover:text-espresso/60"><Phone className="w-4 h-4" />{d.phone}</a>
            <a href="#order" className="px-5 py-2.5 rounded-full bg-espresso text-ivory text-sm font-medium hover:bg-espresso/90 transition-colors">Pre-Order</a>
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
      </nav>

      {/* Mobile */}
      <AnimatePresence>{mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ ease: [0.22, 1, 0.36, 1] }} className="absolute right-0 top-0 bottom-0 w-72 bg-ivory flex flex-col p-6">
            <div className="flex justify-between mb-8"><span className="font-display text-xl italic">Menu</span><button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button></div>
            {(d.navLinks || []).map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="py-3 text-lg font-medium border-b border-espresso/10">{l}</a>)}
            <a href="#order" onClick={() => setMobileOpen(false)} className="mt-auto w-full py-3 rounded-full bg-espresso text-ivory text-center font-medium">Pre-Order</a>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-ivory">
        <HeroBackdrop />
        {/* Texture */}
        <div className="absolute inset-0 thread-pattern" />
        {/* Ambient glow — warm gold, subtle */}
        <div className="absolute top-1/3 right-[15%] w-80 h-80 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-[5%] w-64 h-64 bg-espresso/3 rounded-full blur-[100px]" />

        {/* Left gold line */}
        <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:pl-20 sm:pr-8 w-full mt-16 sm:mt-0">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-espresso/40 font-medium">{d.location}</span>
              <div className="flex gap-0.5 ml-2">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}</div>
              <span className="text-xs text-espresso/30">{d.googleRating}</span>
            </div>

            {/* Headline — MotionSites proportion */}
            <h1 className="font-display text-7xl sm:text-[11vw] lg:text-[10rem] font-bold italic leading-[0.88] tracking-tight mb-4 text-espresso break-words">
              <GradientText>{d.heroLine1}</GradientText>
            </h1>
            <p className="font-display text-2xl sm:text-3xl italic text-gold mb-8 tracking-wide">{d.heroLine2}</p>

            <p className="text-lg text-espresso/50 max-w-lg mb-10 leading-relaxed">{d.tagline}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pastries" className="px-8 py-4 rounded-full bg-espresso text-ivory text-sm font-medium hover:bg-espresso/90 transition-colors inline-flex items-center justify-center gap-2 group w-full sm:w-auto">
                {d?.heroCta1?.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#order" className="px-8 py-4 rounded-full border border-espresso/15 text-espresso text-sm font-medium hover:border-gold/50 hover:text-gold transition-all duration-500 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                {d?.heroCta2?.text}
                <Cake className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INFO BAR */}
      <div className="bg-espresso text-ivory/70 py-4 text-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10">
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> {d.street}</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /> {d.hours}</span>
          <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> {d.phone}</span>
        </div>
      </div>

      {/* PASTRIES */}
      <section id="pastries" className="py-28 bg-ivory">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeIn} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold/40" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">{d.pastriesTitle}</span>
              <div className="h-px w-8 bg-gold/40" />
            </div>
            <p className="text-sm text-espresso/40">{d.pastriesSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(d.menuItems || []).map((item, i) => (
              <motion.div key={i} {...fadeIn} className="group relative bg-white rounded-xl p-6 border border-espresso/5 hover:border-gold/20 hover:-translate-y-1 transition-all duration-500">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-3xl" />
                <Monogram text={item.name} className="w-10 h-10 text-lg mb-4" />
                <h3 className="font-display text-xl italic font-semibold mb-2 text-espresso">{item.name}</h3>
                <p className="text-sm text-espresso/50 leading-relaxed mb-4">{item.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-espresso/5">
                  <span className="font-bold text-gold text-lg">{item.price}</span>
                  <button className="text-xs font-medium text-espresso/30 hover:text-gold transition-colors">Add to order →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAKES */}
      <section id="cakes" className="py-28 bg-espresso/3 relative">
        <div className="absolute inset-0 thread-pattern opacity-50" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cake className="w-5 h-5 text-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">{d.cakesTitle}</span>
            </div>
            <p className="text-sm text-espresso/40">{d.cakesSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(d.cakeItems || []).map((cake, i) => (
              <motion.div key={i} {...fadeIn} className="group bg-white rounded-xl p-8 border border-espresso/5 text-center hover:-translate-y-1 transition-all duration-500 hover:border-gold/20">
                <Monogram text={cake.name} className="w-16 h-16 text-2xl mx-auto mb-4" />
                <div className="inline-block px-3 py-1 rounded-full bg-espresso/5 text-xs font-semibold text-espresso/40 mb-4">Serves {cake.serves}</div>
                <h3 className="font-display text-2xl italic font-semibold mb-2 text-espresso">{cake.name}</h3>
                <p className="text-sm text-espresso/50 leading-relaxed mb-5">{cake.desc}</p>
                <span className="font-display text-2xl text-gold font-bold block mb-4">{cake.price}</span>
                <a href="#order" className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso/40 hover:text-gold transition-colors">
                  Pre-order <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHOCOLATES */}
      <section id="chocolates" className="py-28 bg-espresso text-ivory relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,147,90,0.06),transparent_70%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold/30" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">{d.chocolateTitle}</span>
              <div className="h-px w-8 bg-gold/30" />
            </div>
            <p className="text-sm text-ivory/40">{d.chocolateSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {(d.chocolateItems || []).map((item, i) => (
              <motion.div key={i} {...fadeIn} className="group bg-ivory/5 backdrop-blur-sm rounded-xl p-6 text-center border border-ivory/5 hover:bg-gold/10 hover:border-gold/20 transition-all duration-500">
                <Monogram text={item.name} className="w-12 h-12 text-xl mx-auto mb-3" />
                <h4 className="font-display text-base italic font-semibold mb-2">{item.name}</h4>
                <p className="text-xs text-ivory/40 leading-relaxed mb-3 hidden sm:block">{item.desc}</p>
                <span className="text-lg font-bold text-gold">{item.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER */}
      <section id="order" className="py-28 bg-ivory relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
        <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <motion.div {...fadeIn} className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-gold/30" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">{d.orderTitle}</span>
              <div className="h-px w-8 bg-gold/30" />
            </div>
            <h2 className="font-display text-5xl sm:text-6xl font-bold italic mb-4 text-espresso">{d.orderSubtitle}</h2>
          </motion.div>

          <motion.form {...fadeIn} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-espresso/5 text-left">
            <div className="mb-5">
              <label className="block text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">{d?.orderFields?.item?.label}</label>
              <select value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} className="w-full h-14 rounded-xl border border-espresso/10 px-4 text-sm focus:outline-none focus:border-gold/50 bg-ivory/50" required>
                <option value="">{d?.orderFields?.item?.placeholder}</option>
                {(d.cakeItems || []).map(c => <option key={c.name} value={c.name}>{c.name} — {c.price}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">{d?.orderFields?.name?.label}</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-14 rounded-xl border border-espresso/10 px-4 text-sm bg-ivory/50 focus:outline-none focus:border-gold/50" placeholder={d?.orderFields?.name?.placeholder} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">{d?.orderFields?.email?.label}</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-14 rounded-xl border border-espresso/10 px-4 text-sm bg-ivory/50 focus:outline-none focus:border-gold/50" placeholder={d?.orderFields?.email?.placeholder} required />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">{d?.orderFields?.date?.label}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full h-14 rounded-xl border border-espresso/10 px-4 text-sm bg-ivory/50 focus:outline-none focus:border-gold/50" required />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">{d?.orderFields?.message?.label}</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-espresso/10 p-4 text-sm bg-ivory/50 focus:outline-none focus:border-gold/50 resize-none h-24" placeholder={d?.orderFields?.message?.placeholder} />
            </div>

            <button type="submit" className="w-full py-4 rounded-full bg-espresso text-ivory font-semibold text-sm hover:bg-espresso/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {submitted ? <><Check className="w-4 h-4" /> {d.orderSuccessTitle}</> : <>{d.orderButtonText} <Send className="w-4 h-4" /></>}
            </button>

            {submitted && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-gold mt-4">{d.orderSuccessMessage}</motion.p>}
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-espresso text-ivory">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-ivory/10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-px h-6 bg-gold" />
                <h3 className="font-display text-xl italic font-semibold">{d.name}</h3>
              </div>
              <p className="text-xs text-ivory/50 leading-relaxed mb-4">{d.taglineFull}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ivory/40 mb-4">Shop</h4>
              <div className="space-y-2 text-xs text-ivory/40">
                {['Pastries', 'Cakes', 'Chocolates', 'Gift Boxes', 'Catering'].map(l => <a key={l} href="#" className="block hover:text-gold transition-colors">{l}</a>)}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ivory/40 mb-4">Hours</h4>
              <div className="space-y-2 text-xs text-ivory/40">
                <p>{d.hours}</p>
                <p className="text-ivory/20">Monday — Closed</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ivory/40 mb-4">Find Us</h4>
              <div className="space-y-2 text-xs text-ivory/40">
                {(d.street || '').split(',').map((s, i) => <p key={i}>{s.trim()}</p>)}
                <a href={`tel:${d.phone}`} className="block text-gold hover:text-gold/80 mt-3 text-xs font-semibold">{d.phone}</a>
                <a href={`mailto:${d.email}`} className="block text-ivory/60 hover:text-gold text-xs">{d.email}</a>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-ivory/20 pt-8">{d.footerNote}. All rights reserved.</p>
        </div>
      

    <div style={{textAlign:'center',paddingTop:'22px',borderTop:'1px solid rgba(255,255,255,0.08)',marginTop:'10px'}}><a href="#privacy" style={{color:'#cbd5e1',textDecoration:'underline',fontSize:'12px',letterSpacing:'0.04em'}}>Privacy Policy</a></div>
  

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
    { h: 'Sole Trader? No Registered Office Needed', p: [
      'If the business behind this site trades as a sole trader, there is no registered office requirement at all. Sole traders are not registered with Companies House and only need a business (trading) address for HMRC. In that case the address shown above does not apply, and no registered-office entry is expected on this page.',
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

