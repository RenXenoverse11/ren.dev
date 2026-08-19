import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { site } from '../data/site'
import { findWriteup, formatDate } from '../data/writeups'
import { ArrowLeftIcon } from './Icons'
import { NotFound } from './NotFound'

/** A single writeup at `/writeups/:slug`. */
export function WriteupPage() {
  const { slug } = useParams()
  const writeup = findWriteup(slug)

  // Title is set here rather than in a shared effect so it tracks the post,
  // and is restored on unmount for the routes that don't set their own.
  useEffect(() => {
    if (!writeup) return
    const previous = document.title
    document.title = `${writeup.title} — ${site.name}`
    return () => {
      document.title = previous
    }
  }, [writeup])

  if (!writeup) return <NotFound />

  return (
    <main>
      <article className="section section--page writeup">
        <div className="container container--prose">
          <Link className="writeup__back" to="/writeups">
            <ArrowLeftIcon /> All writeups
          </Link>

          <header className="writeup__header">
            <p className="writeup__meta">
              <time dateTime={writeup.date}>{formatDate(writeup.date)}</time>
              <span aria-hidden>·</span>
              <span>{writeup.readingTime} min read</span>
            </p>
            <h1 className="writeup__title">{writeup.title}</h1>
            <p className="writeup__summary">{writeup.summary}</p>

            <ul className="writeup__tags">
              {writeup.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </header>

          {/* Markdown is compiled at build time from a file in this repo — the
              only author is me, so there is no untrusted input to sanitize. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: writeup.html }} />
        </div>
      </article>
    </main>
  )
}
