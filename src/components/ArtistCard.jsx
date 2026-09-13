import { styleName } from '../data/styles.js'
import LazyImage from './LazyImage.jsx'
import InstagramLink from './InstagramLink.jsx'
import './ArtistCard.css'

/**
 * props: artist (record from artists.js)
 */
export default function ArtistCard({ artist }) {
  return (
    <article className="artist-card">
      <div className="artist-card__portfolio">
        {artist.portfolio.slice(0, 3).map((item, i) => (
          <LazyImage
            key={i}
            src={item.url}
            kind={item.kind}
            alt={`${artist.name} portfolio ${i + 1}`}
            width={800}
            height={1000}
          />
        ))}
      </div>
      <div className="artist-card__meta">
        <span className="artist-card__name">{artist.name}</span>
        <span className="artist-card__sub">
          {artist.city} &middot; {styleName(artist.mainStyle)}
        </span>
        <InstagramLink handle={artist.instagram} className="artist-card__instagram" />
      </div>
    </article>
  )
}
