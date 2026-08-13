/**
 * Generates src/data/brandIcons.ts from simple-icons.
 *
 * Only the marks the site actually uses are written out, so the bundle carries
 * a handful of paths instead of the whole icon set. simple-icons stays a dev
 * dependency — nothing from it ships at runtime.
 *
 * Run: node scripts/gen-brand-icons.mjs
 */
import { writeFileSync } from 'node:fs'
import * as icons from 'simple-icons'

const slugs = [
  'react',
  'typescript',
  'svelte',
  'angular',
  'vuedotjs',
  'jquery',
  'tailwindcss',
  'threedotjs',
  'framer',
  'nodedotjs',
  'laravel',
  'supabase',
  'postgresql',
  'googleappsscript',
  'googlesheets',
  'vite',
  'git',
  'github',
  'vercel',
  'cloudflare',
  'mapbox',
  'leaflet',
  'flutter',
  'dart',
  'androidstudio',
]

/** Relative luminance, to spot marks that would vanish on a dark background. */
function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

const entries = slugs.map((slug) => {
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1)
  const icon = icons[key]
  if (!icon) throw new Error(`simple-icons has no icon for "${slug}"`)

  // Near-black marks (GitHub, Vercel, three.js…) need a light variant to stay
  // visible in dark mode.
  const dark = luminance(icon.hex) < 0.06 ? '#FFFFFF' : null

  return `  ${slug}: {\n    title: ${JSON.stringify(icon.title)},\n    hex: '#${icon.hex}',\n${
    dark ? `    darkHex: '${dark}',\n` : ''
  }    path: '${icon.path}',\n  },`
})

const file = `/**
 * Brand marks used by the Skills section.
 *
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/gen-brand-icons.mjs
 */

export type BrandIcon = {
  title: string
  hex: string
  /** Substituted in dark mode when the brand color is too dark to see. */
  darkHex?: string
  path: string
}

export const brandIcons: Record<string, BrandIcon> = {
${entries.join('\n')}
}
`

writeFileSync(new URL('../src/data/brandIcons.ts', import.meta.url), file)
console.log(`wrote ${slugs.length} icons`)
