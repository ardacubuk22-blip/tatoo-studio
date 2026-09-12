/* ------------------------------------------------------------
   Tattoos — the core content of the archive.

   Content comes from real photo files when they exist:
       src/assets/tattoos/<style-slug>/<name>.jpg
   (see assets.js for the naming rules).

   Until photos are added, a deterministic demo set built on
   inline SVG placeholders keeps the layout honest and fast —
   no external image service, nothing to wait on.

   Each entry:
     id       stable id, used in routes and favourites
     image    resolved image url
     style    style slug (see styles.js)
     subject  Subject filter option, or null if untagged
     bodyPart Body Part filter option, or null
     size     Size filter option, or null
     artistId artist id (see artists.js) or null
     motif    short freeform noun(s) for search, e.g. "lion"
     width    intrinsic width  \ used to reserve space in the
     height   intrinsic height / masonry grid before load

   `width`/`height` matter: without them the lazy images in a
   column-based masonry grid have no height, so the columns
   collapse, so nothing ever enters the viewport, so lazy
   loading never fires. Always render them on the <img>.
   ------------------------------------------------------------ */

import { STYLES } from './styles.js'
import { FILTER_GROUPS } from './filters.js'
import { ARTISTS } from './artists.js'
import { TATTOO_ASSETS, HAS_REAL_TATTOOS } from './assets.js'
import { placeholder } from '../lib/placeholder.js'

const SUBJECTS = FILTER_GROUPS.find((g) => g.key === 'subject').options
const BODY_PARTS = FILTER_GROUPS.find((g) => g.key === 'bodyPart').options
const SIZES = FILTER_GROUPS.find((g) => g.key === 'size').options

const MOTIF_BY_SUBJECT = {
  Portrait: ['face', 'lady head', 'saint', 'child portrait'],
  Animal: ['lion', 'wolf', 'snake', 'koi', 'moth', 'horse'],
  Flower: ['rose', 'peony', 'lily', 'chrysanthemum', 'orchid'],
  Skull: ['skull', 'skull and roses', 'anatomical skull'],
  Nature: ['mountain', 'wave', 'forest', 'moon', 'sun'],
  Abstract: ['brushstroke', 'geometry', 'smear', 'linework'],
}

function pick(list, n) {
  return list[n % list.length]
}

/** Give a photo an artist when one works in that style. */
function assignArtist(styleSlug, i) {
  const pool = ARTISTS.filter((a) => a.mainStyle === styleSlug)
  return pool.length > 0 ? pool[i % pool.length].id : null
}

/** Demo content — only used while src/assets/tattoos is empty. */
function buildDemoSet() {
  const out = []
  let n = 0
  for (let s = 0; s < STYLES.length; s += 1) {
    const style = STYLES[s]
    for (let k = 0; k < 6; k += 1) {
      n += 1
      const subject = pick(SUBJECTS, s + k * 2 + 1)
      const height = k % 3 === 0 ? 1350 : k % 3 === 1 ? 1200 : 1000
      out.push({
        id: `t-${String(n).padStart(3, '0')}`,
        image: placeholder(`tattoo-${n}`, 900, height),
        width: 900,
        height,
        style: style.slug,
        subject,
        bodyPart: pick(BODY_PARTS, s * 2 + k + 2),
        size: pick(SIZES, s + k),
        artistId: assignArtist(style.slug, k),
        motif: pick(MOTIF_BY_SUBJECT[subject], s + k),
      })
    }
  }
  return out
}

/** Real photos found in src/assets/tattoos/<style-slug>/ */
function buildFromAssets() {
  const seen = new Map()
  return TATTOO_ASSETS.map((asset) => {
    const i = seen.get(asset.style) || 0
    seen.set(asset.style, i + 1)
    return {
      // 3:4 is only a reservation — the real ratio takes over on load,
      // but it keeps the masonry columns from collapsing beforehand.
      width: 900,
      height: 1200,
      ...asset,
      artistId: asset.artistId || assignArtist(asset.style, i),
    }
  })
}

export const TATTOOS = HAS_REAL_TATTOOS ? buildFromAssets() : buildDemoSet()

/** True while the archive is still showing generated placeholders. */
export const IS_DEMO_CONTENT = !HAS_REAL_TATTOOS

const TATTOO_BY_ID = Object.fromEntries(TATTOOS.map((t) => [t.id, t]))

export function getTattoo(id) {
  return TATTOO_BY_ID[id] || null
}

export function tattoosByStyle(styleSlug) {
  return TATTOOS.filter((t) => t.style === styleSlug)
}

export function tattoosByArtist(artistId) {
  return TATTOOS.filter((t) => t.artistId === artistId)
}

/**
 * Apply Style Detail filters. `selected` is { subject:[], bodyPart:[], size:[] };
 * an empty array for a group means "no constraint". Untagged photos (null)
 * simply do not match a constrained group.
 */
export function filterTattoos(list, selected) {
  return list.filter((t) => {
    for (const group of ['subject', 'bodyPart', 'size']) {
      const chosen = selected[group]
      if (chosen && chosen.length > 0 && !chosen.includes(t[group])) {
        return false
      }
    }
    return true
  })
}
