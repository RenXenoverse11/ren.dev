/**
 * Gives every route its own HTML file with its own metadata.
 *
 * This site renders on the client, so without this step every URL serves the
 * one `index.html` and therefore one `<title>` and one description. Google can
 * run the JS and eventually sort that out; the social scrapers behind link
 * previews (Facebook, LinkedIn, Slack, X) do not run JS at all, so every shared
 * link would preview as the home page regardless of what was actually shared.
 *
 * The fix that does not cost the visitor anything: after `vite build`, stamp a
 * copy of the built HTML per route with that route's tags baked in. Same JS
 * bundle, same hashed asset URLs, no SSR framework, no runtime dependency, no
 * added bytes. A scraper reads the static head; a visitor still gets the SPA.
 *
 * Static files win over the SPA rewrite on both Vercel and Netlify, so
 * `dist/blog/foo/index.html` is served for /blog/foo while unknown paths still
 * fall through to the app's own 404 route.
 *
 * Also emits sitemap.xml and robots.txt, for the same reason and at the same
 * time: they need the same route list, and deriving it twice invites drift.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')
const POSTS_DIR = join(ROOT, 'src', 'content', 'blog')

// Imported rather than duplicated: Node strips the types, so the generator and
// the app read the same source of truth and cannot drift apart.
const { site, socials } = await import('../src/data/site.ts')

const ORIGIN = site.url.replace(/\/$/, '')
const OG_IMAGE = `${ORIGIN}/og-image.png`

/** Escapes a value for use inside a double-quoted HTML attribute. */
const attr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Escapes text content, which needs no quote handling but must not break tags. */
const text = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * `</script>` anywhere inside a JSON-LD payload would close the block early and
 * spill the rest of the graph into the document as markup.
 */
const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

/** Collects published posts. Drafts are excluded exactly as the app excludes them. */
async function loadPosts() {
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'))
  const posts = []

  for (const file of files) {
    const { data } = matter(await readFile(join(POSTS_DIR, file), 'utf-8'))
    if (data.draft) continue
    posts.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title,
      summary: data.summary,
      date: data.date,
      tags: data.tags ?? [],
      image: data.image ? `${ORIGIN}${data.image}` : OG_IMAGE,
    })
  }

  return posts.sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

/** The tag block that replaces the marked region of the built HTML. */
function head({ title, description, path, image, type = 'website', schema }) {
  const url = `${ORIGIN}${path}`

  return [
    `<title>${text(title)}</title>`,
    `<meta name="description" content="${attr(description)}" />`,
    `<link rel="canonical" href="${attr(url)}" />`,

    `<meta property="og:type" content="${attr(type)}" />`,
    `<meta property="og:site_name" content="${attr(site.brand)}" />`,
    `<meta property="og:title" content="${attr(title)}" />`,
    `<meta property="og:description" content="${attr(description)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${attr(`${site.name} — ${site.role}`)}" />`,

    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(title)}" />`,
    `<meta name="twitter:description" content="${attr(description)}" />`,
    `<meta name="twitter:image" content="${attr(image)}" />`,

    `<script type="application/ld+json">${jsonLd(schema)}</script>`,
  ]
    .map((line) => `    ${line}`)
    .join('\n')
}

const personSchema = {
  '@type': 'Person',
  '@id': `${ORIGIN}/#person`,
  name: site.name,
  url: ORIGIN,
  image: `${ORIGIN}${site.photo}`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: site.location },
  // Verified profile links are how a knowledge graph ties this page to the
  // same person elsewhere; mailto is excluded since it is not a profile.
  sameAs: socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
}

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf-8')
  const markers = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

  if (!markers.test(template)) {
    throw new Error(
      'dist/index.html has no <!-- seo:start --> block. index.html must keep those markers.',
    )
  }

  const posts = await loadPosts()

  const routes = [
    {
      path: '/',
      title: `${site.name} — ${site.role}`,
      description: site.tagline,
      image: OG_IMAGE,
      schema: {
        '@context': 'https://schema.org',
        '@graph': [
          personSchema,
          {
            '@type': 'WebSite',
            '@id': `${ORIGIN}/#website`,
            url: ORIGIN,
            name: site.brand,
            description: site.tagline,
            publisher: { '@id': `${ORIGIN}/#person` },
          },
        ],
      },
    },
    {
      path: '/blog',
      title: `Blog — ${site.name}`,
      description: `Notes on things I've built: ${posts
        .slice(0, 3)
        .map((p) => p.title)
        .join(', ')}.`,
      image: OG_IMAGE,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${ORIGIN}/blog#blog`,
        url: `${ORIGIN}/blog`,
        name: `Blog — ${site.name}`,
        author: { '@id': `${ORIGIN}/#person` },
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${ORIGIN}/blog/${p.slug}`,
          datePublished: p.date,
        })),
      },
    },
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      title: `${post.title} — ${site.name}`,
      description: post.summary,
      image: post.image,
      type: 'article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.summary,
        image: post.image,
        datePublished: post.date,
        dateModified: post.date,
        url: `${ORIGIN}/blog/${post.slug}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${ORIGIN}/blog/${post.slug}` },
        author: { '@id': `${ORIGIN}/#person` },
        publisher: { '@id': `${ORIGIN}/#person` },
        keywords: post.tags.join(', '),
      },
    })),
  ]

  for (const route of routes) {
    const html = template.replace(markers, head(route).trimStart())
    // '/' is dist/index.html; every other route becomes a directory index so
    // the host serves it for the extensionless URL.
    const target = route.path === '/' ? DIST : join(DIST, route.path)
    await mkdir(target, { recursive: true })
    await writeFile(join(target, 'index.html'), html, 'utf-8')
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => {
      const post = posts.find((p) => `/blog/${p.slug}` === route.path)
      return [
        '  <url>',
        `    <loc>${text(ORIGIN + route.path)}</loc>`,
        post ? `    <lastmod>${text(post.date)}</lastmod>` : '',
        `    <changefreq>${route.path === '/' ? 'monthly' : 'yearly'}</changefreq>`,
        `    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    }),
    '</urlset>',
    '',
  ].join('\n')

  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf-8')

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${ORIGIN}/sitemap.xml`,
    '',
  ].join('\n')

  await writeFile(join(DIST, 'robots.txt'), robots, 'utf-8')

  console.log(
    `postbuild: ${routes.length} routes (${posts.length} posts), sitemap.xml, robots.txt`,
  )
}

await main()
