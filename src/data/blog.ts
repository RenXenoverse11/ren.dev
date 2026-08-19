/**
 * Blog index, built from the markdown in `src/content/blog/`.
 *
 * Adding a post means dropping a `.md` file in that folder — the glob picks it
 * up and the filename becomes the URL slug. Nothing here needs editing.
 */

export type Post = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  readingTime: number
  /** Hidden from the built site; still visible in `npm run dev`. */
  draft?: boolean
  /** Cover image served from `public/blog/`. Falls back to a gradient. */
  image?: string
  html: string
}

/** `eager` so posts are part of the main bundle: there are only a handful, and
    a network round-trip per post would show a loading flash on every click. */
const modules = import.meta.glob<{ default: Omit<Post, 'slug'> }>('../content/blog/*.md', {
  eager: true,
})

export const posts: Post[] = Object.entries(modules)
  .map(([path, module]) => ({
    ...module.default,
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
  }))
  // Drafts are readable in `npm run dev` so a post can be previewed in place,
  // and dropped from the build so an unfinished file can't reach the live site
  // just because it was committed.
  .filter((post) => !post.draft || import.meta.env.DEV)
  // Newest first.
  .sort((a, b) => b.date.localeCompare(a.date))

export function findPost(slug: string | undefined): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

/** e.g. '19 August 2026' — spelled out to avoid day/month ambiguity. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** e.g. 'Aug 2026' — for card listings, where the full date is more than needed. */
export function formatMonthYear(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
