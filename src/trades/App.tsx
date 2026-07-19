import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MapPin, Clock, Star, ArrowRight, Send, Check, Shield, Wrench, Timer, ThumbsUp, Award, Menu, X } from 'lucide-react'
import { tradesData } from './business-data'
import { HeroBackdrop, GradientText, GlassCard, Eyebrow } from './components/visual'
const d = tradesData



const fadeView=(dx:number)=>({initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:true,margin:'-20px'},transition:{duration:0.5,ease:[0.25,0.1,0.25,1],delay:dx}})

export default function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? (window.location.hash || '') : '')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const [mobile,setMobile]=useState(false)
  const [done,setDone]=useState(false)
  const [f,setF]=useState({name:'',phone:'',email:'',service:'',urgency:'routine',message:''})
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = Object.entries(f).filter(([, v]) => v != null && String(v).trim() !== '').map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n');
    const who = f.name || f.phone || f.email || 'your website';
    window.location.href = `mailto:${d.email}?subject=${encodeURIComponent('New quote request from ' + who)}&body=${encodeURIComponent(lines)}`;
    setDone(true);
    setTimeout(() => setDone(false), 4000);
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
    <div className="bg-light text-slate-900 font-body">
      <style dangerouslySetInnerHTML={{__html:`body{background:#f8fafc;color:#0f172a;font-family:'Inter',system-ui,sans-serif}`}}/>

      {/* EMERGENCY BANNER */}
      {d.emergency&&<div className="bg-orange text-white text-sm py-2.5"><div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6"><span className="flex items-center gap-2 font-bold"><Timer className="w-4 h-4"/>24/7 Emergency Call-Out</span><a href={`tel:${d.emergencyPhone||d.phone}`} className="flex items-center gap-1.5 font-bold hover:underline"><Phone className="w-3.5 h-3.5"/>{d.emergencyPhone||d.phone}</a></div></div>}

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm"><div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2"><Wrench className="w-6 h-6 text-navy"/><span className="text-xl font-extrabold text-navy tracking-tight">{d.name}</span></a>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">{['Services','About','Reviews','Contact'].map(l=><a key={l} href={`#${l.toLowerCase()}`} className="hover:text-navy transition-colors">{l}</a>)}</div>
        <div className="flex items-center gap-3"><a href={`tel:${d.phone}`} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-navy"><Phone className="w-4 h-4"/>{d.phone}</a><a href="#contact" className="px-5 py-2.5 rounded-md bg-orange text-white text-sm font-bold hover:bg-orange-600 transition-colors">Get Quote</a><button onClick={()=>setMobile(true)} className="md:hidden"><Menu className="w-5 h-5"/></button></div>
      </div></nav>

      <AnimatePresence>{mobile&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] md:hidden"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={()=>setMobile(false)}/><motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="absolute right-0 top-0 bottom-0 w-72 bg-white flex flex-col p-6"><div className="flex justify-between mb-8"><span className="font-extrabold text-navy text-lg">Menu</span><button onClick={()=>setMobile(false)}><X className="w-5 h-5"/></button></div>{['Services','About','Reviews','Contact'].map(l=><a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setMobile(false)} className="py-3 text-lg font-semibold border-b border-slate-100">{l}</a>)}<a href={`tel:${d.phone}`} className="mt-auto w-full py-3 rounded-md bg-orange text-white text-center font-bold">Call Now</a></motion.div></motion.div>}</AnimatePresence>

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-navy to-slate-800 text-white overflow-hidden">
        <HeroBackdrop particles={false} signature="forge" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_70%_30%,white_1px,transparent_1px)] bg-[size:48px_48px]"/>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-32">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4"><div className="flex gap-0.5">{Array(5).fill(0).map((_,i)=><Star key={i} className="w-4 h-4 fill-orange text-orange"/>)}</div><span className="text-sm text-slate-300">{d.googleRating} · {d.googleReviews}</span></div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-4 break-words">{d.heroLine1}<br/><span className="text-orange"><GradientText>{d.heroLine2}</GradientText></span></h1>
            <p className="text-lg text-slate-300 measure-lg mb-8 leading-relaxed">{d.tagline}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contact" className="px-8 py-4 rounded-md bg-orange text-white font-bold text-sm hover:bg-orange-600 inline-flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">{d?.heroCta1?.text} <ArrowRight className="w-4 h-4"/></a>
              <a href={`tel:${d.emergencyPhone||d.phone}`} className="px-8 py-4 rounded-md border-2 border-white/20 text-white font-bold text-sm hover:border-white/40 inline-flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">{d?.heroCta2?.text}</a>
            </div>
          </motion.div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-5 mt-12 pt-8 border-t border-white/10">
            {(d.certs || []).slice(0,4).map(c=><div key={c} className="flex items-center gap-2 text-xs text-slate-300"><Shield className="w-3.5 h-3.5 text-orange"/><span className="font-semibold">{c}</span></div>)}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 mt-10">
            {(d.stats || []).map(s=><div key={s.label}><span className="text-3xl font-extrabold text-orange">{s.value}</span><span className="text-xs text-slate-400 ml-2">{s.label}</span></div>)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-28 bg-white section-rule"><div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div {...fadeView(0)} className="text-center mb-14"><Eyebrow className="text-orange mb-4">{d.servicesTitle}</Eyebrow><h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">{d.servicesSubtitle}</h2></motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(d.services || []).map((s,i)=><motion.div key={i} {...fadeView(i*0.06)} className={`group bg-light rounded-xl p-6 border ${s.emergency?'border-orange/30 bg-orange/5':'border-slate-200'} hover:border-orange/50 hover:-translate-y-1 transition-all duration-300 relative`}>
            {s.emergency&&<div className="absolute -top-2 right-4 px-2.5 py-0.5 rounded-full bg-orange text-white text-[10px] font-extrabold uppercase">Emergency</div>}
            <h3 className="text-lg font-bold text-navy mb-2">{s.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
            {s.price&&<div className="flex items-center justify-between"><span className="text-lg font-extrabold text-orange">{s.price}</span><a href="#contact" className="text-xs font-bold text-navy hover:text-orange">Get Quote →</a></div>}
          </motion.div>)}
        </div>
      </div></section>

      {/* ABOUT */}
      <section id="about" className="py-20 sm:py-28 bg-light section-rule"><div className="max-w-6xl mx-auto px-5 sm:px-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeView(0)}>
          <Eyebrow className="text-orange mb-4">{d.subtitle}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-6">{d.aboutTitle}</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">{(d.aboutParagraphs || []).map((p,i)=><p key={i}>{p}</p>)}</div>
          <div className="flex flex-wrap gap-3 mt-8">{(d.certs || []).map(c=><div key={c} className="flex items-center gap-2 text-xs font-bold text-navy bg-white px-3 py-2 rounded-md border border-slate-200"><Shield className="w-3.5 h-3.5 text-orange"/>{c}</div>)}</div>
        </motion.div>
        <motion.div {...fadeView(0.15)} className="bg-white rounded-xl border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-navy mb-4">Why choose {d.name}?</h3>
          <div className="space-y-4">
            {[{icon:Timer,text:'Same-day response — we aim to arrive within 60 minutes for emergencies'},{icon:ThumbsUp,text:'12-month guarantee on all workmanship — no questions asked'},{icon:Shield,text:'Fully insured and accredited — Gas Safe, NICEIC, Which? Trusted'},{icon:Award,text:'480+ five-star reviews — check our Google profile'}].map((b,i)=><div key={i} className="flex items-start gap-3"><b.icon className="w-5 h-5 text-orange flex-shrink-0 mt-0.5"/><p className="text-sm text-slate-600">{b.text}</p></div>)}
          </div>
        </motion.div>
      </div></div></section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-28 bg-white section-rule"><div className="max-w-5xl mx-auto px-5 sm:px-8"><motion.div {...fadeView(0)} className="text-center mb-12"><Eyebrow className="text-orange mb-4">Reviews</Eyebrow><h2 className="text-3xl sm:text-4xl font-extrabold text-navy">What our customers say</h2></motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{(d.reviews || []).map((r,i)=><motion.div key={i} {...fadeView(i*0.1)} className="rounded-xl">
          <GlassCard className="h-full">
          <div className="flex gap-0.5 mb-3">{Array(r.rating).fill(0).map((_,j)=><Star key={j} className="w-4 h-4 fill-orange text-orange"/>)}</div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">"{r.text}"</p>
          <p className="text-sm font-bold text-navy">{r.name}</p>
          </GlassCard>
        </motion.div>)}</div></div></section>

      {/* CONTACT */}
      <section id="contact" className="py-20 sm:py-28 bg-navy text-white section-rule"><div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <motion.div {...fadeView(0)} className="mb-10"><Eyebrow className="text-orange mb-4">Get in Touch</Eyebrow><h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to get it <span className="text-orange">fixed</span>?</h2><p className="text-slate-300 lead">Free, no-obligation quote. We'll get back to you within 2 hours.</p></motion.div>
        <motion.form {...fadeView(0.1)} onSubmit={submit} className="bg-white rounded-xl p-6 sm:p-8 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><div><label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Name</label><input className="w-full h-12 rounded-md border border-slate-300 px-4 text-sm text-slate-900 focus:outline-none focus:border-orange/50" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/></div><div><label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Phone</label><input className="w-full h-12 rounded-md border border-slate-300 px-4 text-sm text-slate-900 focus:outline-none focus:border-orange/50" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required/></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><div><label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Email</label><input type="email" className="w-full h-12 rounded-md border border-slate-300 px-4 text-sm text-slate-900 focus:outline-none focus:border-orange/50" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div><div><label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Service</label><select className="w-full h-12 rounded-md border border-slate-300 px-4 text-sm text-slate-900 focus:outline-none focus:border-orange/50" value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Select</option>{(d.services || []).map(s=><option key={s.name}>{s.name}</option>)}</select></div></div>
          <div className="mb-4"><label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Urgency</label><div className="flex gap-3">{['routine','urgent','emergency'].map(u=><label key={u} className={`flex-1 h-12 rounded-md border-2 flex items-center justify-center gap-2 cursor-pointer text-sm font-bold transition-colors ${f.urgency===u?'border-orange bg-orange/5 text-orange':'border-slate-300 text-slate-400 hover:border-slate-400'}`}><input type="radio" name="urgency" value={u} checked={f.urgency===u} onChange={e=>setF({...f,urgency:e.target.value})} className="sr-only"/>{u==='emergency'&&<Timer className="w-4 h-4"/>}{u.charAt(0).toUpperCase()+u.slice(1)}</label>)}</div></div>
          <div className="mb-6"><label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Describe the job</label><textarea className="w-full rounded-md border border-slate-300 p-4 text-sm text-slate-900 focus:outline-none focus:border-orange/50 resize-none h-24" value={f.message} onChange={e=>setF({...f,message:e.target.value})} placeholder="e.g. Boiler not working, leak under sink, bathroom renovation..." required/></div>
          <button type="submit" className="w-full py-4 rounded-md bg-orange text-white font-extrabold text-sm hover:bg-orange-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2">{done?<><Check className="w-4 h-4"/>Quote Request Received!</>:<>Get My Free Quote <Send className="w-4 h-4"/></>}</button>
        </motion.form>
      </div></section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-16"><div className="max-w-7xl mx-auto px-5 sm:px-8"><div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-12 border-b border-white/10"><div><div className="flex items-center gap-2 mb-4"><Wrench className="w-5 h-5 text-orange"/><h3 className="text-lg font-extrabold">{d.name}</h3></div><p className="text-xs text-slate-400 leading-relaxed">{d.tagline}</p></div><div><h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4">Services</h4><div className="space-y-2 text-xs text-slate-400">{(d.services || []).map(s=><p key={s.name}>{s.name}</p>)}</div></div><div><h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4">Hours</h4><div className="space-y-2 text-xs text-slate-400">{(d.hours || '').split('·').map((h,i)=><p key={i}>{h.trim()}</p>)}</div></div><div><h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4">Find Us</h4><div className="space-y-2 text-xs text-slate-400">{(d.street || '').split(',').map((s,i)=><p key={i}>{s.trim()}</p>)}<a href={`tel:${d.phone}`} className="block text-white hover:text-orange mt-3 font-bold">{d.phone}</a><a href={`tel:${d.emergencyPhone}`} className="block text-orange hover:text-orange-300 text-xs font-bold">{d.emergencyPhone} (Emergency)</a></div></div></div><p className="text-center text-[10px] text-slate-500 pt-8">© {new Date().getFullYear()} {d.name}. All rights reserved. {(d.certs || []).slice(0,3).join(' · ')}</p></div>

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

