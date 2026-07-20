// Section Engine — Gallery（theme-agnostic 相册）
// grid 卡片：有 image 则 <img>，否则 gradient 背景 + IconByName + title。无 gallery → null。

import { motion } from 'framer-motion'
import { IconByName } from './shared'

export function Gallery({ data }: { data: any; accent?: string }) {
  const d = data
  // 统一字段：优先 screenshots（generate.mjs 的 og:image 也认它），回退 gallery
  const items = d.screenshots || d.gallery
  if (!items || items.length === 0) return null
  return (
    <section id="gallery" className="bg-surface text-ink py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title || 'Gallery'}
                  className="w-full h-56 object-cover rounded-2xl"
                />
              ) : (
                <div
                  className={`w-full h-56 rounded-2xl flex flex-col items-center justify-center gap-3 ${
                    item.gradient || 'bg-gradient-to-br from-accent/20 to-accent/5'
                  }`}
                >
                  {item.icon && <IconByName name={item.icon} className="w-8 h-8 text-accent" />}
                  {item.title && <p className="font-display text-lg font-semibold text-ink">{item.title}</p>}
                  {item.sub && <p className="text-sm text-ink/50">{item.sub}</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
