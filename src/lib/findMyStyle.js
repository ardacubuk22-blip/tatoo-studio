/* ------------------------------------------------------------
   FIND MY STYLE — future feature, scaffolded now.

   Flow (planned):
     1. Show the user a deck of tattoo images.
     2. User picks the ones they like.
     3. analyseSelection() turns those picks into a ranked
        style profile, e.g. "BLACK & GREY REALISM".
     4. UI shows matching tattoos + artists for the top style.

   This module keeps step 3 isolated and swappable. The current
   implementation is a transparent tally over style slugs; it can
   later be replaced with an embedding / model-based ranker
   without touching the UI, as long as the return shape holds.
   ------------------------------------------------------------ */

import { getTattoo } from '../data/tattoos.js'
import { STYLES, styleName } from '../data/styles.js'

/**
 * @param {string[]} likedTattooIds
 * @returns {{
 *   ranking: { slug: string, name: string, weight: number }[],
 *   topStyleSlug: string | null,
 *   label: string | null
 * }}
 */
export function analyseSelection(likedTattooIds = []) {
  const tally = new Map()

  for (const id of likedTattooIds) {
    const tattoo = getTattoo(id)
    if (!tattoo) continue
    tally.set(tattoo.style, (tally.get(tattoo.style) || 0) + 1)
    // secondary signal: subject leaning nudges related styles later
  }

  const total = [...tally.values()].reduce((a, b) => a + b, 0)
  const ranking = STYLES.map((s) => ({
    slug: s.slug,
    name: s.name,
    weight: total > 0 ? (tally.get(s.slug) || 0) / total : 0,
  }))
    .filter((r) => r.weight > 0)
    .sort((a, b) => b.weight - a.weight)

  const topStyleSlug = ranking[0]?.slug || null

  return {
    ranking,
    topStyleSlug,
    label: topStyleSlug ? styleName(topStyleSlug).toUpperCase() : null,
  }
}
