/**
 * Resizes and re-encodes screenshots/covers dropped into a public/ folder.
 *
 * Screenshots come out of a browser (or an image generator) at full
 * resolution and several megabytes; the cards that display them are never
 * wider than ~380px, so shipping the originals wastes most of a mobile
 * visitor's data on pixels they never see.
 *
 * sharp is not a dependency of this project — install it only when you need
 * to run this:
 *   npm i -D --no-save sharp && node scripts/optimize-images.mjs [dir]
 * `dir` is relative to `public/` and defaults to `projects`.
 */
import { readdir, stat, unlink } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const target = process.argv[2] ?? 'projects'
const DIR = fileURLToPath(new URL(`../public/${target}/`, import.meta.url))
const WIDTH = 1200
const QUALITY = 80

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`

const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f))

for (const file of files) {
  const source = join(DIR, file)
  const target = join(DIR, file.replace(extname(file), '.webp'))

  const before = (await stat(source)).size
  await sharp(source).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(target)
  const after = (await stat(target)).size

  await unlink(source)
  console.log(`${file}  ${kb(before)} -> ${kb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`)
}
