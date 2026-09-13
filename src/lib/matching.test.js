import { describe, expect, it } from 'vitest'
import { MATCH_WEIGHTS, matchArtists, matchReasons, scoreArtist } from './matching.js'

const artistA = {
  id: 'a-1',
  name: 'Artist A',
  city: 'Kadıköy',
  mainStyle: 'blackwork',
  styles: ['blackwork', 'geometric'],
  priceRange: { min: 2000, max: 5000 },
}

const artistB = {
  id: 'a-2',
  name: 'Artist B',
  city: 'Şişli',
  mainStyle: 'fine-line',
  styles: ['fine-line', 'minimal'],
  priceRange: { min: 1000, max: 2500 },
}

const artistNoData = {
  id: 'a-3',
  name: 'Artist No Data',
  city: null,
  mainStyle: null,
  styles: [],
  priceRange: null,
}

describe('scoreArtist — style axis', () => {
  it('gives full style credit on an exact single-style match', () => {
    const score = scoreArtist(artistA, { styles: ['blackwork'] })
    expect(score.style).toBe(1)
  })

  it('gives partial credit when only some selected styles match', () => {
    const score = scoreArtist(artistA, { styles: ['blackwork', 'fine-line'] })
    expect(score.style).toBe(0.5)
  })

  it('scores 0 style credit on a style the artist does not do', () => {
    const score = scoreArtist(artistA, { styles: ['japanese'] })
    expect(score.style).toBe(0)
  })

  it('treats a skipped style question as neutral (1)', () => {
    const score = scoreArtist(artistA, { styles: [] })
    expect(score.style).toBe(1)
  })

  it('falls back to mainStyle when styles[] is empty on the artist record', () => {
    const artist = { ...artistA, styles: [] }
    const score = scoreArtist(artist, { styles: ['blackwork'] })
    expect(score.style).toBe(1)
  })
})

describe('scoreArtist — location axis', () => {
  it('gives full credit for an exact district match', () => {
    const score = scoreArtist(artistA, { styles: [], city: 'Kadıköy' })
    expect(score.location).toBe(1)
  })

  it('gives partial credit for a different district', () => {
    const score = scoreArtist(artistA, { styles: [], city: 'Şişli' })
    expect(score.location).toBeGreaterThan(0)
    expect(score.location).toBeLessThan(1)
  })

  it('treats a skipped location question as neutral (1)', () => {
    const score = scoreArtist(artistA, { styles: [] })
    expect(score.location).toBe(1)
  })
})

describe('scoreArtist — budget axis', () => {
  it('gives full credit when the bracket sits inside the artist range', () => {
    const score = scoreArtist(artistA, { styles: [], budget: '2500-5000' })
    expect(score.budget).toBe(1)
  })

  it('gives 0 when the bracket does not overlap the artist range at all', () => {
    const score = scoreArtist(artistB, { styles: [], budget: '10000+' })
    expect(score.budget).toBe(0)
  })

  it('gives partial credit for a partially overlapping bracket', () => {
    const score = scoreArtist(artistA, { styles: [], budget: '0-2500' })
    expect(score.budget).toBeGreaterThan(0)
    expect(score.budget).toBeLessThan(1)
  })

  it('treats a skipped budget question as neutral (1)', () => {
    const score = scoreArtist(artistA, { styles: [] })
    expect(score.budget).toBe(1)
  })
})

describe('scoreArtist — missing artist data', () => {
  it('never penalises an artist for missing city/styles/priceRange', () => {
    const score = scoreArtist(artistNoData, {
      styles: ['blackwork'],
      city: 'Kadıköy',
      budget: '2500-5000',
    })
    expect(score.style).toBe(1)
    expect(score.location).toBe(1)
    expect(score.budget).toBe(1)
    expect(score.total).toBe(1)
  })
})

describe('scoreArtist — weights', () => {
  it('uses the default weights to combine axis scores into a total', () => {
    const score = scoreArtist(artistA, { styles: ['blackwork'], city: 'Kadıköy', budget: '2500-5000' })
    expect(score.total).toBeCloseTo(
      1 * MATCH_WEIGHTS.style + 1 * MATCH_WEIGHTS.location + 1 * MATCH_WEIGHTS.budget,
    )
    expect(score.total).toBeCloseTo(1)
  })

  it('accepts custom weights', () => {
    const score = scoreArtist(
      artistA,
      { styles: ['japanese'], city: 'Kadıköy', budget: '2500-5000' },
      { style: 1, location: 0, budget: 0 },
    )
    expect(score.total).toBe(0)
  })
})

describe('matchArtists', () => {
  it('sorts artists best-first and returns every artist (no cutoff)', () => {
    const ranked = matchArtists([artistB, artistA], { styles: ['blackwork'], city: 'Kadıköy' })
    expect(ranked).toHaveLength(2)
    expect(ranked[0].artist.id).toBe('a-1')
    expect(ranked[1].artist.id).toBe('a-2')
  })

  it('returns every artist ranked even when all questions are skipped', () => {
    const ranked = matchArtists([artistA, artistB, artistNoData], { styles: [] })
    expect(ranked).toHaveLength(3)
    ranked.forEach((r) => expect(r.score.total).toBeCloseTo(1))
  })
})

describe('matchReasons', () => {
  it('explains a full match with style, location and budget', () => {
    const answers = { styles: ['blackwork'], city: 'Kadıköy', budget: '2500-5000' }
    const score = scoreArtist(artistA, answers)
    const reasons = matchReasons(artistA, answers, score)
    expect(reasons.join(' ')).toMatch(/blackwork/i)
    expect(reasons.join(' ')).toMatch(/Kadıköy/)
    expect(reasons.join(' ')).toMatch(/bütçe/i)
  })

  it('returns no reasons when nothing was answered', () => {
    const answers = { styles: [] }
    const score = scoreArtist(artistA, answers)
    expect(matchReasons(artistA, answers, score)).toEqual([])
  })
})
