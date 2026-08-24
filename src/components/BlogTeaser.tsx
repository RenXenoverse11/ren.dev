import { TransitionLink } from './TransitionLink'
import { posts } from '../data/blog'
import { ArrowDownIcon } from './Icons'
import { PostCard } from './PostCard'
import { SectionHeading } from './SectionHeading'

/** All published posts, teased on the home page. */
export function BlogTeaser() {
  // No posts yet: render nothing rather than an empty section, which reads as
  // abandoned. The nav link hides on the same condition.
  if (posts.length === 0) return null

  return (
    <section className="section blog">
      <div className="container" id="blog">
        <SectionHeading title="Blog" subtitle="Notes on things I've built" />

        <div className="blog__grid">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} revealStep={index} />
          ))}
        </div>

        {posts.length > 3 ? (
          <div className="blog__actions" data-reveal>
            <TransitionLink className="button button--ghost" to="/blog">
              All posts <ArrowDownIcon />
            </TransitionLink>
          </div>
        ) : null}
      </div>
    </section>
  )
}
