import { useEffect, useState } from 'react'

/**
 * The visitor's own local time, from their device clock — not the site
 * owner's timezone. Ticks every 15s, which is plenty for a display that
 * only shows hours and minutes.
 */
export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  return now
}
