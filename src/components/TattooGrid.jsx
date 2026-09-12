import { useState } from 'react'
import TattooCard from './TattooCard.jsx'
import TattooModal from './TattooModal.jsx'
import './TattooGrid.css'

/** Images above the fold load immediately; the rest defer. */
const EAGER_COUNT = 12

/**
 * Masonry-style gallery. Owns the detail modal so any page that
 * renders a grid gets tap-to-open for free.
 *
 * props:
 *   tattoos    tattoo records
 *   showStyle  reveal style name on hover (default true)
 *   empty      node shown when tattoos is empty
 */
export default function TattooGrid({ tattoos, showStyle = true, empty = null }) {
  const [active, setActive] = useState(null)

  if (!tattoos || tattoos.length === 0) {
    return <div className="grid-empty">{empty || 'Nothing here yet.'}</div>
  }

  return (
    <>
      <div className="tattoo-grid">
        {tattoos.map((t, i) => (
          <TattooCard
            key={t.id}
            tattoo={t}
            showStyle={showStyle}
            onOpen={setActive}
            eager={i < EAGER_COUNT}
          />
        ))}
      </div>
      <TattooModal tattoo={active} onClose={() => setActive(null)} />
    </>
  )
}
