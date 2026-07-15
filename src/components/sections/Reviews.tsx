// Section Engine — Reviews（theme-agnostic 评价）
// SectionHeading('Reviews') + 卡片 grid，每张 StarRating + 斜体 text + name。无 reviews → null。

import { motion } from 'framer-motion'
import { SectionedData } from './types'
import { SectionHeading, StarRating } from './shared'

export function Reviews({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.reviews || d.reviews.length === 0) return null
  return (
    <section id="reviews" className="bg-surface text-ink py-24 px-5">
      <SectionHeading eyebrow="Reviews" title="What Our Guests Say" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {d.reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
            className="border border-ink/10 rounded-2xl p-8 bg-ink/[0.02]"
          >
            <StarRating rating={r.rating} />
            <p className="italic text-ink/70 leading-relaxed mt-4">“{r.text}”</p>
            <p className="mt-5 text-sm font-medium text-ink">{r.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
