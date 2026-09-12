/* ------------------------------------------------------------
   Simple keyword search over the tattoo archive.
   Query tokens are matched against style name, subject,
   body part, size, motif and artist name. Results are ranked
   by how many distinct tokens matched.

   Examples that should return something sensible:
     "black and grey lion"
     "small fine line flower"
     "japanese sleeve"
     "realism portrait"
   ------------------------------------------------------------ */

import { TATTOOS } from '../data/tattoos.js'
import { styleName } from '../data/styles.js'
import { getArtist } from '../data/artists.js'

const STOP_WORDS = new Set(['and', 'the', 'a', 'an', 'of', 'with', 'in', 'on'])

function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w))
}

function haystackFor(tattoo) {
  const artist = tattoo.artistId ? getArtist(tattoo.artistId) : null
  return [
    styleName(tattoo.style),
    tattoo.subject,
    tattoo.bodyPart,
    tattoo.size,
    tattoo.motif,
    artist?.name,
    artist?.city,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function searchTattoos(query, list = TATTOOS) {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const scored = []
  for (const tattoo of list) {
    const hay = haystackFor(tattoo)
    let matched = 0
    for (const token of tokens) {
      if (hay.includes(token)) matched += 1
    }
    if (matched > 0) {
      scored.push({ tattoo, score: matched })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.tattoo)
}
