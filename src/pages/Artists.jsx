import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ARTISTS } from '../data/artists.js'
import { STYLES, styleName } from '../data/styles.js'
import ArtistCard from '../components/ArtistCard.jsx'

export default function Artists() {
  const [params, setParams] = useSearchParams()
  const styleFilter = params.get('style')

  const groups = useMemo(() => {
    const wanted = styleFilter
      ? STYLES.filter((s) => s.slug === styleFilter)
      : STYLES
    return wanted
      .map((s) => ({
        style: s,
        artists: ARTISTS.filter((a) => a.mainStyle === s.slug),
      }))
      .filter((g) => g.artists.length > 0)
  }, [styleFilter])

  return (
    <main className="page">
      <header className="section-head">
        <p className="eyebrow">Artists</p>
        {styleFilter && (
          <button
            type="button"
            className="btn"
            onClick={() => setParams({})}
          >
            Showing {styleName(styleFilter)} &nbsp;&times;
          </button>
        )}
      </header>

      {groups.length === 0 && (
        <p className="lede">No artists listed for this style yet.</p>
      )}

      {groups.map(({ style, artists }) => (
        <section key={style.slug} className="artist-section">
          <div className="artist-section__head">
            <h2 className="artist-section__title">
              {styleName(style.slug)} Artists
            </h2>
            {!styleFilter && (
              <Link
                className="artist-section__more"
                to={`/artists?style=${style.slug}`}
              >
                View
              </Link>
            )}
          </div>
          <div className="artist-grid">
            {artists.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
