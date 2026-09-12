/* ------------------------------------------------------------
   Artists. `mainStyle` references a style slug from styles.js.

   Portfolio images come from src/assets/artists/<id>/*.jpg when
   present; otherwise placeholders stand in. Add, remove or
   rename artists freely — the ids are what the photo folders
   and tattoo records point at.
   ------------------------------------------------------------ */

import { ARTIST_PORTFOLIO } from './assets.js'
import { placeholder } from '../lib/placeholder.js'

const DEFINITIONS = [
  { id: 'a-001', name: 'Mara Vance', city: 'Berlin', mainStyle: 'black-and-grey' },
  { id: 'a-002', name: 'Deniz Akın', city: 'Istanbul', mainStyle: 'realism' },
  { id: 'a-003', name: 'Lena Ó', city: 'Lisbon', mainStyle: 'fine-line' },
  { id: 'a-004', name: 'Kaito Mori', city: 'Osaka', mainStyle: 'japanese' },
  { id: 'a-005', name: 'Sofia Reyes', city: 'Mexico City', mainStyle: 'blackwork' },
  { id: 'a-006', name: 'Elias Grieve', city: 'London', mainStyle: 'ornamental' },
  { id: 'a-007', name: 'Nora Halvorsen', city: 'Oslo', mainStyle: 'minimal' },
  { id: 'a-008', name: 'Marco Ferri', city: 'Rome', mainStyle: 'realism' },
  { id: 'a-009', name: 'Yuki Tan', city: 'Singapore', mainStyle: 'black-and-grey' },
  { id: 'a-010', name: 'Ida Brenner', city: 'Vienna', mainStyle: 'fine-line' },
  { id: 'a-011', name: 'Rafael Sol', city: 'São Paulo', mainStyle: 'traditional' },
  { id: 'a-012', name: 'Hana Petrova', city: 'Prague', mainStyle: 'japanese' },
]

function portfolioFor(id) {
  const real = ARTIST_PORTFOLIO[id]
  if (real && real.length > 0) return real
  return [1, 2, 3].map((n) => placeholder(`artist-${id}-${n}`, 800, 1000))
}

export const ARTISTS = DEFINITIONS.map((a) => ({
  ...a,
  portfolio: portfolioFor(a.id),
  /** true once real photos exist for this artist */
  hasPhotos: Boolean(ARTIST_PORTFOLIO[a.id]?.length),
}))

const ARTIST_BY_ID = Object.fromEntries(ARTISTS.map((a) => [a.id, a]))

export function getArtist(id) {
  return ARTIST_BY_ID[id] || null
}

export function artistsByStyle(styleSlug) {
  return ARTISTS.filter((a) => a.mainStyle === styleSlug)
}
