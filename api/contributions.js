/**
 * Serverless endpoint returning the GitHub contribution calendar.
 *
 * GitHub's own page for this is public and needs no token:
 *   https://github.com/users/<login>/contributions?from=…&to=…
 * It cannot be fetched from the browser (no CORS headers), so the request is
 * made here and the parsed result is served same-origin.
 *
 * The range is a calendar year — the same view GitHub's own year tabs show —
 * rather than a rolling window of the last 365 days.
 *
 * The response is cached at the edge for an hour — the calendar only changes
 * when a commit lands, and this keeps GitHub from being hit on every visit.
 */

const LOGIN = 'RenXenoverse11'

/** Pulls one attribute out of a tag string. */
function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`))
  return match ? match[1] : null
}

export function parseCalendar(html) {
  // "1,443 contributions in the last year"
  const totalMatch = html.match(/([\d,]+)\s+contribution/i)
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : null

  // Counts live in <tool-tip for="<td id>">N contributions on …</tool-tip>
  const counts = new Map()
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^([\d,]+)\s+contribution/i)
    counts.set(id, n ? Number(n[1].replace(/,/g, '')) : 0)
  }

  const days = []
  for (const [, tag] of html.matchAll(/<td([^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*)>/g)) {
    const date = attr(tag, 'data-date')
    if (!date) continue // the grid's spacer cells carry no date
    const id = attr(tag, 'id')
    days.push({
      date,
      level: Number(attr(tag, 'data-level') ?? 0),
      count: id && counts.has(id) ? counts.get(id) : null,
    })
  }

  days.sort((a, b) => a.date.localeCompare(b.date))

  // Group into calendar weeks, padding the first column so every week starts
  // on Sunday and the seven rows line up.
  const weeks = []
  let week = days.length ? new Array(new Date(days[0].date + 'T00:00:00Z').getUTCDay()).fill(null) : []
  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) weeks.push([...week, ...new Array(7 - week.length).fill(null)])

  return { total, weeks, days: days.length }
}

export default async function handler(request, response) {
  const now = new Date()
  const requested = Number(new URL(request.url, 'http://localhost').searchParams.get('year'))
  const year =
    Number.isInteger(requested) && requested >= 2008 && requested <= now.getUTCFullYear()
      ? requested
      : now.getUTCFullYear()

  const url =
    `https://github.com/users/${LOGIN}/contributions` +
    `?from=${year}-01-01&to=${year}-12-31`

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'renxen.dev',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    if (!upstream.ok) {
      response.status(502).json({ error: `GitHub responded ${upstream.status}` })
      return
    }

    const data = parseCalendar(await upstream.text())

    if (!data.days) {
      response.status(502).json({ error: 'No contribution days found' })
      return
    }

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    response.status(200).json({ login: LOGIN, year, ...data })
  } catch (error) {
    response.status(502).json({ error: String(error) })
  }
}
