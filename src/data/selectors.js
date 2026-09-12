/* ------------------------------------------------------------
   Cross-cutting lookups that need more than one data module.
   Kept separate so styles.js and tattoos.js stay free of cycles.
   ------------------------------------------------------------ */

import { tattoosByStyle } from './tattoos.js'

/**
 * Best available cover image for a style card:
 *   1. a hero file in src/assets/styles/<slug>.jpg
 *   2. the first tattoo photo filed under that style
 *   3. the style's own placeholder
 */
export function styleCoverImage(style) {
  if (style.hero) return style.hero
  const first = tattoosByStyle(style.slug)[0]
  return first ? first.image : style.image
}

/** How many photos the archive holds for a style. */
export function styleCount(slug) {
  return tattoosByStyle(slug).length
}
