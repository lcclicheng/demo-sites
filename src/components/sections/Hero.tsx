// Section Engine — Hero（theme-agnostic 示范组件）
// 装饰层用 `text-accent` 包裹 HeroBackdrop，使 currentColor 跟随主题强调色；
// 标题/副标题/CTA/指标条全部从 SectionedData 取，缺则优雅降级。
// v0.10：接入 `mood` 系统 —— hero 构图(center/asym/split) + 第二招牌分隔条 + CTA 形态，
// 全部由 example JSON 的 `mood` 字段驱动，不硬编码任何颜色。

import { motion } from 'framer-motion'
import { HeroBackdrop, GradientText, StatsStrip, GlassCard, SignatureMark, deriveSignature, getMood, SignatureDivider } from '../visual'
import { SectionedData } from './types'
import { CtaButtons } from './shared'

/* Per-industry hero "register" — the motionsites-inspired differentiation.
   Each business type gets an ambient backdrop matching its emotional register,
   using ONLY the existing HeroBackdrop toolkit (no video / no new engine):
     - structural (law / account / estate / hotel / trades) -> architectural grid,
       no floaty particles / breathing ring (clean, editorial)
     - organic (wellness / beauty / food / florist / dentist / coffee / pet / photo / books)
       and neutral (restaurant / barber / fitness) -> glow + breathing ring + particles
   `d.mood?.backdrop === 'grid'` forces the structural grid for any site. */
function deriveBackdrop(sig: string, override?: string) {
  const structural = ['monogram', 'ledger', 'key', 'grid', 'forge']
  const variant: 'default' | 'grid' = override === 'grid' || structural.includes(sig) ? 'grid' : 'default'
  const breathe = !structural.includes(sig)
  const particles = !structural.includes(sig)
  return { variant, breathe, particles }
}

export function Hero({
  data,
}: {
  data: SectionedData
  accent?: string
}) {
  const d = data
  const mood = getMood(d)

  // hero 构图：显式 mood.hero 优先；否则 designVariant:'B' 退化为 asym（向后兼容 morris-coffee）。
  const layout: 'center' | 'asym' | 'split' =
    mood.hero !== 'center' ? mood.hero : (d as any).designVariant === 'B' ? 'asym' : 'center'

  const sig = deriveSignature(d)
  const bd = deriveBackdrop(sig, (d as any).mood?.backdrop)
  const divider = mood.sig === 'on' && (
    <SignatureDivider kind={sig} className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full" />
  )

  // ── asym: 左文案 + 右玻璃指标卡（原 designVariant B 先例） ──
  if (layout === 'asym') {
    return (
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-surface text-ink">
        <div className="text-accent" aria-hidden>
          <HeroBackdrop variant={bd.variant} breathe={bd.breathe} particles={false} mood={mood.deco} signature={sig} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full mt-16 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <SignatureMark kind={sig} className="w-16 h-16 text-accent mb-6 mood-reveal" />
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
            <CtaButtons c1={d.heroCta1} c2={d.heroCta2} cta={mood.cta} />
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
        {divider}
      </section>
    )
  }

  // ── split: 编辑型两栏 —— 左招牌+标题（左对齐），右导语+CTA+指标 ──
  if (layout === 'split') {
    return (
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-surface text-ink">
        <div className="text-accent" aria-hidden>
          <HeroBackdrop variant={bd.variant} breathe={bd.breathe} particles={bd.particles} mood={mood.deco} signature={sig} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full mt-16 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 text-left"
          >
            <SignatureMark kind={sig} className="w-16 h-16 text-accent mb-6 mood-reveal" />
            {d.heroBadge && (
              <p className="text-accent text-sm tracking-[0.25em] uppercase font-medium mb-5">{d.heroBadge}</p>
            )}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 text-left">
              {d.heroLine1 || d.name}
              {d.heroLine2 && (
                <>
                  <br />
                  <GradientText className="text-accent/90">{d.heroLine2}</GradientText>
                </>
              )}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 text-left"
          >
            {d.tagline && (
              <p className="text-lg sm:text-xl text-ink/60 leading-relaxed mb-8">{d.tagline}</p>
            )}
            <CtaButtons c1={d.heroCta1} c2={d.heroCta2} cta={mood.cta} />
            {d.heroStats && d.heroStats.length > 0 && <StatsStrip stats={d.heroStats} />}
          </motion.div>
        </div>
        {divider}
      </section>
    )
  }

  // ── center: 默认居中构图 ──
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface text-ink">
      {/* 装饰层：currentColor = accent，跟随主题 */}
      <div className="text-accent" aria-hidden>
        <HeroBackdrop mood={mood.deco} signature={sig} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-5 mt-16 max-w-4xl"
      >
        <SignatureMark kind={sig} className="w-16 h-16 mx-auto text-accent mb-6 mood-reveal" />
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
        <CtaButtons c1={d.heroCta1} c2={d.heroCta2} cta={mood.cta} />
        {d.heroStats && d.heroStats.length > 0 && <StatsStrip stats={d.heroStats} />}
      </motion.div>
      {divider}
    </section>
  )
}
