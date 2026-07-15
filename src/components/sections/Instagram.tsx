// Section Engine — Instagram（theme-agnostic 社媒关注）
// 大号关注按钮（IconByName('Instagram') + handle），链接到 data.instagram。无 instagram → null。

import { SectionedData } from './types'
import { SectionHeading, IconByName } from './shared'

export function Instagram({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.instagram) return null
  const handle = d.instagram
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/\/$/, '')
  return (
    <section id="instagram" className="bg-surface text-ink py-24 px-5">
      <SectionHeading eyebrow="Follow Us" title="On The Gram" />
      <div className="flex justify-center">
        <a
          href={d.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-ink/15 hover:border-accent/40 text-ink transition-colors"
        >
          <span className="text-accent">
            <IconByName name="Instagram" className="w-6 h-6" />
          </span>
          <span className="font-display text-lg font-semibold">@{handle}</span>
        </a>
      </div>
    </section>
  )
}
