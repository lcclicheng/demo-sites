// Section Engine — Location（theme-agnostic 位置/联系）
// 三栏：地址、电话/邮箱链接（hover text-accent）、营业时间。无任何联系信息 → null。

import { SectionedData } from './types'
import { SectionHeading } from './shared'

export function Location({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  const h = d.hoursDetail
  const hasContact = !!(d.street || d.location || d.phone || d.email || h)
  if (!hasContact) return null
  return (
    <section id="location" className="bg-surface text-ink py-24 px-5">
      <SectionHeading eyebrow="Find Us" title="Visit The Space" />
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="text-accent text-sm uppercase tracking-[0.2em] font-semibold mb-3">Address</p>
          {d.street && <p className="text-ink">{d.street}</p>}
          {d.location && <p className="text-ink/60 mt-1">{d.location}</p>}
        </div>
        <div>
          <p className="text-accent text-sm uppercase tracking-[0.2em] font-semibold mb-3">Contact</p>
          {d.phone && (
            <a href={`tel:${d.phone}`} className="block text-ink hover:text-accent transition-colors">
              {d.phone}
            </a>
          )}
          {d.email && (
            <a
              href={`mailto:${d.email}`}
              className="block text-ink/60 hover:text-accent transition-colors mt-1"
            >
              {d.email}
            </a>
          )}
        </div>
        {h && (
          <div>
            <p className="text-accent text-sm uppercase tracking-[0.2em] font-semibold mb-3">Hours</p>
            {h.wedFri && <p className="text-ink/60">Wed–Fri · {h.wedFri}</p>}
            {h.saturday && <p className="text-ink/60 mt-1">Sat · {h.saturday}</p>}
            {h.sunday && <p className="text-ink/60 mt-1">Sun · {h.sunday}</p>}
            {h.closedDays && <p className="text-ink/40 mt-1">{h.closedDays}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
