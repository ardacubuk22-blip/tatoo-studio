import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Styles from './pages/Styles.jsx'
import StyleDetail from './pages/StyleDetail.jsx'
import Artists from './pages/Artists.jsx'
import Favorites from './pages/Favorites.jsx'
import SearchResults from './pages/SearchResults.jsx'
import './pages/pages.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <main className="page">
      <div className="section-head">
        <p className="eyebrow">404</p>
        <h1 className="display">Not Found</h1>
        <Link className="btn" to="/">
          Back to the archive
        </Link>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/styles" element={<Styles />} />
        <Route path="/styles/:slug" element={<StyleDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="site-footer">
        <div className="page">
          <span>Tattoo Archive</span>
          <span>Visual discovery &middot; skeleton build</span>
        </div>
      </footer>
    </>
  )
}
