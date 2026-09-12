import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { styleName } from '../data/styles.js'
import { getArtist } from '../data/artists.js'
import FavoriteButton from './FavoriteButton.jsx'
import './TattooModal.css'

/**
 * Big-image detail overlay. Renders nothing unless `tattoo` is set.
 * props:
 *   tattoo   tattoo record | null
 *   onClose  () => void
 */
export default function TattooModal({ tattoo, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!tattoo) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [tattoo, onClose])

  if (!tattoo) return null

  const artist = tattoo.artistId ? getArtist(tattoo.artistId) : null

  const meta = [
    ['Style', styleName(tattoo.style)],
    ['Subject', tattoo.subject],
    ['Body Part', tattoo.bodyPart],
    ['Size', tattoo.size],
  ]

  function findArtist() {
    onClose()
    navigate(`/artists?style=${tattoo.style}`)
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${styleName(tattoo.style)} tattoo`}
      onClick={onClose}
    >
      <div className="modal__body" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal__image">
          {tattoo.kind === 'video' ? (
            <video src={tattoo.image} controls autoPlay muted loop playsInline />
          ) : (
            <img src={tattoo.image} alt={`${styleName(tattoo.style)} — ${tattoo.motif}`} />
          )}
        </div>

        <div className="modal__panel">
          <dl className="modal__meta">
            {meta.map(([k, v]) => (
              <div key={k} className="modal__meta-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            {artist && (
              <div className="modal__meta-row">
                <dt>Artist</dt>
                <dd>
                  {artist.name} &middot; {artist.city}
                </dd>
              </div>
            )}
          </dl>

          <div className="modal__actions">
            <FavoriteButton id={tattoo.id} variant="inline" />
            <button type="button" className="btn btn--solid" onClick={findArtist}>
              Find an Artist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
