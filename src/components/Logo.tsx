import { useState } from 'react'
import { site } from '../data/site'

/**
 * Brand mark + wordmark used in the navbar and footer.
 *
 * Renders `site.logo` (drop your SVG at `public/logo.svg`). If that file is
 * missing, it falls back to the built-in leaf mark so the header never breaks.
 */
export function Logo({ href = '#home' }: { href?: string }) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <a className="logo" href={href} aria-label={`${site.brand} home`}>
      <span className="logo__mark" aria-hidden>
        {site.logo && !logoFailed ? (
          <img src={site.logo} alt="" width={32} height={32} onError={() => setLogoFailed(true)} />
        ) : (
          <FallbackMark />
        )}
      </span>
      {site.showWordmark ? <span className="logo__text">{site.brand}</span> : null}
    </a>
  )
}

function FallbackMark() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="15" fill="var(--logo-bg)" />
      <path
        d="M22.5 9.5c0 6.2-4.1 10.5-9.6 10.5-1 0-1.9-.1-2.7-.4.4-4.8 3.4-8.2 7.7-9.4-4.6.3-7.9 2.7-9.4 6.6-.6-1.2-.9-2.6-.9-4.1 0-1 .1-1.9.4-2.7 2.6-1.4 5.6-1.6 8.4-1.4 2.2.2 4-.1 6.1-1.5z"
        fill="var(--brand)"
      />
      <path
        d="M8.5 24c1.2-3.2 3.3-5.6 6.2-7.2"
        stroke="var(--brand)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
