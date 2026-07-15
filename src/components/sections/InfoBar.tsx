// Section Engine — InfoBar（theme-agnostic 信息横条）
// 深色条 bg-ink text-surface，居中 grid；每项 IconByName + text。无 infoBar → null。

import { SectionedData } from './types'
import { IconByName } from './shared'

export function InfoBar({ data }: { data: SectionedData; accent?: string }) {
  const d = data
  if (!d.infoBar || d.infoBar.length === 0) return null
  return (
    <div className="bg-ink text-surface">
      <div className="max-w-6xl mx-auto px-5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        {d.infoBar.map((item, i) => (
          <div key={i} className="flex items-center justify-center gap-2 text-sm text-surface/80">
            {item.icon && (
              <span className="text-accent">
                <IconByName name={item.icon} className="w-4 h-4" />
              </span>
            )}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
