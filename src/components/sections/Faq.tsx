// Section Engine — Faq（theme-agnostic 问答手风琴）
// useState 控制展开；发丝分隔线分隔。无 faqs → null。

import { useState } from 'react'
import { SectionedData } from './types'
import { SectionHeading } from './shared'

export function Faq({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.faqs || d.faqs.length === 0) return null
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="bg-surface text-ink py-24 px-5">
      <SectionHeading eyebrow="FAQ" title="Questions, Answered" />
      <div className="max-w-2xl mx-auto">
        {d.faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-t border-ink/10">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium text-ink">{f.q}</span>
                <span className="text-accent text-xl leading-none">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <p className="pb-5 text-ink/60 leading-relaxed -mt-2">{f.a}</p>}
            </div>
          )
        })}
        <div className="border-t border-ink/10" />
      </div>
    </section>
  )
}
