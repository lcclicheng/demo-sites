import { ReactNode } from 'react'
import { SectionedData, SectionConfig } from './types'
import { Hero } from './Hero'
import { InfoBar } from './InfoBar'
import { Menu } from './Menu'
import { Story } from './Story'
import { Gallery } from './Gallery'
import { Reviews } from './Reviews'
import { Faq } from './Faq'
import { Team } from './Team'
import { Booking } from './Booking'
import { Location } from './Location'
import { Instagram } from './Instagram'
import { Footer } from './Footer'

export const SECTIONS: Record<string, (p: { data: SectionedData; accent?: string }) => ReactNode> = {
  hero: Hero, infoBar: InfoBar, menu: Menu, story: Story, gallery: Gallery,
  reviews: Reviews, faq: Faq, team: Team, booking: Booking, location: Location,
  instagram: Instagram, footer: Footer,
}

export function renderSections(sections: SectionConfig[], data: SectionedData): ReactNode {
  return sections.map((s, i) => {
    const C = SECTIONS[s.type]
    if (!C) return null
    return <C key={i} data={data} />
  })
}
