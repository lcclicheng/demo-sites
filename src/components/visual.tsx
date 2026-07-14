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

/* ── Hero backdrop: ambient glow + optional breathing ring + drifting particles ──
   Sits absolutely behind hero content. Purely decorative (aria-hidden). */
export function HeroBackdrop({
  breathe = true,
  particles = true,
  variant = 'default',
}: {
  breathe?: boolean
  particles?: boolean
  variant?: 'default' | 'grid'
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Ambient glow blobs — tinted with currentColor, faded via opacity */}
      <div
        className="absolute top-[22%] left-[22%] w-[30rem] h-[30rem] rounded-full blur-[150px] shimmer-soft"
        style={{ background: 'currentColor', opacity: 0.05 }}
      />
      <div
        className="absolute bottom-[28%] right-[22%] w-80 h-80 rounded-full blur-[120px] shimmer-soft"
        style={{ background: 'currentColor', opacity: 0.04, animationDelay: '1.5s' }}
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
