/**
 * Renders the 1200x630 social preview card to `public/og-image.png`.
 *
 * Run this only when the name, role, or brand treatment changes — the output
 * is committed like any other asset, so the production build stays dependency
 * free and deterministic. Nothing here runs on Vercel.
 *
 * A headless browser rather than an image library, deliberately: the card uses
 * Fraunces and Poppins from Google Fonts, and neither is installed on a build
 * machine. Compositing text with sharp would silently fall back to a system
 * serif and quietly stop matching the site. A real browser loads the real
 * fonts, so the card is the same typeface visitors already see.
 *
 * playwright-core is not a dependency of this project — install it only when
 * you need to run this:
 *   npm i -D --no-save playwright-core && node scripts/generate-og-image.mjs
 */
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'public', 'og-image.png')

// Pulled straight from the site's own tokens so the card cannot drift out of
// sync with the palette it is advertising.
const NAME = 'Laurence Jan Bagaan'
const ROLE = 'Full-Stack Web and Mobile Developer'
const BRAND = 'renxen.dev'
const TAGLINE = 'Building responsive web and mobile experiences with clean design and reliable engineering.'

// Inlined as a data URI: the page is loaded from a temp dir, so a relative
// path would not resolve back to public/.
const photo = readFileSync(join(ROOT, 'public', 'laurence.jpg')).toString('base64')

// The mark ships as `fill="currentColor"` so it can inherit the theme's text
// color in the app. Inside an <img> there is no inherited color to pick up and
// it renders black, i.e. invisible on this card. Bake the light value in.
const logo = readFileSync(join(ROOT, 'public', 'logo.svg'), 'utf-8')
  .replace(/currentColor/g, '#f1f7f4')
const logoData = Buffer.from(logo, 'utf-8').toString('base64')

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600..800&display=swap"
      rel="stylesheet"
    />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1200px;
        height: 630px;
        display: flex;
        align-items: center;
        gap: 56px;
        padding: 0 72px;
        background: #0c1512;
        font-family: 'Poppins', sans-serif;
        color: #f1f7f4;
        overflow: hidden;
        position: relative;
      }
      /* The same soft green wash the hero sits on. */
      body::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 78% 50%, rgba(34, 197, 94, 0.18), transparent 55%);
      }
      .copy { position: relative; flex: 1; min-width: 0; }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 30px;
      }
      .brand img { height: 34px; }
      .brand span { font-size: 25px; font-weight: 700; letter-spacing: -0.01em; }
      .brand span b { color: #22c55e; font-weight: 700; }
      h1 {
        font-family: 'Fraunces', serif;
        font-size: 68px;
        font-weight: 800;
        line-height: 1.04;
        letter-spacing: -0.03em;
        color: #22c55e;
        margin-bottom: 20px;
      }
      .role {
        font-size: 27px;
        font-weight: 500;
        color: #d5e3dc;
        margin-bottom: 18px;
      }
      .tagline {
        font-size: 19px;
        line-height: 1.55;
        color: #90a49b;
        max-width: 33ch;
      }
      /* Mirrors the hero's offset-panel-behind-photo treatment. */
      .shot { position: relative; width: 340px; height: 368px; flex: none; }
      .shot .panel {
        position: absolute;
        inset: -18px -18px 18px 18px;
        border-radius: 16px;
        background: #22c55e;
        transform: rotate(5deg);
      }
      .shot .frame {
        position: absolute;
        inset: 0;
        border-radius: 16px;
        overflow: hidden;
        transform: rotate(-2deg);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      }
      .shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
    </style>
  </head>
  <body>
    <div class="copy">
      <div class="brand">
        <img src="data:image/svg+xml;base64,${logoData}" alt="" />
        <span>renxen<b>.dev</b></span>
      </div>
      <h1>${NAME}</h1>
      <p class="role">${ROLE}</p>
      <p class="tagline">${TAGLINE}</p>
    </div>
    <div class="shot">
      <div class="panel"></div>
      <div class="frame"><img src="data:image/jpeg;base64,${photo}" alt="" /></div>
    </div>
  </body>
</html>`

const dir = await mkdtemp(join(tmpdir(), 'og-'))
const page = join(dir, 'card.html')
await writeFile(page, html, 'utf-8')

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const tab = await (await browser.newContext({ viewport: { width: 1200, height: 630 } })).newPage()
await tab.goto(`file://${page.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' })
// Webfonts land after networkidle often enough to matter; the card is a
// one-shot asset, so waiting is cheaper than shipping a fallback-serif render.
await tab.evaluate(() => document.fonts.ready)
await tab.waitForTimeout(400)
await tab.screenshot({ path: OUT })
await browser.close()
await rm(dir, { recursive: true, force: true })

console.log(`wrote ${OUT} (1200x630)`)
