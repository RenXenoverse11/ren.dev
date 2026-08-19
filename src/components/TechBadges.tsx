/**
 * Full-color hexagon marks for tools whose brand identity has no
 * single-color logo (so they can't go through the brandIcons pipeline).
 */

export function CSharpBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 285" aria-hidden>
      <defs>
        <linearGradient id="csharp-badge-bg" x1="17.42%" x2="56.516%" y1="21.86%" y2="97.437%">
          <stop offset="0%" stopColor="#927be5" />
          <stop offset="100%" stopColor="#512bd4" />
        </linearGradient>
      </defs>
      <path
        fill="url(#csharp-badge-bg)"
        d="M0 89.355v105.576c0 13.06 6.967 25.14 18.286 31.666l91.429 52.794a36.56 36.56 0 0 0 36.571 0l91.429-52.794A36.56 36.56 0 0 0 256 194.93V89.356a36.56 36.56 0 0 0-18.285-31.672l-91.43-52.78a36.55 36.55 0 0 0-36.57 0l-91.43 52.78A36.57 36.57 0 0 0 0 89.356"
      />
      <path
        fill="#fff"
        d="M64.003 123.872v36.575a9.13 9.13 0 0 0 9.145 9.145a9.14 9.14 0 0 0 9.145-9.145a9.142 9.142 0 1 1 18.285 0c0 15.149-12.28 27.43-27.43 27.43s-27.43-12.281-27.43-27.43v-36.57c0-15.15 12.28-27.43 27.43-27.43s27.43 12.28 27.43 27.43a9.142 9.142 0 0 1-18.285 0a9.142 9.142 0 1 0-18.285 0zm146.29 36.575a9.134 9.134 0 0 1-9.146 9.145h-9.145v9.14c0 2.427-.96 4.753-2.678 6.466a9.124 9.124 0 0 1-12.928 0a9.17 9.17 0 0 1-2.679-6.467v-9.14h-18.284v9.14a9.124 9.124 0 0 1-9.146 9.146a9.124 9.124 0 0 1-9.14-9.146v-9.14h-9.15a9.142 9.142 0 0 1 0-18.284h9.145v-18.285h-9.145a9.142 9.142 0 0 1 0-18.285h9.145v-9.145a9.142 9.142 0 0 1 18.285 0v9.14h18.285v-9.14a9.142 9.142 0 0 1 18.285 0v9.14h9.145a9.12 9.12 0 0 1 6.461 2.678a9.124 9.124 0 0 1 0 12.928a9.13 9.13 0 0 1-6.46 2.684h-9.146v18.285h9.145a9.166 9.166 0 0 1 9.145 9.14zm-36.576-27.425h-18.284v18.285h18.284z"
      />
    </svg>
  )
}

/**
 * Phaser has no official hexagon mark — this reuses the C# hexagon's
 * outline so the pair reads as one family, filled with the blue lifted
 * from Phaser's own "planet" logo (cdn.phaser.io/images/logo/phaser-logo.svg)
 * instead of an invented color.
 */
export function PhaserBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 285" aria-hidden>
      <defs>
        <linearGradient id="phaser-badge-bg" x1="17.42%" x2="56.516%" y1="21.86%" y2="97.437%">
          <stop offset="0%" stopColor="#bfebfd" />
          <stop offset="100%" stopColor="#3d6fa8" />
        </linearGradient>
      </defs>
      <path
        fill="url(#phaser-badge-bg)"
        d="M0 89.355v105.576c0 13.06 6.967 25.14 18.286 31.666l91.429 52.794a36.56 36.56 0 0 0 36.571 0l91.429-52.794A36.56 36.56 0 0 0 256 194.93V89.356a36.56 36.56 0 0 0-18.285-31.672l-91.43-52.78a36.55 36.55 0 0 0-36.57 0l-91.43 52.78A36.57 36.57 0 0 0 0 89.356"
      />
      <text
        x="128"
        y="160"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="76"
        fill="#fff"
      >
        Ph
      </text>
    </svg>
  )
}

export const techBadges = {
  csharp: CSharpBadge,
  phaser: PhaserBadge,
}
