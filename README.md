# renxen.dev

Personal portfolio site for **Laurence Jan Bagaan** — Full Stack Web and Mobile Developer.

Built with React 18, TypeScript, and Vite. No UI framework — hand-written CSS with
design tokens, so light and dark themes are a single set of variables.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # types only
```

## Editing the content

Everything shown on the site lives in [`src/data/site.ts`](src/data/site.ts) — name,
role, tagline, about copy, stats, skills and their levels, projects, social links, and
nav items. Edit that file and the components pick it up; no markup changes needed.

## Branding

The hero photo is `public/laurence.jpg` and the "R" mark is `public/logo.svg`, drawn
inline by `src/components/LogoMark.tsx` so it follows the theme. The wordmark next to
it is real text, not part of the SVG. See [`public/README.md`](public/README.md) for
how to swap either one.

## Contact form

By default the form validates and then opens the visitor's mail client with the message
pre-filled (`mailto:`). To collect submissions instead, create a
[Formspree](https://formspree.io) form and set `contactEndpoint` in `src/data/site.ts`
to its endpoint URL — the form posts JSON there and shows inline success/error states.

## Dark mode

The toggle in the navbar flips `data-theme` on `<html>` and remembers the choice in
`localStorage`. Until a visitor picks one, the site follows their OS preference.

## Structure

```
src/
  components/   Navbar, Hero, About, Skills, Projects, Contact, Footer, icons
  data/site.ts  all site content
  hooks/        useTheme (dark mode), useScrollSpy (active nav link)
  styles/       index.css — tokens, layout, responsive rules
```

## Deploying

- **Vercel** — import the repo; `vercel.json` sets the build command and output dir.
- **Netlify** — `netlify.toml` is included with build settings and SPA redirects.
- Any static host works: run `npm run build` and serve `dist/`.

GitHub Actions runs a type-check and build on every push and pull request
(`.github/workflows/ci.yml`).
