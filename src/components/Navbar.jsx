import { NavLink, useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import SearchBar from './SearchBar.jsx'
import './Navbar.css'

const LINKS = [
  { to: '/styles', label: 'Styles' },
  { to: '/', label: 'Tattoos', end: true },
  { to: '/artists', label: 'Artists' },
]

export default function Navbar() {
  const { count } = useFavorites()
  const navigate = useNavigate()

  return (
    <header className="nav">
      <div className="nav__inner page">
        <NavLink to="/" className="nav__brand" end>
          Tattoo Archive
        </NavLink>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'nav__link' + (isActive ? ' is-active' : '')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <SearchBar
            variant="compact"
            onSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
          />
          <NavLink to="/favorites" className="nav__fav" aria-label="My favorites">
            <span aria-hidden="true">&#9825;</span>
            <span className="nav__fav-count">{count}</span>
          </NavLink>
        </div>
      </div>
      <hr className="divider" />
    </header>
  )
}
