# public/

Static files served as-is from the site root.

## Your photo

Add your hero photo here as **`profile.jpg`** — that is the path `src/data/site.ts`
points at (`photo: '/profile.jpg'`). Using a different name or format is fine; just
update that one field (e.g. `photo: '/laurence.png'`).

- Recommended: square-ish portrait, at least 800×880px, under ~400KB.
- If the file is missing, the hero shows your initials instead of a broken image.

## Your logo

Save your SVG here as **`logo.svg`** — `site.logo` in `src/data/site.ts` already
points at it, and the navbar and footer pick it up automatically. If the file is
missing, a built-in leaf mark is used instead.

- If your SVG already includes the "ren.dev" wordmark, set `showWordmark: false`
  in `src/data/site.ts` so the text is not rendered twice.
- To use it as the browser tab icon too, point the favicon link in `index.html`
  at `/logo.svg` (or replace `public/favicon.svg` with your file).

## Your CV

Drop a `resume.pdf` here to make the "Download CV" button in the About section work.
