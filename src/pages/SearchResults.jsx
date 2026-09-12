import { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchTattoos } from '../lib/search.js'
import SearchBar from '../components/SearchBar.jsx'
import TattooGrid from '../components/TattooGrid.jsx'

const EXAMPLES = [
  'black and grey lion',
  'small fine line flower',
  'japanese sleeve',
  'realism portrait',
]

export default function SearchResults() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const query = params.get('q') || ''

  const results = useMemo(() => searchTattoos(query), [query])

  function run(q) {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <main className="page">
      <header className="section-head">
        <p className="eyebrow">Search</p>
        <SearchBar variant="hero" initial={query} onSubmit={run} />
        {!query && (
          <div className="search-examples">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="chip" onClick={() => run(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}
        {query && (
          <p className="lede">
            {results.length} {results.length === 1 ? 'result' : 'results'} for
            &ldquo;{query}&rdquo;
          </p>
        )}
      </header>

      {query && (
        <TattooGrid tattoos={results} empty={`Nothing found for "${query}".`} />
      )}
    </main>
  )
}
