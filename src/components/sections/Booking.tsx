// Section Engine — Booking（theme-agnostic 预订表单）
// mailto 提交；提交后显示 Confirmed。无 data.email → null（预订无意义）。

import { useState, FormEvent } from 'react'
import { SectionedData } from './types'
import { SectionHeading } from './shared'

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-ink/[0.03] border border-ink/10 text-ink placeholder:text-ink/40 focus:border-accent/40 focus:outline-none transition-colors'

export function Booking({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.email) return null
  const b = d.booking || {}
  const [form, setForm] = useState<Record<string, string>>({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    message: '',
  })
  const [done, setDone] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const lines = Object.entries(form)
      .filter(([, v]) => v && String(v).trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    window.location.href = `mailto:${d.email}?subject=${encodeURIComponent(
      'Reservation — ' + (form.name || d.name)
    )}&body=${encodeURIComponent(lines)}`
    setDone(true)
  }

  return (
    <section id="booking" className="bg-surface text-ink py-24 px-5">
      <SectionHeading eyebrow="Reserve" title={b.intro ? 'Book Your Table' : 'Reserve'} lead={b.intro} />
      <div className="max-w-xl mx-auto">
        {b.note && <p className="text-center text-ink/50 text-sm mb-8">{b.note}</p>}
        {done ? (
          <p className="text-center text-accent font-medium py-10">
            Confirmed — your email client has opened with the details.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Name"
                className={inputCls}
              />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="Email"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={inputCls}
              />
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
                className={inputCls}
              />
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => set('guests', e.target.value)}
                className={inputCls}
              />
            </div>
            {b.occasionOptions && b.occasionOptions.length > 0 && (
              <select
                value={form.occasion}
                onChange={(e) => set('occasion', e.target.value)}
                className={inputCls}
              >
                <option value="">Occasion (optional)</option>
                {b.occasionOptions.map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="Message (optional)"
              className={inputCls}
            />
            <button
              type="submit"
              className="w-full px-8 py-3.5 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-all"
            >
              Request Reservation
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
