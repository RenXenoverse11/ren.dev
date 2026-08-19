# public/projects/

Screenshots for the project cards, referenced by `image` in `src/data/site.ts`.

| File | Card |
| --- | --- |
| `mindaride.webp` | MindaRide |
| `IMS-dashboard.webp` | Internship Management System |
| `tsi-kpi-dashboard.webp` | KPI Monitoring Dashboard |
| `first-aid-cabinet.webp` | First Aid Adventure |
| `the-last-aethon.webp` | The Last Aethon |

- The frame is **16:9** and the image is cropped from the top by default —
  fine for a browser screenshot, wrong for a portrait photo like
  `first-aid-cabinet.webp`. Set `imagePosition` on that project in
  `src/data/site.ts` (a CSS `object-position` value) to point the crop at
  whatever part of the shot actually matters.
- Drop a new PNG or JPG here, then run the optimizer — it resizes to 1200px
  wide, converts to WebP, and deletes the original:

  ```bash
  npm i -D --no-save sharp && node scripts/optimize-images.mjs
  ```

  Point `image` at the resulting `.webp`. Straight off a browser these files
  run to a megabyte or more; through the optimizer they land under 50KB.
- A missing file is not a broken card: it falls back to the emoji on a green
  gradient.
