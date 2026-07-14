import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Star, Phone, MapPin, Clock, ArrowRight, Send, Check, X, Menu, Sparkles, Wine, UtensilsCrossed, Flame, Lamp, Salad } from 'lucide-react'
import { HeroBackdrop, GradientText } from './components/visual'
import { businessData } from './business-data'

const d = businessData

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
}

const tickerIcons: Record<string, React.FC<{ className?: string }>> = {
  MapPin, Clock, Phone, Wine,
}

const menuIcons: Record<string, React.FC<{ className?: string }>> = {
  Flame, UtensilsCrossed, Sparkles,
}

const galleryIcons: Record<string, React.FC<{ className?: string }>> = {
  Flame, UtensilsCrossed, Sparkles, Wine, Lamp, Salad,
}

export default function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? (window.location.hash || '') : '')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const ringY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const ringOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [mobileOpen, setMobileOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', date: '', time: '19:00',
    guests: '2', occasion: '', note: '',
  })
  const [lightbox, setLightbox] = useState<number | null>(null)

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    const lines = Object.entries(form).filter(([, v]) => v != null && String(v).trim() !== '').map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('\n');
    const who = form.name || form.email || 'your website';
    window.location.href = `mailto:${d.email}?subject=${encodeURIComponent('New reservation from ' + who)}&body=${encodeURIComponent(lines)}`;
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  const navLinks = ['Menu', 'Gallery', 'Reviews', 'Reserve']

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
    <div className="bg-abyss text-paper font-body relative overflow-x-hidden">

      {/* GOLD LINE — left side desktop */}
      <div className="fixed left-8 sm:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent z-50 hidden lg:block pointer-events-none" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-abyss/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:pl-20 sm:pr-8 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gold rounded-full" />
            <a href="#" className="font-display text-xl sm:text-2xl font-bold italic tracking-wide text-paper">
              {d.name}
            </a>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm tracking-[0.15em] uppercase text-mute">
            {navLinks.map(l => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-gold transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all hover:after:w-full"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href={`tel:${d.phone}`} className="hidden sm:flex items-center gap-2 text-sm text-mute hover:text-paper transition-colors">
              <Phone className="w-4 h-4" />
              {d.phone}
            </a>
            <a
              href="#reserve"
              className="px-5 py-2.5 rounded-full border border-gold/30 text-gold text-[13px] tracking-wider uppercase hover:bg-gold hover:text-abyss transition-all duration-500 font-semibold"
            >
              Reserve
            </a>
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-mute">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] md:hidden"
          >
            <div className="absolute inset-0 bg-abyss/95 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-5 text-mute">
                <X className="w-6 h-6" />
              </button>
              {navLinks.map(l => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl italic text-paper hover:text-gold transition-colors"
                >
                  {l}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <HeroBackdrop particles={false} />
        <div className="particles">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>

        {/* Ambient glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-[150px] animate-shimmer" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-600/3 rounded-full blur-[120px] animate-shimmer" style={{ animationDelay: '1.5s' }} />

        {/* Floating golden rings — parallax */}
        <motion.div style={{ y: ringY, opacity: ringOpacity }} className="absolute top-[20%] right-[8%] w-64 h-64 rounded-full border border-gold/10 animate-float hidden lg:block" />
        <motion.div style={{ y: ringY, opacity: ringOpacity }} className="absolute top-[18%] right-[10%] w-48 h-48 rounded-full border border-gold/5 animate-float-delayed hidden lg:block" />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-5 max-w-4xl"
        >
          {/* Badge */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gold/40" />
            <span className="text-xs tracking-[0.4em] uppercase text-gold/80 font-semibold">
              {d.heroBadge}
            </span>
            <div className="h-px w-12 bg-gold/40" />
          </div>

          <h1 className="font-display text-6xl sm:text-[11vw] lg:text-[9rem] font-bold italic leading-[0.9] mb-6 tracking-tight break-words">
            <span className="text-paper"><GradientText>{d.heroLine1}</GradientText></span>
            <br />
            <span className="text-gold block text-4xl sm:text-[5vw] lg:text-7xl font-normal not-italic mt-2 tracking-[0.08em] break-words">
              {d.heroLine2}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-mute max-w-xl mx-auto mb-12 leading-relaxed font-light">
            {d.tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={d?.heroCta1?.href}
              className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-abyss text-sm font-bold tracking-wider uppercase hover:bg-gold-light transition-all duration-500 inline-flex items-center justify-center gap-3"
            >
              {d?.heroCta1?.text}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={d?.heroCta2?.href}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-paper text-sm font-semibold tracking-wider uppercase hover:border-gold/50 hover:text-gold transition-all duration-500 text-center justify-center"
            >
              {d?.heroCta2?.text}
            </a>
          </div>

          {/* Rating strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-14 pt-10 border-t border-white/5">
            {(d.heroStats || []).map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {s.stars && <Star className="w-4 h-4 fill-gold text-gold" />}
                  <span className={`font-display text-2xl ${s.stars ? 'text-gold' : 'text-paper'} font-bold`}>
                    {s.val}
                  </span>
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-mute mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-abyss to-transparent pointer-events-none" />
      </section>

      {/* INFO TICKER */}
      <div className="border-y border-white/5 bg-surface/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:pl-20 sm:pr-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 text-center text-[10px] sm:text-xs tracking-wider uppercase">
          {(d.infoTicker || []).map((t, i) => {
            const Icon = tickerIcons[t.icon]
            return (
              <div key={i} className="flex items-center justify-center gap-2 text-mute min-w-0">
                {Icon && <Icon className="w-3.5 h-3.5 text-gold/60 flex-shrink-0" />}
                <span className="hidden sm:inline truncate max-w-full">{t.text}</span>
                <span className="sm:hidden truncate block max-w-full">{i < 2 ? (t.text || '').split('·')[0] : t.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* MENU */}
      <section id="menu" className="py-24 sm:py-36 relative">
        <div className="max-w-6xl mx-auto px-5 sm:pl-20 sm:pr-8">
          <motion.div {...fadeIn} className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <UtensilsCrossed className="w-4 h-4 text-gold/60" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-semibold">The Menu</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-paper mb-5">
              {d.menuIntroTitle}
            </h2>
            <p className="text-mute text-sm max-w-lg mx-auto leading-relaxed">
              {d.menuIntroText}
            </p>
          </motion.div>

          {(d.menuSections || []).map((section, si) => {
            const Icon = menuIcons[section.icon]
            return (
              <motion.div key={si} {...fadeIn} className="mb-16 last:mb-0">
                <div className="flex items-center gap-4 mb-8">
                  {Icon && <Icon className="w-5 h-5 text-gold/60" />}
                  <h3 className="font-display text-2xl sm:text-3xl italic text-paper">{section.title}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
                </div>
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl hover:bg-white/[0.02] transition-all duration-500 border border-transparent hover:border-white/5"
                    >
                      {/* Dish image (or elegant fallback) */}
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 relative bg-gradient-to-br from-gold/10 to-white/5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {Icon && <Icon className="w-7 h-7 text-gold/30" />}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-abyss/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <h4 className="text-lg sm:text-xl font-semibold text-paper group-hover:text-gold transition-colors duration-500">
                            {item.name}
                          </h4>
                          <span className="text-sm font-light text-gold tabular-nums">£{item.price}</span>
                        </div>
                        <p className="text-sm text-mute leading-relaxed">{item.desc}</p>
                        {item.pair && (
                          <p className="text-[10px] tracking-[0.12em] uppercase text-mute/40 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Wine pairing: {item.pair}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 sm:py-36 bg-surface/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,164,92,0.03),transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:pl-20 sm:pr-8">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-paper mb-4">
              From the <span className="text-gold not-italic">Kitchen</span>
            </h2>
            <p className="text-mute text-sm">Six dishes our regulars ask for by name</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {(d.galleryItems || []).map((g, i) => {
              const GalleryIcon = g.icon ? galleryIcons[g.icon] : null
              return (
                <motion.div
                  key={i}
                  {...fadeIn}
                  onClick={() => setLightbox(i)}
                  className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-gradient-to-br ${g.gradient || 'from-stone-900 to-abyss'}`}
                >
                  {g.image ? (
                    <img
                      src={g.image}
                      alt={g.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 group-hover:scale-105">
                      {GalleryIcon ? (
                        <GalleryIcon className="w-12 h-12 sm:w-14 sm:h-14 text-gold/70 mb-4 transition-all duration-500 group-hover:text-gold group-hover:-translate-y-1" strokeWidth={1.2} />
                      ) : g.emoji ? (
                        <span className="text-5xl sm:text-6xl mb-4 transition-transform duration-700 group-hover:-translate-y-2">
                          {g.emoji}
                        </span>
                      ) : null}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-abyss/15 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-display text-lg italic text-paper drop-shadow-sm">{g.title}</p>
                    {g.sub && <p className="text-[11px] tracking-[0.1em] uppercase text-gold/80 mt-1">{g.sub}</p>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SCREENSHOTS / THE ROOM */}
      {d.screenshots && d.screenshots.length > 0 && (
        <section id="space" className="py-24 sm:py-36 relative">
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:pl-20 sm:pr-8">
            <motion.div {...fadeIn} className="text-center mb-16">
              <span className="block text-[10px] tracking-[0.4em] uppercase text-gold font-semibold mb-4">The Room</span>
              <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-paper mb-4">
                Inside <span className="text-gold not-italic">Sotto Sotto</span>
              </h2>
              <p className="text-mute text-sm">{d.screenshotsIntro || 'Tucked beneath the streets of Bath — candlelight, stone arches, and the hum of a full dining room.'}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {(d.screenshots || []).map((s, i) => (
                <motion.div key={i} {...fadeIn} className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-stone-900 to-abyss">
                  {s.image ? (
                    <img src={s.image} alt={s.title || 'Sotto Sotto interior'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-abyss/15 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-500" />
                  {s.title && (
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="font-display text-lg italic text-paper drop-shadow-sm">{s.title}</p>
                      {s.sub && <p className="text-[11px] tracking-[0.1em] uppercase text-gold/80 mt-1">{s.sub}</p>}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
          {lightbox !== null && d.galleryItems[lightbox] && (() => {
            const g = d.galleryItems[lightbox]
            const LightboxIcon = g.icon ? galleryIcons[g.icon!] : null
            return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-[80] bg-abyss/95 backdrop-blur-xl flex items-center justify-center p-6 sm:p-10"
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-5 right-5 sm:top-8 sm:right-8 text-paper/50 hover:text-paper transition-colors"
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="max-w-3xl w-full flex flex-col items-center"
              >
                {g.image ? (
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full max-h-[78vh] object-contain rounded-3xl border border-white/10 shadow-2xl"
                  />
                ) : (
                  <div className={`w-full aspect-[4/3] rounded-3xl bg-gradient-to-br ${g.gradient || 'from-stone-900 to-abyss'} flex flex-col items-center justify-center border border-white/10`}>
                    {LightboxIcon ? <LightboxIcon className="w-20 h-20 text-gold/70 mb-6" strokeWidth={1} /> : g.emoji ? <span className="text-8xl mb-6">{g.emoji}</span> : null}
                  </div>
                )}
                <div className="text-center mt-5">
                  <h3 className="font-display text-3xl italic text-paper">{g.title}</h3>
                  <p className="text-mute text-sm mt-1">{g.sub || `${d.name}, ${d.location}`}</p>
                </div>
              </motion.div>
            </motion.div>
            )
          })()}
      </AnimatePresence>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 sm:py-36">
        <div className="max-w-5xl mx-auto px-5 sm:pl-20 sm:pr-8">
          <motion.div {...fadeIn} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-paper mb-4">
              What <span className="text-gold not-italic">Our Guests</span> Say
            </h2>
            <p className="text-mute text-sm">
              {d.googleRating} · {d.googleReviews} on Google
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(d.reviews || []).map((r, i) => (
              <motion.div key={i} {...fadeIn} className="relative group">
                <div className="glow-ring rounded-2xl" />
                <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-7 border border-white/5 h-full flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {Array(r.rating || 5).fill(0).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-mute leading-relaxed mb-6 flex-1 italic">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="pt-5 border-t border-white/5">
                    <p className="text-sm font-semibold text-paper">{r.name}</p>
                    <p className="text-[10px] text-mute/50 mt-0.5">Verified Guest</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION */}
      <section id="reserve" className="py-24 sm:py-36 bg-surface/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,164,92,0.04),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-gold/20 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-gold/30" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-semibold">Reservations</span>
              <div className="h-px w-10 bg-gold/30" />
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-paper mb-5">
              Secure <span className="text-gold not-italic">Your</span> Evening
            </h2>
            <p className="text-mute text-sm">{d.reservationNote}</p>
          </motion.div>

          <motion.form
            {...fadeIn}
            onSubmit={handleBook}
            className="bg-abyss rounded-3xl p-6 sm:p-10 border border-white/5 relative"
          >
            <div className="glow-ring rounded-3xl" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-paper placeholder:text-white/15 focus:outline-none focus:border-gold/50 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-paper placeholder:text-white/15 focus:outline-none focus:border-gold/50 transition-all"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-paper focus:outline-none focus:border-gold/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Time</label>
                <select
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-paper focus:outline-none focus:border-gold/50 transition-all"
                >
                  {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Guests</label>
                <select
                  value={form.guests}
                  onChange={e => setForm({ ...form, guests: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-paper focus:outline-none focus:border-gold/50 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={String(n)}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Occasion</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(d.occasionOptions || []).map(o => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setForm({ ...form, occasion: o })}
                    className={`h-10 rounded-xl border text-[11px] font-medium transition-all ${
                      form.occasion === o
                        ? 'border-gold/50 bg-gold/10 text-gold'
                        : 'border-white/10 text-mute hover:border-white/20'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-mute font-semibold mb-3">Special Requests</label>
              <textarea
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-4 text-sm text-paper placeholder:text-white/15 focus:outline-none focus:border-gold/50 transition-all resize-none h-20"
                placeholder="Dietary requirements, seating preferences, allergies..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gold text-abyss font-bold text-sm tracking-wider uppercase hover:bg-gold-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" /> Reservation Requested
                </>
              ) : (
                <>
                  Request Table <Send className="w-4 h-4" />
                </>
              )}
            </button>

            {sent && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-gold mt-4"
              >
                We&rsquo;ll confirm within 2 hours. Thank you.
              </motion.p>
            )}
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:pl-20 sm:pr-8 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/5">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 bg-gold rounded-full" />
                <h3 className="font-display text-2xl font-bold italic text-paper">{d.name}</h3>
              </div>
              <p className="text-xs text-mute leading-relaxed mb-5">
                {(d.certifications || []).join('. ')}. {d.tagline}
              </p>
              <p className="text-xs text-mute/50">&copy; {new Date().getFullYear()} {d.name} Fine Dining</p>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-mute font-bold mb-4">Hours</h4>
              <div className="space-y-2 text-xs text-mute/70">
                <p>Wednesday — Friday <span className="text-paper/80 ml-2">{d?.hoursDetail?.wedFri}</span></p>
                <p>Saturday <span className="text-paper/80 ml-2">{d?.hoursDetail?.saturday}</span></p>
                <p>Sunday <span className="text-paper/80 ml-2">{d?.hoursDetail?.sunday}</span></p>
                <p className="text-mute/40">{d?.hoursDetail?.closedDays}</p>
              </div>
            </div>

            {/* Find Us */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-mute font-bold mb-4">Find Us</h4>
              <div className="space-y-2 text-xs text-mute/70">
                {(d.street || '').split(',').map((s, i) => (
                  <p key={i}>{s.trim()}</p>
                ))}
              </div>
              <a href={`tel:${d.phone}`} className="block text-gold text-xs font-semibold mt-3 hover:text-gold-light transition-colors">
                {d.phone}
              </a>
              <a href={`mailto:${d.email}`} className="block text-mute text-xs hover:text-paper mt-1 transition-colors">
                {d.email}
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-mute font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-xs">
                {['Tasting Menu', 'Wine List', 'Private Dining', 'Gift Cards', 'Press', 'Careers'].map(l => (
                  <a key={l} href="#" className="block text-mute/70 hover:text-gold transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 text-[10px] text-mute/30">
            <p>{d.footerNote}</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-mute/60">Privacy Policy</a>
              <a href="#" className="hover:text-mute/60">Terms</a>
              <a href="#" className="hover:text-mute/60">Accessibility</a>
            </div>
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

