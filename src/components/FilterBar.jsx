import './FilterBar.css'

/**
 * Multi-select filter chips grouped by category.
 * props:
 *   groups    [{ key, label, options: string[] }]
 *   selected  { [key]: string[] }
 *   onChange  (nextSelected) => void
 */
export default function FilterBar({ groups, selected, onChange }) {
  function toggle(key, option) {
    const current = selected[key] || []
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option]
    onChange({ ...selected, [key]: next })
  }

  const activeCount = Object.values(selected).reduce(
    (n, arr) => n + (arr?.length || 0),
    0,
  )

  function clearAll() {
    const cleared = {}
    for (const g of groups) cleared[g.key] = []
    onChange(cleared)
  }

  return (
    <div className="filterbar">
      {groups.map((group) => (
        <div key={group.key} className="filterbar__group">
          <span className="filterbar__label">{group.label}</span>
          <div className="filterbar__chips">
            {group.options.map((option) => {
              const on = (selected[group.key] || []).includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  className={'chip' + (on ? ' is-on' : '')}
                  aria-pressed={on}
                  onClick={() => toggle(group.key, option)}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {activeCount > 0 && (
        <button type="button" className="filterbar__clear" onClick={clearAll}>
          Clear ({activeCount})
        </button>
      )}
    </div>
  )
}
