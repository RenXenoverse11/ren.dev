import { Link } from 'react-router-dom'
import { formatDate, writeups } from '../data/writeups'
import { revealDelay } from '../hooks/useReveal'
import { SectionHeading } from './SectionHeading'

/** Full listing at `/writeups`. */
export function WriteupsIndex() {
  return (
    <main>
      <section className="section section--page">
        <div className="container">
          <SectionHeading title="Writeups" subtitle="Notes on things I've built" />

          {writeups.length === 0 ? (
            <p className="writeups__empty">Nothing published yet — check back soon.</p>
          ) : (
            <div className="writeups__grid">
              {writeups.map((writeup, index) => (
                <Link
                  key={writeup.slug}
                  to={`/writeups/${writeup.slug}`}
                  className="writeup-card card"
                  data-reveal
                  style={revealDelay(index % 3)}
                >
                  <p className="writeup-card__meta">
                    <time dateTime={writeup.date}>{formatDate(writeup.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{writeup.readingTime} min read</span>
                  </p>

                  <h3 className="writeup-card__title">{writeup.title}</h3>
                  <p className="writeup-card__summary">{writeup.summary}</p>

                  <ul className="writeup-card__tags">
                    {writeup.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <span className="writeup-card__more">Read writeup</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
