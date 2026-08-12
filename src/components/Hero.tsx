import { useMemo, useState } from 'react'
import { site, socials } from '../data/site'
import { ArrowDownIcon, MailIcon, socialIcons } from './Icons'

/** Decorative squares scattered behind the hero, matching the reference design. */
const squares = [
  { top: '12%', left: '11%', size: 14, delay: 0 },
  { top: '30%', left: '4%', size: 10, delay: 1.2 },
  { top: '72%', left: '14%', size: 16, delay: 2.1 },
  { top: '78%', left: '9%', size: 10, delay: 0.6 },
  { top: '58%', left: '52%', size: 12, delay: 1.6 },
  { top: '62%', left: '48%', size: 18, delay: 2.6 },
  { top: '90%', left: '47%', size: 12, delay: 0.9 },
  { top: '16%', left: '75%', size: 14, delay: 1.8 },
  { top: '20%', left: '91%', size: 16, delay: 0.4 },
  { top: '26%', left: '90%', size: 12, delay: 2.3 },
  { top: '34%', left: '84%', size: 10, delay: 1.1 },
  { top: '48%', left: '92%', size: 14, delay: 2.8 },
  { top: '55%', left: '87%', size: 10, delay: 0.2 },
  { top: '82%', left: '80%', size: 12, delay: 1.4 },
]

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function Hero() {
  const [photoFailed, setPhotoFailed] = useState(false)
  const initials = useMemo(() => initialsOf(site.name), [])

  return (
    <section className="hero section" id="home">
      <div className="hero__squares" aria-hidden>
        {squares.map((square, index) => (
          <span
            key={index}
            className="hero__square"
            style={{
              top: square.top,
              left: square.left,
              width: square.size,
              height: square.size,
              animationDelay: `${square.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            {site.greeting} <span className="hero__name">{site.name}</span>
          </h1>
          <p className="hero__role">{site.role}</p>
          <p className="hero__tagline">{site.tagline}</p>

          <div className="hero__buttons">
            <a className="button button--primary" href="#contact">
              <MailIcon /> Hire Me
            </a>
            <a className="button button--ghost" href="#projects">
              View Projects <ArrowDownIcon />
            </a>
          </div>

          <div className="hero__socials">
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

        <div className="hero__photo-wrap">
          <span className="hero__photo-backdrop" aria-hidden />
          <div className="hero__photo">
            {photoFailed ? (
              <div className="hero__photo-fallback" role="img" aria-label={site.name}>
                {initials}
              </div>
            ) : (
              <img
                src={site.photo}
                alt={site.name}
                loading="eager"
                onError={() => setPhotoFailed(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
