/**
 * Resizes and re-encodes the project screenshots.
 *
 * Screenshots come out of a browser at full resolution and several megabytes;
 * the cards are never wider than ~380px, so shipping the originals wastes most
 * of a mobile visitor's data on pixels they never see.
 *
 * sharp is not a dependency of this project — install it only when you need to
 * run this:  npm i -D --no-save sharp && node scripts/optimize-images.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises'
import { extname, join } from 'node:path'
import sharp from 'sharp'

const DIR = new URL('../public/projects/', import.meta.url).pathname
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
