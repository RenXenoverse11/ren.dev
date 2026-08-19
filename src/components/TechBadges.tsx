/**
 * Full-color marks for tools whose logo has no single-color form, so they
 * can't go through the brandIcons pipeline. simple-icons carries neither of
 * these (it has F#, not C#, and no Phaser at all), which is why they're
 * hand-held here rather than generated.
 */

/**
 * The classic C# mark: a purple hexagon with a white "C#".
 *
 * Traced from devicon's `csharp` (MIT). Preferred over the .NET-family
 * variant in Iconify's `logos` set, whose glyph is small inside its hexagon
 * and turns to mush at the 20px these chips render at — this one carries a
 * much larger "C#" and stays readable.
 */
export function CSharpBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" aria-hidden>
      <path
        fill="#9b4f96"
        d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7s-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7"
      />
      <path
        fill="#68217a"
        d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7s2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8z"
      />
      <path
        fill="#fff"
        d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20c-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8z"
      />
    </svg>
  )
}

/**
 * Phaser publishes no square icon mark — its only logo is a ~3:1 wordmark
 * (bundled in the npm package as changelog/v4/assets/phaser4-logo.png), which
 * is unreadable at chip size and would just repeat the "Phaser" label beside
 * it. No icon set carries one either: not simple-icons, logos, devicon,
 * skill-icons, or cib.
 *
 * So this is deliberately a generic rounded tile rather than a pretend brand
 * mark. What is authentic is the color: the cyan and magenta are sampled
 * straight from that official wordmark, so the chip still reads as Phaser
 * beside its neighbours.
 */
export function PhaserBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" aria-hidden>
      <defs>
        <linearGradient id="phaser-badge-bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#6CE3F8" />
          <stop offset="55%" stopColor="#48C8F1" />
          <stop offset="100%" stopColor="#F52CE6" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="url(#phaser-badge-bg)" />
      <text
        x="64"
        y="92"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize="78"
        fill="#fff"
      >
        P
      </text>
    </svg>
  )
}

export const techBadges = {
  csharp: CSharpBadge,
  phaser: PhaserBadge,
}
