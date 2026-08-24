/**
 * Serverless endpoint returning the GitHub contribution calendar.
 *
 * Prefer the authenticated GraphQL API when `GITHUB_TOKEN` is available so the
 * response can include private contribution counts. Fall back to the public
 * contributions page otherwise.
 */

const LOGIN = 'RenXenoverse11'

/** Pulls one attribute out of a tag string. */
function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`))
  return match ? match[1] : null
}

function normalizeDays(days) {
  days.sort((a, b) => a.date.localeCompare(b.date))

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

  return { days, weeks }
}

export function parseCalendar(html) {
  // "1,443 contributions in the last year"
  const totalMatch = html.match(/([\d,]+)\s+contribution/i)
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : null

  // Counts live in <tool-tip for="<td id>">N contributions on ...</tool-tip>
  const counts = new Map()
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^([\d,]+)\s+contribution/i)
    counts.set(id, n ? Number(n[1].replace(/,/g, '')) : 0)
  }

  const days = []
  for (const [, tag] of html.matchAll(/<td([^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*)>/g)) {
    const date = attr(tag, 'data-date')
    if (!date) continue
    const id = attr(tag, 'id')
    days.push({
      date,
      level: Number(attr(tag, 'data-level') ?? 0),
      count: id && counts.has(id) ? counts.get(id) : null,
    })
  }

  const calendar = normalizeDays(days)
  return { total, weeks: calendar.weeks, days: calendar.days.length }
}

function parseGraphqlCalendar(payload) {
  const viewer = payload?.data?.viewer
  const calendar = viewer?.contributionsCollection?.contributionCalendar
  if (!viewer || !calendar) return null

  const days = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      level: day.contributionLevel,
      count: day.contributionCount,
    })),
  )

  const normalized = normalizeDays(days)
  return {
    login: viewer.login || LOGIN,
    total: calendar.totalContributions,
    weeks: normalized.weeks,
    days: normalized.days.length,
  }
}

async function fetchPrivateCalendar(year, token) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'renxen.dev',
    },
    body: JSON.stringify({
      query: `
        query($from: DateTime!, $to: DateTime!) {
          viewer {
            login
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL responded ${response.status}`)
  }

  const payload = await response.json()
  if (payload?.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '))
  }

  const data = parseGraphqlCalendar(payload)
  if (!data?.days) {
    throw new Error('No contribution days found')
  }

  return data
}

async function fetchPublicCalendar(year) {
  const url =
    `https://github.com/users/${LOGIN}/contributions` +
    `?from=${year}-01-01&to=${year}-12-31`

  const upstream = await fetch(url, {
    headers: {
      'User-Agent': 'renxen.dev',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  if (!upstream.ok) {
    throw new Error(`GitHub responded ${upstream.status}`)
  }

  const data = parseCalendar(await upstream.text())
  if (!data.days) {
    throw new Error('No contribution days found')
  }

  return { login: LOGIN, ...data }
}

export default async function handler(request, response) {
  const now = new Date()
  const requested = Number(new URL(request.url, 'http://localhost').searchParams.get('year'))
  const year =
    Number.isInteger(requested) && requested >= 2008 && requested <= now.getUTCFullYear()
      ? requested
      : now.getUTCFullYear()

  try {
    const token = process.env.GITHUB_TOKEN
    const data = token ? await fetchPrivateCalendar(year, token) : await fetchPublicCalendar(year)
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    response.status(200).json({ login: data.login || LOGIN, year, ...data })
  } catch (error) {
    response.status(502).json({ error: String(error) })
  }
}
