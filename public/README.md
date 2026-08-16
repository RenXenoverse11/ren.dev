# public/

Static files served as-is from the site root.

## Your photo

`laurence.jpg` is the hero photo, referenced by `site.photo` in `src/data/site.ts`.
To swap it, drop the new file here and update that one field — if it is ever missing,
the hero shows your initials instead of a broken image.

## Your logo

`logo.svg` is the "R" brand mark. The header and footer render it inline from
`src/components/LogoMark.tsx` so it can inherit the theme color, with "renxen.dev"
beside it as live text — the mark, the name, an accent dot, then a muted TLD. The
wordmark is split from `site.brand`, so renaming the brand is a one-line change.

- Editing the artwork means updating **both** `public/logo.svg` and `LogoMark.tsx`.
- `favicon.svg` is the same mark in brand green on a dark tile.
- Set `showWordmark: false` in `src/data/site.ts` to show the mark on its own.

## Your resume

`LAURENCE-BAGAAN_RESUME.pdf`, referenced by `site.resume` in `src/data/site.ts`. That
filename is what lands in a visitor's downloads folder, so it's set on purpose rather
than a generic `resume.pdf`. Both the navbar's download icon and the About section's
"Download Resume" button point at this same field — swap the file and update
`site.resume` together if you ever rename it.
