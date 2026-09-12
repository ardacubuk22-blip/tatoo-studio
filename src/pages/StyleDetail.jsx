import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStyle } from '../data/styles.js'
import { tattoosByStyle, filterTattoos } from '../data/tattoos.js'
import { FILTER_GROUPS, EMPTY_FILTERS } from '../data/filters.js'
import FilterBar from '../components/FilterBar.jsx'
import TattooGrid from '../components/TattooGrid.jsx'

export default function StyleDetail() {
  const { slug } = useParams()
  const style = getStyle(slug)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const all = useMemo(() => (style ? tattoosByStyle(style.slug) : []), [style])
  const shown = useMemo(() => filterTattoos(all, filters), [all, filters])

  if (!style) {
    return (
      <main className="page">
        <header className="section-head">
          <p className="eyebrow">Unknown style</p>
          <Link className="btn" to="/styles">
            All styles
          </Link>
        </header>
      </main>
    )
  }

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="display">{style.name}</h1>
        <p className="lede">{style.description}</p>
      </header>

      <FilterBar groups={FILTER_GROUPS} selected={filters} onChange={setFilters} />
      <hr className="divider" />
      <div className="style-detail__count">
        {shown.length} {shown.length === 1 ? 'tattoo' : 'tattoos'}
      </div>

      <TattooGrid
        tattoos={shown}
        showStyle={false}
        empty="No tattoos match these filters."
      />
    </main>
  )
}
