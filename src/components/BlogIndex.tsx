import { useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../data/blog'
import { revealDelay } from '../hooks/useReveal'
import { GridIcon, ListIcon, MailIcon } from './Icons'
import { PostCard } from './PostCard'
import { SectionHeading } from './SectionHeading'

type View = 'grid' | 'row'

/** Full listing at `/blog`. */
export function BlogIndex() {
  const [view, setView] = useState<View>('grid')

  return (
    <main>
      <section className="section section--page">
        <div className="container">
          <SectionHeading title="Blog" subtitle="Notes on things I've built" />

          {posts.length > 0 ? (
            <div className="blog__toolbar">
              <div className="view-toggle" role="group" aria-label="Post layout">
                <button
                  type="button"
                  className={`view-toggle__button${view === 'grid' ? ' view-toggle__button--active' : ''}`}
                  aria-pressed={view === 'grid'}
                  aria-label="Grid view"
                  onClick={() => setView('grid')}
                >
                  <GridIcon />
                </button>
                <button
                  type="button"
                  className={`view-toggle__button${view === 'row' ? ' view-toggle__button--active' : ''}`}
                  aria-pressed={view === 'row'}
                  aria-label="List view"
                  onClick={() => setView('row')}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          ) : null}

          {posts.length === 0 ? (
            <p className="blog__empty">Nothing published yet. Check back soon.</p>
          ) : (
            <div className={view === 'grid' ? 'blog__grid' : 'blog__list'}>
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} variant={view} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* /blog is a standalone route rather than a section in the Home scroll
          (each post needs its own shareable URL), so scrolling past the grid
          hits the end of the page with nowhere further to go. This closes
          that dead end with the same links the one-page flow would have led
          into next. */}
      <section className="section blog-continue" data-reveal>
        <div className="container blog-continue__inner">
          <h2 className="blog-continue__title">Looking for something else?</h2>
          <p className="blog-continue__text">
            Here's the rest of the portfolio: what I do, what I've built, and how to reach me.
          </p>

          <div className="blog-continue__links" data-reveal style={revealDelay(1)}>
            <Link className="button button--ghost" to="/#about">
              About Me
            </Link>
            <Link className="button button--ghost" to="/#projects">
              View Projects
            </Link>
            <Link className="button button--primary" to="/#contact">
              <MailIcon /> Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
