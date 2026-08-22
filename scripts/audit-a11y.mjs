/**
 * Runs axe-core over the site's routes in both themes and prints what fails.
 *
 * Catches the class of problem that is invisible when you build a site by
 * looking at it: contrast that is fine to your eyes but under 4.5:1, a heading
 * level skipped, a landmark missing. Checking by hand does not find these
 * reliably; this does.
 *
 * Needs the dev server running, and neither dependency is part of the project:
 *   npm run dev
 *   npm i -D --no-save axe-core playwright-core
 *   node scripts/audit-a11y.mjs [port]
 *
 * Exits non-zero when anything fails, so it can gate a commit if you ever want
 * it to.
 */
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core'), 'utf-8')

const PORT = process.argv[2] ?? '5173'
const BASE = `http://localhost:${PORT}`
// One page of each shape: the long scrolling home page, a listing, and an
// article. Every component the site has appears in at least one of them.
const ROUTES = ['/', '/blog', '/blog/how-i-use-ai-to-build']
const THEMES = ['light', 'dark']

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const found = new Map()

for (const theme of THEMES) {
  for (const route of ROUTES) {
    const page = await (
      await browser.newContext({ viewport: { width: 1600, height: 900 } })
    ).newPage()

    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme)

    // Anything still at opacity 0 is treated as hidden and skipped, which would
    // quietly exclude most of the page from the audit.
    await page.evaluate(() =>
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed')),
    )
    // Reveal is a 0.65s animation with a stagger on top. Sampling mid-fade
    // reports interpolated colors as contrast failures, which is noise.
    await page.waitForTimeout(2500)

    await page.addScriptTag({ content: axeSource })
    const { violations } = await page.evaluate(async () =>
      window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      }),
    )

    for (const v of violations) {
      if (!found.has(v.id)) found.set(v.id, { ...v, where: new Set() })
      found.get(v.id).where.add(`${theme}${route}`)
    }

    await page.close()
  }
}

await browser.close()

const RANK = { critical: 0, serious: 1, moderate: 2, minor: 3 }
const all = [...found.values()].sort((a, b) => RANK[a.impact] - RANK[b.impact])

if (all.length === 0) {
  console.log(`No violations across ${ROUTES.length} routes x ${THEMES.length} themes.`)
  process.exit(0)
}

for (const v of all) {
  console.log(`\n[${(v.impact ?? 'n/a').toUpperCase()}] ${v.id} — ${v.help} (${v.nodes.length})`)
  console.log(`  on: ${[...v.where].join(', ')}`)
  for (const node of v.nodes.slice(0, 3)) {
    console.log(`  → ${node.target.join(' ')}`)
    const detail = (node.failureSummary ?? '').split('\n').filter(Boolean).slice(1, 3).join(' | ')
    if (detail) console.log(`    ${detail}`)
  }
}

console.log(`\n${all.length} rule(s) failing.`)
process.exit(1)
