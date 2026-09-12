import { Link } from 'react-router-dom'
import { styleCoverImage, styleCount } from '../data/selectors.js'
import LazyImage from './LazyImage.jsx'
import './StyleCard.css'

/**
 * Large image card linking to a style detail page.
 * props:
 *   style  record from styles.js
 *   eager  load immediately (first screenful)
 */
export default function StyleCard({ style, eager = false }) {
  const count = styleCount(style.slug)

  return (
    <Link to={`/styles/${style.slug}`} className="style-card">
      <div className="style-card__frame">
        <LazyImage
          className="style-card__img"
          src={styleCoverImage(style)}
          alt={style.name}
          width={1200}
          height={1500}
          eager={eager}
        />
      </div>
      <span className="style-card__name">
        {style.name}
        {count > 0 && <em className="style-card__count">{count}</em>}
      </span>
    </Link>
  )
}
