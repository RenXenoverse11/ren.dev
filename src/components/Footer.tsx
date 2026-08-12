import { navLinks, site, socials } from '../data/site'
import { socialIcons } from './Icons'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tagline">{site.tagline}</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
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
