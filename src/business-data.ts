// business-data.ts — 此文件由 generate.mjs 自动生成，勿手动编辑

export interface MenuItem {
  name: string
  desc: string
  price: string
}

export interface Review {
  name: string
  text: string
  rating: number
}

export interface BusinessData {
  // 基础信息
  name: string
  subtitle: string      // 如 "Italian Restaurant" / "Family Bakery"
  tagline: string        // Hero 大标题下的一行描述
  established: string    // 如 "2015"
  location: string       // 如 "Bath, UK"
  street: string
  postcode: string
  phone: string
  email: string
  googleRating: string   // 如 "4.8"
  googleReviews: string  // 如 "200+ reviews"

  // 菜单
  menuCategories: Array<{
    category: string
    items: MenuItem[]
  }>

  // Hero 按钮
  heroCta1: { text: string; href: string }
  heroCta2: { text: string; href: string }

  // "关于" 段落
  aboutTitle: string
  aboutParagraphs: string[]
  aboutStats: Array<{ value: string; label: string }>

  // 评价
  reviews: Review[]

  // 预约
  reservationIntro: string

  // SEO / Meta
  pageTitle: string

  // 社交
  instagram?: string
  facebook?: string
  twitter?: string
}

// 示例数据 — 意大利餐厅
export const businessData: BusinessData = {
  name: 'La Terrazza',
  subtitle: 'Italian Restaurant',
  tagline: 'Authentic Italian cuisine crafted with passion, served with a view of the Royal Crescent',
  established: '1998',
  location: 'Bath, UK',
  street: '12 Royal Crescent, Bath BA1 2LR',
  postcode: 'BA1 2LR',
  phone: '+44 1234 567890',
  email: 'ciao@laterrazza.co.uk',
  googleRating: '4.8',
  googleReviews: '200+ reviews',

  menuCategories: [
    {
      category: 'Starters',
      items: [
        { name: 'Bruschetta al Pomodoro', desc: 'Toasted sourdough, vine-ripened tomatoes, fresh basil, aged balsamic', price: '£9.50' },
        { name: 'Calamari Fritti', desc: 'Crispy squid, lemon aioli, Calabrian chili, parsley', price: '£12.00' },
        { name: 'Burrata & Heirloom', desc: 'Creamy burrata, heirloom tomatoes, basil pesto, sea salt', price: '£11.50' },
      ],
    },
    {
      category: 'Mains',
      items: [
        { name: 'Tagliatelle al Ragu', desc: 'Handmade pasta, slow-braised beef and pork ragu, Parmigiano', price: '£18.50' },
        { name: 'Branzino alla Griglia', desc: 'Grilled Mediterranean sea bass, lemon butter sauce, roasted fennel', price: '£24.00' },
        { name: 'Risotto ai Funghi', desc: 'Arborio rice, wild mushrooms, truffle oil, aged Parmesan', price: '£17.00' },
      ],
    },
    {
      category: 'Desserts',
      items: [
        { name: 'Tiramisu Classico', desc: 'Espresso-soaked ladyfingers, mascarpone cream, cocoa dust', price: '£9.00' },
        { name: 'Panna Cotta', desc: 'Vanilla bean panna cotta, berry compote, mint', price: '£8.50' },
      ],
    },
  ],

  heroCta1: { text: 'View Menu', href: '#menu' },
  heroCta2: { text: 'Make a Reservation', href: '#reservations' },

  aboutTitle: 'Three Generations of Passion',
  aboutParagraphs: [
    'Since 1998, our family has brought authentic Italian flavours to the heart of Bath.',
    'Every dish is prepared fresh daily using seasonal ingredients sourced from local farms and imported directly from Italy.',
    'From our handmade pasta to our carefully curated wine list, every detail reflects our commitment to excellence.',
  ],
  aboutStats: [
    { value: '28+', label: 'Years' },
    { value: '200+', label: 'Wine Labels' },
    { value: '4.8', label: 'Google Rating' },
  ],

  reviews: [
    { name: 'James Whitfield', text: 'The best Italian food outside of Florence. The osso buco was melt-in-your-mouth perfection.', rating: 5 },
    { name: 'Elena Rossi', text: 'As an Italian, I\'m very particular about pasta. This place gets it right — tastes exactly like my nonna\'s.', rating: 5 },
    { name: 'Michael & Sarah', text: 'We celebrated our anniversary here. The terrace at sunset is pure magic. Unforgettable.', rating: 5 },
  ],

  reservationIntro: 'We recommend booking at least 48 hours in advance for weekend dining.',

  pageTitle: 'La Terrazza — Italian Restaurant',

  instagram: '#',
  facebook: '#',
  twitter: '#',
} as const
