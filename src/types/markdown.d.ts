/** Shape produced by the `writeups-markdown` Vite plugin (see vite.config.ts). */
declare module '*.md' {
  const writeup: {
    title: string
    /** ISO date, e.g. '2026-08-19'. */
    date: string
    summary: string
    tags: string[]
    /** Minutes, shown on the card. */
    readingTime: number
    /** Rendered from the markdown body at build time. */
    html: string
  }
  export default writeup
}
