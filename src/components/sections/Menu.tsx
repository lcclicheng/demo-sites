// Section Engine — Menu（theme-agnostic 菜单）
// SectionHeading(eyebrow 'Our Menu') + 分类（标题 + 图标 + 发丝分隔线）+ items 列表。无 menu → null。

import { SectionedData } from './types'
import { SectionHeading, IconByName } from './shared'

export function Menu({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.menu || d.menu.length === 0) return null
  return (
    <section id="menu" className="bg-surface text-ink py-24 px-5">
      <SectionHeading
        eyebrow="Our Menu"
        title={d.menuIntroTitle || 'Handcrafted Daily'}
        lead={d.menuIntroText}
      />
      <div className="max-w-3xl mx-auto space-y-16">
        {d.menu.map((cat, ci) => (
          <div key={ci}>
            <div className="flex items-center gap-3 mb-6">
              {cat.icon && (
                <span className="text-accent">
                  <IconByName name={cat.icon} className="w-6 h-6" />
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{cat.title}</h3>
            </div>
            <div className="border-t border-ink/10" />
            <ul className="mt-6 space-y-6">
              {cat.items.map((item, ii) => (
                <li key={ii} className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{item.name}</p>
                    {item.desc && (
                      <p className="text-sm text-ink/50 mt-1 max-w-md leading-relaxed">{item.desc}</p>
                    )}
                    {item.pair && (
                      <p className="text-xs text-ink/40 mt-1.5 uppercase tracking-wide">{item.pair}</p>
                    )}
                  </div>
                  {item.price && (
                    <p className="text-ink font-medium whitespace-nowrap">{item.price}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
