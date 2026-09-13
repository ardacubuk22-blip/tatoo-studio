/* ------------------------------------------------------------
   Customer -> artist matching.

   Pure, framework-free scoring so it's trivial to unit test.
   Only three answers are scored (style / location / budget) —
   body part, size, first-tattoo and colour preference are
   collected for the appointment request message, but there's no
   reliable per-artist data to score them against yet (photo ->
   artist attribution in tattoos.js is a round-robin placeholder,
   not a real record of who made what).

   A skipped question must never penalise an artist: it scores a
   neutral 1 for every artist on that axis, so it adds the same
   constant to every total and never changes the ranking.
   ------------------------------------------------------------ */

export const MATCH_WEIGHTS = {
  style: 0.5,
  location: 0.25,
  budget: 0.25,
}

/** Istanbul-district partial credit when the quiz district isn't an exact hit. */
const SAME_CITY_PARTIAL_CREDIT = 0.3

export const BUDGET_BRACKETS = [
  { value: '0-2500', label: '2.500₺ ve altı', min: 0, max: 2500 },
  { value: '2500-5000', label: '2.500₺ – 5.000₺', min: 2500, max: 5000 },
  { value: '5000-10000', label: '5.000₺ – 10.000₺', min: 5000, max: 10000 },
  { value: '10000+', label: '10.000₺ ve üzeri', min: 10000, max: Infinity },
]

function styleScore(artist, selectedStyles) {
  if (!selectedStyles || selectedStyles.length === 0) return 1 // "kararsızım" / skipped
  const artistStyles = artist.styles && artist.styles.length > 0 ? artist.styles : [artist.mainStyle].filter(Boolean)
  if (artistStyles.length === 0) return 1 // no data — neutral, don't punish

  const hits = selectedStyles.filter((s) => artistStyles.includes(s)).length
  return hits / selectedStyles.length
}

function locationScore(artist, selectedCity) {
  if (!selectedCity) return 1 // skipped
  if (!artist.city) return 1 // no data — neutral
  if (artist.city === selectedCity) return 1
  return SAME_CITY_PARTIAL_CREDIT
}

function budgetScore(artist, selectedBracketValue) {
  if (!selectedBracketValue) return 1 // skipped / "belirtmek istemiyorum"
  const bracket = BUDGET_BRACKETS.find((b) => b.value === selectedBracketValue)
  if (!bracket) return 1
  if (!artist.priceRange) return 1 // no data — neutral

  const { min: aMin, max: aMax } = artist.priceRange
  const overlapStart = Math.max(aMin, bracket.min)
  const overlapEnd = Math.min(aMax, bracket.max)
  if (overlapEnd <= overlapStart) return 0 // no overlap at all

  const bracketSpan = bracket.max === Infinity ? aMax - bracket.min || 1 : bracket.max - bracket.min
  const overlapSpan = overlapEnd - overlapStart
  return Math.max(0, Math.min(1, overlapSpan / bracketSpan))
}

/**
 * @param {object} artist
 * @param {{ styles?: string[], city?: string, budget?: string }} answers
 * @param {typeof MATCH_WEIGHTS} weights
 * @returns {{ total: number, style: number, location: number, budget: number }}
 */
export function scoreArtist(artist, answers, weights = MATCH_WEIGHTS) {
  const style = styleScore(artist, answers.styles)
  const location = locationScore(artist, answers.city)
  const budget = budgetScore(artist, answers.budget)

  const total = style * weights.style + location * weights.location + budget * weights.budget

  return { total, style, location, budget }
}

/**
 * Rank every artist for the given quiz answers. Always returns every
 * artist (best first) — there's no cutoff, the caller decides how many
 * to show and whether to label the tail "benzer sanatçılar".
 */
export function matchArtists(artists, answers, weights = MATCH_WEIGHTS) {
  return artists
    .map((artist) => ({ artist, score: scoreArtist(artist, answers, weights) }))
    .sort((a, b) => b.score.total - a.score.total)
}

/** Short, human strings explaining why an artist scored well. */
export function matchReasons(artist, answers, score) {
  const reasons = []

  if (answers.styles && answers.styles.length > 0 && score.style > 0) {
    const artistStyles = artist.styles || [artist.mainStyle].filter(Boolean)
    const matched = answers.styles.filter((s) => artistStyles.includes(s))
    if (matched.length > 0) reasons.push(`${matched.join(', ')} stilinde çalışıyor`)
  }

  // Phrased as "X bölgesinde" rather than an attached suffix (X'de/X'ta) —
  // Turkish vowel harmony would need real per-city handling otherwise.
  if (answers.city && score.location === 1) {
    reasons.push(`${artist.city} bölgesinde çalışıyor`)
  } else if (answers.city && score.location > 0) {
    reasons.push(`${artist.city} bölgesinde, aradığın yere yakın`)
  }

  if (answers.budget && score.budget >= 0.6) {
    reasons.push('bütçene uygun')
  }

  return reasons
}
