import { useFavorites } from '../context/FavoritesContext.jsx'
import './FavoriteButton.css'

/**
 * props:
 *   id       tattoo id
 *   variant  "overlay" (on a card) | "inline" (in detail view)
 */
export default function FavoriteButton({ id, variant = 'overlay' }) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(id)

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    toggle(id)
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        className={'fav-inline btn' + (active ? ' is-active' : '')}
        onClick={handleClick}
        aria-pressed={active}
      >
        <span aria-hidden="true">{active ? '♥' : '♡'}</span>
        {active ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={'fav-overlay' + (active ? ' is-active' : '')}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Save to favorites'}
    >
      <span aria-hidden="true">{active ? '♥' : '♡'}</span>
    </button>
  )
}
