/* ------------------------------------------------------------
   Photo pipeline.

   Drop image files into src/assets/** and they appear on the
   site automatically — no data entry, no imports to maintain.
   Vite resolves, hashes and bundles them at build time.

   Layout
   ------
   src/assets/tattoos/<style-slug>/<name>.jpg
       The style comes from the FOLDER, so plain camera
       filenames (IMG_4821.jpg) are fine.

       Optionally tag a file by naming it with "__" separators:
           animal__forearm__medium__lion.jpg
       Any leading tags that match a filter option are read as
       subject / body part / size, in any order. Whatever is
       left over becomes the motif used by search.

   src/assets/styles/<style-slug>.jpg
       Hero image for a style card. If absent, the style falls
       back to one of its own tattoo photos.

   src/assets/artists/<artist-id>/<name>.jpg
       Portfolio images for that artist.

   Accepted extensions: jpg jpeg png webp avif
   ------------------------------------------------------------ */

import { FILTER_GROUPS } from './filters.js'

const TATTOO_FILES = import.meta.glob(
  '../assets/tattoos/*/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)

const STYLE_FILES = import.meta.glob(
  '../assets/styles/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)

const ARTIST_FILES = import.meta.glob(
  '../assets/artists/*/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)

/* ---------- filename tag lookup ---------- */

// "forearm" -> { group: 'bodyPart', value: 'Forearm' }
const TAG_LOOKUP = new Map()
for (const group of FILTER_GROUPS) {
  for (const option of group.options) {
    TAG_LOOKUP.set(option.toLowerCase(), { group: group.key, value: option })
  }
}

function baseName(path) {
  const file = path.split('/').pop() || ''
  return file.replace(/\.[^.]+$/, '')
}

function folderName(path) {
  const parts = path.split('/')
  return parts[parts.length - 2] || ''
}

/**
 * Read optional subject / bodyPart / size tags out of a filename.
 * Unrecognised chunks are joined into the motif.
 */
function parseTags(name) {
  const chunks = name.split('__').map((c) => c.trim()).filter(Boolean)
  const out = { subject: null, bodyPart: null, size: null, motif: '' }
  const leftovers = []

  for (const chunk of chunks) {
    const tag = TAG_LOOKUP.get(chunk.toLowerCase())
    if (tag && !out[tag.group]) {
      out[tag.group] = tag.value
    } else {
      leftovers.push(chunk)
    }
  }

  out.motif = leftovers.join(' ').replace(/[-_]+/g, ' ').trim()
  return out
}

/* ---------- exported views ---------- */

/** Tattoo photos found on disk, grouped in a flat list. */
export const TATTOO_ASSETS = Object.entries(TATTOO_FILES)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url], i) => {
    const name = baseName(path)
    const tags = parseTags(name)
    return {
      id: `p-${String(i + 1).padStart(3, '0')}`,
      image: url,
      style: folderName(path),
      subject: tags.subject,
      bodyPart: tags.bodyPart,
      size: tags.size,
      motif: tags.motif || name.replace(/[-_]+/g, ' '),
      artistId: null,
      source: path,
    }
  })

/** style slug -> hero image url (only styles that have a file) */
export const STYLE_HERO = Object.fromEntries(
  Object.entries(STYLE_FILES).map(([path, url]) => [baseName(path), url]),
)

/** artist id -> [image urls] */
export const ARTIST_PORTFOLIO = Object.entries(ARTIST_FILES)
  .sort(([a], [b]) => a.localeCompare(b))
  .reduce((acc, [path, url]) => {
    const id = folderName(path)
    ;(acc[id] ||= []).push(url)
    return acc
  }, {})

export const HAS_REAL_TATTOOS = TATTOO_ASSETS.length > 0
