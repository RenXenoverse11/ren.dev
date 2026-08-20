import type { ComponentPropsWithoutRef } from 'react'
import { useClock } from '../hooks/useClock'
import { ClockIcon } from './Icons'

/**
 * Reads the visitor's own device clock, not mine — a small "you're looking at
 * this live" touch rather than a timezone signal.
 *
 * Rendered in two places: the sidebar, which only exists on wide screens, and
 * the hero for every width below that. CSS shows exactly one of them, so the
 * clock never disappears just because the sidebar isn't there.
 */
export function LocalClock({ className = '', ...rest }: ComponentPropsWithoutRef<'p'>) {
  const now = useClock()
  const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  return (
    <p className={`clock ${className}`.trim()} {...rest}>
      <ClockIcon />
      Your local time is <strong>{timeLabel}</strong>
    </p>
  )
}
