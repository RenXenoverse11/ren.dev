import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Home } from './components/Home'
import { Navbar } from './components/Navbar'
import { NotFound } from './components/NotFound'
import { WriteupPage } from './components/WriteupPage'
import { WriteupsIndex } from './components/WriteupsIndex'
import { useReveal } from './hooks/useReveal'
import { useTheme } from './hooks/useTheme'

/**
 * Navigating to a new route should start at the top — the browser only
 * restores scroll for real page loads, so a client-side route change would
 * otherwise land halfway down the new page.
 *
 * Arriving with a hash (`/#about`, from the navbar on a writeup page) is the
 * other case: the browser won't jump to an anchor it never loaded, so the
 * scroll has to happen here, after the target route has rendered.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // One frame, so the route being navigated to has mounted its sections.
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()

  // Re-scan on route change: each page mounts its own [data-reveal] elements,
  // and the observer only ever sees the ones present when it was created.
  useReveal(pathname)

  return (
    <>
      <ScrollToTop />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writeups" element={<WriteupsIndex />} />
        <Route path="/writeups/:slug" element={<WriteupPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
