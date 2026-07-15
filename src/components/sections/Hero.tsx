// Section Engine — Hero（theme-agnostic 示范组件）
// 装饰层用 `text-accent` 包裹 HeroBackdrop，使 currentColor 跟随主题强调色；
// 标题/副标题/CTA/指标条全部从 SectionedData 取，缺则优雅降级。

import { motion } from 'framer-motion'
import { HeroBackdrop, GradientText, StatsStrip } from '../visual'
import { SectionedData } from './types'
import { CtaButtons } from './shared'

export function Hero({
  data,
}: {
  data: SectionedData
  accent?: string
}) {
  const d = data
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
