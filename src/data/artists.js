/* ------------------------------------------------------------
   Artists. `mainStyle` references a style slug from styles.js.

   Portfolio images come from src/assets/artists/<id>/*.jpg when
   present; otherwise placeholders stand in. Add, remove or
   rename artists freely — the ids are what the photo folders
   and tattoo records point at.

   `status: "draft"` keeps an artist out of every public list (the
   Artists page, the matching quiz, tattoo-photo auto-assignment)
   without deleting their record — flip it to "published" when
   they're ready to go live. Missing status is treated as published
   so older records don't need editing.
   ------------------------------------------------------------ */

import { ARTIST_PORTFOLIO } from './assets.js'
import { placeholder } from '../lib/placeholder.js'
import { artists as DEFINITIONS } from './artists.json'

function portfolioFor(id) {
  const real = ARTIST_PORTFOLIO[id]
  if (real && real.length > 0) return real
  return [1, 2, 3].map((n) => ({
    url: placeholder(`artist-${id}-${n}`, 800, 1000),
    kind: 'image',
  }))
}

export const ARTISTS = DEFINITIONS.filter((a) => a.status !== 'draft').map((a) => ({
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
