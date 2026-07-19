// Shared visual-technique components — extracted from the 20 legacy standalone
// site folders (premium-* series, bento-dashboard, vanguard-landing, coffee-template…)
// and consolidated into ONE reusable system for all 8 industry templates.
//
// DESIGN RULE: every component is theme-agnostic. It uses `currentColor` + opacity /
// `color-mix()` so the same markup looks right on BOTH the dark gold restaurant theme
// and the light cream coffee theme — the tint follows whatever text colour the host
// section already uses. No hard-coded brand colours live here.
//
// The matching keyframes / utility classes live in `VISUAL_CSS` (injected by
// generate.mjs into every template's index.css), so nothing here depends on a
// specific template's Tailwind config.

import { ReactNode } from 'react'
import { Star } from 'lucide-react'

/* ── Mood system (v0.10): per-site aesthetic deepening ──
   Each site opts into a `mood` object in its example JSON:
     { deco: 'minimal'|'balanced'|'rich',   // ambient decoration density
       hero: 'center'|'asym'|'split',        // hero composition (sectioned only)
       sig:  'on'|'off',                      // signature divider on/off
       cta:  'fill'|'outline'|'ghost' }       // CTA treatment
   `getMood()` merges with a safe default so a missing field never breaks render.
   Everything stays theme-agnostic — the mood only modulates density / composition,
   never hard-codes a colour. */
export type MoodDeco = 'minimal' | 'balanced' | 'rich'
export type Mood = {
  deco: MoodDeco
  hero: 'center' | 'asym' | 'split'
  sig: 'on' | 'off'
  cta: 'fill' | 'outline' | 'ghost'
}
// 默认 sig:'off' —— 仅显式 sig:'on' 的站（Day1-4 外联 20 站）才加 Hero 底部第二招牌分隔条，
// 其余站（含非 Day1-4 的 sectioned 站）视觉保持与改动前完全一致。deco/hero/cta 默认亦等于历史外观。
const DEFAULT_MOOD: Mood = { deco: 'balanced', hero: 'center', sig: 'off', cta: 'fill' }
export function getMood(d: any): Mood {
  const m = (d && d.mood) || {}
  return {
    deco: (m.deco as MoodDeco) || DEFAULT_MOOD.deco,
    hero: (m.hero as Mood['hero']) || DEFAULT_MOOD.hero,
    sig: (m.sig as Mood['sig']) || DEFAULT_MOOD.sig,
    cta: (m.cta as Mood['cta']) || DEFAULT_MOOD.cta,
  }
}

/* ── Hero backdrop: ambient glow + optional breathing ring + drifting particles ──
   Sits absolutely behind hero content. Purely decorative (aria-hidden).
   `mood` (deco preset) modulates glow / watermark / particle density via the
   `deco-*` class on the wrapper — see VISUAL_CSS for the theme-agnostic rules. */
export function HeroBackdrop({
  breathe = true,
  particles = true,
  variant = 'default',
  signature,
  mood,
}: {
  breathe?: boolean
  particles?: boolean
  variant?: 'default' | 'grid'
  signature?: string
  mood?: MoodDeco
}) {
  const decoClass = mood ? `deco-${mood}` : ''
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${decoClass}`} aria-hidden>
      {/* Ambient glow blobs — tinted with currentColor; opacity moved to the
          `.glow-blob` class so the mood preset can modulate it (VISUAL_CSS). */}
      <div
        className="glow-blob absolute top-[22%] left-[22%] w-[30rem] h-[30rem] rounded-full blur-[150px] shimmer-soft"
        style={{ background: 'currentColor' }}
      />
      <div
        className="glow-blob glow-blob--2 absolute bottom-[28%] right-[22%] w-80 h-80 rounded-full blur-[120px] shimmer-soft"
        style={{ background: 'currentColor' }}
      />

      {/* Breathing ring — slow scale pulse, very zen (from premium-yoga) */}
      {breathe && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="breathe-ring" />
          <div className="breathe-ring delay" />
        </div>
      )}

      {/* Drifting particles (premium-restaurant) OR architectural bento grid (bento-dashboard) */}
      {variant === 'grid' ? (
        <div className="bento-grid" aria-hidden />
      ) : (
        particles && (
          <div className="particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="particle" />
            ))}
          </div>
        )
      )}

      {/* Signature watermark — faint motif tinted with currentColor (theme-agnostic) */}
      {signature && (
        <div className="sig-watermark" aria-hidden>
          <SignatureMotif kind={signature} className="sig-wm-motif" />
        </div>
      )}
    </div>
  )
}

/* ── Stats / rating strip: hero metrics row (from coffee-template / salon-template) ──
   Renders `stats` (array of {val,label,stars?}). Falls back gracefully if empty. */
export function StatsStrip({
  stats,
}: {
  stats: Array<{ val: string; label: string; stars?: boolean }>
}) {
  if (!stats || stats.length === 0) return null
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 pt-8"
      style={{ borderTop: '1px solid color-mix(in srgb, currentColor 10%, transparent)' }}
    >
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <div className="flex items-center justify-center gap-1">
            {s.stars && <Star className="w-4 h-4" style={{ fill: 'currentColor' }} />}
            <span className="font-display text-2xl font-bold tabular-nums">{s.val}</span>
          </div>
          <p
            className="text-[10px] tracking-[0.2em] uppercase mt-1"
            style={{ opacity: 0.6 }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ── Gradient / shimmer text (from bento-dashboard) ──
   Wrap any heading fragment to give it a flowing metallic sheen. */
export function GradientText({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={`gradient-text ${className}`}>{children}</span>
}

/* ── Glass card: frosted panel (from bento-dashboard / premium-dessert) ──
   Theme-adaptive border + tint via currentColor. Use for feature / trust blocks. */
export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`glass-card rounded-2xl p-7 ${className}`}>{children}</div>
}

/* ── Confetti dotted backdrop: subtle dotted texture (from premium-dessert) ──
   Place as an absolutely-positioned layer inside a `relative` section. */
export function ConfettiBg({ className = '' }: { className?: string }) {
  return <div className={`confetti-dots absolute inset-0 pointer-events-none ${className}`} aria-hidden />
}

/* ── Section eyebrow: small uppercase kicker used before headings ──
   Keeps the "label · label" micro-typography consistent across templates. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold ${className}`}
      style={{ opacity: 0.7 }}
    >
      {children}
    </p>
  )
}

/* ── Square monogram: editorial initials tile (from premium-law) ──
   Square (not round) tile tinted with currentColor + initials. Reads high-end /
   editorial vs the generic round avatar. Theme-adaptive via currentColor. */
export function SquareMonogram({
  initials,
  className = '',
}: {
  initials: string
  className?: string
}) {
  return (
    <div
      className={`square-monogram font-display ${className}`}
      style={{
        width: '5rem',
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.25rem',
        background: 'color-mix(in srgb, currentColor 9%, transparent)',
        border: '1px solid color-mix(in srgb, currentColor 22%, transparent)',
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '0.02em',
      }}
      aria-hidden
    >
      {initials}
    </div>
  )
}

/* ── Signature motif: the page's "招牌" (signature mark) ──
   ONE reusable, theme-agnostic component. `kind` selects a business-type motif,
   all drawn with `currentColor` + subtle CSS keyframes (defined in VISUAL_CSS,
   injected by generate.mjs). No hard-coded colours — the mark follows the host
   section's text colour (accent for heroes, ink elsewhere).
   `deriveSignature(data)` maps a site to its motif automatically; an explicit
   `data.signature` field overrides the guess. */

const MOTIFS: Record<string, JSX.Element> = {
  // coffee / tea — rising steam over a cup
  brew: (
    <g>
      <g className="sig-float" style={{ transformOrigin: 'center' }}>
        <path d="M40 80 q-9 11 -9 22 a19 19 0 0 0 38 0 q0 -11 -9 -22" fill="none" />
        <path d="M85 86 q11 0 11 -11 q0 -11 -11 -11" fill="none" />
      </g>
      <g className="sig-steam" fill="none" strokeWidth={4} opacity={0.85} style={{ transformOrigin: 'center' }}>
        <path d="M48 60 q6 -11 0 -22 q-6 -11 0 -22" />
        <path d="M60 60 q6 -11 0 -22 q-6 -11 0 -22" />
        <path d="M72 60 q6 -11 0 -22 q-6 -11 0 -22" />
      </g>
    </g>
  ),
  // yoga / wellness — breathing concentric rings
  breath: (
    <g className="sig-breathe" fill="none" style={{ transformOrigin: 'center' }}>
      <circle cx="60" cy="60" r="46" />
      <circle cx="60" cy="60" r="32" opacity={0.7} />
      <circle cx="60" cy="60" r="18" opacity={0.5} />
      <circle cx="60" cy="60" r="5" fill="currentColor" stroke="none" />
    </g>
  ),
  // law / luxury — editorial seal (ring + square + tick)
  monogram: (
    <g fill="none">
      <circle cx="60" cy="60" r="44" />
      <rect x="38" y="38" width="44" height="44" rx="6" />
      <path d="M48 60 l8 8 l16 -18" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  // dessert / sweets — scattered confetti + a sparkle
  confetti: (
    <g className="sig-twinkle" fill="currentColor" stroke="none">
      <circle cx="36" cy="40" r="4" />
      <circle cx="84" cy="34" r="3" />
      <circle cx="60" cy="24" r="3" />
      <circle cx="30" cy="70" r="3" />
      <circle cx="90" cy="64" r="4" />
      <circle cx="72" cy="86" r="3" />
      <circle cx="46" cy="88" r="3" />
      <circle cx="60" cy="60" r="5" opacity={0.7} />
      <path d="M84 78 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" opacity={0.85} />
    </g>
  ),
  // restaurant / food — plate seen from above
  plate: (
    <g className="sig-spin" fill="none" style={{ transformOrigin: 'center' }}>
      <circle cx="60" cy="60" r="46" />
      <circle cx="60" cy="60" r="34" opacity={0.6} />
      <circle cx="60" cy="60" r="10" fill="currentColor" stroke="none" />
    </g>
  ),
  // salon / beauty — mirror disc with a sweeping shine
  sheen: (
    <g fill="none">
      <circle cx="60" cy="60" r="42" />
      <g className="sig-sweep" strokeWidth={6}>
        <path d="M40 86 L86 40" opacity={0.85} />
      </g>
    </g>
  ),
  // trades / industrial — anvil + rising sparks
  forge: (
    <g>
      <g fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 44 h46 a8 8 0 0 1 8 8 h-13 l-6 11 h-19 l-4 -11 h-13 a8 8 0 0 1 8 -8 z" />
        <path d="M39 63 v22 M77 63 v22 M39 85 h38" />
      </g>
      <g className="sig-rise" fill="currentColor" stroke="none">
        <circle cx="58" cy="30" r="3" />
        <circle cx="67" cy="22" r="2" />
        <circle cx="49" cy="24" r="2" />
      </g>
    </g>
  ),
  // hotel / architecture — 3×3 grid
  grid: (
    <g className="sig-spin-slow" fill="none" strokeWidth={3} style={{ transformOrigin: 'center' }}>
      {[18, 51, 84].map((y) =>
        [18, 51, 84].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width={24} height={24} rx={3} />)
      )}
    </g>
  ),
  // fitness / health — ECG pulse line
  pulse: (
    <g className="sig-draw" fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 60 h20 l8 -24 l11 46 l10 -46 l8 24 h23" />
    </g>
  ),
  // florist / nature — bloom (six petals)
  bloom: (
    <g className="sig-bloom" fill="currentColor" stroke="none" style={{ transformOrigin: 'center' }}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="60" cy="32" rx="9" ry="17" opacity={0.85} transform={`rotate(${a} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="10" />
    </g>
  ),
  // photography — lens aperture
  aperture: (
    <g className="sig-spin" fill="none" style={{ transformOrigin: 'center' }}>
      <circle cx="60" cy="60" r="44" />
      <path d="M60 16 L96 38 L96 82 L60 104 L24 82 L24 38 Z" />
      <g opacity={0.5}>
        <path d="M60 60 L60 16 M60 60 L96 38 M60 60 L96 82 M60 60 L60 104 M60 60 L24 82 M60 60 L24 38" />
      </g>
    </g>
  ),
  // pet — paw print
  paw: (
    <g fill="currentColor" stroke="none">
      <ellipse cx="60" cy="74" rx="21" ry="17" />
      <circle cx="40" cy="48" r="7" />
      <circle cx="56" cy="40" r="7.5" />
      <circle cx="72" cy="42" r="7" />
      <circle cx="86" cy="52" r="6" />
    </g>
  ),
  // books — open book
  page: (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 32 C44 24 26 24 18 30 v52 c8 -6 26 -6 42 2" />
      <path d="M60 32 C76 24 94 24 102 30 v52 c-8 -6 -26 -6 -42 2" />
      <path d="M60 32 v54" opacity={0.6} />
    </g>
  ),
  // estate agent — key
  key: (
    <g fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="42" cy="42" r="16" />
      <path d="M54 54 L92 92 M82 82 l9 -9 M72 72 l8 -8" />
    </g>
  ),
  // accountants — bar chart
  ledger: (
    <g stroke="none">
      <rect x="30" y="64" width="16" height="32" rx="2" fill="currentColor" />
      <rect x="52" y="44" width="16" height="52" rx="2" fill="currentColor" opacity={0.82} />
      <rect x="74" y="54" width="16" height="42" rx="2" fill="currentColor" opacity={0.62} />
      <path d="M22 98 h76" stroke="currentColor" strokeWidth={4} fill="none" />
    </g>
  ),
  // dentist — smile + sparkle
  smile: (
    <g fill="none" strokeWidth={5} strokeLinecap="round">
      <path d="M34 56 q26 30 52 0" />
      <path d="M82 34 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3 z" className="sig-twinkle" fill="currentColor" stroke="none" />
    </g>
  ),
  // barber — barber-pole disc
  razor: (
    <g className="sig-spin" fill="none" style={{ transformOrigin: 'center' }}>
      <circle cx="60" cy="60" r="42" />
      <g opacity={0.5} strokeWidth={5}>
        <path d="M30 44 L90 64 M28 60 L88 80 M44 28 L64 88" />
      </g>
    </g>
  ),
}

export function SignatureMotif({ kind, className = '' }: { kind: string; className?: string }) {
  const inner = MOTIFS[kind] || MOTIFS.monogram
  return (
    <svg
      viewBox="0 0 120 120"
      className={`sig-motif ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {inner}
    </svg>
  )
}

/* Focal signature mark — drop into a hero (wrapped in `text-accent` so the
   motif picks up the theme accent). Sized by the caller via Tailwind classes. */
export function SignatureMark({ kind, className = '' }: { kind: string; className?: string }) {
  if (!kind || !MOTIFS[kind]) return null
  return (
    <span className={`sig-mark inline-flex ${className}`} aria-hidden>
      <SignatureMotif kind={kind} />
    </span>
  )
}

/* Map a site's data to a signature kind. Honours an explicit `signature`
   field; otherwise guesses from name / subtitle / category keywords. */
export function deriveSignature(d: any): string {
  if (d && d.signature && MOTIFS[d.signature]) return d.signature
  const t = `${d?.name || ''} ${d?.subtitle || ''} ${d?.category || ''}`.toLowerCase()
  const rules: Array<[RegExp, string]> = [
    [/yoga|meditat|wellness|pilates/, 'breath'],
    [/pet|dog|cat|paw|groom|hound/, 'paw'],
    [/law|solicitor|legal|notary/, 'monogram'],
    [/dessert|patisserie|pâtisserie|cake|chocolat|macaron|sweet|bakery|pastr|bake/, 'confetti'],
    [/coffee|espresso|café|cafe|brew|roastery|flat white/, 'brew'],
    [/restaurant|trattoria|pizza|kitchen|dining|food|bistro|brasserie/, 'plate'],
    [/salon|beauty|nail|hair|spa/, 'sheen'],
    [/barber|shave|razor/, 'razor'],
    [/trades|plumb|heating|gas|electric|landscap|garden|handyman|builder|hardware/, 'forge'],
    [/hotel|inn|guest|stay|cove|lodg|suites|clifftop/, 'grid'],
    [/fitness|gym|strong|crossfit|train/, 'pulse'],
    [/florist|flower|bloom|petal/, 'bloom'],
    [/photograph|photo| cinemat|film studio/, 'aperture'],
    [/book|library|press/, 'page'],
    [/estate|property|letting|realtor|housing/, 'key'],
    [/account|bookkeep|tax|finance|audit/, 'ledger'],
    [/dentist|dental|orthodont|smile/, 'smile'],
  ]
  for (const [re, k] of rules) if (re.test(t)) return k
  return 'monogram'
}

/* Signature divider — a second "招牌" landing point per site.
   A thin editorial rule flanked by the business-type motif, used to close the
   hero (or separate chapters). Theme-agnostic: motif follows currentColor. */
export function SignatureDivider({ kind, className = '' }: { kind: string; className?: string }) {
  const k = MOTIFS[kind] ? kind : 'monogram'
  return (
    <div className={`sig-divider ${className}`} aria-hidden>
      <SignatureMotif kind={k} />
    </div>
  )
}
