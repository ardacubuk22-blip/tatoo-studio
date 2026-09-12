import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Styles from './pages/Styles.jsx'
import StyleDetail from './pages/StyleDetail.jsx'
import Artists from './pages/Artists.jsx'
import Favorites from './pages/Favorites.jsx'
import SearchResults from './pages/SearchResults.jsx'
import './pages/pages.css'

/*
 * The local admin tool only ever makes sense on the machine it's built
 * on — it writes straight to this checkout's disk via the File System
 * Access API. Gating the import behind import.meta.env.DEV means Vite
 * drops the module (and this whole route) from a production build
 * entirely; `npm run build` output never contains it.
 */
const AdminLazy = import.meta.env.DEV ? lazy(() => import('./pages/Admin.jsx')) : null

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
        {AdminLazy && (
          <Route
            path="/local-admin"
            element={
              <Suspense fallback={null}>
                <AdminLazy />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <a
        className="whatsapp-fab"
        href="https://wa.me/905359862655"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.45 1.34 4.95L2 22l5.2-1.36a9.96 9.96 0 0 0 4.84 1.23h.01c5.52 0 10-4.48 10-10s-4.48-9.87-10.01-9.87Zm5.87 14.24c-.25.7-1.45 1.34-2 1.42-.5.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.89-4.25-5.04-4.45-.15-.2-1.2-1.6-1.2-3.05s.75-2.17 1.02-2.47c.26-.3.58-.37.77-.37s.38 0 .55.01c.18.01.41-.07.64.49.25.6.84 2.07.91 2.22.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.3.4-.44.53-.15.15-.3.3-.13.6.17.3.75 1.24 1.62 2.01 1.11.99 2.04 1.3 2.34 1.45.3.15.48.13.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.24.65-.15.26.1 1.65.78 1.94.92.28.15.47.22.54.34.07.13.07.72-.18 1.42Z" />
        </svg>
      </a>

      <footer className="site-footer">
        <div className="page">
          <span>Tattoo Archive</span>
          <a
            href="https://wa.me/905359862655"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__whatsapp"
          >
            WhatsApp &middot; +90 535 986 26 55
          </a>
          <span>Visual discovery &amp; artist reference</span>
        </div>
      </footer>
    </>
  )
}
