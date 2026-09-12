import { styleName } from '../data/styles.js'
import FavoriteButton from './FavoriteButton.jsx'
import LazyImage from './LazyImage.jsx'
import './TattooCard.css'

/**
 * props:
 *   tattoo    tattoo record
 *   onOpen    (tattoo) => void   — opens the detail modal
 *   showStyle boolean            — reveal style name on hover (default true)
 *   eager     load immediately (first screenful)
 */
export default function TattooCard({ tattoo, onOpen, showStyle = true, eager = false }) {
  return (
    <article className="tattoo-card">
      <button
        type="button"
        className="tattoo-card__hit"
        onClick={() => onOpen?.(tattoo)}
        aria-label={`Open ${styleName(tattoo.style)} tattoo`}
      >
        {/* width/height reserve the box before load — without them the
            masonry columns collapse and nothing ever enters the viewport */}
        <LazyImage
          className="tattoo-card__img"
          src={tattoo.image}
          alt={`${styleName(tattoo.style)} — ${tattoo.motif}`}
          width={tattoo.width || 900}
          height={tattoo.height || 1200}
          eager={eager}
        />
        {showStyle && (
          <span className="tattoo-card__style">{styleName(tattoo.style)}</span>
        )}
      </button>
      <FavoriteButton id={tattoo.id} />
    </article>
  )
}
