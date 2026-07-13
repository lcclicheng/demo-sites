export interface RoomItem { name: string; desc: string; price: string }

export const hotelData = {
  name: 'The Gables', subtitle: 'Boutique Bed & Breakfast',
  tagline: 'A Victorian townhouse reimagined. Six individually designed rooms in the heart of Bath.',
  established: '2010', location: 'Bath, UK',
  street: '22 Great Pulteney Street, Bath BA2 4BU', postcode: 'BA2 4BU',
  phone: '+44 1225 432198', email: 'stay@thegablesbath.co.uk',
  googleRating: '4.9', googleReviews: '340+ reviews',
  hours: 'Check-in: 15:00 · Check-out: 11:00',
  heroLine1: 'Rest.', heroLine2: 'Recharge.', heroLine3: 'Rediscover Bath.',
  heroCta1: { text: 'View Our Rooms', href: '#rooms' },
  heroCta2: { text: 'Check Availability', href: '#book' },

  roomsTitle: 'Our Rooms', roomsSubtitle: 'Six unique spaces, one warm welcome.',
  rooms: [
    { name: 'The Georgian Suite', desc: 'Our largest room with a four-poster bed, roll-top bath, and views over Pulteney Bridge. Includes breakfast and afternoon tea.', price: '£225' },
    { name: 'The Garden Room', desc: 'French doors opening onto our private walled garden. King bed, rainfall shower, and a quiet corner for reading.', price: '£185' },
    { name: 'The Library Room', desc: 'Floor-to-ceiling bookshelves, a window seat overlooking Great Pulteney Street, and an antique writing desk.', price: '£165' },
    { name: 'The Blue Room', desc: 'Calm and coastal-inspired. Queen bed, ensuite with claw-foot tub, and morning light that fills the room.', price: '£145' },
  ],

  pageTitle: 'The Gables — Boutique B&B in Bath',
  instagram: '#', facebook: '#',
} as const
