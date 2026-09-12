/* ------------------------------------------------------------
   Tattoo styles.
   `slug` is the stable id used across tattoos / artists / routes,
   and it is also the folder name for that style's photos:
       src/assets/tattoos/<slug>/

   A style's hero image can come from three places, in order:
     1. `image` in styles.json — set by the Decap CMS "Kapak
        Fotoğrafı" field, uploaded to public/uploads/.
     2. src/assets/styles/<slug>.jpg — the drop-a-file convention.
     3. a generated placeholder.
   Otherwise the Styles page falls back to one of the style's own
   tattoo photos (see selectors.js).
   ------------------------------------------------------------ */

import { STYLE_HERO } from './assets.js'
import { placeholder } from '../lib/placeholder.js'
import { styles as DEFINITIONS } from './styles.json'

export const STYLES = DEFINITIONS.map((s) => ({
  ...s,
  /** hero file if one was dropped in src/assets/styles/, else null */
  hero: s.image || STYLE_HERO[s.slug] || null,
  /** always safe to render */
  image: s.image || STYLE_HERO[s.slug] || placeholder(`style-${s.slug}`, 1200, 1500),
}))

const STYLE_BY_SLUG = Object.fromEntries(STYLES.map((s) => [s.slug, s]))

export function getStyle(slug) {
  return STYLE_BY_SLUG[slug] || null
}

export function styleName(slug) {
  return STYLE_BY_SLUG[slug]?.name || slug
}

/** Folder names the photo pipeline accepts under src/assets/tattoos/ */
export const STYLE_SLUGS = DEFINITIONS.map((s) => s.slug)
