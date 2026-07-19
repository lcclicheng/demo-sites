// Section Engine — 共享 subcomponent
// theme-agnostic：所有强调色用 Tailwind 的 `text-accent` / `bg-accent/*` / `border-accent/*`，
// 背景前景用 `bg-surface` / `text-ink`。accent / surface / ink 由 sectioned 模板的 twConfig 定义，
// 可通过 THEMES 机制逐站覆盖（与现有 8 套模板的调色方式一致）。

import { Star, ArrowRight, Sparkles } from 'lucide-react'
import * as Icons from 'lucide-react'

export function CtaButtons({
  c1,
  c2,
  cta = 'fill',
}: {
  c1?: { text: string; href: string }
  c2?: { text: string; href: string }
  cta?: 'fill' | 'outline' | 'ghost'
}) {
  if (!c1 && !c2) return null
  // mood.cta 驱动 CTA 形态（theme-agnostic：只用 accent / ink token）
  const c1cls =
    cta === 'ghost'
      ? 'text-accent font-medium hover:underline underline-offset-4 decoration-2 transition-all flex items-center gap-2'
      : cta === 'outline'
      ? 'px-8 py-3.5 rounded-full border-2 border-accent text-accent text-sm font-medium hover:bg-accent/10 transition-all flex items-center gap-2'
      : 'px-8 py-3.5 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2'
  const c2cls =
    cta === 'ghost'
      ? 'text-ink/55 hover:text-ink text-sm font-medium transition-colors'
      : 'px-8 py-3.5 rounded-full border-2 border-ink/15 text-ink text-sm font-medium hover:border-accent/40 transition-colors'
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {c1 && (
        <a href={c1.href} className={c1cls}>
          {c1.text}
          {cta !== 'ghost' && <ArrowRight className="w-4 h-4" />}
        </a>
      )}
      {c2 && (
        <a href={c2.href} className={c2cls}>
          {c2.text}
        </a>
      )}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string
  title: string
  lead?: string
}) {
  return (
    <div className="text-center mb-14 max-w-2xl mx-auto px-5">
      {eyebrow && (
        <p className="text-accent text-sm tracking-[0.25em] uppercase font-semibold mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-ink">{title}</h2>
      {lead && <p className="text-ink/50 leading-relaxed">{lead}</p>}
      <div className="w-16 h-px bg-accent/40 mx-auto mt-6" />
    </div>
  )
}

export function StarRating({ rating = 5 }: { rating?: number }) {
  const n = Math.max(0, Math.min(5, rating || 0))
  if (n === 0) return null
  return (
    <div className="flex gap-0.5 text-accent">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-4 h-4" style={{ fill: 'currentColor' }} />
      ))}
    </div>
  )
}

export function IconByName({ name, className = 'w-6 h-6' }: { name?: string; className?: string }) {
  const key = (name || 'Sparkles') as keyof typeof Icons
  const Cmp = (Icons[key] as React.FC<{ className?: string }>) || Sparkles
  return <Cmp className={className} />
}
