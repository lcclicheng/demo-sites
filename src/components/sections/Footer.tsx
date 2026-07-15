// Section Engine — Footer（theme-agnostic 页脚）
// bg-ink text-surface：品牌名 + tagline + 社交图标 + quickLinks + 版权 + 4 个 hash 路由链接。

import { SectionedData } from './types'
import { IconByName } from './shared'

export function Footer({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  const f = d.footer || {}
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink text-surface py-16 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl font-bold">{d.name}</p>
          {d.tagline && (
            <p className="text-surface/60 mt-3 text-sm leading-relaxed max-w-xs">{d.tagline}</p>
          )}
          {f.note && <p className="text-surface/40 mt-3 text-xs leading-relaxed max-w-xs">{f.note}</p>}
        </div>
        <div>
          <p className="text-surface/50 text-sm uppercase tracking-[0.2em] mb-4">Explore</p>
          {f.quickLinks && f.quickLinks.length > 0 && (
            <ul className="space-y-2">
              {f.quickLinks.map((l, i) => (
                <li key={i}>
                  <a
                    href={`#${l}`}
                    className="text-surface/70 hover:text-accent transition-colors text-sm"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-surface/50 text-sm uppercase tracking-[0.2em] mb-4">Social</p>
          <div className="flex gap-4">
            {d.instagram && (
              <a
                href={d.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-surface/70 hover:text-accent transition-colors"
              >
                <IconByName name="Instagram" className="w-5 h-5" />
              </a>
            )}
            {d.facebook && (
              <a
                href={d.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-surface/70 hover:text-accent transition-colors"
              >
                <IconByName name="Facebook" className="w-5 h-5" />
              </a>
            )}
            {d.twitter && (
              <a
                href={d.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-surface/70 hover:text-accent transition-colors"
              >
                <IconByName name="Twitter" className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-surface/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface/50">
        <p>© {year} {d.name}</p>
        <div className="flex flex-wrap gap-5">
          <a href="#privacy" className="hover:text-accent transition-colors">Privacy</a>
          <a href="#contract" className="hover:text-accent transition-colors">Contract</a>
          <a href="#invoice" className="hover:text-accent transition-colors">Invoice</a>
          <a href="#address-info" className="hover:text-accent transition-colors">Registered Office</a>
        </div>
      </div>
    </footer>
  )
}
