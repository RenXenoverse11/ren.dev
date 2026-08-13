import { useEffect, useState } from 'react'

type Day = { date: string; level: number; count: number | null } | null

type Calendar = {
  login: string
  year: number
  total: number | null
  weeks: Day[][]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** A label above each week where a new month starts. */
function monthLabels(weeks: Day[][]) {
  let previous = -1
  return weeks.map((week) => {
    const first = week.find(Boolean)
    if (!first) return ''
    const month = new Date(first.date + 'T00:00:00Z').getUTCMonth()
    // Skip a label in the first column when it would sit half off the edge.
    if (month === previous) return ''
    previous = month
    return MONTHS[month]
  })
}

function describe(day: NonNullable<Day>) {
  const when = new Date(day.date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
  if (day.count === null) return when
  return `${day.count === 0 ? 'No' : day.count} contribution${day.count === 1 ? '' : 's'} on ${when}`
}

export function Contributions() {
  const [calendar, setCalendar] = useState<Calendar | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/contributions')
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: Calendar) => {
        if (!cancelled && data?.weeks?.length) setCalendar(data)
      })
      // The endpoint only exists on the deployed site; locally, and if GitHub
      // is unreachable, the section simply stays out of the page.
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  if (!calendar) return null

  const labels = monthLabels(calendar.weeks)

  return (
    <div className="contributions" id="activity">
      <div className="contributions__card card">
          <div className="contributions__head">
            <h2 className="contributions__title">
              {calendar.total !== null ? (
                <>
                  <strong>{calendar.total.toLocaleString()}</strong> contributions in {calendar.year}
                </>
              ) : (
                `GitHub activity in ${calendar.year}`
              )}
            </h2>
            <a
              className="contributions__link"
              href={`https://github.com/${calendar.login}`}
              target="_blank"
              rel="noreferrer"
            >
              @{calendar.login}
            </a>
          </div>

          <div className="contributions__scroll">
            <div className="contributions__grid-wrap">
              <div className="contributions__months" aria-hidden>
                {labels.map((label, index) => (
                  <span key={index}>{label}</span>
                ))}
              </div>

              <div className="contributions__weekdays" aria-hidden>
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div
                className="contributions__grid"
                role="img"
                aria-label={`GitHub contribution calendar for ${calendar.year}`}
              >
                {calendar.weeks.map((week, weekIndex) =>
                  week.map((day, dayIndex) =>
                    day ? (
                      <span
                        key={day.date}
                        className="contributions__day"
                        data-level={day.level}
                        title={describe(day)}
                      />
                    ) : (
                      <span key={`${weekIndex}-${dayIndex}`} className="contributions__day contributions__day--empty" />
                    ),
                  ),
                )}
              </div>
            </div>
          </div>

        <div className="contributions__legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className="contributions__day" data-level={level} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
