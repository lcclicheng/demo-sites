// Section Engine — Story（theme-agnostic 品牌故事）
// 两栏：左文（eyebrow + 标题 + 段落 + stats 数值）；右 4 格视觉：3 图 + 1 字母 monogram。
// 无 paragraphs → null。图片不足 3 张时回退到原来的 accent 渐变方块网格。

import { motion } from 'framer-motion'
import { SectionedData } from './types'

function MonogramCard({ name, title }: { name?: string; title?: string }) {
  const initial = (title || name || ' ').trim().charAt(0).toUpperCase()
  return (
    <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center overflow-hidden">
      <span className="font-display text-5xl sm:text-6xl font-bold text-accent/70 leading-none select-none">
        {initial}
      </span>
    </div>
  )
}

function ImageCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-square rounded-2xl overflow-hidden border border-accent/10 shadow-sm">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
        loading="lazy"
      />
    </div>
  )
}

export function Story({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  const story = d.story
  if (!story || !story.paragraphs || story.paragraphs.length === 0) return null

  // 优先用 story.images；否则回退到 screenshots 的 image 字段
  const storyImages: string[] | undefined = story.images?.length
    ? story.images
    : d.screenshots?.map((s: any) => s.image).filter(Boolean)

  const hasImages = storyImages && storyImages.length >= 3

  return (
    <section id="story" className="bg-surface text-ink py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-accent text-sm tracking-[0.25em] uppercase font-semibold mb-3">Our Story</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">{story.title || d.name}</h2>
          {story.subtitle && <p className="text-ink/50 mb-8 text-lg">{story.subtitle}</p>}
          <div className="space-y-5 text-ink/60 leading-relaxed max-w-xl">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {story.stats && story.stats.length > 0 && (
            <div className="flex flex-wrap gap-10 mt-10">
              {story.stats.map((s, i) => (
                <div key={i}>
                  <p className="font-display text-3xl font-bold text-accent">{s.value}</p>
                  <p className="text-sm text-ink/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="text-accent">
          {hasImages ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <ImageCard src={storyImages[0]} alt={story.title || d.name} />
                <ImageCard src={storyImages[1]} alt={story.title || d.name} />
              </div>
              <div className="space-y-4 pt-8">
                <ImageCard src={storyImages[2]} alt={story.title || d.name} />
                <MonogramCard name={d.name} title={story.title} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/25 to-accent/5 border border-accent/20" />
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-accent/10 to-accent/20 border border-accent/10" />
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/10 to-accent/25 border border-accent/10" />
                <div className="aspect-square rounded-2xl bg-gradient-to-tl from-accent/20 to-accent/5 border border-accent/20" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
