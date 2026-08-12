# public/

Static files served as-is from the site root.

## Your photo

`laurence.jpg` is the hero photo, referenced by `site.photo` in `src/data/site.ts`.
To swap it, drop the new file here and update that one field — if it is ever missing,
the hero shows your initials instead of a broken image.

## Your logo

`logo.svg` is the "R" brand mark. The header and footer render it inline from
`src/components/LogoMark.tsx` so it can inherit the theme color, with "ren.dev"
beside it as live text — mark, then `ren`, an accent dot, and a muted `dev`.

- Editing the artwork means updating **both** `public/logo.svg` and `LogoMark.tsx`.
- `favicon.svg` is the same mark in brand green on a dark tile.
- Set `showWordmark: false` in `src/data/site.ts` to show the mark on its own.

## Your CV

Drop a `resume.pdf` here to make the "Download CV" button in the About section work.
