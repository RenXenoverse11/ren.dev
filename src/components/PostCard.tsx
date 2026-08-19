import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMonthYear, type Post } from '../data/blog'
import { revealDelay } from '../hooks/useReveal'

/** Cover image when one is present, gradient + emoji until then. */
function PostCover({ post }: { post: Post }) {
  const [failed, setFailed] = useState(false)

  if (post.image && !failed) {
    return (
      <div className="post-card__cover post-card__cover--image">
        <img src={post.image} alt={post.title} loading="lazy" onError={() => setFailed(true)} />
      </div>
    )
  }

  return (
    <div className="post-card__cover" aria-hidden>
      <span>📝</span>
    </div>
  )
}

type PostCardProps = {
  post: Post
  /** Stagger step for the scroll-reveal animation. Omit to skip the reveal entirely. */
  revealStep?: number
  /** 'row' lays the cover beside the text instead of above it — the list view. */
  variant?: 'grid' | 'row'
}

/** One post, as a full-card link. Shared by the homepage teaser and `/blog`. */
export function PostCard({ post, revealStep, variant = 'grid' }: PostCardProps) {
  const isRow = variant === 'row'

  const content = (
    <>
      <PostCover post={post} />

      <div className="post-card__body">
        <p className="post-card__meta">
          <time dateTime={post.date}>{formatMonthYear(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </p>

        <h3 className="post-card__title">{post.title}</h3>
        <p className="post-card__summary">{post.summary}</p>

        {!isRow ? (
          <ul className="post-card__tags">
            {post.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <span className="post-card__more">Read post</span>
      </div>
    </>
  )

  // Reveal is opt-in via revealStep, and only for the grid variant. It's
  // wrong for anywhere the layout can toggle between variants (the /blog
  // grid/list switch): the observer marks a card revealed by mutating its
  // classList directly, outside React. The next time React re-renders that
  // same DOM node with a different className (switching variants), it
  // overwrites the whole class list and wipes that out — and since the
  // observer only fires once per element, it never gets re-revealed, so the
  // card sits at opacity: 0 forever. Omit revealStep wherever the view can
  // change under a card; only a page-load entrance (the homepage teaser) is
  // safe to animate.
  if (isRow || revealStep === undefined) {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={`post-card card${isRow ? ' post-card--row' : ''}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <Link to={`/blog/${post.slug}`} className="post-card card" data-reveal style={revealDelay(revealStep)}>
      {content}
    </Link>
  )
}
