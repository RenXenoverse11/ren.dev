/** Shape produced by the `blog-markdown` Vite plugin (see vite.config.ts). */
declare module '*.md' {
  const post: {
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
  export default post
}
