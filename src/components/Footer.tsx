import { Link, useLocation } from 'react-router-dom'
import { posts } from '../data/blog'
import { navLinks, site, socials } from '../data/site'
import { socialIcons } from './Icons'
import { Logo } from './Logo'

export function Footer() {
  const onHome = useLocation().pathname === '/'

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tagline">{site.tagline}</p>
        </div>

        {/* Same as the navbar: these anchors only resolve on the home page, so
            off it they have to route there first. */}
        <nav className="footer__links" aria-label="Footer">
          {navLinks.map((link) =>
            onHome ? (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={`/${link.href}`}>
                {link.label}
              </Link>
            ),
          )}
          {posts.length > 0 ? <Link to="/blog">Blog</Link> : null}
        </nav>

        <div className="footer__socials">
          {socials.map((social) => {
            const Icon = socialIcons[social.icon]
            return (
              <a
                key={social.label}
                className="social-link"
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </span>
        <span>Built with React, TypeScript & Vite.</span>
      </div>
    </footer>
  )
}
