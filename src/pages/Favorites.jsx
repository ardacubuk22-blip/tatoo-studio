import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { getTattoo } from '../data/tattoos.js'
import TattooGrid from '../components/TattooGrid.jsx'

export default function Favorites() {
  const { ids, count, clear } = useFavorites()

  const tattoos = useMemo(
    () => ids.map(getTattoo).filter(Boolean),
    [ids],
  )

  return (
    <main className="page">
      <header className="section-head">
        <p className="eyebrow">My favorites</p>
        {count > 0 && (
          <button type="button" className="btn" onClick={clear}>
            Clear all
          </button>
        )}
      </header>

      <TattooGrid
        tattoos={tattoos}
        empty={
          <>
            Nothing saved yet. Tap the heart on any tattoo.{' '}
            <Link to="/" style={{ borderBottom: '1px solid currentColor' }}>
              Browse
            </Link>
          </>
        }
      />
    </main>
  )
}
