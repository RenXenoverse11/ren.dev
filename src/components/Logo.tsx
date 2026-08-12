import { site } from '../data/site'
import { LogoMark } from './LogoMark'

/**
 * Brand lockup: the custom "R" SVG mark followed by the wordmark as live text —
 * "ren" solid, the dot as the accent, "dev" muted.
 */
export function Logo({ href = '#home' }: { href?: string }) {
  return (
    <a className="logo" href={href} aria-label={`${site.brand} home`}>
      <LogoMark className="logo__mark" />
      {site.showWordmark ? (
        <span className="logo__text">
          ren<span className="logo__dot">.</span>
          <span className="logo__suffix">dev</span>
        </span>
      ) : null}
    </a>
  )
}
