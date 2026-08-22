import { TransitionLink } from './TransitionLink'
import { site } from '../data/site'
import { LogoMark } from './LogoMark'

const dotIndex = site.brand.lastIndexOf('.')
const brandName = dotIndex === -1 ? site.brand : site.brand.slice(0, dotIndex)
const brandSuffix = dotIndex === -1 ? '' : site.brand.slice(dotIndex + 1)

/**
 * Brand lockup: the custom "R" SVG mark followed by the wordmark as live text —
 * the name solid, the dot as the accent, the TLD muted.
 *
 * Routes to `/` rather than `#home` so it also works as a way back from a
 * blog post.
 */
export function Logo({ to = '/' }: { to?: string }) {
  return (
    <TransitionLink className="logo" to={to} aria-label={`${site.brand} home`}>
      <LogoMark className="logo__mark" />
      {site.showWordmark ? (
        <span className="logo__text">
          {brandName}
          {brandSuffix ? (
            <>
              <span className="logo__dot">.</span>
              <span className="logo__suffix">{brandSuffix}</span>
            </>
          ) : null}
        </span>
      ) : null}
    </TransitionLink>
  )
}
