import { TransitionLink } from './TransitionLink'

export function NotFound() {
  return (
    <main>
      <section className="section section--page notfound">
        <div className="container">
          <p className="notfound__code">404</p>
          <h1 className="notfound__title">This page doesn't exist</h1>
          <p className="notfound__text">
            The link may be out of date, or the page may have moved.
          </p>
          <TransitionLink className="button button--primary" to="/">
            Back to home
          </TransitionLink>
        </div>
      </section>
    </main>
  )
}
