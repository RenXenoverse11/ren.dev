/**
 * Writeups index, built from the markdown in `src/content/writeups/`.
 *
 * Adding a post means dropping a `.md` file in that folder — the glob picks it
 * up and the filename becomes the URL slug. Nothing here needs editing.
 */

export type Writeup = {
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
const modules = import.meta.glob<{ default: Omit<Writeup, 'slug'> }>(
  '../content/writeups/*.md',
  { eager: true },
)

export const writeups: Writeup[] = Object.entries(modules)
  .map(([path, module]) => ({
    ...module.default,
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
  }))
  // Newest first.
  .sort((a, b) => b.date.localeCompare(a.date))

export function findWriteup(slug: string | undefined): Writeup | undefined {
  return writeups.find((writeup) => writeup.slug === slug)
}

/** e.g. '19 August 2026' — spelled out to avoid day/month ambiguity. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
