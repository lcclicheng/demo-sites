// Section Engine — 统一数据契约
// ─────────────────────────────────────────────────────────────────────────
// 这是「sectioned」组合器模板消费的数据结构，也是 AI Intake（步骤 3）输出的目标 schema。
// 设计原则：宽松（所有字段可选），section 组件按需取用；缺数据的 section 自动跳过渲染。
// 视觉完全 theme-agnostic：配色靠 twConfig 里的 accent / surface / ink 三色，装饰靠
// currentColor + color-mix（沿用 src/components/visual.tsx 的同一套哲学），所以同一套
// section 组件可挂在任何主题（暖金、青绿、李子、工业铜……）上而无需改代码。

export type SectionType =
  | 'hero'
  | 'infoBar'
  | 'menu'
  | 'story'
  | 'gallery'
  | 'reviews'
  | 'faq'
  | 'team'
  | 'booking'
  | 'location'
  | 'instagram'
  | 'footer'

export interface SectionConfig {
  type: SectionType
  // 预留：未来某 section 可带局部覆盖配置（如 menu 只显示部分分类、gallery 限制数量）
  [key: string]: any
}

export interface MenuDish {
  name: string
  desc?: string
  price?: string
  pair?: string
}
export interface MenuCategory {
  title: string
  icon?: string
  items: MenuDish[]
}
export interface HeroStat {
  val: string
  label: string
  stars?: boolean
}
export interface GalleryItem {
  title?: string
  sub?: string
  image?: string
  icon?: string
  gradient?: string
}
export interface Review {
  name: string
  text: string
  rating?: number
}
export interface Faq {
  q: string
  a: string
}
export interface TeamMember {
  name: string
  role?: string
  bio?: string
  initials?: string
  image?: string
}
export interface InfoItem {
  icon?: string
  text: string
}

export interface SectionedData {
  template?: string
  name: string
  subtitle?: string
  tagline?: string
  established?: string
  location?: string
  street?: string
  postcode?: string
  registeredAddress?: string
  phone?: string
  email?: string
  googleRating?: string
  googleReviews?: string

  heroLine1?: string
  heroLine2?: string
  heroBadge?: string
  heroStats?: HeroStat[]
  heroCta1?: { text: string; href: string }
  heroCta2?: { text: string; href: string }

  // 组合覆盖：若存在则严格按此数组顺序渲染对应 section；
  // 否则引擎用默认顺序，并自动跳过「数据缺失」的 section。
  sections?: SectionConfig[]

  infoBar?: InfoItem[]
  menu?: MenuCategory[]
  menuIntroTitle?: string
  menuIntroText?: string
  story?: { title?: string; subtitle?: string; paragraphs?: string[]; stats?: { value: string; label: string }[] }
  gallery?: GalleryItem[]
  reviews?: Review[]
  faqs?: Faq[]
  team?: TeamMember[]
  booking?: { intro?: string; note?: string; occasionOptions?: string[] }
  hoursDetail?: { wedFri?: string; saturday?: string; sunday?: string; closedDays?: string }
  footer?: { note?: string; quickLinks?: string[]; hoursTitle?: string }
  instagram?: string
  facebook?: string
  twitter?: string

  pageTitle?: string
  seo?: { title?: string; description?: string }
  [key: string]: any
}
