import { Link } from 'react-router-dom'
import { formatDate, posts } from '../data/blog'
import { revealDelay } from '../hooks/useReveal'
import { SectionHeading } from './SectionHeading'

/** Full listing at `/blog`. */
export function BlogIndex() {
  return (
    <main>
      <section className="section section--page">
        <div className="container">
          <SectionHeading title="Blog" subtitle="Notes on things I've built" />

          {posts.length === 0 ? (
            <p className="blog__empty">Nothing published yet — check back soon.</p>
          ) : (
            <div className="blog__grid">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="post-card card"
                  data-reveal
                  style={revealDelay(index % 3)}
                >
                  <p className="post-card__meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime} min read</span>
                  </p>

                  <h3 className="post-card__title">{post.title}</h3>
                  <p className="post-card__summary">{post.summary}</p>

                  <ul className="post-card__tags">
                    {post.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <span className="post-card__more">Read post</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
