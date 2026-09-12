import { useState } from 'react'
import './SearchBar.css'

/**
 * Controlled-ish search input.
 * props:
 *   variant   "compact" (navbar) | "hero" (search page)
 *   initial   initial query string
 *   onSubmit  (query: string) => void
 */
export default function SearchBar({ variant = 'compact', initial = '', onSubmit }) {
  const [value, setValue] = useState(initial)

  function handleSubmit(e) {
    e.preventDefault()
    const q = value.trim()
    if (q) onSubmit?.(q)
  }

  return (
    <form
      className={`searchbar searchbar--${variant}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <input
        className="searchbar__input"
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          variant === 'hero'
            ? 'black and grey lion · japanese sleeve · fine line flower'
            : 'Search'
        }
        aria-label="Search tattoos"
        autoComplete="off"
      />
      <button className="searchbar__submit" type="submit" aria-label="Search">
        &#8594;
      </button>
    </form>
  )
}
