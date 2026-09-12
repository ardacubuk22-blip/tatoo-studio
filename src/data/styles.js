/* ------------------------------------------------------------
   Tattoo styles.
   `slug` is the stable id used across tattoos / artists / routes,
   and it is also the folder name for that style's photos:
       src/assets/tattoos/<slug>/

   A style's hero image comes from src/assets/styles/<slug>.jpg
   when present. Otherwise the Styles page falls back to one of
   the style's own tattoo photos (see selectors.js).
   ------------------------------------------------------------ */

import { STYLE_HERO } from './assets.js'
import { placeholder } from '../lib/placeholder.js'

const DEFINITIONS = [
  {
    slug: 'black-and-grey',
    name: 'Black & Grey',
    description:
      'Shading built entirely from diluted black ink. Soft gradients, depth and contrast without colour.',
  },
  {
    slug: 'realism',
    name: 'Realism',
    description:
      'Photographic detail rendered in skin. Portraits, animals and objects with lifelike light and texture.',
  },
  {
    slug: 'fine-line',
    name: 'Fine Line',
    description:
      'Single-needle work. Thin, precise linework with delicate, restrained detail.',
  },
  {
    slug: 'blackwork',
    name: 'Blackwork',
    description:
      'Bold solid black fields and heavy graphic shapes. High contrast, strong silhouettes.',
  },
  {
    slug: 'minimal',
    name: 'Minimal',
    description: 'The least mark for the most meaning. Small, quiet, essential.',
  },
  {
    slug: 'traditional',
    name: 'Traditional',
    description:
      'American traditional. Bold outlines, limited palette, timeless iconography.',
  },
  {
    slug: 'neo-traditional',
    name: 'Neo Traditional',
    description:
      'Traditional roots with richer colour, dimensional shading and decorative detail.',
  },
  {
    slug: 'japanese',
    name: 'Japanese',
    description:
      'Irezumi. Flowing compositions of dragons, koi, waves and blossoms built for the body.',
  },
  {
    slug: 'ornamental',
    name: 'Ornamental',
    description:
      'Pattern as decoration. Mandalas, filigree and jewellery-like detail that follows the form.',
  },
  {
    slug: 'geometric',
    name: 'Geometric',
    description:
      'Precise shapes, symmetry and sacred geometry. Clean construction lines.',
  },
  {
    slug: 'dotwork',
    name: 'Dotwork',
    description:
      'Tone and form rendered entirely in stippled dots. Patient, textural, meditative.',
  },
  {
    slug: 'lettering',
    name: 'Lettering',
    description: 'Script, blackletter and custom type. Words carried with intent.',
  },
  {
    slug: 'abstract',
    name: 'Abstract',
    description:
      'Gesture, brushstroke and colour without a literal subject. Painterly and free.',
  },
  {
    slug: 'trash-polka',
    name: 'Trash Polka',
    description:
      'Realism collaged with brushstrokes, smears and type. Red and black, chaotic and deliberate.',
  },
]

export const STYLES = DEFINITIONS.map((s) => ({
  ...s,
  /** hero file if one was dropped in src/assets/styles/, else null */
  hero: STYLE_HERO[s.slug] || null,
  /** always safe to render */
  image: STYLE_HERO[s.slug] || placeholder(`style-${s.slug}`, 1200, 1500),
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
