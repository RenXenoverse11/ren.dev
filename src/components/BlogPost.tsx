import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findPost, formatDate } from '../data/blog'
import { site } from '../data/site'
import { ArrowLeftIcon } from './Icons'
import { NotFound } from './NotFound'

/** A single post at `/blog/:slug`. */
export function BlogPost() {
  const { slug } = useParams()
  const post = findPost(slug)

  // Title is set here rather than in a shared effect so it tracks the post,
  // and is restored on unmount for the routes that don't set their own.
  useEffect(() => {
    if (!post) return
    const previous = document.title
    document.title = `${post.title} | ${site.name}`
    return () => {
      document.title = previous
    }
  }, [post])

  if (!post) return <NotFound />

  return (
    <main>
      <article className="section section--page post">
        <div className="container container--prose">
          <Link className="post__back" to="/blog">
            <ArrowLeftIcon /> All posts
          </Link>

          <header className="post__header">
            <p className="post__meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </p>
            <h1 className="post__title">{post.title}</h1>
            <p className="post__summary">{post.summary}</p>

            <ul className="post__tags">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </header>

          {/* Markdown is compiled at build time from a file in this repo — the
              only author is me, so there is no untrusted input to sanitize. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </article>
    </main>
  )
}
