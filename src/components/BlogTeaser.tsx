import { Link } from 'react-router-dom'
import { formatDate, posts } from '../data/blog'
import { revealDelay } from '../hooks/useReveal'
import { ArrowDownIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

/** The three newest posts, teased on the home page. */
export function BlogTeaser() {
  // No posts yet: render nothing rather than an empty section, which reads as
  // abandoned. The nav link hides on the same condition.
  if (posts.length === 0) return null

  return (
    <section className="section blog" id="blog">
      <div className="container">
        <SectionHeading title="Blog" subtitle="Notes on things I've built" />

        <div className="blog__grid">
          {posts.slice(0, 3).map((post, index) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="post-card card"
              data-reveal
              style={revealDelay(index)}
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

        {posts.length > 3 ? (
          <div className="blog__actions" data-reveal>
            <Link className="button button--ghost" to="/blog">
              All posts <ArrowDownIcon />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
