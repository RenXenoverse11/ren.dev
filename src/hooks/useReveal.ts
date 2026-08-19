import { useEffect, type CSSProperties } from 'react'

/**
 * Reveals every `[data-reveal]` element as it scrolls into view.
 *
 * One observer for the whole page rather than a hook per component: a route's
 * markup is static after mount, so a single scan picks up everything, and
 * elements above the fold intersect immediately — which doubles as the on-load
 * entrance.
 *
 * `key` re-runs the scan when it changes. Pass the current pathname: each route
 * mounts its own elements, and an observer only tracks what existed when it was
 * built, so without this a navigated-to page would stay invisible.
 */
export function useReveal(key?: string) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'))

    // Without an observer — or when the visitor asked for less motion — show
    // everything up front. The alternative is a permanently blank page.
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      elements.forEach((element) => element.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          // Reveal once: scrolling back up shouldn't replay it.
          observer.unobserve(entry.target)
        }
      },
      // Waits until the element is a little way in, so it animates while the
      // visitor is looking at it rather than off at the very edge.
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key])
}

/** Staggers one element behind its neighbours, for lists that reveal together. */
export function revealDelay(step: number): CSSProperties {
  return { '--reveal-delay': `${step * 0.07}s` } as CSSProperties
}
