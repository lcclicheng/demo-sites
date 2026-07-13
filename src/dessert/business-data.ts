// V2 — 调性重做：象牙白 + 哑光金 + 浓缩咖啡。参考 Ladurée/MotionSites 克制高级感。

export interface PastryItem { name: string; desc: string; price: string }
export interface CakeItem { name: string; desc: string; price: string; serves: string }
export interface ChocolateItem { name: string; desc: string; price: string }

export const dessertData = {
  template: 'dessert',
  name: 'PATISSERIE',
  subtitle: 'French Craft',
  tagline: 'Handcrafted pastries, cakes, and chocolates made daily with the finest French ingredients.',
  taglineFull: 'A boutique patisserie in the heart of Bath. Every piece is a small work of art.',
  location: 'Bath, UK',
  street: '8 Abbey Green, Bath BA1 1NW',
  phone: '+44 1225 456789',
  email: 'bonjour@patisseriebath.co.uk',
  googleRating: '4.9',
  googleReviews: '180+ reviews',
  hours: 'Tue—Sun · 8:00—17:00',
  pageTitle: 'PATISSERIE — French Craft Patisserie',

  heroLine1: 'PATISSERIE',
  heroLine2: 'French Craft',
  heroCta1: { text: 'Explore Pastries', href: '#pastries' },
  heroCta2: { text: 'Custom Cake Order', href: '#order' },

  navLinks: ['Pastries', 'Cakes', 'Chocolates', 'Order'],

  pastriesTitle: 'Our Pastries',
  pastriesSubtitle: 'Fresh from the oven every morning.',
  menuItems: [
    { name: 'Mille-Feuille', desc: 'Caramelized puff pastry, vanilla bean crème diplomate, fresh berries', price: '£8.50' },
    { name: 'Éclair Trio', desc: 'Selection of dark chocolate, salted caramel & pistachio', price: '£7.00' },
    { name: 'Tarte au Citron', desc: 'Classic lemon tart with torched Swiss meringue', price: '£6.50' },
    { name: 'Paris-Brest', desc: 'Choux pastry ring, praline crème mousseline', price: '£9.00' },
    { name: 'Macaron Box', desc: '6 handcrafted macarons: raspberry, rose, pistachio, vanilla', price: '£12.00' },
    { name: 'Crème Brûlée', desc: 'Tahitian vanilla custard with caramelized sugar crust', price: '£6.00' },
  ],

  cakesTitle: 'Celebration Cakes',
  cakesSubtitle: 'Made for special days. 72 hours notice.',
  cakeItems: [
    { name: 'Fraisier', desc: 'Genoise sponge, mousseline cream, fresh strawberries', price: '£45', serves: '8—10' },
    { name: 'Opéra', desc: 'Almond sponge, coffee buttercream, dark chocolate ganache', price: '£48', serves: '10—12' },
    { name: 'Charlotte aux Fruits', desc: 'Ladyfinger-lined mousse cake with seasonal fruit', price: '£42', serves: '8—10' },
  ],

  chocolateTitle: 'Chocolates',
  chocolateSubtitle: 'Single-origin couverture from a family farm in Ecuador.',
  chocolateItems: [
    { name: 'Praliné Noisette', desc: 'Hazelnut praline, dark chocolate shell', price: '£3.50' },
    { name: 'Ganache Framboise', desc: 'Raspberry ganache, 64% dark chocolate', price: '£3.50' },
    { name: 'Caramel Fleur de Sel', desc: 'Salted butter caramel, milk chocolate', price: '£3.00' },
    { name: 'Truffle Noire', desc: '72% single-origin truffle, cocoa dusted', price: '£3.50' },
  ],

  orderTitle: 'Pre-Order',
  orderSubtitle: 'Reserve your favourites for collection.',
  orderSuccessTitle: 'Order Confirmed',
  orderSuccessMessage: 'We\'ll confirm within 2 hours. Merci.',
  orderButtonText: 'Place Pre-Order',
  orderFields: {
    item: { label: 'Selection', placeholder: 'Choose your cake' },
    name: { label: 'Name', placeholder: 'Your name' },
    email: { label: 'Email', placeholder: 'you@email.com' },
    date: { label: 'Collection Date' },
    message: { label: 'Special Requests', placeholder: 'Allergies, dietary requirements...' },
  },

  footerNote: 'Made with care in Bath since 2018.',
} as const
