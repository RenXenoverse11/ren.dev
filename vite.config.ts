import { readFileSync } from 'node:fs'
import matter from 'gray-matter'
import { marked } from 'marked'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Compiles `.md` imports to `{ ...frontmatter, html }` at build time.
 *
 * Parsing here rather than in the browser keeps `marked` and `gray-matter` as
 * dev dependencies — the bundle ships plain HTML strings instead of a markdown
 * parser, which would otherwise cost more than every writeup combined.
 */
function markdown(): Plugin {
  return {
    name: 'writeups-markdown',
    enforce: 'pre',
    async transform(_code, id) {
      if (!id.endsWith('.md')) return null

      // Read from disk rather than using `_code`: Vite may hand this over
      // after other transforms, and frontmatter must be parsed off the raw file.
      const raw = readFileSync(id, 'utf-8')
      const { data, content } = matter(raw)
      const html = await marked.parse(content, { async: true })

      return {
        code: `export default ${JSON.stringify({ ...data, html })}`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [markdown(), react()],
})
