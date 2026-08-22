import { type ComponentProps, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'

/**
 * A `<Link>` that cross-fades between routes via the View Transitions API.
 *
 * React Router ships a `viewTransition` prop, but the code that actually calls
 * `document.startViewTransition` lives inside `RouterProvider` — the data
 * router. This app uses `<BrowserRouter>` + `<Routes>`, where that prop is
 * accepted, threaded through, and then silently never acted on. Rather than
 * restructure routing for an animation, the ~20 lines it actually takes live
 * here.
 *
 * Everything about `<Link>` is preserved: this only takes over the plain
 * left-click that would navigate in this tab, and hands every other case back
 * to the router untouched.
 */
export function TransitionLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  const navigate = useNavigate()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    // Anything that is not a bare left-click is someone asking for a new tab,
    // a download, or a context menu. Let the browser and the router do what
    // they already do correctly.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (props.target && props.target !== '_self') ||
      typeof props.to !== 'string'
    ) {
      return
    }

    // No support, or the visitor asked their OS for less motion: navigate
    // normally. The CSS opts out too, but not starting a transition at all is
    // cheaper than starting one and animating it to nothing.
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    event.preventDefault()
    // flushSync forces the route swap to land synchronously inside the
    // callback. Without it React may defer the re-render past the moment the
    // browser snapshots the "after" state, and the transition captures the old
    // page twice — a fade from a page to itself.
    document.startViewTransition(() => {
      flushSync(() => navigate(props.to as string))
    })
  }

  return <Link {...props} onClick={handleClick} />
}
