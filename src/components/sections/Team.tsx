// Section Engine — Team（theme-agnostic 团队）
// 方形头像（image 或 initials 方块，非圆），name + role(text-accent) + bio(text-ink/60)。无 team → null。

import { motion } from 'framer-motion'
import { SectionedData } from './types'
import { SectionHeading } from './shared'

export function Team({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.team || d.team.length === 0) return null
  return (
    <section id="team" className="bg-surface text-ink py-24 px-5">
      <SectionHeading eyebrow="Our Team" title="The Hands Behind It" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {d.team.map((m, i) => {
          const initials =
            m.initials ||
            m.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden border border-accent/20 bg-accent/10 flex items-center justify-center mb-4">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-2xl font-bold text-accent">{initials}</span>
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-ink">{m.name}</h3>
              {m.role && <p className="text-sm text-accent mt-1">{m.role}</p>}
              {m.bio && (
                <p className="text-sm text-ink/60 mt-3 leading-relaxed max-w-xs mx-auto">{m.bio}</p>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
