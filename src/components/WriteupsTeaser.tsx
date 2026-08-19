import { Link } from 'react-router-dom'
import { formatDate, writeups } from '../data/writeups'
import { revealDelay } from '../hooks/useReveal'
import { ArrowDownIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

/** The three newest writeups, teased on the home page. */
export function WriteupsTeaser() {
  // No posts yet: render nothing rather than an empty section, which reads as
  // abandoned. The nav link hides on the same condition.
  if (writeups.length === 0) return null

  return (
    <section className="section writeups" id="writeups">
      <div className="container">
        <SectionHeading title="Writeups" subtitle="Notes on things I've built" />

        <div className="writeups__grid">
          {writeups.slice(0, 3).map((writeup, index) => (
            <Link
              key={writeup.slug}
              to={`/writeups/${writeup.slug}`}
              className="writeup-card card"
              data-reveal
              style={revealDelay(index)}
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

        {writeups.length > 3 ? (
          <div className="writeups__actions" data-reveal>
            <Link className="button button--ghost" to="/writeups">
              All writeups <ArrowDownIcon />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
