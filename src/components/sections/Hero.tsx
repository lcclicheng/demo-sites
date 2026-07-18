// Section Engine — Hero（theme-agnostic 示范组件）
// 装饰层用 `text-accent` 包裹 HeroBackdrop，使 currentColor 跟随主题强调色；
// 标题/副标题/CTA/指标条全部从 SectionedData 取，缺则优雅降级。

import { motion } from 'framer-motion'
import { HeroBackdrop, GradientText, StatsStrip, GlassCard } from '../visual'
import { SectionedData } from './types'
import { CtaButtons } from './shared'

export function Hero({
  data,
}: {
  data: SectionedData
  accent?: string
}) {
  const d = data

  // Variant B — asymmetric split: left copy + right glass metrics card.
  // Only the site that opts in via designVariant:'B' (e.g. morris-coffee) gets this;
  // all other sectioned sites keep the centered layout below.
  if ((d as any).designVariant === 'B') {
    return (
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden bg-surface text-ink"
      >
        <div className="text-accent" aria-hidden>
          <HeroBackdrop particles={false} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full mt-16 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            {d.heroBadge && (
              <p className="text-accent text-sm tracking-[0.25em] uppercase font-medium mb-5">{d.heroBadge}</p>
            )}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
              {d.heroLine1 || d.name}
              {d.heroLine2 && (
                <>
                  <br />
                  <GradientText className="text-accent/90">{d.heroLine2}</GradientText>
                </>
              )}
            </h1>
            {d.tagline && (
              <p className="text-lg text-ink/60 max-w-xl mb-10 leading-relaxed">{d.tagline}</p>
            )}
            <CtaButtons c1={d.heroCta1} c2={d.heroCta2} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="text-accent">
              <GlassCard className="p-10">
                {d.heroStats && d.heroStats.length > 0 && (
                  <div className="grid grid-cols-1 gap-5">
                    {d.heroStats.map((s: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-baseline justify-between border-b border-ink/10 pb-4 last:border-0 last:pb-0"
                      >
                        <span className="text-xs tracking-[0.2em] uppercase text-ink/50">{s.label}</span>
                        <span className="font-display text-3xl font-bold text-ink">{s.val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface text-ink"
    >
      {/* 装饰层：currentColor = accent，跟随主题 */}
      <div className="text-accent" aria-hidden>
        <HeroBackdrop />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-5 mt-16 max-w-4xl"
      >
        {d.heroBadge && (
          <p className="text-accent text-sm tracking-[0.25em] uppercase font-medium mb-5">{d.heroBadge}</p>
        )}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
          {d.heroLine1 || d.name}
          {d.heroLine2 && (
            <>
              <br />
              <GradientText className="text-accent/90">{d.heroLine2}</GradientText>
            </>
          )}
        </h1>
        {d.tagline && (
          <p className="text-lg sm:text-xl text-ink/60 max-w-xl mx-auto mb-10 leading-relaxed">{d.tagline}</p>
        )}
        <CtaButtons c1={d.heroCta1} c2={d.heroCta2} />
        {d.heroStats && d.heroStats.length > 0 && <StatsStrip stats={d.heroStats} />}
      </motion.div>
    </section>
  )
}
