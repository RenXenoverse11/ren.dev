import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, site } from '../data/site'
import { writeups } from '../data/writeups'
import { useScrollSpy } from '../hooks/useScrollSpy'
import type { Theme } from '../hooks/useTheme'
import {
  CloseIcon,
  CodeIcon,
  DownloadIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  MenuIcon,
  MoonIcon,
  PenIcon,
  SunIcon,
  UserIcon,
} from './Icons'
import { Logo } from './Logo'

/**
 * Sections the scrollspy watches, which must stay in DOM order — useScrollSpy
 * keeps the last entry that has scrolled past, so a list out of order
 * highlights the wrong link. The writeups teaser sits between projects and
 * contact on the home page, and isn't in navLinks because its nav entry is a
 * route rather than an anchor.
 */
const sectionIds = navLinks
  .map((link) => link.href.slice(1))
  .flatMap((id) => (id === 'contact' && writeups.length > 0 ? ['writeups', id] : [id]))

/** One icon per section, shown in the mobile dropdown only. */
const navIcons = {
  '#home': HomeIcon,
  '#about': UserIcon,
  '#skills': CodeIcon,
  '#projects': LayersIcon,
  '#contact': MailIcon,
} as const

type NavbarProps = {
  theme: Theme
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const activeId = useScrollSpy(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the page from scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      {/* Dims the page behind the open mobile panel and closes it on tap —
          the panel used to float over the content with nothing separating
          the two. Rendered at all widths; CSS only shows it under 768px. */}
      <button
        type="button"
        className={`navbar__backdrop${menuOpen ? ' navbar__backdrop--open' : ''}`}
        onClick={() => setMenuOpen(false)}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="container navbar__inner">
        <Logo />

        <nav className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
          {navLinks.map((link, index) => {
            const LinkIcon = navIcons[link.href as keyof typeof navIcons]
            // Off the home page these sections don't exist to scroll to, so the
            // link has to route back to `/` and carry the hash with it.
            const active = onHome && activeId === link.href.slice(1)
            const className = `navbar__link${active ? ' navbar__link--active' : ''}`
            const style = { '--stagger': index } as CSSProperties

            return onHome ? (
              <a
                key={link.href}
                href={link.href}
                className={className}
                style={style}
                onClick={() => setMenuOpen(false)}
              >
                <LinkIcon className="navbar__link-icon" />
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={`/${link.href}`}
                className={className}
                style={style}
                onClick={() => setMenuOpen(false)}
              >
                <LinkIcon className="navbar__link-icon" />
                {link.label}
              </Link>
            )
          })}

          {/* Hidden until something is published — an empty section in the nav
              reads worse than no section at all. */}
          {writeups.length > 0 ? (
            <Link
              to="/writeups"
              className={`navbar__link${
                pathname.startsWith('/writeups') || (onHome && activeId === 'writeups')
                  ? ' navbar__link--active'
                  : ''
              }`}
              style={{ '--stagger': navLinks.length } as CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              <PenIcon className="navbar__link-icon" />
              Writeups
            </Link>
          ) : null}
        </nav>

        <div className="navbar__actions">
          <a
            className="navbar__resume"
            href={site.resume}
            download
            title="Download resume (PDF)"
            aria-label="Download resume (PDF)"
          >
            <span>Resume</span>
            <DownloadIcon />
          </a>
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-button navbar__burger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
