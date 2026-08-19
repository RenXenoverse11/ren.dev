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
