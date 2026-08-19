import { useState } from 'react'
import { posts } from '../data/blog'
import { GridIcon, ListIcon } from './Icons'
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
            <p className="blog__empty">Nothing published yet — check back soon.</p>
          ) : (
            <div className={view === 'grid' ? 'blog__grid' : 'blog__list'}>
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} revealStep={index % 3} variant={view} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
